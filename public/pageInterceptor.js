(function(){

  const originalFetch = window.fetch;

  window.fetch = async function(...args){

    const response = await originalFetch(...args);

    try{
      const url = typeof args[0] === "string" ? args[0] : args[0]?.url;

      if(url && url.includes("/check/")){
        const clone = response.clone();
        clone.json().then(data=>{

          const submissionId = String(data.submission_id || "");
          if(submissionId.includes("runcode")) return;

          if(data.state === "SUCCESS"){
          console.log(
              "LeetBoost API:",
              data.status_code,
              data.status_msg
          );

          window.dispatchEvent(new CustomEvent("leetboost-result",{
              detail:{
                  status:data.status_code,
                  msg:data.status_msg
              }
          }));
          }

        }).catch(()=>{});
      }
    }
    catch(e){}

    return response;
  };

})();