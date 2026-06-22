import {useEffect,useState} from "react";
import {Settings, X} from "lucide-react";
import {getLeetCodeUser} from "../utils/user";


function Header({onClose,onSettings,activeTab}){


const [username,setUsername]=useState("leetcode");


useEffect(()=>{


let user=getLeetCodeUser();


setUsername(user);


},[]);





return(

<div
className="
px-4 py-3

flex justify-between items-center

shrink-0

border-b border-gray-700/60
"
>



<div className="flex items-center gap-3">



<div
className="
w-9 h-9

rounded-full

overflow-hidden

ring-2 ring-green-500/40

shadow-[0_0_12px_rgba(34,197,94,0.6)]

flex items-center justify-center

bg-gray-800
"
>

<img
  src={chrome.runtime.getURL("icon128.png")}
  className="
    w-[120%]
    h-[120%]
    object-cover
    scale-125
  "
/>

</div>




<div className="flex flex-col gap-1">


<h2 className="font-xl mb-0 text-lg text-gray-100">

LeetBoost

</h2>



<p className="text-xs text-green-400 font-mono">

@{username}

</p>


</div>



</div>








<div className="flex items-center gap-2">



<button

onClick={onSettings}

title="Settings"

style={
activeTab==="settings"
?
{
animation:"led-pulse 2.5s ease-in-out infinite"
}
:
{}
}


className={`

w-9 h-9

flex items-center justify-center

rounded-xl

transition

cursor-pointer

border


${

activeTab==="settings"

?

"bg-green-500 text-white border-white shadow-[0_0_10px_rgba(34,197,94,0.7),0_0_20px_rgba(34,197,94,0.4)]"

:

"bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white"

}

`}

>


<Settings size={17} strokeWidth={2}/>


</button>









<button

onClick={onClose}

title="Close"

className="
w-9 h-9

flex items-center justify-center

rounded-xl

bg-gray-700

text-gray-400

border border-white/20

hover:bg-gray-600

hover:text-white

hover:border-white/40

transition

cursor-pointer
"

>


<X size={15} strokeWidth={2.5}/>


</button>




</div>



</div>


)


}


export default Header;