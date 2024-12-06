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
var stringData = [
  { note: 0, fretNumber: 0, timer: undefined},
  { note: 5, fretNumber: 0, timer: undefined},
  { note: 10, fretNumber: 0, timer: undefined},
  { note: 15, fretNumber: 0, timer: undefined},
  { note: 19, fretNumber: 0, timer: undefined},
  { note: 24, fretNumber: 0, timer: undefined},
]

var primaryMouseButtonDown = false;

function setPrimaryButtonState(e) {
  var flags = e.buttons !== undefined ? e.buttons : e.which;
  primaryMouseButtonDown = (flags & 1) === 1;
}

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
  stringInfo = stringData[string]
  console.log(numberToNote[stringInfo.note + stringInfo.fretNumber])
  letter.textContent = numberToNote[stringInfo.note + stringInfo.fretNumber].replace(/\+|-/g, "")
  circle.append(letter)

  let oldCircles = this.parentNode.querySelectorAll(".fret_circle")
  oldCircles.forEach(fretCircle => fretCircle.remove())
  this.append(circle)
}

drawGrid();

function play(string) {
  const fretNumber = stringData[string].fretNumber;
  const numberNote = stringData[string].note + fretNumber;
  const letterNote = numberToNote[numberNote];
  console.log(letterNote)
  const audio = new Audio(`./sounds/${encodeURIComponent(letterNote)}.ogg`);
  audio.play();
}

let previousX;
let inString;

document.addEventListener("pointermove", (e) => {
  setPrimaryButtonState(e)
  const coalescedEvents = e.getCoalescedEvents();
  for (let coalescedEvent of coalescedEvents) {
    let element = document.elementFromPoint(coalescedEvent.clientX, coalescedEvent.clientY);
    if(!element) {return}
    if(element.classList.contains("string")) {
      if(primaryMouseButtonDown && !inString) {
        const debouncedPlay = debounce(play, 100, element.dataset.string);
        debouncedPlay(element.dataset.string);
        inString = true
      }
    } else {inString = false}
    previousX = coalescedEvent.clientX
  }
});

document.addEventListener("pointerdown", (e) => {
  setPrimaryButtonState(e)
  let element = document.elementFromPoint(e.clientX, e.clientY);
     // if string and coming from left
     if(element.classList.contains("string")) {
       const debouncedPlay = debounce(play, 100, element.dataset.string);
       debouncedPlay(element.dataset.string);
       inString = true
     }
});
document.addEventListener("pointerup", setPrimaryButtonState);