
var isUpKeyPressed = false,
    isDownKeyPressed = false,
    isLeftKeyPressed = false,
    isRightKeyPressed = false,
    isSpaceKeyPressed = false;
      
(function () {

  // key code value
  var KV_A = 65,
      KV_D = 68,
      KV_S = 83,
      KV_W = 87,
      KV_SPACE = 32;

  canvas.setAttribute('tabindex', 0);
  canvas.addEventListener('keydown', onKeyDown, false);
  canvas.addEventListener('keyup', onKeyUp, false);
  canvas.addEventListener('touchstart', onTouchStart, false);
  canvas.addEventListener('touchend', onTouchEnd, false);

  function onKeyDown(e) {
    switch (e.keyCode) {
      case KV_W: isUpKeyPressed = true; break;
      case KV_S: isDownKeyPressed = true; break;
      case KV_A: isLeftKeyPressed = true; break;
      case KV_D: isRightKeyPressed = true; break;
      case KV_SPACE: isSpaceKeyPressed = true; break;
    }
  }

  function onKeyUp(e) {
    switch (e.keyCode) {
      case KV_W: isUpKeyPressed = false; break;
      case KV_S: isDownKeyPressed = false; break;
      case KV_A: isLeftKeyPressed = false; break;
      case KV_D: isRightKeyPressed = false; break;
      case KV_SPACE: isSpaceKeyPressed = false; break;
    }
  }

  function onTouchStart(e) {

    var touchPx = e.touches[0].clientX;
    var touchPy = e.touches[0].clientY;
    e.preventDefault();

    if (canvas.width / 3 * 2 < touchPx) {
      isRightKeyPressed = true;
      isLeftKeyPressed = false;
    } else if (canvas.width / 3 > touchPx) {
      isRightKeyPressed = false;
      isLeftKeyPressed = true;
    } else {
      isRightKeyPressed = false;
      isLeftKeyPressed = false;
    }

    if (canvas.height / 3 * 2 < touchPy) {
      isUpKeyPressed = false;
      isDownKeyPressed = true;
    } else if (canvas.height / 3 > touchPy) {
      isUpKeyPressed = true;
      isDownKeyPressed = false;
    } else {
      isUpKeyPressed = false;
      isDownKeyPressed = false;
    }
    
    isSpaceKeyPressed = (e.touches.length <= 1) ? false : true;
  }

  function onTouchEnd(e) {
    isUpKeyPressed = false;;
    isDownKeyPressed = false;
    isLeftKeyPressed = false;
    isRightKeyPressed = false;
    isSpaceKeyPressed = false;
  }

})();
