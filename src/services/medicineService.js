export const analyzeMedicineImage = async (imageFile) => {
    try {
      // Convert to base64
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error("Image reading failed"));
        reader.readAsDataURL(imageFile);
      });
  
      const response = await fetch('/api/analyze-medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: base64Data,
          mimeType: imageFile.type
        })
      });
  
      if (!response.ok) throw new Error("Request failed");
      
      const data = await response.json();
      return data.analysis || data; // Handle both formats
  
    } catch (error) {
      console.error("Medicine analysis error:", error);
      return {
        error: true,
        message: error.message || "Analysis failed"
      };
    }
  };