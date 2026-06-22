export function getLeetCodeUser(){


try{


// Method 1: LeetCode global data

let scripts =
document.querySelectorAll("script");


for(let script of scripts){


let text=script.textContent;


if(
text &&
text.includes("username")
){


let match =
text.match(/"username":"(.*?)"/);


if(match && match[1]){


localStorage.setItem(
"LEETBOOST_USER",
match[1]
);


return match[1];


}


}


}




// Method 2: old saved username


let saved =
localStorage.getItem(
"LEETBOOST_USER"
);


if(saved){

return saved;

}



}
catch(e){

console.log(e);

}



return "leetcode";


}