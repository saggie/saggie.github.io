
// タル定数
const taruSize = 11;
const taruRadius = parseInt(taruSize / 2);
const numTaruMax = 3;
const gravity = 0.3;
const restTaru = 0.9; // タル同士の反発係数(restitution)
const restFloor = 0.5; // 床の反発係数
const taruSpawnPx = 70 + taruRadius;
const taruSpawnPy = 56 + taruRadius;

// タル変数
var taru = []; // タルリスト
var calculatedTaruIdList = [];
var nextTaruThrowingInterval = 0;
var previousTaruThrownTime = 0;

// タルプロト
var taruProto = {
  getId : function () { return this.id; },
  getVx : function () { return this.vx; },
  getVy : function () { return this.vy; },
  getPx : function () { return this.px; },
  getPy : function () { return this.py; },

  step : function () {

    var isGrounded = false; // このフレーム内で接地したかどうか

    // タル同士の衝突判定・応答 begin
    if (taru) {
      for (var i = calculatedTaruIdList.length; i < taru.length; i++) {

        if (i == this.id) { continue; } // 自分同士はスキップ

        if (isHit(this.px, this.py, taru[i].px, taru[i].py, taruSize)) {

          // 座標の更新(お互いを少しずつ離す)
          var dx = distance(this.px, taru[i].px) / 6; // 要調整
          var dy = distance(this.py, taru[i].py) / 6;
          if (this.px < taru[i].px) { this.px -= dx; taru[i].px += dx; } // 自分が左、相手が右のとき
          else                      { this.px += dx; taru[i].px -= dx; } // 自分が右、相手が左のとき
          if (this.py < taru[i].py) { this.py -= dy; taru[i].py += dy; } // 自分が下、相手が上のとき
          else                      { this.py += dy; taru[i].py -= dy; } // 自分が上、相手が下のとき

          // 速度の更新(交換と減衰)
          var tempVx = this.vx;
          var tempVy = this.vy;
          this.vx = taru[i].vx * restTaru;
          this.vy = taru[i].vy * restTaru;
          taru[i].vx = tempVx * restTaru;
          taru[i].vy = tempVy * restTaru;

          // 当たったらちょっと上にバウンドさせてみる
          if ((abs(this.vy) < gravity) && (abs(taru[i].vy) < gravity)) {
              this.vy    -= Math.random() * 0.5 + 0.5;
              taru[i].vy -= Math.random() * 0.5 + 0.5;
          }
        }
      }
    }

    // X座標の更新
    this.px += this.vx;
    if (this.px < 0 + taruRadius) {
        this.px = 0 + taruRadius;
        this.vx *= -1;
    }
    if (this.px > screenWidth - taruRadius) {
        this.px = screenWidth - taruRadius;
        this.vx *= -1;
    }

    // Y座標の更新
    this.py += this.vy;
    if (this.py < 0 + taruRadius) {
        this.py = 0 + taruRadius;
        this.vy *= -1;
    }
    if (this.py > screenHeight - taruRadius) {
        this.py = screenHeight - taruRadius;
        this.vy *= -1 * restFloor;
        isGrounded = true;
    }

    // ステージ障害物との当たり判定
    if (isTaruInTheObject(this.px, this.py, taruRadius)) { // TODO 改良の余地あり
      this.px = parseInt(this.px);
      this.py = parseInt(this.py);
      var escapeDistance = getTaruEscapeDistance(this.px, this.py, taruRadius);
      this.py += escapeDistance;
      this.vy *= -1;
      if (escapeDistance <= 0) {
        // 上(マイナス)方向に逃げたら接地と判断する
        isGrounded = true;
        this.vy *= restFloor;
      }
    }

    // X加速度の更新
    if (isGrounded) {
      this.vx *= 1.0; // 接地面との摩擦
    }

    // Y加速度の更新
    if(!isGrounded) {
      this.vy += gravity; // 重力

      if (this.vy > 8) { this.vy = 8; } // 速度制限
    }
    
    // ヒゲとの干渉
    if (isHitRectAndCircle(higeX, higeY, higeSize, higeSize, this.px, this.py, taruRadius)) {
      
      // ヒゲを動かす
      higeX += this.vx;
      higeY += this.vy;
      
      // ヒゲに動かされる
      this.vx *= -1 * 0.8;
      this.vy *= -1 * 0.8;
      
      var higeCenterX = higeX + higeSize / 2;
      var higeCenterY = higeY + higeSize / 2;
      
      // 座標の更新(お互いを少しずつ離す、少し速度を与えてみる)
      var dx = distance(this.px, higeCenterX) / 6; // 要調整
      var dy = distance(this.py, higeCenterY) / 6;
      if (this.px < higeCenterX) { this.px -= dx; this.vx -= dx * 0.05; higeX += dx; } // タルが左、ヒゲが右のとき
      else                       { this.px += dx; this.vx += dx * 0.05; higeX -= dx; } // タルが右、ヒゲが左のとき
      if (this.py < higeCenterY) { this.py -= dy; this.vy -= dy * 0.05; higeY += dy; } // タルが下、ヒゲが上のとき
      else                       { this.py += dy; this.vy += dy * 0.05; higeY -= dy; } // タルが上、ヒゲが下のとき
      
      higeX = parseInt(higeX);
      higeY = parseInt(higeY);
    }
  }
};

var makeTaru = function (init_vx, init_vy) {
  var newTaru = Object.create(taruProto);
  newTaru.id = taru.length;
  newTaru.px = taruSpawnPx;
  newTaru.py = taruSpawnPy;
  newTaru.vx = init_vx;
  newTaru.vy = init_vy;
  
  taru.push(newTaru);
  return newTaru;
};

var calcAllTaru = function () {
  for (var i = 0; i < taru.length; i++) {
    taru[i].step();
    calculatedTaruIdList.push(i);
  }
  calculatedTaruIdList = [];
}
