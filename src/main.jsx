import React from "react";
import {createRoot} from "react-dom/client";
import App from "./App.jsx";
import css from "./index.css?inline";


console.log("🔥 LeetBoost React Started");


const host=document.createElement("div");

host.id="leetboost-root";

document.body.appendChild(host);


const shadow=host.attachShadow({
    mode:"open"
});


const style=document.createElement("style");

style.textContent=css;

shadow.appendChild(style);



const root=document.createElement("div");

shadow.appendChild(root);


createRoot(root).render(

<React.StrictMode>

<App/>

</React.StrictMode>

);