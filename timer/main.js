let q = selector => document.querySelector(selector);
let qAll = selector => document.querySelectorAll(selector);
let timerEl = q(".timer");
let time = timerEl.dataset.time;
let strTime = "";
let colors = ["#009914", "#ff0000", "#ff7777", "#f7de00"];
let color = colors[0];
let keyIP = "123557855";
let strIP = "";
let clickFunc;
let timer;
let result = 10;

function strFromTime(time) {
 let str = "";
 if (time < 0) {
  time = Math.abs(time);
  str = "-";
 }
 let minute = ~~(time / 60);
 let second = time % 60;

 str += `${~~(minute / 10)}${minute % 10}:${~~(second / 10)}${second % 10}`;
 return str;
}

q(".page").addEventListener(
 "click",
 (clickFunc = e => {
  timer = setInterval(() => {
   time -= 1;
   minute = ~~((time - 1) / 60);

   if (time < 60) timerEl.style.animation = "scale 1s infinite linear";
   if (time < 0) timerEl.style.animation = "scale .5s infinite linear";
   if (minute > -1 && minute < 3) color = colors[minute + 1];
   strTime = strFromTime(time);
   timerEl.textContent = strTime;
   timerEl.style.color = color;
  }, 1000);
  q(".page").removeEventListener("click", clickFunc);
  console.log(123);
 })
);

document.addEventListener("keyup", e => {
 if (e.keyCode === 13) {
  console.log("enter");

  Array.from(qAll("input"), input => {
   strIP += input.value;
  });

  if (strIP === keyIP) {
   clearInterval(timer);
   if (time < 0) result -= ~~(Math.abs(time) / 60);
   q(".code").style.color = colors[0];
   q("body").classList.add("finish");
   q(".timer").style.animation = "none";
  } else {
   q(".code").classList.add("error");
  }
 }
 strIP = "";
});

q(".code").addEventListener("webkitAnimationEnd", function() {
 this.classList.remove("error");
});
