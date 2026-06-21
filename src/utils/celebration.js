import {getSettings} from "./settings";

export function showCelebration(type,count){


getSettings((settings)=>{


if(!settings.celebration)
return;


let overlay=document.createElement("div");

overlay.className="leetboost-celebration";



let img=document.createElement("img");


try{

img.src=
chrome.runtime.getURL(
`assets/${settings.theme}/${type}.png`
);

}
catch(e){

return;

}


img.className="leetboost-img";

overlay.appendChild(img);






let text=document.createElement("h1");


text.innerText=
type==="passed"
?
`Cleared in ${count} attempts 🔥`
:
`Attempt #${count}`;


text.className="leetboost-title";


overlay.appendChild(text);






let style=document.createElement("style");


style.innerHTML=`

.leetboost-celebration{

position:fixed;
top:0;
left:0;

height:100vh;
width:100vw;

background:rgba(0,0,0,.88);

display:flex;
flex-direction:column;

align-items:center;
justify-content:center;

gap:25px;

z-index:999999999;

animation:lbFade .8s ease;

}


.leetboost-img{

width:600px;

max-width:90%;

animation:lbZoom 1.2s ease;

}



.leetboost-title{

color:#ffcc00;

font-size:48px;

font-family:Impact,Arial;

letter-spacing:2px;

text-transform:uppercase;

background:rgba(0,0,0,.5);

padding:12px 30px;

border-radius:12px;


text-shadow:

4px 4px 0 black,

0 0 20px #ffcc00;


animation:lbText .8s ease;

}




@keyframes lbFade{

from{
opacity:0;
}

to{
opacity:1;
}

}




@keyframes lbZoom{

from{

opacity:0;

transform:scale(2.5);

}


to{

opacity:1;

transform:scale(1);

}

}




@keyframes lbText{


from{

opacity:0;

transform:translateY(40px);

}


to{

opacity:1;

transform:translateY(0);

}

}

`;



overlay.appendChild(style);


document.body.appendChild(overlay);







let audio=null;


try{


audio=new Audio(

chrome.runtime.getURL(
`assets/${settings.theme}/${type}.mp3`
)

);


audio.volume=1;


if(settings.sound){

audio.play();

}


}
catch(e){}






setTimeout(()=>{


overlay.style.opacity="0";

overlay.style.transition=".7s";


},7300);







setTimeout(()=>{


overlay.remove();


if(audio){

audio.pause();

}


},8000);



});

}
