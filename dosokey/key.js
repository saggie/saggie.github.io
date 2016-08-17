
/* key code value */
const KV_A = 65,
      KV_D = 68,
      KV_S = 83,
      KV_W = 87,
      KV_SPACE = 32;

var flgKeyUp = false,
    flgKeyDown = false,
    flgKeyLeft = false,
    flgKeyRight = false,
    flgKeySpace = false;

canvas.setAttribute('tabindex', 0);
canvas.addEventListener('keydown', onKeyDown, false);
canvas.addEventListener('keyup', onKeyUp, false);

function onKeyDown(e) {
  switch (e.keyCode) {
    case KV_W: flgKeyUp = true; break;
    case KV_S: flgKeyDown = true; break;
    case KV_A: flgKeyLeft = true; break;
    case KV_D: flgKeyRight = true; break;
    case KV_SPACE: flgKeySpace = true; break;
  }
}

function onKeyUp(e) {
  switch (e.keyCode) {
    case KV_W: flgKeyUp = false; break;
    case KV_S: flgKeyDown = false; break;
    case KV_A: flgKeyLeft = false; break;
    case KV_D: flgKeyRight = false; break;
    case KV_SPACE: flgKeySpace = false; break;
  }
}

// touch event
canvas.addEventListener('touchstart', onTouchStart, false);
canvas.addEventListener('touchend', onTouchEnd, false);

var touchPx = 0;
var touchPy = 0;
var boundingClientRectLeft = 0;
var boundingClientRectTop = 0;
  
function onTouchStart(e) {

  touchPx = e.touches[0].pageX;
  touchPy = e.touches[0].pageY;
  
  var boundingClientRect = e.target.getBoundingClientRect();
  boundingClientRectLeft = boundingClientRect.left;
  boundingClientRectTop = boundingClientRect.top;
  e.preventDefault();

  if (canvas.width / 4 * 3 < touchPx) {
    flgKeyRight = true;
    flgKeyLeft = false;
  } else if (canvas.width / 4 > touchPx) {
    flgKeyRight = false;
    flgKeyLeft = true;
  } else {
    flgKeyRight = false;
    flgKeyLeft = false;
  }

  if (canvas.height / 4 * 3 < touchPy) {
    flgKeyUp = false;
    flgKeyDown = true;
  } else if (canvas.height / 4 > touchPy) {
    flgKeyUp = true;
    flgKeyDown = false;
  } else {
    flgKeyUp = false;
    flgKeyDown = false;
  }
  
  if (e.touches.length <= 1) {
    flgKeySpace = false;
  } else {
    flgKeySpace = true;
  }
}

function onTouchEnd(e) {
  flgKeyUp = false;;
  flgKeyDown = false;
  flgKeyLeft = false;
  flgKeyRight = false;
  flgKeySpace = false;
}

