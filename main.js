class Data {
 constructor() {
  this.attempts     = 4;
  this.rows         = 18;
  this.columns      = 2;
  this.rowLength    = 30;
  this.bracketsOpen = ["{", "[", "<", "("];
  this.bracketsClose = ["}", "]", ">", ")"];
  this.chars = [
   "[",
   "{",
   "'",
   '"',
   "!",
   "<",
   "_",
   "@",
   "-",
   "?",
   "(",
   ";",
   "+",
   "#",
   "^",
   "&",
   "*",
   "$",
   "%",
   "~"
  ];
  this.words = [
   [
    "пират",
    "сигара",
    "человек",
    "комната",
    "оплата",
    "лицензия",
    "акация",
    "собака",
    "кукушка",
    "макушка",
    "парта",
    "сапог",
    "перчатка",
    "бумажка",
    "интерес",
    "порт",
    "ромка",
    "водка",
    "столик",
    "вантик",
    "бантик",
    "кукла",
    "ваза",
    "взяла",
    "забрала",
    "снеговик",
    "кукуруза",
    "ураган",
    "зима",
    "лето",
    "осень",
    " весна"
   ]
  ];
 }
 initAttempts() {
  for (let i of range(this.attempts)) {
   $(".attempt--wrapper").append('<div class="attempt"></div>');
  }
 }
 updateAttempts(win) {
  if (win) {
  } else {
   $(".attempt:last").remove();
  }
 }
 initMap() {
  this.indexWord = 0;
  this.indexHint;
  this.countHex    = 0;
  this.randHex     = ~~(Math.random() * 65536);
  this.countWords  = ~~((this.rowLength * this.rows) / 60);
  this.offsetWord  = ~~((this.rowLength * this.rows * this.columns) / this.countWords);
  this.posWord     = ~~(Math.random() * this.offsetWord);
  this.countHint   = ~~(this.countWords / 2);
  this.offsetHint  = ~~((this.rowLength * this.rows * this.columns) / this.countHint);
  this.posHint     = ~~(Math.random() * this.offsetHint);
  this.wordsInGame = mixArr(this.words[0].slice(0, this.countWords));
  this.password    = this.wordsInGame[~~(Math.random() * this.wordsInGame.length)];

  console.log(this.countWords, this.countHint, this.wordsInGame);

  for (let column of range(this.columns)) {
   $(".map").append(`<div class="map__column">
                  <div class="map__decor"></div>
                  <div class="map__filed"></div>
              </div>`);

   for (let row of range(this.rows)) {
    (this.field = $(".map__filed:last")[0]), (this.decor = $(".map__decor:last"));

    this.fillMap(row, column);

    //this.field.innerHTML += "<br/>";
    this.countHex += 4;

    this.decor.append(`<div>${"0x" + (this.randHex + this.countHex).toString(16).toUpperCase()}</div>`);
   }
  }

  $(".map").append('<div class="map__terminal"></div>');
  $(".map__terminal").append(
   '<div class="map__enter-wrapper"><i class="icon-angle-right"></i><i class="icon-angle-right"></i><i class="icon-angle-right"></i><div class="map__enter active"></div></div>'
  );
  return this;
 }
 fillMap(row, column) {
  for (let charPos of range(this.rowLength)) {
   let randChar = this.chars[~~(Math.random() * this.chars.length)];
   let i        = 0;

   $(this.field).append(`<span class="map__char">${randChar} </span>`);

   if ((this.rows * column + row) * this.rowLength + charPos == this.posHint) {
    for (let el of Array.from(document.querySelectorAll(".map__char")).reverse()) {
     let char = el.textContent.trim();

     if (el.classList.contains("map__word")) {
      //console.log(i);
     }

     if (this.bracketsOpen.includes(char)) {
      console.log(char);
      //console.log(char);
      $(this.field).append(`<span class="map__char">${this.getCloseBracket(char)} </span>`);
      el.classList.add("map__hint");
      break;
     }

     i++;
    }

    this.posHint += this.offsetHint;
   }
   console.log(this.posWord, this.offsetWord);
   if ((this.rows * column + row) * this.rowLength + charPos == this.posWord) {
    $(this.field).append(
     `<span class="map__char map__word">${this.wordsInGame[this.indexWord].toUpperCase()}</span>`
    );
    this.posWord += this.offsetWord;
    this.indexWord++;
   }
  }
 }

 getCloseBracket(bracketOpen) {
  if (bracketOpen == "[") return "]";
  else if (bracketOpen == "{") return "}";
  else if (bracketOpen == "(") return ")";
  else if (bracketOpen == "<") return ">";
 }
 compareBrackets(open, close) {
  console.log(open.trim(), close.trim());
  if (open.trim() == "{" && close.trim() == "}") return true;
  else if (open.trim() == "[" && close.trim() == "]") return true;
  else if (open.trim() == "<" && close.trim() == ">") return true;
  else if (open.trim() == "(" && close.trim() == ")") return true;
  return false;
 }

 highlightHint() {
  $(".map__hint").on("mouseenter mouseleave", e => {
   let typeEvent    = e.type;
   let el           = e.target;
   let nextEl       = el.nextElementSibling;
   let bracketOpen  = el.textContent.trim();
   let bracketClose = nextEl.textContent.trim();
   let flag         = true;

   while (flag) {
    flag = !this.compareBrackets(bracketOpen, bracketClose);
    typeEvent == "mouseenter" ? nextEl.classList.add("active"): nextEl.classList.remove("active");
    nextEl       = nextEl.nextElementSibling;
    bracketClose = nextEl.textContent.trim();
   }
  });
 }
 clickEvent() {
  $(".map__char").click(e => {
   let el = e.target;

   if (!el.classList.contains("map__hint") && !el.classList.contains("map__word")) {
    this.updateAttempts(0);
   }

   if (el.classList.contains("map__word")) {
    console.log(this.password, el.textContent.trim().toLowerCase());
    if (el.textContent.trim().toLowerCase() == this.password) {
     this.enterTerminal("Вы угадали пароль");
    } else {
     this.updateAttempts(0);
     this.enterTerminal("Неверный пароль");
    }
   }

   if (el.classList.contains("map__hint")) {
    let rand = Math.random() - 0.5;
   }
  });
 }

 enterTerminal(enter) {
  let el = $(".map__enter-wrapper:last").clone();

  $(".map__enter", el)
   .text(enter)
   .removeClass("active");
  $(".map__terminal").prepend(el);
 }
}

let data = new Data();

data.initAttempts();
data.initMap();
data.highlightHint();
data.clickEvent();

function* range(amount, start = 0) {
 for (let i = start; i < start + amount; i++) {
  yield i;
 }
}

function mixArr(arr) {
 arr.sort((a, b) => {
  return Math.random() - 0.5;
 });
 return arr;
}

$(".map__char").on("mouseenter", e => {
 let audio          = new Audio();
     audio.src      = "keyboard5.mp3";
     audio.autoplay = true;

 $(".map__enter:last").html(e.target.textContent);
});
