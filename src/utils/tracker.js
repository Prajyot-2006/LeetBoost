import {showCelebration} from "./celebration";


let stats={

startTime:Date.now(),

pasteEvents:0,

tabSwitches:0,

bulkPaste:false,

submitted:false,

attempts:0,

status:null

};



let waitingResult=false;






export function startTracking(){



window.addEventListener(
"paste",
(e)=>{


stats.pasteEvents++;


let text=e.clipboardData?
e.clipboardData.getData("text")
:"";


if(text.length>300){

stats.bulkPaste=true;

}


},
true
);








document.addEventListener(
"visibilitychange",
()=>{


if(document.hidden){

stats.tabSwitches++;

}


}
);










document.addEventListener(
"click",
(e)=>{


let btn=e.target.closest("button");


if(!btn)return;



if(btn.innerText.includes("Submit")){


stats.submitted=true;


waitingResult=true;


}


}
);











const observer=new MutationObserver(()=>{


if(!waitingResult)
return;



let page=document.body.innerText;





if(page.includes("Accepted")){


stats.status="passed";



saveReport((count)=>{


showCelebration(
"passed",
count
);


});



waitingResult=false;


}







else if(

page.includes("Wrong Answer") ||

page.includes("Runtime Error") ||

page.includes("Compile Error") ||

page.includes("Time Limit Exceeded")

){



stats.status="failed";



saveReport((count)=>{


showCelebration(
"failed",
count
);


});



waitingResult=false;


}



});








observer.observe(
document.body,
{
childList:true,
subtree:true,
characterData:true
}
);



}













export function getStats(){



if(!stats.submitted){

return{

submitted:false

};

}





let time=Math.floor(

(Date.now()-stats.startTime)/1000

);






let verdict="🟢 Natural Coding Pattern";




if(stats.bulkPaste){

verdict="🔴 Bulk Paste Detected";

}


else if(stats.pasteEvents>3){

verdict="🟡 Multiple Paste Events";

}






return{


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



let problem=

window.location.pathname.split("/")[2];





chrome.storage.local.get(
{
reports:{}
},
(data)=>{



let reports=data.reports;



let old=reports[problem];




// attempts cumulative

let oldAttempts=

old?

old.attempts:

0;



stats.attempts=

oldAttempts+1;






let report=getStats();







// time cumulative

let oldTime=

old?

old.time:

0;




report.time=

oldTime + report.time;








reports[problem]=report;







chrome.storage.local.set(
{
reports
},
()=>{


callback(stats.attempts);


}


);



}


);



}