(function(){

  const originalFetch = window.fetch;


  // ==========================================
  // GET SUBMITTED CODE
  // ==========================================

  async function getSubmittedCode(submissionId){

    try{

      const query = `
        query submissionDetails($submissionId: Int!) {
          submissionDetails(submissionId: $submissionId) {
            code
            lang {
              name
              verboseName
            }
            statusDisplay
          }
        }
      `;


      const response = await originalFetch(
        "https://leetcode.com/graphql/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },

          credentials: "include",

          body: JSON.stringify({

            operationName:
              "submissionDetails",

            variables: {

              submissionId:
                Number(submissionId)

            },

            query

          })

        }
      );


      if(!response.ok){

        console.error(
          "LeetBoost: Failed to fetch submission code:",
          response.status
        );

        return "";

      }


      const data =
        await response.json();


      console.log(
        "LeetBoost Submission Details:",
        data
      );


      const code =
        data?.data?.submissionDetails?.code || "";


      return code;

    }
    catch(error){

      console.error(
        "LeetBoost: Error getting submitted code:",
        error
      );

      return "";

    }

  }


  // ==========================================
  // INTERCEPT FETCH
  // ==========================================

  window.fetch = async function(...args){

    const response =
      await originalFetch(...args);


    try{

      const url =
        typeof args[0] === "string"
          ? args[0]
          : args[0]?.url;


      // ==========================================
      // LEETCODE SUBMISSION RESULT
      // ==========================================

      if(
        url &&
        url.includes("/check/")
      ){

        const clone =
          response.clone();


        clone.json().then(async (data) => {

          const submissionId =
            String(
              data.submission_id || ""
            );


          // Ignore run-code requests
          if(
            submissionId.includes("runcode")
          ){

            return;

          }


          if(
            data.state === "SUCCESS"
          ){

            console.log(
              "LeetBoost API:",
              data.status_code,
              data.status_msg
            );


            // ==========================================
            // GET SUBMITTED CODE
            // ==========================================

            let submittedCode = "";


            if(submissionId){

              submittedCode =
                await getSubmittedCode(
                  submissionId
                );

            }


            console.log(
              "LeetBoost Submitted Code:",
              submittedCode
            );


            // ==========================================
            // SEND RESULT TO TRACKER
            // ==========================================

            window.dispatchEvent(

              new CustomEvent(
                "leetboost-result",
                {

                detail: {
                  status: data.status_code,
                  msg: data.status_msg,
                  code: submittedCode,
                  problemSlug: window.location.pathname.split("/")[2]
                }

                }

              )

            );

          }

        }).catch(() => {});

      }

    }
    catch(error){

      console.error(
        "LeetBoost interceptor error:",
        error
      );

    }


    return response;

  };

})();