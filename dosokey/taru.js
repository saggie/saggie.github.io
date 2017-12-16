// タル管理オブジェクト
var taruManager = (function () {

  var size = 11,
      radius = parseInt(size / 2),
      numMax = 256,
      restitutionTaru = 0.9,  // タル同士の反発係数
      restitutionFloor = 0.5, // 床の反発係数
      frictionFloor = 0.98,   // 床の摩擦係数
      spawnPx = 70 + radius,
      spawnPy = 48 + radius,
      calculatedTaruIdList = [],
      nextTaruThrowingInterval = 0,
      previousTaruThrownTime = 0;

  var getSize = function() { return size; };
  var getRadius = function () { return radius; };
  var getMaxNumber = function () { return numMax; };

  // タルプロト
  var taruProto = {
    getId : function () { return this.id; },
    getVx : function () { return this.vx; },
    getVy : function () { return this.vy; },
    getPx : function () { return this.px; },
    getPy : function () { return this.py; },
    isMoving : function () { return !this.isStopped; },

    calc : function () {

      var isGrounded = false; // このフレーム内で接地したかどうか
      var previousPx = parseInt(this.px);
      var previousPy = parseInt(this.py);

      // タル同士の衝突判定・応答 begin
      for (var i = calculatedTaruIdList.length; i < taru.length; i++) {

        if (i == this.id) { continue; } // 自分同士はスキップ

        if (isHitAmongCircles(this.px, this.py, taru[i].px, taru[i].py, size)) {

          // 座標の更新(お互いを少しずつ離す)
          var dx = distance(this.px, taru[i].px) / 8;
          var dy = distance(this.py, taru[i].py) / 8;
          if (this.px < taru[i].px) { this.px -= dx; taru[i].px += dx; } // 自分が左、相手が右のとき
          else                      { this.px += dx; taru[i].px -= dx; } // 自分が右、相手が左のとき
          if (this.py < taru[i].py) { this.py -= dy; taru[i].py += dy; } // 自分が上、相手が下のとき
          else                      { this.py += dy; taru[i].py -= dy; } // 自分が下、相手が上のとき

          // 速度の更新(交換と減衰)
          var tempVx = this.vx;
          var tempVy = this.vy;
          this.vx = taru[i].vx * restitutionTaru;
          this.vy = taru[i].vy * restitutionTaru;
          taru[i].vx = tempVx * restitutionTaru;
          taru[i].vy = tempVy * restitutionTaru;

          // ランダムにバウンドさせてみる
          if (this.px < taru[i].px) { this.vx -= Math.random()/3; taru[i].vx += Math.random()/3; } // 自分が左、相手が右のとき
          else                      { this.vx += Math.random()/3; taru[i].vx -= Math.random()/3; } // 自分が右、相手が左のとき
          if (this.py < taru[i].py) { this.vy -= Math.random()/3; taru[i].vy += Math.random()/3; } // 自分が上、相手が下のとき
          else                      { this.vy += Math.random()/3; taru[i].vy -= Math.random()/3; } // 自分が下、相手が上のとき
        }
      }

      // X座標の更新
      this.px += this.vx;
      if (this.px < 0 + radius) {
          this.px = 0 + radius;
          this.vx *= -1;
      }
      if (this.px > screenWidth - radius) {
          this.px = screenWidth - radius;
          this.vx *= -1;
      }

      // Y座標の更新
      this.py += this.vy;
      if (this.py < 0 + radius) {
          this.py = 0 + radius;
          this.vy *= -1;
      }
      if (this.py > screenHeight - radius) {
          this.py = screenHeight - radius + 1;
          this.vy *= -1 * restitutionFloor;
          isGrounded = true;
      }

      // ステージとの当たり判定
      if (stage.isTaruInTheObject(this.px, this.py, radius)) {
        var escapeDistance = stage.getTaruEscapeDistance(this.px, this.py, radius);
        this.py += escapeDistance;
        this.vy *= -1;
        if (escapeDistance <= 0) {
          // 上(マイナス)方向に逃げたら接地と判断する
          isGrounded = true;
          this.vy *= restitutionFloor;
        }
      }

      // X加速度の更新
      if (isGrounded) {
        this.vx *= frictionFloor; // 接地面との摩擦
      }

      // Y加速度の更新
      if(!isGrounded) {
        this.vy += gravity; // 重力

        if (this.vy > 8) { this.vy = 8; } // 速度制限
      }
      
      // ヒゲとの干渉
      if (isHitAmongRectangleAndCircle(hige.getPx(), hige.getPy(),
                                       hige.getSize()-4, hige.getSize(),
                                       this.px, this.py, radius)) {
        // ヒゲを動かす
        hige.addPx(this.vx);
        hige.addPy(this.vy);
        
        // ヒゲに動かされる
        if (abs(this.vx) > 1) { this.vx *= -0.8; }
        if (abs(this.vy) > 1) { this.vy *= -0.8; }
        
        var higeCenterX = hige.getPx() + hige.getSize() / 2;
        var higeCenterY = hige.getPy() + hige.getSize() / 2;
        
        // 座標の更新(お互いを少しずつ離す、少し速度も与えてみる)
        var dx = distance(this.px, higeCenterX) / 8;
        var dy = distance(this.py, higeCenterY) / 8;
        if (this.px < higeCenterX) { this.px -= dx; this.vx -= 0.5; hige.addPx(+dx); } // タルが左、ヒゲが右のとき
        else                       { this.px += dx; this.vx += 0.5; hige.addPx(-dx); } // タルが右、ヒゲが左のとき
        if (this.py < higeCenterY) { this.py -= dy; this.vy -= 0.5; hige.addPy(+dy); } // タルが上、ヒゲが下のとき
        else                       { this.py += dy; this.vy += 0.5; hige.addPy(-dy); } // タルが下、ヒゲが上のとき
      }
      
      // このフレーム内で動きがなかった
      this.isStopped = (parseInt(this.px) == previousPx) &&
                       (parseInt(this.py) == previousPy) &&
                       (abs(this.vx) < 0.04 && abs(this.vy) < 0.04) ? true : false;
    }
  };

  var generateTaru = function (init_vx, init_vy) {
    var newTaru = Object.create(taruProto);
    newTaru.id = taru.length;
    newTaru.px = spawnPx;
    newTaru.py = spawnPy;
    newTaru.vx = init_vx;
    newTaru.vy = init_vy;
    
    taru.push(newTaru);
    return newTaru;
  };

  var calcAll = function () {
    for (var i = 0; i < taru.length; i++) {
      taru[i].calc();
      calculatedTaruIdList.push(i);
    }
    calculatedTaruIdList = [];
  };

  return {
    getSize: getSize,
    getRadius: getRadius,
    getMaxNumber: getMaxNumber,
    generateTaru: generateTaru,
    calcAll: calcAll
  };

}());
