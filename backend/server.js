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
      const { imageData, mimeType, patientInfo } = req.body;
      console.log("Received prescription analysis request");
      
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
      });
      
      // Extract useful patient info if provided
      const patientContext = patientInfo ? `
        Consider this patient context when analyzing:
        - Age: ${patientInfo.age || 'Not provided'}
        - Gender: ${patientInfo.gender || 'Not provided'}
        - Known allergies: ${patientInfo.allergies || 'None reported'}
        - Existing conditions: ${patientInfo.conditions || 'None reported'}
        - Current medications: ${patientInfo.medications || 'None reported'}
      ` : '';
  
      const prompt = `You are a pharmaceutical expert analyzing a prescription image. 
${patientContext}

Analyze this ${mimeType.startsWith('image') ? 'prescription image' : 'PDF prescription document'} with high precision and provide:

1. SUMMARY: A plain text summary listing all medications with their names (brand/generic), dosages, frequencies, and purposes. Format as:
   "Metoprolol (Betaloc) 50mg twice daily for high blood pressure"

2. USES: An array of strings listing conditions each medication treats. Format each as:
   "Metoprolol: treats high blood pressure and prevents chest pain"

3. SIDE_EFFECTS: An array of strings listing common side effects. Format each as:
   "Metoprolol: may cause dizziness, fatigue, or slow heart rate"

4. PRECAUTIONS: An array of strings with specific warnings. Format each as:
   "Avoid alcohol with Metoprolol as it may increase dizziness"

5. DIET_RECOMMENDATIONS: An array of strings with food-related advice. Format each as:
   "Take Metoprolol with food to reduce stomach upset"

6. ADVERSE_REACTIONS: An array of strings with serious reactions. Format each as:
   "Metoprolol: seek help for difficulty breathing or swelling"

STRICT FORMATTING RULES:
- Only use the exact keys: summary, uses, sideEffects, precautions, dietRecommendations, adverseReactions
- All values must be either strings (for summary) or arrays of strings (all others)
- No nested objects or additional keys
- No medication-specific subkeys
- Combine all information for each medication into the appropriate arrays

Example of CORRECT format:
{
  "summary": "Metoprolol 50mg twice daily for blood pressure...",
  "uses": [
    "Metoprolol: treats high blood pressure and chest pain",
    "Dorzolamide: reduces eye pressure in glaucoma"
  ],
  "sideEffects": [
    "Metoprolol: may cause dizziness or fatigue",
    "Dorzolamide: may cause eye irritation"
  ],
  "precautions": [
    "Avoid sudden stops with Metoprolol",
    "Use Dorzolamide eye drops exactly as prescribed"
  ],
  "dietRecommendations": [
    "Take Metoprolol with food",
    "No special diet needed for Dorzolamide"
  ],
  "adverseReactions": [
    "Metoprolol: seek help for wheezing or swelling",
    "Dorzolamide: get help for eye pain or vision changes"
  ]
}

DO NOT include:
- Any nested objects
- Medication-specific subkeys
- Any keys other than the 6 specified
- Disclaimers or explanatory text
- Markdown formatting`;
  
      const result = await model.generateContent({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: imageData } }
          ]
        }],
        generationConfig: {
          temperature: 0.2, // Lower temperature for more factual/deterministic responses
          topP: 0.8,
          maxOutputTokens: 1024
        }
      });
  
      clearTimeout(timeout);
      
      const response = await result.response;
      const text = response.text();
      
      let cleanText = text.trim().replace(/^```json\s*[\n]?/, '').replace(/```$/, '').trim();
      console.log('Processed response received');
      console.log(cleanText);
      
      
      // Validate and sanitize the response
      let processedResponse;
      try {
        processedResponse = JSON.parse(cleanText);
        
        // Ensure all expected fields exist
        const requiredFields = ['summary', 'uses', 'sideEffects', 'precautions', 'dietRecommendations', 'adverseReactions'];
        for (const field of requiredFields) {
          if (!processedResponse[field]) {
            processedResponse[field] = field === 'summary' ? 'Information not clearly visible in prescription' : [];
          }
          
          // Ensure array fields are arrays
          if (field !== 'summary' && !Array.isArray(processedResponse[field])) {
            // If it's a string, try to convert to array
            if (typeof processedResponse[field] === 'string' && processedResponse[field].trim() !== '') {
              processedResponse[field] = [processedResponse[field]];
            } else {
              processedResponse[field] = [];
            }
          }
        }
        
        // For array fields, ensure items are properly formatted
        for (const field of requiredFields.filter(f => f !== 'summary')) {
          processedResponse[field] = processedResponse[field].map(item => {
            if (typeof item === 'string') {
              // Remove bullet points, asterisks, and excessive newlines
              return item.replace(/^[•\-\*]\s*/, '').trim().replace(/\n{2,}/g, '\n');
            }
            return item;
          }).filter(item => item); // Remove empty entries
        }
        
      } catch (error) {
        console.error("Error parsing model response:", error);
        throw new Error("Invalid response format received from analysis model");
      }

      res.json({ 
        success: true, 
        analysis: processedResponse,
        confidence: result.response.promptFeedback?.safetyRatings ? 'high' : 'medium'
      });
  
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


