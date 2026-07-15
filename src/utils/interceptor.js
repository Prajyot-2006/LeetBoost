export function injectInterceptor(){

  if(window.__LEETBOOST_INTERCEPTOR__) return;
  window.__LEETBOOST_INTERCEPTOR__ = true;

  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("pageInterceptor.js");
  script.onload = function(){ this.remove(); };
  (document.head || document.documentElement).appendChild(script);

}