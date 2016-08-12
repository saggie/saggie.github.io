
// タル変数
var taruSize = 10;
var taruRadius = taruSize / 2;
var tarus = []; // タルリスト
var taruMax = 256;

var restTaru = 0.8; // タルの反発係数(restitution)
var restFloor = 0.5; // 床の反発係数
var calculatedList = [];

var taruSpawnX = 20;
var taruSpawnY = 40;
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
        // Hit Check
        if (tarus) {
            for (var i = calculatedList.length; i < tarus.length; i++) {

                if (i == this.id) {
                    continue;
                }

                if (isHit(this.px, this.py, tarus[i].px, tarus[i].py, taruSize)) {

                    // update positions between tarus
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
                    
                    // 当たったら上にバウンドさせてみる
                    if(abs(this.vy) < 0.3 && abs(tarus[i].vy) < 0.3) {
                        this.vy -= Math.random() * 0.5 + 0.5;
                        tarus[i].vy -= Math.random() * 0.5 + 0.5;
                    }
                }
            }
        }

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
        var isGrounded = false;
        if (this.py < 0 + taruRadius) {
            this.py = 0 + taruRadius;
            this.vy *= -1;
        }
        if (this.py > screenHeight - taruRadius) {
            this.py = screenHeight - taruRadius;
            this.vy *= -1 * restFloor;
            isGrounded = true;
        }

        // Y加速度の更新
        if(!isGrounded) {
            this.vy += 0.3; // 重力

            // 加速度制限
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

    var taru = makeTaru(Math.random() * 5 + 2, Math.random() * -5 - 2);
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
