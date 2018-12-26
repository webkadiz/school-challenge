class Game {
 constructor(gameNumber) {
  this.charLengthAVG = 18;
  this.mapLineHeight = 1.1;
  this.gameNumber = gameNumber;
  this.keyWords = ["раз", "уж", "начал", "побеждай"];
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
    "часы"
   ],
   [
    "огонёк",
    "звёзды",
    "сияние",
    "ягель",
    "вьюга",
    "клюка",
    "пурга",
    "пирог",
    "мишура",
    "пороша",
    "кафтан",
    "штоф",
    "глыба",
    "блюдо",
    "танцы",
    "солнце",
    "отдых",
    "хутор"
   ],
   [
    "игрушки",
    "шоколад",
    "куржак",
    "кружева",
    "бубенцы",
    "сугроб",
    "закуска",
    "музыка",
    "конфетти",
    "конфеты",
    "гололёд",
    "огонёк",
    "хоровод",
    "хлопья",
    "метель",
    "письмо"
   ],
   [
    "снеговик",
    "снегоход",
    "чародей",
    "вечеринка",
    "полынья",
    "январь",
    "традиции",
    "гостинцы",
    "скоморох",
    "бахрома",
    "коктейль",
    "каникулы",
    "украшения",
    "волшебство",
    "снежинка",
    "варежки",
    "",
    "",
    "",
    "",
    "",
    ""
   ]
  ];
 }
 initMap() {
  this.mapHeight =
   $(".wrapper").height() - $(".greeting").outerHeight(true) + $(".attempt--wrapper").outerHeight(true);

  console.log(this.mapHeight);
  let el = $(`<div class="map__column">
  <div class="map__decor"><div>0x8540</div></div>
  <div class="map__field"></div>
  </div>`);
  $(".map").append(el);
  this.rowHeight = el.height();
  this.rowWidth = $('.map__column').width() - $('.map__decor').outerWidth(true);
  console.log(this.rowHeight, this.rowWidth);
  el.remove();

  this.rows = ~~(this.mapHeight / (this.rowHeight * this.mapLineHeight));

  this.rowLength = ~~(this.rowWidth / this.charLengthAVG)
  console.log(this.rowLength, 'rowLength');
  
 }
 createMap() {
  this.indexWord = 0;
  this.indexHint;
  this.countHex = 0;
  this.randHex = ~~(Math.random() * 65536);
  this.countWords =
   ~~((this.rowLength * this.rows) / 60) % 2 == 1
    ? ~~((this.rowLength * this.rows) / 60) + 1
    : ~~((this.rowLength * this.rows) / 60);
  this.offsetWord = ~~((this.rowLength * this.rows * this.columns) / this.countWords);
  this.posWord = ~~(Math.random() * this.offsetWord);
  this.countHint = ~~(this.countWords / 2);
  this.offsetHint = ~~((this.rowLength * this.rows * this.columns) / this.countHint);
  this.posHint = ~~(Math.random() * this.offsetHint);
  this.wordsInGame = shuffle(this.words[this.gameNumber].slice(0, this.countWords));
  this.password = this.wordsInGame[~~(Math.random() * this.wordsInGame.length)];
  this.nonExclude = [this.password];

  console.log(this.countWords, this.countHint, this.wordsInGame);

  for (let column of range(this.columns)) {
   $(".map").append(`<div class="map__column">
      <div class="map__decor"></div>
      <div class="map__field"></div>
      </div>`);

   for (let row of range(this.rows)) {
    (this.field = $(".map__field:last")[0]), (this.decor = $(".map__decor:last"));

    this.fillMap(row, column);

    //this.field.innerHTML += "<br/>";
    this.countHex += 4;

    this.decor.append(`<div>${"0x" + (this.randHex + this.countHex).toString(16).toUpperCase()}</div>`);
   }
  }
 
  this.mapHeight = $('.map').height()

  while ($('.map__field:first').height() <  this.mapHeight  + 1) {
    let randChar = this.chars[~~(Math.random() * this.chars.length)];
    $('.map__field:first').append(`<span class="map__char">${randChar} </span>`);
  }
  $('.map__field:first .map__char:last').remove()

  while ($('.map__field:last').height() <  this.mapHeight  + 1) {
    let randChar = this.chars[~~(Math.random() * this.chars.length)];
    $('.map__field:last').append(`<span class="map__char">${randChar} </span>`);
  }
  $('.map__field:last .map__char:last').remove()


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
  $(".win__code").attr("data-text", this.keyWords[this.gameNumber]);
  new Typed(".win__title", {
   strings: ["твое кодовое слово"],
   typeSpeed: 170,
   startDelay: 9000,
   showCursor: false,
   onLastStringBackspaced: () => {
    console.log("typed");
   },
   preStringTyped: (arrayPos, self) => $(self.el).addClass("cursor--blink"),
   onComplete: () => {
    new Typed(".win__code", {
     strings: [this.keyWords[this.gameNumber]],
     typeSpeed: 800,
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

$(document).ready(function() {
 //  let data = new Data();
 //  data.initAttempts(data.attempts);
 //  data.initMap();
 //  data.highlightHint();
 //  data.clickEvent();
 //  data.audioMap();

 $(".start").click(() => {
  $(".start").css("animation", "none");
  $(".start").css("opacity", 0);
  $(".start").css("pointer-events", "none");

  // if (document.documentElement.requestFullScreen) {
  //  document.documentElement.requestFullScreen();
  // } else if (document.documentElement.mozRequestFullScreen) {
  //  document.documentElement.mozRequestFullScreen();
  // } else if (document.documentElement.webkitRequestFullScreen) {
  //  document.documentElement.webkitRequestFullScreen();
  // }

  setTimeout(() => {
   let game = new Game(2);
   $("body").addClass("game");
   game.initMap();
   game.initAttempts(game.attempts);
   game.createMap();
   game.highlightHint();
   game.clickEvent();
   game.audioMap();

   setTimeout(() => {
    $(".left").removeClass("open");
    $(".right").removeClass("open");
   }, 1000);
  }, 1000);
 });
});
