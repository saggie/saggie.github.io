
var Hige = function () {

  var spawnPx = 50,
      spawnPy = 192,
      size = 16,
      px = spawnPx,
      py = spawnPy,
      vx = 0,
      vy = 0,
      movingCount = 0,
      isGrounded = false,
      isLaddering = false,
      isFacingRight = true,
      isAtBottom = false,
      isCleared = false;

  var states = {
    right_stand: 0,
    right_walk1: 1,
    right_walk2: 2,
    right_jump: 3,
    left_stand: 4,
    left_walk1: 5,
    left_walk2: 6,
    left_jump: 7,
    climb1: 8,
    climb2: 9
  };
  var state = states["right_stand"];

  this.getPx = function () {return px; };
  this.getPy = function () { return py; };
  this.getSize = function () { return size; }
  this.getState = function () { return state; };
  this.getStates = function (key) { return states[key]; };

  this.addPx = function (val) { px += val; };
  this.addPy = function (val) { py += val; };

  this.isCleared = function () { return isCleared; }

  this.updateState = function () {

    if (isLaddering) {
      state = (movingCount % 8 < 4) ? states["climb1"] : states["climb2"];
      return;
    }

    if (!isGrounded) {
      state = isFacingRight ? states["right_jump"] : states["left_jump"];
      return;
    }

    var walkingFrame = movingCount % 6;
    if (isFacingRight) {
      state = ((walkingFrame == 0) || (walkingFrame == 1)) ? states["right_stand"]
            : ((walkingFrame == 2) || (walkingFrame == 3)) ? states["right_walk1"]
                                                           : states["right_walk2"];
      return;
    } else {
      state = ((walkingFrame == 0) || (walkingFrame == 1)) ? states["left_stand"]
            : ((walkingFrame == 2) || (walkingFrame == 3)) ? states["left_walk1"]
                                                           : states["left_walk2"];
      return;
    }
  };

  this.tryMove = function () {

    // 整数化しておく
    px = parseInt(px);
    py = parseInt(py);

    // ハシゴ昇降の継続判定
    if (isLaddering && isHigeAwayFromTheLadder(px, py, size)) {
      // 前回ハシゴを昇降していたけど、今はハシゴから離れている
      isLaddering = false;
    }

    // ステージとの当たり判定
    if (!isLaddering && isHigeInTheObject(px, py, size) || isAtBottom) {
      var escapeDistance = getHigeEscapeDistance(px, py, size);
      py -= escapeDistance;
      isGrounded = true;
      vy = 0;
    } else {
      isGrounded = false;
    }

    // ジャンプ
    if (flgKeySpace && isGrounded && !isLaddering) {
      vy -= 2;
      py -= 1;
    }

    // Y座標・Y速度の更新
    if (!isGrounded && !isLaddering) {
      py += vy;
      vy += gravity; // 重力

      if (this.vy > 8) { this.vy = 8; } // 落下速度を制限
    }

    // ハシゴの昇降
    if ((flgKeyUp || flgKeyDown) && (isGrounded || isLaddering)) {
      px = parseInt(px);
      py = parseInt(py);
      if (canHigeGrabTheLadder(px, py, size) || isAtBottom) {
        isLaddering = true;
        if (flgKeyUp)   { py--; movingCount++; }
        if (flgKeyDown) { py++; movingCount++; }
      }
    }

    // 横方向の移動
    if (flgKeyLeft)  { px--; isFacingRight = false; movingCount++; }
    if (flgKeyRight) { px++; isFacingRight = true;  movingCount++; }

    // Higeの座標をスクリーン内に制限する
    if (px < 0) { px = 0; }
    if (py < 0) { py = 0; }
    if (px + size > screenWidth) { px = screenWidth - size; }
    if (py + size > screenHeight) {
      py = screenHeight - size + 1;
      vy = 0;
      isAtBottom = true;
    } else { isAtBottom = false; }
    
    // クリア判定
    if (isHigeInTheClearArea(px, py, size) && isGrounded && !isLaddering) {
      isCleared = true;
    }
  };

};
