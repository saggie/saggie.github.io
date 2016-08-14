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
      globalTimeFrame++;
    }
  }

  function isAllReady() {
    return bg_ready &&
           stage_ready &&
           hige_ready;
  }

  function revertScale() {
    context.scale(1 / scale, 1 / scale);
  }

  function render() {
    context.clearRect(0, 0, screenWidth, screenHeight);

    revertScale();
    context.drawImage(bg_img, 0, 0);
    context.scale(scale, scale);

    context.fillStyle="#00FFFF";
    context.strokeStyle="#00FFFF";
    context.strokeRect(0, 0, screenWidth, screenHeight);
    context.beginPath();

    context.strokeRect(higeX, higeY, higeSize, higeSize);

    for (var i = 0; i < taru.length; i++) {
      context.beginPath();
      context.arc(taru[i].getPx(), taru[i].getPy(), taruRadius, 0, Math.PI*2, false);
      context.stroke();

      context.fillText(taru[i].getId(), taru[i].getPx()-4, taru[i].getPy()+4);
    }

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

})();
