const fretHolders = document.querySelectorAll(".fret-holder")

const numberToNote = [
  "-E",
  "-F",
  "-F#",
  "-G",
  "-G#",
  "-A",
  "-A#",
  "-B",
  "-C",
  "-C#",
  "-D",
  "-D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "+E",
  "+F",
  "+F#",
  "+G",
  "+G#",
  "+A",
  "+A#",
  "+B",
  "+C",
  "+C#",
  "+D",
  "+D#",
  "++E",
]
var fretNumbers = [
  0,
  0,
  0,
  0,
  0,
  0
]

var timers = [...Array(6)]

var stringData = [
  { note: 0, fretNumber: 0, timer: undefined},
  { note: 5, fretNumber: 0, timer: undefined},
  { note: 10, fretNumber: 0, timer: undefined},
  { note: 15, fretNumber: 0, timer: undefined},
  { note: 19, fretNumber: 0, timer: undefined},
  { note: 24, fretNumber: 0, timer: undefined},
]

function debounce(func, timeout, string) {
  return (...args) => {
    if(!stringData[string].timer) {
      func.apply(this, args)

      clearTimeout(stringData[string].timer)
      stringData[string].timer = setTimeout(() => {
      stringData[string].timer = undefined
      }, timeout)
    }
  }
}

function drawGrid() {
  fretHolders.forEach((fretHolder, index) => {
    for (let i = 0; i < 13; i++) {
      let div = document.createElement("div");
      let string = index;
      let fretNumber = i;
      div.setAttribute("id", `fret_${i}`);
      div.setAttribute("class", "fret");
      fretHolder.append(div);
      div.addEventListener("mousedown", chooseFret.bind(div, fretNumber, string));
    }
  });
}

function chooseFret(fret, string) {
  stringData[string].fretNumber = fret;
  let circle = document.createElement("div")
  let letter = document.createElement("span")
  circle.setAttribute("class", "fret_circle")
  letter.setAttribute("class", "text")
  letter.textContent = ""
  circle.append(letter)
  // Remove old ones
  let oldCircles = this.parentNode.querySelectorAll(".fret_circle")
  oldCircles.forEach(fretCircle => fretCircle.remove())
  this.append(circle)
  console.log(fretNumbers)
}

drawGrid();

function play(string) {
  console.log(string)
  const fretNumber = stringData[string].fretNumber;
  const numberNote = stringData[string].note + fretNumber;
  // if(!numberToNote[numberNote]) {return}
  const letterNote = numberToNote[numberNote];
  // console.log(letterNote)
  const audio = new Audio(`./sounds/${encodeURIComponent(letterNote)}.ogg`);
  audio.play();
}

let previousX;
document.addEventListener("pointermove", (e) => {
  const coalescedEvents = e.getCoalescedEvents();
  for (let coalescedEvent of coalescedEvents) {
     let element = document.elementFromPoint(coalescedEvent.clientX, coalescedEvent.clientY);
     // if string and coming from left
     if(element.classList.contains("string") && coalescedEvent.clientX > previousX) {
       const debouncedPlay = debounce(play, 100, element.dataset.string);
       debouncedPlay(element.dataset.string);
     }
     previousX = coalescedEvent.clientX
   }
});