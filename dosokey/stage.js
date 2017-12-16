
var stage = (function() {

  var colorOffset    = 4, // R=[i+0], G=[i+1], B=[1+2], A=[i+3], ...
      redOffset      = 0,
      greenOffset    = 1,
      blueOffset     = 2,
      stageThickness = 8; // ステージの厚さ

  var _getRedAddress = function (x, y) {
    return (x * colorOffset + redOffset) + (y * stage_data.width * colorOffset);
  };

  var _getGreenAddress = function (x, y) {
    return (x * colorOffset + greenOffset) + (y * stage_data.width * colorOffset);
  };

  var _getBlueAddress = function (x, y) {
    return (x * colorOffset + blueOffset) + (y * stage_data.width * colorOffset);
  };

  var isTaruInTheObject = function (x, y) {
    var r = taruManager.getRadius();
    leftX1  = parseInt(x - r);
    leftX2  = parseInt(x - r * Math.SQRT1_2);
    centerX = parseInt(x);
    rightX2 = parseInt(x + r * Math.SQRT1_2);
    rightX1 = parseInt(x + r);
    upperY1 = parseInt(y - r);
    upperY2 = parseInt(y - r * Math.SQRT1_2);
    centerY = parseInt(y);
    lowerY2 = parseInt(y + r * Math.SQRT1_2);
    lowerY1 = parseInt(y + r);

    var address1 = _getRedAddress(leftX1,  centerY); // left-end
    var address2 = _getRedAddress(leftX2,  upperY2); // upper-left
    var address3 = _getRedAddress(leftX2,  lowerY2); // lower-left
    var address4 = _getRedAddress(centerX, upperY1); // top
    var address5 = _getRedAddress(centerX, lowerY1); // bottom
    var address6 = _getRedAddress(rightX2, upperY2); // upper-right
    var address7 = _getRedAddress(rightX2, lowerY2); // lower-right
    var address8 = _getRedAddress(rightX1, centerY); // right-end

    return (stage_data.data[address1] == 255) ||
           (stage_data.data[address2] == 255) ||
           (stage_data.data[address3] == 255) ||
           (stage_data.data[address4] == 255) ||
           (stage_data.data[address5] == 255) ||
           (stage_data.data[address6] == 255) ||
           (stage_data.data[address7] == 255) ||
           (stage_data.data[address8] == 255);
  };

  var getTaruEscapeDistance = function (x, y) {
    var upperDistance = _getUpperTaruEscapeDistance(x, y);
    var lowerDistance = stageThickness + taruManager.getSize() - upperDistance;

    return (upperDistance > lowerDistance) ? lowerDistance : -upperDistance + 1;
  };

  var _getUpperTaruEscapeDistance = function (x, y) {
    for (var i = 1; i < stageThickness + taruManager.getSize(); i++) {
      if (!isTaruInTheObject(x, y - i)) {
          return i;
      }
    }
    return stageThickness + taruManager.getSize();
  };

  var isHigeInTheObject = function (x, y) {
    x = parseInt(x);
    y = parseInt(y);
    var size = hige.getSize();
    var address1 = _getRedAddress(x, y + size);
    var address2 = _getRedAddress(x + size, y + size);

    return (stage_data.data[address1] == 255) ||
           (stage_data.data[address2] == 255);
  };

  var getHigeEscapeDistance = function (x, y) {
    for (var i = 1; i < stageThickness; i++) {
      if (!isHigeInTheObject(x, y - i)) {
          return i - 1;
      }
    }
    return stageThickness;
  };

  var canHigeGrabTheLadder = function (x, y) {
    var leftOk = false,
        rightOk = false,
        size = hige.getSize();
    for (var i = 0; i < parseInt(size / 2); i++) {
      if (_isThereGreenPixelWithinUpperAndLower3pixels(x + i, y + size)) {
        leftOk = true;
      }
    }
    for (var i = parseInt(size / 2); i < size; i++) {
      if (_isThereGreenPixelWithinUpperAndLower3pixels(x + i, y + size)) {
        rightOk = true;
      }
    }
    return leftOk && rightOk;
  };

  var _isThereGreenPixelWithinUpperAndLower3pixels = function (x, y) {
    x = parseInt(x);
    y = parseInt(y);
    var address1 = _getGreenAddress(x, y);
    var address2 = _getGreenAddress(x, y - 1);
    var address3 = _getGreenAddress(x, y + 1);

    return (stage_data.data[address1] == 255 ||
            stage_data.data[address2] == 255 ||
            stage_data.data[address3] == 255);
  };

  var isHigeAwayFromTheLadder = function (x, y) {
    return canHigeGrabTheLadder(x, y) ? false : true;
  };

  var isHigeAtTheGoalArea = function (x, y) {
    x = parseInt(x);
    y = parseInt(y);
    var size = hige.getSize();
    var address1 = _getBlueAddress(x, y);
    var address2 = _getBlueAddress(x, y + size);
    var address3 = _getBlueAddress(x + size, y);
    var address4 = _getBlueAddress(x + size, y + size);

    return (stage_data.data[address1] == 255) ||
           (stage_data.data[address2] == 255) ||
           (stage_data.data[address3] == 255) ||
           (stage_data.data[address4] == 255);
  };

  return {
    isTaruInTheObject: isTaruInTheObject,
    getTaruEscapeDistance: getTaruEscapeDistance,
    isHigeInTheObject: isHigeInTheObject,
    getHigeEscapeDistance: getHigeEscapeDistance,
    canHigeGrabTheLadder: canHigeGrabTheLadder,
    isHigeAwayFromTheLadder: isHigeAwayFromTheLadder,
    isHigeAtTheGoalArea: isHigeAtTheGoalArea
  };

}());
