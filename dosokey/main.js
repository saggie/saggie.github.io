
var globalTimeFrame = 0,
    images          = new Images(),
    kong            = new Kong(),
    taruManager     = new TaruManager(),
    hige            = new Hige(),
    stage           = new Stage();

(function () {
  var flameRate = 30;
  var sleepTime = parseInt(1000 / flameRate);

  function loop() {
    if (images.areAllImagesReady() && !hige.isCleared()) {
      kong.throwTaru();
      kong.updateState();
      taruManager.calcAll();
      hige.tryMove();
      hige.updateState();
      render();

      if (hige.isCleared()) { clearInterval(interval) }
      globalTimeFrame++;
    } else {
      drawNowLoadingLabel();
    }
  }
  
  function revertScale() {
    context.scale(1 / scale, 1 / scale);
  }

  function drawKong(row, column) {
    context.drawImage(kong_img, column * 96, row * 64, 96, 64, 64, 48, 96, 64);
  }

  function drawHige(row, column) {
    context.drawImage(hige_img, column * 32, row * 32, 32, 32, hige.getPx()*2, hige.getPy()*2, 32, 32);
  }

  function drawTaru(id, column) {
    context.drawImage(taru_img, column * 24, 0, 24, 24,
                      (taru[id].getPx() - taruManager.getRadius()) * scale,
                      (taru[id].getPy() - taruManager.getRadius()) * scale, 24, 24);
  }

  function drawNowLoadingLabel() {
    revertScale();
    context.fillStyle="#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(load_img, 0, 0, 208, 48, 144, 208, 208, 48);
    context.scale(scale, scale);
  }

  function drawGameClearLabel() {
    context.drawImage(clear_img, 0, 0, 208, 48, 144, 240, 208, 48);
  }

  function render() {

    // draw background
    revertScale();
    context.drawImage(bg_img, 0, 0);

    // draw Kong
    switch (kong.getState()) {
      case kong.getStates("center1"): drawKong(0, 0); break;
      case kong.getStates("center2"): drawKong(1, 0); break;
      case kong.getStates("right1"):  drawKong(0, 1); break;
      case kong.getStates("right2"):  drawKong(1, 1); break;
      case kong.getStates("left1"):   drawKong(0, 2); break;
      case kong.getStates("left2"):   drawKong(1, 2); break;
    }
    
    // draw Hige
    switch (hige.getState()) {
      case hige.getStates("right_stand"): drawHige(0, 0); break;
      case hige.getStates("right_walk1"): drawHige(0, 1); break;
      case hige.getStates("right_walk2"): drawHige(0, 2); break;
      case hige.getStates("right_jump"):  drawHige(0, 3); break;
      case hige.getStates("climb1"):      drawHige(0, 4); break;
      case hige.getStates("left_stand"): drawHige(1, 0); break;
      case hige.getStates("left_walk1"): drawHige(1, 1); break;
      case hige.getStates("left_walk2"): drawHige(1, 2); break;
      case hige.getStates("left_jump"):  drawHige(1, 3); break;
      case hige.getStates("climb2"):     drawHige(1, 4); break;
    }
    
    // draw Taru
    for (var i = 0; i < taru.length; i++) {
      switch ((globalTimeFrame + taru[i].getId()) % 12) {
        case 0: case 1: case 2: drawTaru(i, 0); break;
        case 3: case 4: case 5: drawTaru(i, 1); break;
        case 6: case 7: case 8: drawTaru(i, 2); break;
        case 9: case 10: case 11: drawTaru(i, 3); break;
      }
    }

    // draw clear label
    if (hige.isCleared()) {
      drawGameClearLabel();
    }
    
    context.scale(scale, scale);

    // debug text
    var row = 10;
    context.fillStyle="#00FFFF";
    context.strokeStyle="#00FFFF";
    context.fillText(globalTimeFrame, 10, row); row += 10;
    context.fillText(touchPx, 10, row); row += 10;
    context.fillText(touchPy, 10, row); row += 10;
  }

  var interval = setInterval(loop, sleepTime);

})();
