
var hige = (function () {

  var spawnPx = 50,
      spawnPy = 192,
      size = 16,
      px = spawnPx,
      py = spawnPy,
      vy = 0,
      movingCount = 0,
      isGrounded = false,
      isLaddering = false,
      isFacingRight = true,
      isAtBottom = false,
      _isCleared = false;

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

  var getPx = function () {return px; };
  var getPy = function () { return py; };
  var getSize = function () { return size; }
  var getState = function () { return state; };
  var getStates = function (key) { return states[key]; };
  var isCleared = function () { return _isCleared; }

  var addPx = function (val) { px += val; };
  var addPy = function (val) { py += val; };

  var updateState = function () {

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

  var tryMove = function () {

    // ハシゴ昇降の継続判定
    if (isLaddering && stage.isHigeAwayFromTheLadder(px, py)) {
      // 前回ハシゴを昇降していたけど、今はハシゴから離れている
      isLaddering = false;
    }

    // ステージとの当たり判定
    if (!isLaddering && stage.isHigeInTheObject(px, py)) {
      var escapeDistance = stage.getHigeEscapeDistance(px, py);
      py -= escapeDistance;
      isGrounded = true;
      vy = 0;
    } else {
      isGrounded = false;
    }

    // ステージの底にいる
    if (isAtBottom) { isGrounded = true; }

    // ジャンプ
    if (isSpaceKeyPressed && isGrounded && !isLaddering) {
      vy -= 2.5;
      py -= 1;
    }

    // Y座標・Y速度の更新
    if (!isGrounded && !isLaddering) {
      py += vy;
      vy += gravity; // 重力

      if (this.vy > 8) { this.vy = 8; } // 落下速度を制限
    }

    // ハシゴの昇降
    if ((isUpKeyPressed || isDownKeyPressed) && (isGrounded || isLaddering)) {
      if (stage.canHigeGrabTheLadder(px, py)) {
        isLaddering = true;
        if (isUpKeyPressed)   { py--; movingCount++; }
        if (isDownKeyPressed) { py++; movingCount++; }
      }
    }

    // 横方向の移動
    if (isLeftKeyPressed)  { px--; isFacingRight = false; movingCount++; }
    if (isRightKeyPressed) { px++; isFacingRight = true;  movingCount++; }

    // 座標をスクリーン内に制限する
    if (px < 0) { px = 0; }
    if (py < 0) { py = 0; }
    if (px + size > screenWidth) { px = screenWidth - size; }
    if (py + size > screenHeight) {
      py = screenHeight - size + 1;
      vy = 0;
      isAtBottom = true;
    } else { 
      isAtBottom = false;
    }
    
    // クリア判定
    if (stage.isHigeAtTheGoalArea(px, py) && isGrounded && !isLaddering) {
      _isCleared = true;
    }
  };

  return {
    getPx: getPx,
    getPy: getPy,
    getSize: getSize,
    getState: getState,
    getStates: getStates,
    isCleared: isCleared,
    addPx: addPx,
    addPy: addPy,
    updateState: updateState,
    tryMove: tryMove
  };

}());
