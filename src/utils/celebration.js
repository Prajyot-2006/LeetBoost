import { getSettings } from "./settings";

export function showCelebration(type, count) {
console.log("showCelebration:", type);
  getSettings((settings) => {

    if (!settings.celebration)
      return;

    let overlay = document.createElement("div");

    overlay.className = "leetboost-celebration";

    let img = document.createElement("img");

    try {

      img.src =
        chrome.runtime.getURL(
          `assets/${settings.theme}/${type}.png`
        );
        console.log("Theme:", settings.theme);
        console.log("Image URL:", img.src);
        console.log("Settings:", settings);

    }
    catch (e) {

      return;

    }

    img.className = "leetboost-img";

    overlay.appendChild(img);





    let text = document.createElement("h1");

    text.innerText =
      type === "passed"
        ? `Cleared in ${count} attempts 🔥`
        : `Attempt #${count}`;

    text.className = "leetboost-title";

    overlay.appendChild(text);





    let style = document.createElement("style");

    style.innerHTML = `

.leetboost-celebration{

position:fixed;
top:0;
left:0;

width:100vw;
height:100vh;

background:rgba(0,0,0,.88);

display:flex;
flex-direction:column;

align-items:center;
justify-content:center;

gap:25px;

z-index:999999999;

animation:lbFade .4s ease;

}



.leetboost-img{

width:600px;

max-width:90%;

animation:lbZoom .7s ease;

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

animation:lbText .5s ease;

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

transform:scale(2);

}

to{

opacity:1;

transform:scale(1);

}

}



@keyframes lbText{

from{

opacity:0;

transform:translateY(30px);

}

to{

opacity:1;

transform:translateY(0);

}

}

`;

    overlay.appendChild(style);

    document.body.appendChild(overlay);





    let audio = null;

    try {

      audio = new Audio(

        chrome.runtime.getURL(
          `assets/${settings.theme}/${type}.mp3`
        )

      );

      audio.volume = 0.6;

      if (settings.sound) {

        audio.play();

      }

    }
    catch (e) { }






    // Fade out after 3.5 seconds
    setTimeout(() => {

      overlay.style.opacity = "0";
      overlay.style.transition = "opacity .5s ease";

    }, 4500);





    // Remove after 4 seconds
    setTimeout(() => {

      overlay.remove();

      if (audio) {

        audio.pause();
        audio.currentTime = 0;

      }

    }, 5000);

  });

}