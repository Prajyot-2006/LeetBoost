import { showCelebration } from "./celebration";
import { injectInterceptor } from "./interceptor";

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

export function startTracking(){

  injectInterceptor();

  // Paste Detection
  window.addEventListener("paste", (e)=>{
    stats.pasteEvents++;
    let text = e.clipboardData ? e.clipboardData.getData("text") : "";
    if(text.length > 300){
      stats.bulkPaste = true;
    }
  }, true);

  // Tab Switch Detection
  document.addEventListener("visibilitychange", ()=>{
    if(document.hidden){
      stats.tabSwitches++;
    }
  });

  // Submit Detection
  document.addEventListener("click", (e)=>{
    let btn = e.target.closest("button");
    if(!btn) return;
    if(btn.innerText.includes("Submit")){
      stats.submitted = true;
      stats.status = null;
      processingResult = false;
    }
  });

  // Result Detection via fetch interceptor
  window.addEventListener("leetboost-result", (e)=>{

    if(!stats.submitted) return;
    if(processingResult) return;

    processingResult = true;

const { status, msg } = e.detail;

console.log("LeetBoost API:", status, msg);

// Only Accepted is success.
// Everything else is Mission Failed.

if (status === 10) {

  stats.status = "passed";

  saveReport((count) => {

    showCelebration("passed", count);

    processingResult = false;
    stats.submitted = false;

  });

} else {

  stats.status = "failed";

  saveReport((count) => {

    showCelebration("failed", count);

    processingResult = false;
    stats.submitted = false;

  });

}

  });

}

export function getStats(){

  if(!stats.submitted){
    return { submitted:false };
  }

  let time = Math.floor((Date.now() - stats.startTime) / 1000);

  let verdict = "🟢 Natural Coding Pattern";

  if(stats.bulkPaste){
    verdict = "🔴 Bulk Paste Detected";
  }
  else if(stats.pasteEvents > 3){
    verdict = "🟡 Multiple Paste Events";
  }

  return {
    submitted:true,
    attempts:stats.attempts,
    status:stats.status,
    time,
    pasteEvents:stats.pasteEvents,
    tabSwitches:stats.tabSwitches,
    verdict
  };

}

export function saveReport(callback){

  let problem = window.location.pathname.split("/")[2];

  chrome.storage.local.get({ reports:{} }, (data)=>{

    let reports = data.reports;
    let old = reports[problem];

    let oldAttempts = old ? old.attempts : 0;
    stats.attempts = oldAttempts + 1;

    let report = getStats();

    let oldTime = old ? old.time : 0;
    report.time = oldTime + report.time;

    report.tabSwitches = stats.tabSwitches;
    report.pasteEvents = stats.pasteEvents;

    reports[problem] = report;

    chrome.storage.local.set({ reports }, ()=>{

      stats.startTime = Date.now();
      stats.tabSwitches = 0;
      stats.pasteEvents = 0;
      stats.bulkPaste = false;
      stats.status = null;

      callback(stats.attempts);
    });

  });

}