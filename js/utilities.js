function random(min, max) {
 let rand = Math.random();

 if (typeof min === "undefined") {
  return rand;
 } else if (typeof max === "undefined") {
  if (min instanceof Array) {
   return min[Math.floor(rand * min.length)];
  } else {
   return rand * min;
  }
 } else {
  if (min > max) {
   var tmp = min;
   min = max;
   max = tmp;
  }

  return rand * (max - min) + min;
 }
}

function* range(amount, start = 0) {
 for (let i = start; i < start + amount; i++) {
  yield i;
 }
}

function shuffle(arr) {
 arr.sort((a, b) => {
  return Math.random() - 0.5;
 });
 return arr;
}
