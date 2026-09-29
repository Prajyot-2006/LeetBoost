const API_URL = "https://leetboost.onrender.com/analyze-complexity";

export async function analyzeComplexity(problemSlug, code) {

  if (!problemSlug || !code) {
    return null;
  }

  const saved = await chrome.storage.local.get({
    complexityReports: {}
  });

  const reports = saved.complexityReports;

  // Already successfully analyzed
  if (reports[problemSlug]) {

    console.log(
      "LeetBoost Complexity: Using saved result for",
      problemSlug
    );

    return {
      ...reports[problemSlug],
      cached: true
    };

  }

  console.log(
    "LeetBoost Complexity: Sending to Gemini",
    problemSlug
  );

  try {

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        code
      })

    });


    // Gemini/API temporarily unavailable
    if (response.status === 503) {

      console.warn(
        "LeetBoost Complexity: Gemini temporarily unavailable"
      );

      return {
        error: true,
        errorType: "unavailable",
        message:
          "AI Complexity analysis is temporarily unavailable. Please try again later."
      };

    }


    // Gemini quota/rate limit
    if (response.status === 429) {

      console.warn(
        "LeetBoost Complexity: Gemini quota/rate limit reached"
      );

      return {
        error: true,
        errorType: "quota",
        message:
          "AI Complexity analysis is temporarily unavailable because the Gemini API quota has been reached."
      };

    }


    if (!response.ok) {

      throw new Error(
        `Complexity API failed: ${response.status}`
      );

    }


    const result = await response.json();


    // Save ONLY successful Gemini results
    reports[problemSlug] = {

      timeComplexity:
        result.timeComplexity,

      spaceComplexity:
        result.spaceComplexity

    };


    await chrome.storage.local.set({
      complexityReports: reports
    });


    console.log(
      "LeetBoost Complexity: Saved result for",
      problemSlug
    );


    return {

      ...reports[problemSlug],

      cached: false

    };

  }

  catch (error) {

    console.error(
      "LeetBoost Complexity Error:",
      error
    );

    return {
      error: true,
      errorType: "unknown",
      message:
        "AI Complexity analysis failed. Please try again later."
    };

  }

}