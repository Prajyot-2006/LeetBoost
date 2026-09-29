import {useState} from "react";
import {getStats} from "../utils/tracker";


function formatTime(seconds){

  if(!seconds || seconds <= 0){
    return "0 sec";
  }

  const hours = Math.floor(seconds / 3600);

  const minutes =
    Math.floor((seconds % 3600) / 60);

  const remainingSeconds =
    seconds % 60;

  let result = "";

  if(hours > 0){
    result += `${hours} hr `;
  }

  if(minutes > 0){
    result += `${minutes} min `;
  }

  if(remainingSeconds > 0){
    result += `${remainingSeconds} sec`;
  }

  return result.trim();

}


function loadComplexity(problemSlug, callback){

  chrome.storage.local.get(
    {
      complexityReports:{}
    },

    (saved)=>{

      const complexity =
        saved.complexityReports?.[problemSlug];

      callback(complexity || null);

    }

  );

}


function ReportView(){

  const [report,setReport]=useState(null);


  function generateReport(){

    let path=window.location.pathname.split("/");

    if(path[1]!=="problems"){

      setReport({
        type:"empty"
      });

      return;

    }


    const problemSlug = path[2];

    let data=getStats();


    // ==========================================
    // NO ACTIVE SUBMISSION
    // ==========================================

    if(!data.submitted){

      chrome.storage.local.get(

        {
          reports:{}
        },

        (saved)=>{

          let old=saved.reports[problemSlug];


          if(old){

            loadComplexity(
              problemSlug,
              (complexity)=>{

                setReport({
                  type:"report",
                  ...old,
                  complexity
                });

              }
            );

          }

          else{

            setReport({
              type:"nosubmit"
            });

          }

        }

      );


      return;

    }


    // ==========================================
    // CURRENT SUBMISSION
    // ==========================================

    loadComplexity(
      problemSlug,
      (complexity)=>{

        setReport({

          type:"report",

          ...data,

          complexity

        });

      }
    );

  }


  // ==========================================
  // INITIAL SCREEN
  // ==========================================

  if(!report){

    return(

      <div className="space-y-2">

        <h3 className="
        text-[11px]
        font-medium
        text-gray-400
        uppercase
        tracking-wider
        ">

          Submission Analysis

        </h3>


        <button

          onClick={generateReport}

          className="
          w-full
          py-2
          rounded-lg
          text-sm
          font-semibold
          text-white
          bg-gradient-to-r
          from-green-500
          to-emerald-600
          hover:from-green-400
          hover:to-emerald-500
          transition
          cursor-pointer
          glow-btn
          "

        >

          Generate Report

        </button>

      </div>

    );

  }


  // ==========================================
  // EMPTY
  // ==========================================

  if(report.type==="empty"){

    return(

      <div className="space-y-3">

        <h3 className="
        text-[11px]
        font-medium
        text-gray-400
        uppercase
        tracking-wider
        ">

        Submission Report

        </h3>


        <div className="
        relative
        overflow-hidden
        rounded-xl
        bg-gradient-to-br
        from-gray-900
        to-gray-800
        border
        border-gray-700/60
        shadow-sm
        p-4
        text-sm
        text-gray-300
        space-y-2
        ">

          <p>No active problem found</p>

          <p className="text-gray-400">

            Open a LeetCode problem to view analysis

          </p>

        </div>


        <button

          onClick={()=>setReport(null)}

          className="w-full py-2 text-sm"

        >

          ← Back

        </button>

      </div>

    );

  }


  // ==========================================
  // NO SUBMISSION
  // ==========================================

  if(report.type==="nosubmit"){

    return(

      <div className="space-y-3">

        <h3 className="
        text-[11px]
        font-medium
        text-gray-400
        uppercase
        tracking-wider
        ">

        Submission Report

        </h3>


        <div className="
        relative
        overflow-hidden
        rounded-xl
        bg-gradient-to-br
        from-gray-900
        to-gray-800
        border
        border-gray-700/60
        shadow-sm
        p-4
        text-sm
        text-gray-300
        space-y-2
        ">

          <p>No submissions found</p>

          <p className="text-gray-400">

            Submit a solution to generate analysis

          </p>

        </div>


        <button

          onClick={()=>setReport(null)}

          className="w-full py-2 text-sm"

        >

          ← Back

        </button>

      </div>

    );

  }


  // ==========================================
  // SUBMISSION REPORT
  // ==========================================

  return(

    <div className="space-y-3">

      <h3 className="
      text-[11px]
      font-medium
      text-gray-400
      uppercase
      tracking-wider
      ">

      Submission Report

      </h3>


      <div className="
      relative
      overflow-hidden
      rounded-xl
      bg-gradient-to-br
      from-gray-900
      to-gray-800
      border
      border-gray-700/60
      shadow-sm
      p-4
      space-y-3
      text-sm
      text-gray-200
      ">


        <p>

          🔥 Attempts : {report.attempts}

        </p>


        <p>

        {
          report.status==="passed"
          ?
          "🟢 Mission Passed"
          :
          "🔴 Mission Failed"
        }

        </p>


        <div className="
        border-t
        border-gray-700
        pt-3
        space-y-3
        ">


          {/* TIME */}

          <p>

            ⏱ Time : {formatTime(report.time)}

          </p>


          {/* PASTE EVENTS */}

          <p>

            📋 Paste Events : {report.pasteEvents}

          </p>


          {/* TAB SWITCHES */}

          <p>

            👀 Tab Switches : {report.tabSwitches}

          </p>


          {/* VERDICT */}

          <p>

            {report.verdict}

          </p>


{/* AI COMPLEXITY */}

{report.complexity && (

  <div className="
  border-t
  border-gray-700
  pt-3
  space-y-2
  ">

    {/* AI ERROR */}

    {report.complexity.error ? (

      <p className="text-yellow-400">

        ⚠️ {report.complexity.message}

      </p>

    ) : (

      <>

        {/* TIME COMPLEXITY */}

        <p className="text-gray-300">

          🤖 Time Complexity :
          <span className="text-green-400 ml-1">

            {report.complexity.timeComplexity}

          </span>

        </p>


        {/* SPACE COMPLEXITY */}

        <p className="text-gray-300">

          💾 Space Complexity :
          <span className="text-green-400 ml-1">

            {report.complexity.spaceComplexity}

          </span>

        </p>

      </>

    )}

  </div>

)}


        </div>


      </div>


      <button

        onClick={()=>setReport(null)}

        className="w-full py-2 text-sm"

      >

        ← Back

      </button>


    </div>

  );

}


export default ReportView;