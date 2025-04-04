export const analyzePrescription = async (file) => {
    const controller = new AbortController();
    const timeoutDuration = 60000; // 60 seconds
  
    try {
      // File validation
      if (!file) throw new Error("No file selected");
      if (file.size > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");
  
      // Convert to base64 with progress feedback
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onprogress = (e) => {
          if (e.loaded > 5 * 1024 * 1024) {
            reader.abort();
            reject(new Error("File processing took too long"));
          }
        };
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error("File reading failed"));
        reader.readAsDataURL(file);
      });
  
      // Set timeout
      const timeout = setTimeout(() => controller.abort(), timeoutDuration);
  
      const response = await fetch('/api/analyze-prescription', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: base64Data,
          mimeType: file.type,
          fileName: file.name
        })
      });
  
      clearTimeout(timeout);
      console.log("Response status:", response.status);
      console.log('resoonse', response);
      
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed (${response.status})`);
      }
  
      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Analysis failed");
  
      return data.analysis;
  
    } catch (error) {
      console.error("Analysis error:", error);
      
      let userMessage = "Analysis failed. Please try again.";
      if (error.name === 'AbortError') {
        userMessage = "Analysis took too long. Try with a smaller file or simpler prescription.";
      } else if (error.message.includes('timeout')) {
        userMessage = "Server timeout. Please try again later.";
      }
  
      return {
        summary: userMessage,
        uses: [],
        sideEffects: [],
        precautions: [],
        dietRecommendations: [],
        adverseReactions: []
      };
    } finally {
      controller.abort(); // Cleanup
    }
  };