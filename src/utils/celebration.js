import { getSettings } from "./settings";

export function showCelebration(type, count) {

  getSettings(async (settings) => {

    if (!settings.celebration) return;

    const imageUrl =
      chrome.runtime.getURL(
        `assets/${settings.theme}/${type}.png`
      );

    const audioUrl =
      chrome.runtime.getURL(
        `assets/${settings.theme}/${type}.mp3`
      );

    // --------------------------------
    // PRELOAD IMAGE
    // --------------------------------

    const img = new Image();

    img.src = imageUrl;

    try {
      await img.decode();
    }
    catch (e) {
      // Continue even if decode is not supported
    }

    // --------------------------------
    // PRELOAD AUDIO
    // --------------------------------

    let audio = null;

    if (settings.sound) {

      try {

        audio = new Audio();

        audio.src = audioUrl;
        audio.volume = 0.6;
        audio.preload = "auto";

        await new Promise((resolve) => {

          if (audio.readyState >= 3) {
            resolve();
            return;
          }

          audio.addEventListener(
            "canplaythrough",
            resolve,
            { once: true }
          );

          // Don't wait forever
          setTimeout(resolve, 1000);

        });

      }
      catch (e) {

        audio = null;

      }

    }

    // --------------------------------
    // CREATE OVERLAY
    // --------------------------------

    const overlay =
      document.createElement("div");

    overlay.className =
      "leetboost-celebration";

    // --------------------------------
    // IMAGE
    // --------------------------------

    img.className =
      "leetboost-img";

    overlay.appendChild(img);

    // --------------------------------
    // TEXT
    // --------------------------------

    const text =
      document.createElement("h1");

    text.innerText =
      type === "passed"
        ? `Cleared in ${count} attempts 🔥`
        : `Attempt #${count}`;

    text.className =
      "leetboost-title";

    overlay.appendChild(text);

    // --------------------------------
    // STYLES
    // --------------------------------

    const style =
      document.createElement("style");

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

        opacity:1;

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

    // --------------------------------
    // SHOW OVERLAY
    // --------------------------------

    document.documentElement.appendChild(
      overlay
    );

    // --------------------------------
    // AUDIO + VISUAL TIMING
    // --------------------------------

    if (audio && settings.sound) {

      audio.currentTime = 0;

      try {

        await audio.play();

        // --------------------------------
        // GET ACTUAL AUDIO DURATION
        // --------------------------------

        const duration =
          Number.isFinite(audio.duration) &&
          audio.duration > 0
            ? audio.duration * 1000
            : 6000;

        console.log(
          "LeetBoost Celebration Duration:",
          duration,
          "ms"
        );

        // --------------------------------
        // FADE IMAGE + OVERLAY
        // --------------------------------

        const fadeTime = 500;

        setTimeout(() => {

          overlay.style.transition =
            "opacity 500ms ease";

          overlay.style.opacity = "0";

        }, Math.max(0, duration - fadeTime));

        // --------------------------------
        // WAIT FOR AUDIO TO FINISH
        // --------------------------------

        audio.addEventListener(
          "ended",
          () => {

            overlay.remove();

            try {
              audio.currentTime = 0;
              audio.src = "";
            }
            catch (e) {}

          },
          { once: true }
        );

      }
      catch (e) {

        // --------------------------------
        // AUDIO FAILED
        // --------------------------------

        console.warn(
          "LeetBoost: Audio could not play."
        );

        setTimeout(() => {

          overlay.style.transition =
            "opacity 500ms ease";

          overlay.style.opacity = "0";

        }, 5500);

        setTimeout(() => {

          overlay.remove();

        }, 6000);

      }

    }

    // --------------------------------
    // SOUND OFF
    // --------------------------------

    else {

      const duration = 6000;

      setTimeout(() => {

        overlay.style.transition =
          "opacity 500ms ease";

        overlay.style.opacity = "0";

      }, duration - 500);

      setTimeout(() => {

        overlay.remove();

      }, duration);

    }

  });

}