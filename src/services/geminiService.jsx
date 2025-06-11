const API_BASE = import.meta.env.VITE_API_BASE || '';

export const analyzePrescription = async (file, userDetails = {}) => {
    const controller = new AbortController();
    const TIMEOUT = 600000; // 60 seconds
  
    try {
      // Validate file
      if (!file) throw new Error("No file selected");
      if (file.size > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");
  
      // Convert to base64
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error("File reading failed"));
        reader.readAsDataURL(file);
      });
  
      // Make multiple API calls in parallel
      const apiCalls = [
        makeAnalysisRequest(base64Data, file.type, userDetails, controller.signal),
        makeAnalysisRequest(base64Data, file.type, userDetails, controller.signal),
        makeAnalysisRequest(base64Data, file.type, userDetails, controller.signal)
      ];
  
      // Wait for all responses with timeout
      const responses = await Promise.race([
        Promise.all(apiCalls),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Analysis timeout")), TIMEOUT);
        })
      ]);
  
      // Process and validate responses
      const validatedResponses = responses.map(validateResponse);
      const consensus = findConsensus(validatedResponses);
      console.log("Consensus result:", consensus);
      
      if (consensus.confidence < 0.7) { // 70% agreement threshold
        return {
          needsReview: true,
          summary: "This prescription requires expert verification due to inconsistencies",
          rawResponses: validatedResponses
        };
      }
  
      return {
        ...consensus.result,
        confidence: consensus.confidence
      };
  
    } catch (error) {
      console.error("Analysis error:", error);
      return {
        needsReview: true,
        summary: error.message || "Analysis failed",
        error: true
      };
    } finally {
      controller.abort();
    }
  };
  
  // Helper functions
  const makeAnalysisRequest = async (base64Data, mimeType, userDetails, signal) => {
    const response = await fetch(`${API_BASE}/api/analyze-prescription`, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageData: base64Data,
        mimeType,
        userDetails: {
          age: userDetails.age || '',
          gender: userDetails.gender || '',
          allergies: userDetails.allergies || '',
          existingMedicalIssues: userDetails.existingMedicalIssues || '',
          currentMedicalIssues: userDetails.currentMedicalIssues || ''
        }
      })
    });
  
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return response.json();
  };
  
  const validateResponse = (response) => {
    if (!response.success) throw new Error(response.message || "Invalid response");
    
    const requiredFields = ['summary', 'uses', 'sideEffects', 'precautions', 'dietRecommendations', 'adverseReactions'];
    const validated = {};
    
    requiredFields.forEach(field => {
      if (!response.analysis[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
      
      // Ensure arrays are actually arrays
      if (field !== 'summary' && !Array.isArray(response.analysis[field])) {
        throw new Error(`Field ${field} must be an array`);
      }
    });
    
    return response.analysis;
  };
  
  const findConsensus = (responses) => {
    // Simple consensus finding - counts matching items across responses
    const fieldScores = {};
    const allFields = Object.keys(responses[0]);
    
    allFields.forEach(field => {
      fieldScores[field] = {};
      
      responses.forEach(response => {
        if (field === 'summary') {
          // For summary, we look for similar content
          const key = response[field].substring(0, 50); // First 50 chars as key
          fieldScores[field][key] = (fieldScores[field][key] || 0) + 1;
        } else {
          // For arrays, we count matching items
          response[field].forEach(item => {
            const key = item.substring(0, 50); // First 50 chars as key
            fieldScores[field][key] = (fieldScores[field][key] || 0) + 1;
          });
        }
      });
    });
    
    // Build consensus result
    const result = {};
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    allFields.forEach(field => {
      if (field === 'summary') {
        // Take the most common summary
        const best = Object.entries(fieldScores[field]).sort((a,b) => b[1]-a[1])[0];
        result[field] = best[0];
        totalScore += best[1];
        maxPossibleScore += responses.length;
      } else {
        // Take items that appear in majority of responses
        result[field] = [];
        const threshold = Math.ceil(responses.length / 2);
        
        Object.entries(fieldScores[field]).forEach(([item, count]) => {
          if (count >= threshold) {
            result[field].push(item);
            totalScore += count;
          }
        });
        
        maxPossibleScore += responses.length * responses[0][field].length;
      }
    });
    
    const confidence = totalScore / maxPossibleScore;
    
    return { result, confidence };
  };