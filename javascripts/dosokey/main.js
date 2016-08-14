(function () {
    var flameRate = 30;
    var sleepTime = parseInt(1000 / flameRate);

    var globalTimeFrame = 0;

    function loop() {
      if (isAllReady) {
        tryMoveHige();
        render();
        nextTaru();
        taruStep();
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

        for (var i = 0; i < tarus.length; i++) {
            context.beginPath();
            context.arc(tarus[i].getPx(), tarus[i].getPy(), taruRadius, 0, Math.PI*2, false);
            context.stroke();

            context.fillText(tarus[i].getId(), tarus[i].getPx()-4, tarus[i].getPy()+4);
        }

        // debug text
        var row = 10;
        context.fillText(globalTimeFrame, 10, row); row += 10;
    }
    setInterval(loop, sleepTime);
})();
