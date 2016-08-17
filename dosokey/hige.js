
const higeSpawnPx = 50,
      higeSpawnPy = 200,
      higeSize = 16;

var higeX = higeSpawnPx,
    higeY = higeSpawnPy,
    higeVx = 0,
    higeVy = 0,
    higeMovingCount = 0,
    isHigeGrounded = false,
    isHigeLaddering = false,
    isHigeFacingRight = true;

var higeStates = {
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
var higeState = higeStates["right_stand"];

function updateHigeState() {
  if (isHigeLaddering) {
    higeState =  (higeMovingCount % 8 < 4) ? higeStates["climb1"]
                                           : higeStates["climb2"];
    return;
  }

  if (!isHigeGrounded) {
    higeState = isHigeFacingRight ? higeStates["right_jump"]
                                  : higeStates["left_jump"];
    return;
  }

  var higeWalkingFrame = higeMovingCount % 6;
  if (isHigeFacingRight) {
    higeState = ((higeWalkingFrame == 0) || (higeWalkingFrame == 1))
                  ? higeStates["right_stand"]
                  : ((higeWalkingFrame == 2) || (higeWalkingFrame == 3))
                    ? higeStates["right_walk1"]
                    : higeStates["right_walk2"];
    return;
  } else {
    higeState = ((higeWalkingFrame == 0) || (higeWalkingFrame == 1))
                  ? higeStates["left_stand"]
                  : ((higeWalkingFrame == 2) || (higeWalkingFrame == 3))
                    ? higeStates["left_walk1"]
                    : higeStates["left_walk2"];
    return;
  }
}

function tryMoveHige() {

  // 整数化しておく
  higeX = parseInt(higeX);
  higeY = parseInt(higeY);

  // Higeの状態の更新
  isHigeGrounded = false;
  if (isHigeLaddering) {
    if (isHigeAwayFromTheLadder(higeX, higeY, higeSize)) {
      // 前回ハシゴを昇降していたけど、今はハシゴから離れている
      isHigeLaddering = false;
    }
  }

  // Higeとステージとの当たり判定
  if (!isHigeLaddering && isHigeInTheObject(higeX, higeY, higeSize)) {
    var escapeDistance = getHigeEscapeDistance(higeX, higeY, higeSize);
    higeY -= escapeDistance;
    isHigeGrounded = true;
    higeVy = 0;
  }

  // ジャンプ
  if (flgKeySpace && isHigeGrounded && !isHigeLaddering) {
    higeVy -= 2;
    higeY -= 1;
  }

  // Y座標・Y速度の更新
  if (!isHigeGrounded && !isHigeLaddering) {
    higeY += higeVy;
    higeVy += gravity; // 重力

    if (this.vy > 8) { this.vy = 8; } // 落下速度を制限
  }

  // ハシゴの昇降
  if ((flgKeyUp || flgKeyDown) && (isHigeGrounded || isHigeLaddering)) {
    higeX = parseInt(higeX);
    higeY = parseInt(higeY);
    if (canHigeGrabTheLadder(higeX, higeY, higeSize)) {
      isHigeLaddering = true;
      if (flgKeyUp)   { higeY--; higeMovingCount++; }
      if (flgKeyDown) { higeY++; higeMovingCount++; }
    }
  }

  // 横方向の移動
  if (flgKeyLeft)  { higeX--; isHigeFacingRight = false; higeMovingCount++; }
  if (flgKeyRight) { higeX++; isHigeFacingRight = true;  higeMovingCount++; }

  // Higeの座標をスクリーン内に制限する
  if (higeX < 0) { higeX = 0; }
  if (higeY < 0) { higeY = 0; }
  if (higeX + higeSize > screenWidth) { higeX = screenWidth - higeSize; }
  if (higeY + higeSize > screenHeight) {
    higeY = screenHeight - higeSize;
    higeVy = 0;
    isHigeGrounded = true;
  }
}
