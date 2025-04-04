export const analyzePrescription = async (imageData) => {
    // In a real implementation, you would call the Gemini API here
    // This is a mock implementation
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response - in reality this would come from the Gemini API
    return {
      summary: "This prescription contains medications for hypertension and mild pain relief. The primary medications are Amlodipine for blood pressure and Paracetamol for pain management.",
      precautions: [
        "Take Amlodipine at the same time each day",
        "Avoid grapefruit while taking Amlodipine",
        "Monitor blood pressure regularly",
        "Limit alcohol consumption",
        "Report any swelling in ankles or feet"
      ],
      dietRecommendations: [
        "Increase potassium-rich foods (bananas, spinach, sweet potatoes)",
        "Reduce sodium intake",
        "Maintain adequate hydration",
        "Include magnesium-rich foods (nuts, seeds, leafy greens)",
        "Consume omega-3 fatty acids (fatty fish, flaxseeds)"
      ]
    };
  };