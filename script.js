const note_selector = document.querySelector(".notes_picker");
const fretHolders = document.querySelectorAll(".fret-holder")
const note_selectors = Array.from(note_selector.querySelectorAll("input"));
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
  2,
  2,
  0,
  0,
  0
]
// rewriting fret code so flexbox for each string
function drawGrid() {
  fretHolders.forEach((fretHolder, index) => {
    // console.log(index)
    for (let i = 1; i < 13; i++) {
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
  fretNumbers[string] = fret;
  let circle = document.createElement("div")
  let letter = document.createElement("span")
  circle.setAttribute("class", "fret_circle")
  letter.setAttribute("class", "text")
  letter.textContent = "G"
  circle.append(letter)
  // Remove old ones
  let oldCircles = this.parentNode.querySelectorAll(".fret_circle")
  oldCircles.forEach(fretCircle => fretCircle.remove())
  this.append(circle)
  console.log(fretNumbers)
}

drawGrid();

function mouseOverString(e) {
  play(this.dataset.note, this.dataset.string)
}

function play(note, string) { 
  const fretNumber = fretNumbers[string];
  let numberNote = +note + +fretNumber;
  if(!numberToNote[note]) {return}
  const letterNote = numberToNote[numberNote];
  console.log(letterNote)
  const audio = new Audio(`./sounds/${encodeURIComponent(letterNote)}.ogg`);
  audio.play();
}

function saveChord() {
  note_selectors.forEach((selector) => {
    console.log(selector);
    fretNumbers[selector.dataset.string] = selector.value;
  });
  // console.log(fretNumbers)
}

const strings = document.querySelectorAll(".string")
strings.forEach(string => string.addEventListener("mouseover", mouseOverString))