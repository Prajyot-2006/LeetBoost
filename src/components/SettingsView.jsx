import {useEffect,useState} from "react";
import {saveSetting} from "../utils/settings";


function SettingsView(){


const [settings,setSettings]=useState({

celebration:true,

sound:true,

theme:"gta"

});



useEffect(()=>{


chrome.storage.local.get(

{

celebration:true,

sound:true,

theme:"gta"

},

(data)=>{

setSettings(data);

}

);


},[]);





function update(key,value){


setSettings({

...settings,

[key]:value

});


saveSetting(key,value);


}








return(

<div className="space-y-5 animate-fade-in">


<div className="text-center">

<h3 className="
text-[11px]
font-bold
tracking-widest
uppercase
text-gray-400
">

Settings

</h3>

</div>





<Section title="Appearance">


<SettingRow

title="Celebration Mode"

desc="Show GTA-style banner on submission"

>

<Toggle

enabled={settings.celebration}

onToggle={()=>
update(
"celebration",
!settings.celebration
)
}

/>


</SettingRow>





<SettingRow

title="Sound Effects"

desc="Play Wasted / Mission Passed"

>

<Toggle

enabled={settings.sound}

onToggle={()=>
update(
"sound",
!settings.sound
)
}

/>

</SettingRow>


</Section>








<Section title="Theme">


<div className="space-y-1">


<select

value={settings.theme}

onChange={(e)=>
update(
"theme",
e.target.value
)
}

className="
w-full
rounded-lg

bg-gray-900

border
border-gray-700

px-3
py-2

text-sm
text-gray-200

focus:border-green-500
focus:outline-none

transition
cursor-pointer
"
>


<option value="gta">

Grand Theft Auto

</option>


<option value="minecraft">

Minecraft

</option>


</select>



<p className="text-xs text-gray-400 mt-2">

Controls banner visuals and sound style

</p>


</div>


</Section>









<div className="
rounded-lg

border
border-green-900/40

bg-green-950/20

px-3
py-2

text-xs
text-gray-300
">

Settings are saved automatically to your browser.

</div>





</div>

)


}









function Section({title,children}){


return(

<div className="
rounded-xl

border
border-gray-700/60

bg-gradient-to-br
from-gray-900
to-gray-800

p-4

space-y-4
">


<div className="
text-xs

font-semibold

text-gray-300

uppercase

tracking-wide
">

{title}

</div>


{children}


</div>

)

}










function SettingRow({title,desc,children}){


return(

<div className="
flex

items-center

justify-between

gap-3
">


<div>


<div className="
text-sm

font-medium

text-gray-200
">

{title}

</div>



<div className="
text-xs

text-gray-400

leading-relaxed
">

{desc}

</div>


</div>


{children}


</div>

)

}










function Toggle({enabled,onToggle}){


return(

<button

onClick={onToggle}

role="switch"

className={`

relative

inline-flex

h-7

w-12

items-center

rounded-full


transition-all

duration-300

ease-out


focus:outline-none

focus:ring-2

focus:ring-green-500/40


${

enabled

?

"bg-gradient-to-r from-green-400 to-emerald-500 glow-toggle"

:

"bg-gradient-to-r from-gray-700 to-gray-600"

}

`}

>


<span

className={`

absolute

left-1

h-5

w-5

rounded-full

bg-white


transition-transform

duration-300

ease-out


${

enabled

?

"translate-x-5 shadow-[0_0_8px_rgba(255,255,255,0.9)]"

:

"translate-x-0 shadow-md"

}

`}

/>


</button>

)

}





export default SettingsView;