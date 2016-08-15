(function () {
  var flameRate = 30;
  var sleepTime = parseInt(1000 / flameRate);

  var globalTimeFrame = 0;

  setInterval(loop, sleepTime);

  function loop() {
    if (isAllReady) {
      render();
      launchNextTaru();
      calcAllTaru();
      tryMoveHige();
      updateHigeState();
      globalTimeFrame++;
    }
  }

  function isAllReady() {
    return bg_ready &&
           stage_ready &&
           hige_ready;
  }

  function render() {

    // clear screen
    context.clearRect(0, 0, screenWidth, screenHeight);

    // draw background
    revertScale();
    context.drawImage(bg_img, 0, 0);
    context.scale(scale, scale);

    context.fillStyle="#00FFFF";
    context.strokeStyle="#00FFFF";
    context.strokeRect(0, 0, screenWidth, screenHeight);
    context.beginPath();

    // draw Hige
    revertScale();
    switch (higeState) {
      case higeStates["right_stand"]: drawHige(0, 0); break;
      case higeStates["right_walk1"]: drawHige(0, 1); break;
      case higeStates["right_walk2"]: drawHige(0, 2); break;
      case higeStates["right_jump"]:  drawHige(0, 3); break;
      case higeStates["climb1"]:      drawHige(0, 4); break;
      case higeStates["left_stand"]: drawHige(1, 0); break;
      case higeStates["left_walk1"]: drawHige(1, 1); break;
      case higeStates["left_walk2"]: drawHige(1, 2); break;
      case higeStates["left_jump"]:  drawHige(1, 3); break;
      case higeStates["climb2"]:     drawHige(1, 4); break;
    }
    context.scale(scale, scale);

    // draw Taru
    for (var i = 0; i < taru.length; i++) {
      context.beginPath();
      context.arc(taru[i].getPx(), taru[i].getPy(), taruRadius, 0, Math.PI*2, false);
      context.stroke();

      context.fillText(taru[i].getId(), taru[i].getPx()-4, taru[i].getPy()+4);
    }

    // draw Kong

    // debug text
    var row = 10;
    context.fillText(globalTimeFrame, 10, row); row += 10;
    //if(taru && taru[0]) {
    //  context.fillText(taru[0].getPx(), 10, row); row += 10;
    //  context.fillText(taru[0].getVx(), 10, row); row += 10;
    //  context.fillText(taru[0].getPy(), 10, row); row += 10;
    //  context.fillText(taru[0].getVy(), 10, row); row += 10;
    //}
  }

  function revertScale() {
    context.scale(1 / scale, 1 / scale);
  }

  function drawHige(row, column) {
    context.drawImage(hige_img, column * 32, row * 32, 32, 32, higeX * 2, higeY * 2, 32, 32);
  }

})();
