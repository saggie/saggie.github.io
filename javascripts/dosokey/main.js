(function () {
    var flameRate = 30;
    var sleepTime = parseInt(1000 / flameRate);

    var globalTimeFrame = 0;

    var charPosX = parseInt(Math.random() * canvas.width);
    var charPosY = parseInt(Math.random() * canvas.height);
    var charSize = 8;

    function loop() {
      if (isAllReady) {
        moveChar();
        render();
        nextTaru();
        taruStep();
        globalTimeFrame++;
      }
    }

    function isAllReady() {
        return bg_ready &&
               stage_ready;
    }

    function moveChar() {
        /* move char */
        if (flgKeyUp == true) { charPosY++; }
        if (flgKeyDown == true) { charPosY--; }
        if (flgKeyLeft == true) { charPosX--; }
        if (flgKeyRight == true) { charPosX++; }

        /* set charPos inside the canvas */
        if (charPosX < 0) { charPosX = 0; }
        if (charPosY < 0) { charPosY = 0; }
        if (charPosX + charSize > screenWidth) { charPosX = screenWidth - charSize; }
        if (charPosY + charSize > screenHeight) { charPosY = screenHeight - charSize; }
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
        context.strokeRect(charPosX, screenHeight - charPosY - charSize, charSize, charSize);

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