app.post('/api/analyze-medicine', async (req, res) => {
    const timeout = setTimeout(() => {
        res.status(504).json({
            success: false,
            message: "Analysis timeout - server took too long to respond"
        });
    }, 55000);

    try {
        const { imageData, mimeType } = req.body;
        console.log("Received medicine analysis request");

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
        });

        // Enhanced prompt with hallucination prevention
        const prompt = `You are a pharmaceutical expert analyzing a medicine package image.
Provide the following information with confidence ratings:

1. SUMMARY: The most likely medicine name and purpose (be specific if possible)

2. PROBABLE_MATCHES: List 2-3 possible brand/generic names if uncertain

3. USES: Possible medical conditions this medicine treats
   - Only include if clearly visible or highly likely
   - Mark as uncertain if needed

4. Other standard fields...

5. CONFIDENCE: Rate as:
   - "high" if text is clearly readable and matches known medicines
   - "medium" if partially visible but good matches exist
   - "low" if very unclear

6. VERIFICATION_FLAGS: Note any uncertainties

Respond in this JSON format:
{
  "summary": "",
  "probableMatches": [],
  "uses": [],
  "sideEffects": [],
  "precautions": [],
  "dietRecommendations": [],
  "adverseReactions": [],
  "confidence": "medium",
  "verificationFlags": []
}`;

        const result = await model.generateContent({
            contents: [{
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType, data: imageData } }
                ]
            }],
            generationConfig: {
                temperature: 0.1, // Lower temperature for less creativity
                topP: 0.5,       // More conservative sampling
                maxOutputTokens: 1024
            }
        });

        clearTimeout(timeout);
        
        const response = await result.response;
        const text = response.text();
        
        let cleanText = text.trim().replace(/^```json\s*[\n]?/, '').replace(/```$/, '').trim();
        console.log('Processed medicine response received');
        
        let processedResponse;
        try {
            processedResponse = JSON.parse(cleanText);
            
            // Enhanced validation
            const requiredFields = ['summary', 'uses', 'sideEffects', 'precautions', 
                                  'dietRecommendations', 'adverseReactions', 
                                  'confidence', 'verificationFlags'];
            
            for (const field of requiredFields) {
                if (!processedResponse[field]) {
                    processedResponse[field] = field === 'summary' ? 'Information not clearly visible' : 
                                            field === 'confidence' ? 'low' : [];
                }
                
                if (field !== 'summary' && field !== 'confidence' && !Array.isArray(processedResponse[field])) {
                    processedResponse[field] = [processedResponse[field]].filter(Boolean);
                }
            }

            // Post-processing to reduce hallucinations
            if (processedResponse.confidence === 'low') {
                processedResponse.verificationFlags.push('Low confidence analysis - requires human verification');
            }

            // Check for generic responses that might indicate poor image quality
            if (processedResponse.summary.toLowerCase().includes('not clearly visible')) {
                processedResponse.confidence = 'low';
                processedResponse.verificationFlags.push('Key information not clearly visible in image');
            }

        } catch (error) {
            console.error("Error parsing medicine response:", error);
            throw new Error("Invalid response format from medicine analysis");
        }

        res.json({ 
            success: true, 
            analysis: processedResponse
        });

    } catch (error) {
        clearTimeout(timeout);
        console.error("Medicine API Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Medicine analysis failed",
            errorType: error.name
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    modelStatus: genAI ? 'initialized' : 'error' 
  });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
  console.log(`Gemini API key: ${process.env.GEMINI_API_KEY ? '***' + process.env.GEMINI_API_KEY.slice(-4) : 'MISSING'}`);
});