
// タル変数
const taruSize = 10;
const taruRadius = parseInt(taruSize / 2);
var tarus = []; // タルリスト
const taruMax = 255;
const gravity = 0.3;

const restTaru = 0.9; // タル同士の反発係数(restitution)
const restFloor = 0.5; // 床の反発係数
var calculatedList = [];

const taruSpawnX = 70;
const taruSpawnY = 40;
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

        // タル同士の当たり判定 begin
        if (tarus) {
            for (var i = calculatedList.length; i < tarus.length; i++) {

              // 自分同士はスキップ
              if (i == this.id) { continue; }

                if (isHit(this.px, this.py, tarus[i].px, tarus[i].py, taruSize)) {

                    // update positions
                    var dx = distance(this.px, tarus[i].px) / 6; // 要調整
                    var dy = distance(this.py, tarus[i].py) / 6;
                    if (this.px < tarus[i].px) {
                        this.px -= dx;
                        tarus[i].px += dx;
                    } else {
                        this.px += dx;
                        tarus[i].px -= dx;
                    }
                    if (this.py < tarus[i].py) {
                        this.py -= dy;
                        tarus[i].py += dy;
                    } else {
                        this.py += dy;
                        tarus[i].py -= dy;
                    }

                    // update (exchange) velocities
                    var tempVx = this.vx;
                    var tempVy = this.vy;
                    this.vx = tarus[i].vx * restTaru;
                    this.vy = tarus[i].vy * restTaru;
                    tarus[i].vx = tempVx * restTaru;
                    tarus[i].vy = tempVy * restTaru;

                    // 当たったらちょっと上にバウンドさせてみる
                    if (abs(this.vy) < 0.3 && abs(tarus[i].vy) < 0.3) {
                        this.vy -= Math.random() * 0.5 + 0.5;
                        tarus[i].vy -= Math.random() * 0.5 + 0.5;
                    }
                }
            }
        }
        // タル同士の当たり判定 end

        // X座標の更新
        this.px += this.vx;
        if (this.px > screenWidth - taruRadius) {
            this.px = screenWidth - taruRadius;
            this.vx *= -1;
        }
        if (this.px < 0 + taruRadius) {
            this.px = 0 + taruRadius;
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

        // ステージとの当たり判定 begin
        if (isKabeNoNaka(this.px, this.py, taruRadius)) { // もっと分解する余地ありそう
          this.px = parseInt(this.px);
          this.py = parseInt(this.py);
          var escapeDistance = getEscapeDistance(this.px, this.py, taruRadius);
          this.py += escapeDistance;
          this.vy *= -1;
          if (escapeDistance <= 0) {
            isGrounded = true;
            this.vy *= restFloor;
          }
        }
        // ステージとの当たり判定 end

        // X加速度の更新
        if (isGrounded) {
          // 接地面との摩擦のつもり
          this.vx *= 1.0;
        }

        // Y加速度の更新
        if(!isGrounded) {
            this.vy += gravity; // 重力

            // 速度制限
            if (this.vy > 8) {
                this.vy = 8;
            }
        }
    },
    toString : function() {
      return 'taru: ' +
        'id=' + this.id + ', ' +
        'px=' + this.px + ', ' +
        'py=' + this.py + ', ' +
        'vx=' + this.vx + ', ' +
        'vy=' + this.vy;
    }
};

var makeTaru = function (init_vx, init_vy) {
    var taru = Object.create(taruProto);
    taru.id = tarus.length;
    taru.px = taruSpawnX;
    taru.py = taruSpawnY;
    taru.vx = init_vx;
    taru.vy = init_vy;
    return taru;
};

var nextTaru = function() {

    if (tarus.length > taruMax) {
    return;
    }

    var date = new Date();
    var time = date.getTime();
    if (time - previousTaruThrownTime < nextTaruThrowingInterval) {
        return;
    }

    var taru = makeTaru(Math.random() * 5 + 3, Math.random() * -3 - 2);
    //var taru = makeTaru(5, -5);
    tarus.push(taru);

    previousTaruThrownTime = time;
    nextTaruThrowingInterval = Math.random() * 500 + 100;
}

var taruStep = function () {
    for (var i = 0; i < tarus.length; i++) {
        tarus[i].step();
        calculatedList.push(i);
    }
    calculatedList = [];
}
