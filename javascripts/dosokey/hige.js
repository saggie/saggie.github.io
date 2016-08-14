
const higeSpawnPx = 50,
      higeSpawnPy = 200,
      higeSize = 16;

var higeX = higeSpawnPx,
    higeY = higeSpawnPy,
    higeVy = 0,
    isHigeGrounded = false,
    isHigeLaddering = false;

function tryMoveHige() {

  // タルから受ける外力はタル側で計算

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
  if (flgKeySpace && isHigeGrounded) {
    higeVy -= 2;

    higeY -= 2;//test
  }

  // Y座標の更新
  higeY += higeVy;

  // Y速度更新(重力)
  if (!isHigeGrounded && !isHigeLaddering) {
    higeVy  += gravity;

    if (this.vy > 8) { this.vy = 8; } // 速度制限
  }

  // ハシゴの昇降
  if (flgKeyUp || flgKeyDown) {
    if (canHigeGrabTheLadder(higeX, higeY, higeSize)) {
      if (flgKeyUp == true) { higeY--; }
      if (flgKeyDown == true) { higeY++; }
      isHigeLaddering = true;
    }
  }

  // 横方向の移動
  if (flgKeyLeft) { higeX--; }
  if (flgKeyRight) { higeX++; }

  // Higeの座標をスクリーン内に制限する
  if (higeX < 0) { higeX = 0; }
  if (higeY < 0) { higeY = 0; }
  if (higeX + higeSize > screenWidth) { higeX = screenWidth - higeSize; }
  if (higeY + higeSize > screenHeight) { higeY = screenHeight - higeSize; }
}
