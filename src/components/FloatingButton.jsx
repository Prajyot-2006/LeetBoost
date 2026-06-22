function FloatingButton({onClick}){

return (

<button
onClick={onClick}

className="
fixed bottom-6 right-6 z-[999999]

w-14 h-14

rounded-full

bg-gray-900

border border-gray-700

text-white text-2xl

flex items-center justify-center

shadow-[0_0_20px_rgba(34,197,94,.6)]

hover:scale-110

transition
cursor-pointer
"
>

<img
src={chrome.runtime.getURL("icon128.png")}
className="w-full h-full object-cover"
/>

</button>

);

}


export default FloatingButton;