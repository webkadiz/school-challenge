

class Data {
    constructor () {
        this.rows = 18;
        this.columns = 2;
        this.rowLength = 40;
        this.chars = [
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
           this.words = [['пират', 'сигара', 'человек', 'комната', 'оплата', 'лицензия', 'акация', 'собака', 'кукушка', 'макушка', 'парта', 'сапог', 'перчатка', 'бумажка', 'интерес', 'порт']];
    }
    initMap(){
        this.wordIndex = 0;
        this.countHex = 0;
        this.randHex    = ~~(Math.random() * 65536);
     this.countWords = this.rows - ~~(Math.random() * (5 - 2) + 2);
     this.offsetWord = ~~(this.rowLength * this.rows / this.countWords);
     this.posWord = ~~(Math.random() * this.offsetWord)

     for (let i of range(this.columns)) {
        $(".map").append(`<div class="map__column">
                  <div class="map__decor"></div>
                  <div class="map__filed"></div>
              </div>`);
      
        for (let rowIndex of range(this.rows)) {
            this.rowIndex = rowIndex
         this.field        = $(".map__filed:last")[0],
              this.decor = $(".map__decor:last");
      
              this.fillMap();
              
              //this.field.innerHTML += "<br/>";
              this.countHex += 4;
      
         this.decor.append(
          `<div>${"0x" + (this.randHex + this.countHex).toString(16).toUpperCase()}</div>`
         );
        }
       }
      
       $(".map").append('<div class="map__terminal"></div>');
       $('.map__terminal').append('<div class="map__enter-wrapper"><i class="icon-angle-right"></i><i class="icon-angle-right"></i><i class="icon-angle-right"></i><div class="map__enter"></div></div>')
       
    }
    fillMap() {
        for (let k of range(this.rowLength)) {
    
            let char = this.chars[~~(Math.random() * this.chars.length)];
        
            this.field.innerHTML += `<span class="map__char">${char} <span>`;
            
            
        
            if(this.rowIndex * this.rowLength + k == this.posWord) {
                console.log(this.wordIndex);
                
                this.field.innerHTML += `<span class="map__char map__word">${this.words[0][this.wordIndex].toUpperCase()}<span>`;
                this.posWord += this.offsetWord
                this.wordIndex++;
            }
           }
    }
}


let data = new Data()

data.initMap()





function* range(amount) {
 for (let i = 0; i < amount; i++) {
  yield i;
 }
}






$(".map__char").on("mouseenter", e => {
 let audio = new Audio();
 audio.src      = "keyboard5.mp3";
 audio.autoplay = true;

 console.log(e);
 
 $('.map__enter').html(e.target.textContent)
});
