import { showCelebration } from "./celebration";
import { injectInterceptor } from "./interceptor";
import { analyzeComplexity } from "./complexity";

let stats = {
  startTime: Date.now(),
  pasteEvents: 0,
  tabSwitches: 0,
  bulkPaste: false,
  submitted: false,
  attempts: 0,
  status: null
};

let processingResult = false;

// --------------------------------
// CURRENT PROBLEM
// --------------------------------

function getProblemSlug() {

  const path = window.location.pathname.split("/");

  if (path[1] !== "problems") {
    return null;
  }

  return path[2] || null;
}

let currentProblem = getProblemSlug();

// This tells us whether the user submitted
// during the current visit to this problem.
let hasSubmittedThisVisit = false;


// --------------------------------
// CHECK FOR PROBLEM CHANGE
// --------------------------------

function checkProblemChange() {

  const problem = getProblemSlug();

  if (problem !== currentProblem) {

    currentProblem = problem;

    // New problem visit
    hasSubmittedThisVisit = false;

    stats = {
      startTime: Date.now(),
      pasteEvents: 0,
      tabSwitches: 0,
      bulkPaste: false,
      submitted: false,
      attempts: 0,
      status: null
    };

    processingResult = false;
  }

}


// --------------------------------
// START TRACKING
// --------------------------------

export function startTracking(){

  injectInterceptor();

  // --------------------------------
  // Detect problem navigation
  // --------------------------------

  setInterval(() => {

    checkProblemChange();

  }, 500);


  // --------------------------------
  // Paste Detection
  // --------------------------------

  window.addEventListener("paste", (e)=>{

    checkProblemChange();

    stats.pasteEvents++;

    let text =
      e.clipboardData
        ? e.clipboardData.getData("text")
        : "";

    if(text.length > 300){

      stats.bulkPaste = true;

    }

  }, true);


  // --------------------------------
  // Tab Switch Detection
  // --------------------------------

  document.addEventListener(
    "visibilitychange",
    ()=>{

      checkProblemChange();

      if(document.hidden){

        stats.tabSwitches++;

      }

    }
  );


  // --------------------------------
  // Submit Detection
  // --------------------------------

  document.addEventListener("click", (e)=>{

    checkProblemChange();

    let btn = e.target.closest("button");

    if(!btn) return;

    if(btn.innerText.includes("Submit")){

      stats.submitted = true;

      stats.status = null;

      processingResult = false;

      // IMPORTANT:
      // This submission belongs to the
      // current visit.
      hasSubmittedThisVisit = true;

    }

  });


  // --------------------------------
  // Result Detection
  // --------------------------------

  window.addEventListener(
    "leetboost-result",
    (e)=>{

      if(!stats.submitted) return;

      if(processingResult) return;

      processingResult = true;

      const {
        status,
        msg,
        code,
        problemSlug
      } = e.detail;


      // --------------------------------
      // AI COMPLEXITY
      // --------------------------------

      analyzeComplexity(
        problemSlug,
        code
      )
      .then((complexity) => {

        if (complexity) {

          console.log(
            "LeetBoost Complexity:",
            complexity
          );

        }

      })
      .catch((error) => {

        console.error(
          "LeetBoost Complexity Error:",
          error
        );

      });


      console.log(
        "LeetBoost API:",
        status,
        msg
      );


      // --------------------------------
      // ACCEPTED
      // --------------------------------

      if (status === 10) {

        stats.status = "passed";

        saveReport((count) => {

          showCelebration(
            "passed",
            count
          );

          processingResult = false;

          stats.submitted = false;

        });

      }


      // --------------------------------
      // FAILED
      // --------------------------------

      else {

        stats.status = "failed";

        saveReport((count) => {

          showCelebration(
            "failed",
            count
          );

          processingResult = false;

          stats.submitted = false;

        });

      }

    }
  );

}


// --------------------------------
// GET STATS
// --------------------------------

export function getStats(){

  checkProblemChange();

  if(!stats.submitted){

    return {
      submitted: false,
      hasSubmittedThisVisit
    };

  }


  let time =
    Math.floor(
      (Date.now() - stats.startTime) / 1000
    );


  let verdict =
    "🟢 Natural Coding Pattern";


  if(stats.bulkPaste){

    verdict =
      "🔴 Bulk Paste Detected";

  }

  else if(stats.pasteEvents > 3){

    verdict =
      "🟡 Multiple Paste Events";

  }


  return {

    submitted: true,

    attempts: stats.attempts,

    status: stats.status,

    time,

    pasteEvents: stats.pasteEvents,

    tabSwitches: stats.tabSwitches,

    verdict,

    hasSubmittedThisVisit

  };

}


// --------------------------------
// SAVE REPORT
// --------------------------------

export function saveReport(callback){

  checkProblemChange();

  let problem =
    window.location.pathname.split("/")[2];


  chrome.storage.local.get(
    { reports:{} },
    (data)=>{

      let reports =
        data.reports;

      let old =
        reports[problem];


      let oldAttempts =
        old
          ? old.attempts
          : 0;


      stats.attempts =
        oldAttempts + 1;


      let report =
        getStats();


      let oldTime =
        old
          ? old.time
          : 0;


      report.time =
        oldTime + report.time;


      report.tabSwitches =
        stats.tabSwitches;


      report.pasteEvents =
        stats.pasteEvents;


      reports[problem] =
        report;


      chrome.storage.local.set(
        { reports },
        ()=>{

          stats.startTime =
            Date.now();

          stats.tabSwitches =
            0;

          stats.pasteEvents =
            0;

          stats.bulkPaste =
            false;

          stats.status =
            null;

          callback(
            stats.attempts
          );

        }
      );

    }
  );

}