function* range(amount) {
 for (let i = 0; i < amount; i++) {
  yield i;
 }
}

function map(strLength = 40, rows = 12, columns = 2) {
 let countHex   = 0,
     randHex    = ~~(Math.random() * 65536),
     countWords = rows - ~~(Math.random() * (5 - 2) + 2),
     fillChars  = [
   "[",
   "]",
   "{",
   "}",
   "'",
   '"',
   "!",
   "<",
   ">",
   "_",
   "@",
   "-",
   "?",
   "(",
   ")",
   ";",
   "+",
   "#",
   "^",
   "&",
   "*"
  ];

 for (let i of range(columns)) {
  $(".map").append(`<div class="map__column">
			<div class="map__decor"></div>
			<div class="map__filed"></div>
		</div>`);

  for (let j of range(rows)) {
   let el        = $(".map__filed:last")[0];
       countHex += 4;
   for (let k of range(strLength)) {
    let char = fillChars[~~(Math.random() * fillChars.length)];

    el.innerHTML += `<span class="map__char">${char}<span>`;
   }
   el.innerHTML += "<br/>";

   $(".map__decor:last").append(
    `<div>${"0x" + (randHex + countHex).toString(16).toUpperCase()}</div>`
   );
  }
 }

 $(".map").append('<div class="map__terminal"></div>');
}

map();

$(".map__char").on("mouseenter", e => {
 let audio = new Audio();
 console.log(123);
 audio.src      = "keyboard5.mp3";
 audio.autoplay = true;
});
