import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini with error handling
let genAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables");
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
    timeout: 60000 // 60 seconds
  });
} catch (error) {
  console.error("Gemini initialization failed:", error.message);
  process.exit(1);
}

app.post('/api/analyze-prescription', async (req, res) => {
    const timeout = setTimeout(() => {
      res.status(504).json({
        success: false,
        message: "Analysis timeout - server took too long to respond"
      });
    }, 55000); // Slightly less than client timeout
  
    try {
      const { imageData, mimeType } = req.body;
      console.log("Received image data:");
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",

      });
  
      const prompt = `Analyze this ${mimeType.startsWith('image') ? 'prescription image' : 'PDF prescription document'} and provide:
      1. SUMMARY: Medication names (brands) and purposes
      2. USES: Conditions each medication treats
      3. SIDE_EFFECTS: Common side effects
      4. PRECAUTIONS: Important warnings
      5. DIET_RECOMMENDATIONS: Food interactions
      6. ADVERSE_REACTIONS: Dangerous reactions
      
      Respond in lamen terms so that even normal people can understand it.

      Respond in this exact JSON format, only create pointers inside the array and no subkeys, keep the following structure as it is:
      {
        "summary": "",
        "uses": [],
        "sideEffects": [],
        "precautions": [],
        "dietRecommendations": [],
        "adverseReactions": []
      }
`;
  
      const result = await model.generateContent({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: imageData } }
          ]
        }]
      });
  
      clearTimeout(timeout);
      
      const response = await result.response;
      const text = response.text();
      console.log('Response text:', text);
      
      let cleanText = text.replace(/^```json\n?/, '').replace(/```$/, '');
      console.log('console log cleanText', cleanText);
      
    let processedResponse = JSON.parse(cleanText);


      res.json({ success: true, analysis: processedResponse });
  
    } catch (error) {
      clearTimeout(timeout);
      console.error("API Error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Analysis failed",
        errorType: error.name
      });
    }
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
  console.log(`Gemini API key: ${process.env.GEMINI_API_KEY ? '***' + process.env.GEMINI_API_KEY.slice(-4) : 'MISSING'}`);
});