import { getSettings } from "./settings";

export function showCelebration(type, count) {

  getSettings((settings) => {

    if (!settings.celebration) return;

    const overlay = document.createElement("div");
    overlay.className = "leetboost-celebration";

    const img = document.createElement("img");

    try {
      img.src = chrome.runtime.getURL(`assets/${settings.theme}/${type}.png`);
    }
    catch (e) {
      return;
    }

    img.className = "leetboost-img";
    overlay.appendChild(img);

    const text = document.createElement("h1");
    text.innerText = type === "passed" ? `Cleared in ${count} attempts 🔥` : `Attempt #${count}`;
    text.className = "leetboost-title";
    overlay.appendChild(text);

    const style = document.createElement("style");
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
        z-index:2147483647;
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
        text-shadow:4px 4px 0 black, 0 0 20px #ffcc00;
        animation:lbText .5s ease;
      }

      @keyframes lbFade{
        from{ opacity:0; }
        to{ opacity:1; }
      }

      @keyframes lbZoom{
        from{ opacity:0; transform:scale(2); }
        to{ opacity:1; transform:scale(1); }
      }

      @keyframes lbText{
        from{ opacity:0; transform:translateY(30px); }
        to{ opacity:1; transform:translateY(0); }
      }

    `;

    overlay.appendChild(style);
    document.documentElement.appendChild(overlay);

    let audio = null;

    try {
      audio = new Audio(chrome.runtime.getURL(`assets/${settings.theme}/${type}.mp3`));
      audio.volume = 0.6;
      if (settings.sound){
        audio.play().catch(()=>{});
      }
    }
    catch (e) {}

    // Fade overlay out at 5.5s, gone by 6s
    setTimeout(() => {
      overlay.style.transition = "opacity 500ms ease";
      overlay.style.opacity = "0";
    }, 5500);

    setTimeout(() => {
      overlay.remove();
    }, 6000);

    // Fade audio out at 6.5s, gone by 7s
    setTimeout(() => {
      if (audio){
        let volume = audio.volume;
        const fadeAudio = setInterval(()=>{
          volume -= 0.06;
          if(volume <= 0){
            audio.volume = 0;
            clearInterval(fadeAudio);
          } else {
            audio.volume = volume;
          }
        }, 50);
      }
    }, 6500);

    setTimeout(() => {
      if (audio){
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0.6;
      }
    }, 7000);

  });

}