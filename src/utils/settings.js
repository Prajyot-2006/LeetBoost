export function getSettings(callback){


if(
typeof chrome==="undefined" ||
!chrome.storage
){

callback({

celebration:true,

sound:true,

theme:"gta"

});


return;

}




chrome.storage.local.get(

{

celebration:true,

sound:true,

theme:"gta"

},

callback

);


}









export function saveSetting(key,value){



if(
typeof chrome==="undefined" ||
!chrome.storage
){

return;

}




chrome.storage.local.set({

[key]:value

});



}