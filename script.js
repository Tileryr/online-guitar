const note_selector = document.querySelector(".notes_picker");
const note_selectors = Array.from(note_selector.querySelectorAll("input"));

var spaceDown = false;

const numberToNote = {
  1 : "-E",
  2 : "-F",
  3 : "-F#",
  4 : "-G",
  5 : "-G#",
  6 : "-A",
  7 : "-A#",
  8 : "-B",
  9 : "-C",
  10 : "-C#",
  11 : "-D",
  12 : "-D#",
  13 : "E",
  14 : "F",
  15 : "F#",
  16 : "G",
  17 : "G#",
  18 : "A",
  19 : "A#",
  20 : "B",
  21 : "C",
  22 : "C#",
  23 : "D",
  24 : "D#",
  25 : "+E",
  26 : "+F",
  27 : "+F#",
  28 : "+G",
  29 : "+G#",
  30 : "+A",
  31 : "+A#",
  32 : "+B",
  33 : "+C",
  34 : "+C#",
  35 : "+D",
  36 : "+D#",
  37 : "++E",
}

var fretNumbers = {
  1: "",
  6: 6,
  11: 4,
  16: 6,
  20: 6,
  25: ""
}

function mouseOverString(e) {
  if(spaceDown) {play(this.dataset.note)};
}

function play(string) {
  const fretNumber = fretNumbers[string];
  const note = +string + +fretNumber;
  if(!numberToNote[note]) {
    return
  }
  const letterNote = numberToNote[note] ;
  console.log(letterNote)
  const audio = new Audio(`./sounds/${encodeURIComponent(letterNote)}.ogg`);
  audio.play();
}

function saveChord() {
  note_selectors.forEach((selector) => {
    console.log(selector);
    fretNumbers[selector.dataset.string] = selector.value;
  });
  console.log(fretNumbers)
}

document.addEventListener("keydown", e => {spaceDown = e.key === " " ? true : false;});
document.addEventListener("keyup", e => {spaceDown = e.key === " " ? false : true;});

const strings = document.querySelectorAll(".string")
strings.forEach(string => string.addEventListener("mouseover", mouseOverString))