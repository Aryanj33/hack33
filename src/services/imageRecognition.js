export const recognizeMedicine = async (image) => {
    // In a real implementation, this would use an image recognition API
    // This is a mock implementation
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response
    return {
      name: "Crocin Advance",
      genericName: "Paracetamol",
      uses: "Used to treat mild to moderate pain and to reduce fever.",
      sideEffects: [
        "Allergic reactions (rare)",
        "Skin rashes",
        "Nausea (with high doses)",
        "Liver damage (with overdose)"
      ],
      dosage: "1-2 tablets every 4-6 hours as needed, not exceeding 8 tablets in 24 hours.",
      precautions: [
        "Do not exceed recommended dose",
        "Consult doctor if pain persists for more than 3 days",
        "Avoid if allergic to paracetamol",
        "Consult doctor before use if you have liver disease"
      ],
      interactions: [
        "May interact with blood thinners",
        "Alcohol may increase risk of liver damage",
        "May interact with other medications containing paracetamol"
      ]
    };
  };