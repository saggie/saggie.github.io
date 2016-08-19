
var Stage = function() {

  var self = this;

  var colorOffset    = 4, // R[i+0], G[i+1], B[1+2], A[i+3], ...
      redOffset      = 0,
      greenOffset    = 1,
      blueOffset     = 2,
      stageThickness = 8; // 障害物オブジェクトの厚さ

  function getRedAddress (x, y) {
    return (x * colorOffset + redOffset) + (y * stage_data.width * colorOffset);
  }

  function getGreenAddress (x, y) {
    return (x * colorOffset + greenOffset) + (y * stage_data.width * colorOffset);
  }

  function getBlueAddress (x, y) {
    return (x * colorOffset + blueOffset) + (y * stage_data.width * colorOffset);
  }

  this.isTaruInTheObject = function (x, y) {
    var r = taruManager.getRadius();
    leftX1  = parseInt(x - r);
    leftX2  = parseInt(x - r * sin45);
    centerX = parseInt(x);
    rightX2 = parseInt(x + r * sin45);
    rightX1 = parseInt(x + r);
    upperY1 = parseInt(y - r);
    upperY2 = parseInt(y - r * sin45);
    centerY = parseInt(y);
    lowerY2 = parseInt(y + r * sin45);
    lowerY1 = parseInt(y + r);
    
    var address1 = getRedAddress(leftX1,  centerY); // left-end
    var address2 = getRedAddress(leftX2,  upperY2); // upper-left
    var address3 = getRedAddress(leftX2,  lowerY2); // lower-left
    var address4 = getRedAddress(centerX, upperY1); // top
    var address5 = getRedAddress(centerX, lowerY1); // bottom
    var address6 = getRedAddress(rightX2, upperY2); // upper-right
    var address7 = getRedAddress(rightX2, lowerY2); // lower-right
    var address8 = getRedAddress(rightX1, centerY); // right-end

    return (stage_data.data[address1] == 255) ||
           (stage_data.data[address2] == 255) ||
           (stage_data.data[address3] == 255) ||
           (stage_data.data[address4] == 255) ||
           (stage_data.data[address5] == 255) ||
           (stage_data.data[address6] == 255) ||
           (stage_data.data[address7] == 255) ||
           (stage_data.data[address8] == 255);
  };

  this.getTaruEscapeDistance = function (x, y) {
    var upperDistance = getUpperTaruEscapeDistance(x, y);
    var lowerDistance = stageThickness + taruManager.getSize() - upperDistance;

    return (upperDistance > lowerDistance) ? lowerDistance : -upperDistance + 1;
  };

  function getUpperTaruEscapeDistance (x, y) {
    for (var i = 1; i < stageThickness + taruManager.getSize(); i++) {
      if (!self.isTaruInTheObject(x, y - i)) {
          return i;
      }
    }
    return stageThickness + taruManager.getSize();
  }

  this.isHigeInTheObject = function (x, y, size) {
    var address1 = getRedAddress(x, y + size);
    var address2 = getRedAddress(x + size, y + size);

    return (stage_data.data[address1] == 255) ||
           (stage_data.data[address2] == 255);
  };

  this.getHigeEscapeDistance = function (x, y, size) {
    for (var i = 1; i < stageThickness; i++) {
      if (!this.isHigeInTheObject(x, y - i, size)) {
          return i - 1;
      }
    }
    return stageThickness;
  };

  this.canHigeGrabTheLadder = function (x, y, size) {
    var leftOk = false,
        rightOk = false;
    for (var i = 0; i < parseInt(size / 2); i++) {
      if (isThereGreenPixelWithinUpperAndLower3pixels(x + i, y + size)) {
        leftOk = true;
      }
    }
    for (var i = parseInt(size / 2); i < size; i++) {
      if (isThereGreenPixelWithinUpperAndLower3pixels(x + i, y + size)) {
        rightOk = true;
      }
    }
    return leftOk && rightOk;
  };

  function isThereGreenPixelWithinUpperAndLower3pixels (x, y) {
    var address1 = getGreenAddress(x, y);
    var address2 = getGreenAddress(x, y - 1);
    var address3 = getGreenAddress(x, y + 1);

    return (stage_data.data[address1] == 255 ||
            stage_data.data[address2] == 255 ||
            stage_data.data[address3] == 255);
  }

  this.isHigeAwayFromTheLadder = function (x, y, size) {
    return this.canHigeGrabTheLadder(x, y, size) ? false : true;
  };

  this.isHigeAtTheGoalArea = function (x, y, size) {
    var address1 = getBlueAddress(x, y);
    var address2 = getBlueAddress(x, y + size);
    var address3 = getBlueAddress(x + size, y);
    var address4 = getBlueAddress(x + size, y + size);

    return (stage_data.data[address1] == 255) ||
           (stage_data.data[address2] == 255) ||
           (stage_data.data[address3] == 255) ||
           (stage_data.data[address4] == 255);
  };

};
