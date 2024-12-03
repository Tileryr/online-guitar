var primaryMouseButtonDown = false;

function setPrimaryButtonState(e) {
  var flags = e.buttons !== undefined ? e.buttons : e.which;
  primaryMouseButtonDown = (flags & 1) === 1;
}

function mouseOverString(e) {
    if(primaryMouseButtonDown) {
        play()
    }
}

function play(note) {
  const audio = new Audio(`./sounds/E.ogg`);
  audio.play()
}
document.addEventListener("mousedown", setPrimaryButtonState);
document.addEventListener("mousemove", setPrimaryButtonState);
document.addEventListener("mouseup", setPrimaryButtonState);

const strings = document.querySelectorAll(".string")
strings.forEach(string => string.addEventListener("mouseover", mouseOverString))