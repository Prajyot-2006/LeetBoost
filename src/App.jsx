import {useState,useEffect} from "react";

import FloatingButton from "./components/FloatingButton";
import Header from "./components/Header";
import SettingsView from "./components/SettingsView";
import ReportView from "./components/ReportView";

import {startTracking} from "./utils/tracker";


function App(){


const [open,setOpen]=useState(false);

const [activeTab,setActiveTab]=useState("report");



useEffect(()=>{

startTracking();

},[]);





if(!open){

return(

<FloatingButton

onClick={()=>setOpen(true)}

/>

);

}







return(

<div

className="
fixed bottom-6 right-6

z-[999999]

w-[26rem]

max-h-[80vh]

rounded-2xl


bg-gradient-to-br

from-gray-900/90

to-gray-800/90


backdrop-blur-xl


border

border-gray-700/60


shadow-[0_20px_60px_rgba(0,0,0,0.6)]


flex

flex-col

overflow-hidden

font-sans
"

>





<Header

onClose={()=>setOpen(false)}

activeTab={activeTab}

onSettings={()=>{


setActiveTab(

activeTab==="settings"

?

"report"

:

"settings"

)


}}

/>









<div

className="
px-4
py-4

flex-1

overflow-y-auto

scrollbar-thin

scrollbar-thumb-gray-700/60

scrollbar-track-transparent
"

>


{

activeTab==="report"

?

<ReportView/>

:

<SettingsView/>


}


</div>









<div

className="
px-3 py-2

text-center

text-xs

text-gray-400

border-t

border-gray-800

font-mono
"

>

LeetBoost • v1.0

</div>





</div>


);


}


export default App;