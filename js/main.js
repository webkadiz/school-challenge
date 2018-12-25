class Data {
 constructor(gameNumber) {
   this.gameNumber = gameNumber
   this.keyWords= ['раз', 'уж', 'начал', 'побеждай']
  this.attempts = 4;
  this.rows = 14;
  this.columns = 2;
  this.rowLength = 30;
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
    "ёлка",
    "лёд",
    "снег",
    "огни",
    "мороз",
    "узоры",
    "холод",
    "хвоя",
    "шуба",
    "шар",
    "лыжи",
    "снежок",
    "ночь",
    "часы",
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
 initMap() {
  this.indexWord = 0;
  this.indexHint;
  this.countHex = 0;
  this.randHex = ~~(Math.random() * 65536);
  this.countWords = ~~((this.rowLength * this.rows) / 60);
  this.offsetWord = ~~((this.rowLength * this.rows * this.columns) / this.countWords);
  this.posWord = ~~(Math.random() * this.offsetWord);
  this.countHint = ~~(this.countWords / 2);
  this.offsetHint = ~~((this.rowLength * this.rows * this.columns) / this.countHint);
  this.posHint = ~~(Math.random() * this.offsetHint);
  this.wordsInGame = mixArr(this.words[this.gameNumber].slice(0, this.countWords));
  this.password = this.wordsInGame[~~(Math.random() * this.wordsInGame.length)];
  this.nonExclude = [this.password];

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
   let i = 0;

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

 audioMap() {
  $(".map__char").on("mouseenter", e => {
   let audio = new Audio();
   audio.src = "assets/keyboard5.mp3";
   //audio.autoplay = true;
   //    audio.addEventListener(
   //     "loadeddata",
   //     function() {
   //      loaded = true;
   //     },
   //     false
   //    );
   audio.play();

   $(".map__enter:last").html(e.target.textContent);
  });
 }
 highlightHint() {
  $(".map__hint").on("mouseenter mouseleave", e => {
   let typeEvent = e.type;
   let el = e.target;
   let nextEl = el.nextElementSibling;
   let bracketOpen = el.textContent.trim();
   let bracketClose = nextEl.textContent.trim();
   let flag = true;

   while (flag) {
    flag = !this.compareBrackets(bracketOpen, bracketClose);
    typeEvent == "mouseenter" ? nextEl.classList.add("active") : nextEl.classList.remove("active");
    nextEl = nextEl.nextElementSibling;
    bracketClose = nextEl.textContent.trim();
   }
  });
 }
 initAttempts(amount) {
  for (let i of range(amount)) {
   $(".attempt--wrapper").append('<div class="attempt"></div>');
  }
 }
 updateAttempts(word) {
  if (!word) {
   this.initAttempts(this.attempts - $(".attempt").length);
   return;
  } else {
   $(".attempt:last").remove();
  }
  if (!$(".attempt:last").length) {
   this.enterTerminal("Блокировка экрана&nbsp;.&nbsp;.&nbsp;.");
   $(".wrapper").after('<div class="block-event"></div>');
   $(".map__enter-wrapper:last").remove();
   setTimeout(() => this.lose(), 2000);
   return;
  }

  let html = $('<div><div class="terminal__word"></div></div>');
  let pass = this.password;
  let matchCount = 0;
  let matchEndings = [
   "ий",
   "ие",
   "ия",
   "ия",
   "ия",
   "ий",
   "ий",
   "ий",
   "ий",
   "ий",
   "ий",
   "ий",
   "ий",
   "ий",
   "ий"
  ];
  let matchEnding = "",
   matchStr = "";
  for (let char of word) {
   if (~pass.indexOf(char)) {
    pass = pass.replace(char, "");
    $(".terminal__word", html).append(`<span class="char__highlight">${char}</span>`);
    matchCount++;
   } else {
    $(".terminal__word", html).append(`<span>${char}</span>`);
   }
  }

  matchEnding = matchCount > 14 ? matchEndings[matchCount % 10] : matchEndings[matchCount];
  matchStr = `${matchCount} совпаден${matchEnding}`;
  html.prepend(matchStr);
  this.enterTerminal(html);
 }
 clickEvent() {
  $(".map__char").click(e => {
   let el = e.target;

   //    if (!el.classList.contains("map__hint") && !el.classList.contains("map__word")) {
   //     this.updateAttempts(0);
   //    }

   if (el.classList.contains("map__word")) {
    console.log(this.password, el.textContent.trim().toLowerCase());
    if (el.textContent.trim().toLowerCase() == this.password) {
     this.enterTerminal("Выполняется вход&nbsp;.&nbsp;.&nbsp;.");
     this.win();
    } else {
     this.updateAttempts(el.textContent.trim().toLowerCase());
     this.nonExclude.push(el.textContent.trim().toLowerCase());
    }
   }

   if (el.classList.contains("map__hint")) {
    let rand = Math.random() - 0.5;

    if (rand <= 0) {
     this.updateAttempts();
     this.enterTerminal("Жизни восстановлены");
    } else {
     let randWord = this.wordsInGame[~~(Math.random() * this.wordsInGame.length)];
     while (this.nonExclude.includes(randWord))
      randWord = this.wordsInGame[~~(Math.random() * this.wordsInGame.length)];

     let elWord = $(`.map__word:contains(${randWord.toUpperCase()})`);
     let textLength = elWord.text().length;

     for (let pos of range(textLength)) {
      elWord.after('<span class="map__char">.&nbsp;&nbsp;</span>');
     }
     elWord.remove();
     this.enterTerminal("Убрано лишнее слово");
    }

    $(el) // remove hint
     .removeClass("map__hint")
     .trigger("mouseleave")
     .off("mouseenter mouseleave");
   }
  });
 }

 enterTerminal(enter) {
  let el = $(".map__enter-wrapper:last").clone();

  $(".map__enter", el)
   .html(enter)
   .removeClass("active");
  $(".map__enter-wrapper:last").before(el);
 }
 win() {
  $(".wrapper").after('<div class="block-event"></div>');
  $(".map__enter-wrapper:last").remove();
  $(".win").addClass("win__active");
  new Typed(".win__title", {
   strings: ["твое кодовое слово"],
   typeSpeed: 200,
   startDelay: 9000,
   showCursor: false,
   preStringTyped: (arrayPos, self) => $(self.el).addClass("cursor--blink"),
   onComplete: () => {
    new Typed(".win__code", {
     strings: this.keyWords[this.gameNumber],
     typeSpeed: 1000,
     startDelay: 1000,
     showCursor: false,
     preStringTyped: (arrayPos, self) => $(self.el).addClass("cursor--blink"),
     onComplete: () => {
      $(".win__title").addClass("win__title--glitch");
      $(".win__code").addClass("win__code--glitch");
     }
    });
   }
  });
 }
 lose() {
  $("body").addClass("lose");
  //prettier-ignore
  document.querySelector(".wrapper").addEventListener("webkitAnimationEnd",function(event) {
    setTimeout(() => {
     $(".bg").addClass("glitch");
     $(".bg").append("<span>no signal</span>");
    }, 500);
  },false);
 }
}

class Start {
 constructor() {
  console.log(fabric);
  this.font = "Bender";
  this.fontWeight = 900;
  this.speed = 5;
  this.doc = document.documentElement;
  this.docWidth = document.documentElement.clientWidth;
  this.docHeight = document.documentElement.clientHeight;
 }

 run() {
  this.canvas = new fabric.Canvas(document.getElementById("start"), {
   width: this.docWidth,
   height: this.docHeight,
   backgroundColor: "#020102"
  });
 }
 loadFont() {
  fontSpy(this.font, {
   success: () => this.numbers(),
   failure: () => console.log(false),
   timeOut: 3000,
   fontWeight: this.fontWeight
  });
 }
 numbers() {
  this.startText = new fabric.IText("START", {
   globalCompositeOperation: "destination-out",
   stroke: "green",
   fontSize: 300,
   fontFamily: this.font,
   charSpacing: 500,
   fontWeight: this.fontWeight,
   originX: "center",
   originY: "center"
  });
  this.canvas.add(this.startText);
  this.startText.center();

  for (let i of range(100)) {
   let left = ~~(Math.random() * document.documentElement.clientWidth);
   let top = ~~(Math.random() * document.documentElement.clientHeight);
   let digitText = Math.random() - 0.5 < 0 ? "0" : "1";
   let digit = new fabric.IText(digitText, {
    fill: "#13b40d",
    shadow: "0 0 10px #1adf12",
    fontFamily: this.font,
    left,
    top,
    type: "digit",
    originX: "center",
    originY: "center"
   });
   digit.dirX = (Math.random() * 2 - 1) * random(15);
   digit.dirY = (Math.random() * 2 - 1) * random(15);
   digit.dirRot = (Math.random() * 2 - 1) * random(20);
   this.canvas.add(digit);
  }
  this.anim();
 }
 anim() {
  let anim = () => {
   if (this.game) return;
   this.canvas.forEachObject(el => {
    if (el.type === "digit") {
     el.set({
      left: el.left + el.dirX,
      top: el.top + el.dirY,
      angle: el.angle + el.dirRot
     });

     if (el.left > this.docWidth) {
      el.left = 0 - el.width;
     }
     if (el.left + el.width < 0) {
      el.left = this.docWidth;
     }
     if (el.top > this.docHeight) {
      el.top = 0 - el.height;
     }

     if (el.top + el.height < 0) {
      el.top = this.docHeight;
     }
     this.canvas.requestRenderAll();
    }
   });
   window.requestAnimationFrame(anim);
  };
  anim();
 }
 startGame() {
  this.canvas.on("mouse:up", e => {
   fabric.util.animate({
    startValue: this.startText.fontSize,
    endValue: this.startText.fontSize + 1000,
    duration: 8000,
    // linear movement
    easing: (t, b, c, d) => (c * t) / d + b,
    onChange: fontSize => {
     //  let charSpacing = this.startText.charSpacing - fontSize / 100;
     //  if (charSpacing > -100) this.startText.set({ charSpacing });
     this.startText.set({ fontSize });

     this.canvas.requestRenderAll();
    }
    // onComplete: animate
   });
   setTimeout(() => {
    this.game = true;

    let data = new Data();
    $("body").addClass("game");
    data.initAttempts(data.attempts);
    data.initMap();
    data.highlightHint();
    data.clickEvent();
    data.audioMap();
   }, 2000);
  });
 }
}

$(document).ready(function() {
 //  let data = new Data();
 //  data.initAttempts(data.attempts);
 //  data.initMap();
 //  data.highlightHint();
 //  data.clickEvent();
 //  data.audioMap();

 $('.start').click(() => {
  $('.start').css('animation', 'none');
  $('.start').css('opacity', 0)
  $('.start').css('pointer-events', 'none')

  document.documentElement.requestFullscreen();
   
  let data = new Data(0);
  $("body").addClass("game");
  data.initAttempts(data.attempts);
  data.initMap();
  data.highlightHint();
  data.clickEvent();
  data.audioMap();

   setTimeout(() => {
    $('.left').removeClass('open')
    $('.right').removeClass('open')
   },2000)
 })
 
});
