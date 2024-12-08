const fretHolders = Array.from(document.querySelectorAll(".fret-holder"));
const canvases = Array.from(document.querySelectorAll("canvas"));

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
  { note: 0, fretNumber: 0, timer: undefined, ctx: canvases[0].getContext("2d"), key: "s"},
  { note: 5, fretNumber: 0, timer: undefined, ctx: canvases[1].getContext("2d"), key: "d"},
  { note: 10, fretNumber: 0, timer: undefined, ctx: canvases[2].getContext("2d"), key: "f"},
  { note: 15, fretNumber: 0, timer: undefined, ctx: canvases[3].getContext("2d"), key: "j"},
  { note: 19, fretNumber: 0, timer: undefined, ctx: canvases[4].getContext("2d"), key: "k"},
  { note: 24, fretNumber: 0, timer: undefined, ctx: canvases[5].getContext("2d"), key: "l"},
]

var savedChords = Array.from({length: 9}, () => Array.from({length: 6}, () => 0))
var currentChord = 0;
var inString;
var primaryMouseButtonDown = false;

// FOR CANVAS
const frequency = 0.5;

function drawString(ctx, angle = 0, amplitude = 10) {
  const canvas = ctx.canvas
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2
  const gradient = ctx.createLinearGradient(centerX, 0, centerX, canvas.height);
  gradient.addColorStop(0, "transparent")
  gradient.addColorStop(0.1, "#475f5c")
  gradient.addColorStop(0.9, "#475f5c")
  gradient.addColorStop(1, "transparent")
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const x = centerX + Math.sin(angle) * amplitude;

  ctx.strokeStyle = gradient
  ctx.lineWidth = 12
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.quadraticCurveTo(x, centerY, centerX, canvas.height)
  ctx.stroke()

  angle += frequency;
  amplitude -= frequency

  if(amplitude > 0) {
    requestAnimationFrame(function() {
      drawString(ctx, angle, amplitude)
    });
  }
}

function initializeString(ctx) {
  const canvas = ctx.canvas
  const centerX = canvas.width / 2;
  const gradient = ctx.createLinearGradient(centerX, 0, centerX, canvas.height);
  gradient.addColorStop(0, "transparent")
  gradient.addColorStop(0.1, "#475f5c")
  gradient.addColorStop(0.9, "#475f5c")
  gradient.addColorStop(1, "transparent")

  ctx.strokeStyle = gradient
  ctx.lineWidth = 12
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height)
  ctx.stroke()
}

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
      div.addEventListener("mousedown", chooseFret.bind(div, fretNumber, string, false));
    }
  });
}

function chooseFret(fret, string, ignore = false) {
  let stringInfo = stringData[string];
  let oldCircles = this.parentNode.querySelectorAll(".fret_circle");

  if(stringInfo.fretNumber === fret && !ignore || ignore && fret === undefined) {
    console.log("what")
    stringInfo.fretNumber = undefined
    oldCircles.forEach(fretCircle => fretCircle.remove());
  } else {
    stringInfo.fretNumber = fret
    let circle = document.createElement("div");
    let letter = document.createElement("span");
    circle.setAttribute("class", "fret_circle");
    letter.setAttribute("class", "text");
    letter.textContent = numberToNote[stringInfo.note + stringInfo.fretNumber].replace(/\+|-/g, "");

    oldCircles.forEach(fretCircle => fretCircle.remove());
    circle.append(letter);
    this.append(circle);
  }
}

function selectChord(chord) {
  // SAVE CHORD
  savedChords[currentChord].forEach((element, index, array) => {
    array[index] = stringData[index].fretNumber
  })

  currentChord = chord;

  stringData.forEach((string, index) => {
    var frets = fretHolders[index].children;
    var fret = frets.item(savedChords[chord][index]);
    chooseFret.call(fret, savedChords[chord][index], index, true);
  })
}

function play(string) {
  const fretNumber = stringData[string].fretNumber;
  if(fretNumber === undefined) {return}
  const numberNote = stringData[string].note + fretNumber;
  const letterNote = numberToNote[numberNote];

  const audio = new Audio(`./sounds/${encodeURIComponent(letterNote)}.ogg`);
  audio.play();
  drawString(stringData[string].ctx)
}

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
document.addEventListener("keydown", e => {
  let key = e.key
  if(/^[1-9]$/i.test(key)) {
    selectChord(key-1)
  } else {
    stringData.forEach((dataset, index) => {
      if(dataset.key == key) {
        play(index)
      }
    })
  }
})
window.addEventListener("load", function() {
  drawGrid()
  selectChord(0)
  stringData.forEach(dataset => {initializeString(dataset.ctx)})
});
