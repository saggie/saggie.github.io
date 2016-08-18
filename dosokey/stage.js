
var Stage = function() {

  var self = this;

  var colorOffset = 4,    // R[i+0], G[i+1], B[1+2], A[i+3], ...
      redOffset = 0,
      greenOffset = 1,
      blueOffset = 2,
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

  this.isTaruInTheObject = function (x, y, region) {
    x = parseInt(x);
    y = parseInt(y);
    var address1 = getRedAddress(x - region, y);
    var address2 = getRedAddress(x + region, y);
    var address3 = getRedAddress(x, y - region);
    var address4 = getRedAddress(x, y + region);

    return (stage_data.data[address1] == 255) ||
           (stage_data.data[address2] == 255) ||
           (stage_data.data[address3] == 255) ||
           (stage_data.data[address4] == 255);
  };

  this.getTaruEscapeDistance = function (x, y, region) {
      var upperDistance = getUpperTaruEscapeDistance(x, y, region);
      var lowerDistance = getLowerTaruEscapeDistance(x, y, region); // 必要ない

      return (upperDistance > lowerDistance) ?  lowerDistance : -upperDistance;
  };

  function getUpperTaruEscapeDistance (x, y, region) {
      for (var i = 1; i < stageThickness + taruManager.getSize(); i++) {
        if (!self.isTaruInTheObject(x, y - i, region)) {
            return i - 1;
        }
      }
      return stageThickness + taruManager.getSize() + 1;
  }

  function getLowerTaruEscapeDistance (x, y, region) {
      for (var i = 1; i < stageThickness + taruManager.getSize(); i++) {
        if (!self.isTaruInTheObject(x, y + i, region)) {
            return i + 1;
        }
      }
      return stageThickness + taruManager.getSize() + 1;
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
