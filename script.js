const note_selector = document.querySelector(".notes_picker");
const fretboard = document.querySelector(".fretboard")
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

var spaceDown = false;

var fretNumbers = [
  //6th string
  0,
  // continue from 1
  0,
  0,
  0,
  0,
  0
]

function drawGrid() {
  for (let i = 1; i < 73; i++) {
    let div = document.createElement("div");
    let note
    let string = i % 6
    let fretNumber = Math.ceil(i/6)
    console.log(fretNumbers[2])
    // switch (string) {
    //   case 0:
    //     note = 25
    // }

    div.setAttribute("id", `fret_${i}`)
    div.setAttribute("class", "fret")
    fretboard.append(div);
    div.addEventListener("mousedown", chooseFret.bind(div, i, note, string));
  }
}

function chooseFret(fret) {
  let circle = document.createElement("div")
  circle.setAttribute("class", "fret_circle")
  let letter = document.createElement("span")
  letter.textContent("")
}

drawGrid();

function mouseOverString(e) {
  play(this.dataset.note, this.dataset.string)
}

function play(note, string) { 
  const fretNumber = fretNumbers[string];
  let numberNote = +string + +fretNumber;
  if(!numberToNote[note]) {
    return
  }
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