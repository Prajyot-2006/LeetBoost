import {useState} from "react";
import {getStats} from "../utils/tracker";


function ReportView(){


const [report,setReport]=useState(null);




function generateReport(){


let path=window.location.pathname.split("/");


// not problem page

if(path[1]!=="problems"){

setReport({
type:"empty"
});

return;

}




let data=getStats();


if(!data.submitted){


chrome.storage.local.get(
{
reports:{}
},
(saved)=>{


let old=
saved.reports[path[2]];


if(old){

setReport({
type:"report",
...old
});

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










setReport({

type:"report",

...data

});


}








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

bg-gradient-to-r
from-green-500
to-emerald-600

hover:from-green-400
hover:to-emerald-500

text-white

shadow-[0_0_16px_rgba(16,185,129,.6)]

transition
cursor-pointer
"

>

Generate Report

</button>


</div>

)

}









// HOME PAGE

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


<p>
No active problem found
</p>


<p className="text-gray-400">
Open a LeetCode problem to view analysis
</p>


</div>





<button

onClick={()=>setReport(null)}

className="
w-full
py-2
text-sm
"

>

← Back

</button>


</div>

)

}









// PROBLEM PAGE BUT NO SUBMIT


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


<p>
No submissions found
</p>



<p className="text-gray-400">

Submit a solution to generate analysis

</p>


</div>





<button

onClick={()=>setReport(null)}

className="
w-full
py-2
text-sm
"

>

← Back

</button>


</div>

)

}









// ACTUAL REPORT


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


<p>

⏱ Time : {report.time}s

</p>



<p>

📋 Paste Events : {report.pasteEvents}

</p>



<p>

👀 Tab Switches : {report.tabSwitches}

</p>



<p>

{report.verdict}

</p>


</div>


</div>







<button

onClick={()=>setReport(null)}

className="
w-full
py-2
text-sm
"

>

← Back

</button>



</div>


)

}


export default ReportView;