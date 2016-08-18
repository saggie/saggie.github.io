
var colorOffset = 4,    // R[i+0], G[i+1], B[1+2], A[i+3], ...
    greenOffset = 1,
    blueOffset = 2,
    stageThickness = 8; // 障害物オブジェクトの厚さ

var getGreenAddress = function (x, y) {
  return (x * colorOffset + greenOffset) + (y * stage_data.width * colorOffset);
}

var getBlueAddress = function (x, y) {
  return (x * colorOffset + blueOffset) + (y * stage_data.width * colorOffset);
}

var isTaruInTheObject = function (x, y, region) {
  var parsedX = parseInt(x);
  var parsedY = parseInt(y);
  var centerX = parsedX * colorOffset;
  var centerY = parsedY * stage_data.width * colorOffset;
  var leftX = (parsedX - region) * colorOffset;
  var rightX = (parsedX + region) * colorOffset;
  var topY = (parsedY - region) * stage_data.width * colorOffset;
  var bottomY = (parsedY + region) * stage_data.width * colorOffset;

  return (stage_data.data[leftX + centerY] == 255) ||
         (stage_data.data[rightX + centerY] == 255) ||
         (stage_data.data[centerX + topY] == 255) ||
         (stage_data.data[centerX + bottomY] == 255);
}

var getTaruEscapeDistance = function (x, y, region) {
    var upperDistance = getUpperTaruEscapeDistance(x, y, region);
    var lowerDistance = getLowerTaruEscapeDistance(x, y, region); // 必要ない

    return (upperDistance > lowerDistance) ?  lowerDistance : -upperDistance;
}

var getUpperTaruEscapeDistance = function (x, y, region) {
    for (var i = 1; i < stageThickness + taruSize; i++) {
      if (!isTaruInTheObject(x, y - i, region)) {
          return i - 1;
      }
    }
    return stageThickness + taruSize + 1;
}

var getLowerTaruEscapeDistance = function (x, y, region) {
    for (var i = 1; i < stageThickness + taruSize; i++) {
      if (!isTaruInTheObject(x, y + i, region)) {
          return i + 1;
      }
    }
    return stageThickness + taruSize + 1;
}

var isHigeInTheObject = function (x, y, size) {
  var leftX = x * colorOffset;
  var rightX = (x + size) * colorOffset;
  var bottomY = (y + size) * stage_data.width * colorOffset;

  return (stage_data.data[leftX + bottomY] == 255) ||
         (stage_data.data[rightX + bottomY] == 255);
}

var getHigeEscapeDistance = function (x, y, size) {
  for (var i = 1; i < stageThickness; i++) {
    if (!isHigeInTheObject(x, y - i, size)) {
        return i - 1;
    }
  }
  return stageThickness + 1;
}

var isThereGreenPixelWithinUpperAndLower3pixels = function (x, y) {
  var address1 = getGreenAddress(x, y);
  var address2 = getGreenAddress(x, y - 1);
  var address3 = getGreenAddress(x, y + 1);
  if (stage_data.data[address1] == 255 ||
      stage_data.data[address2] == 255 ||
      stage_data.data[address3] == 255) {
    return true;
  }
  return false;
}

var canHigeGrabTheLadder = function (x, y, size) {
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
}

var isHigeAwayFromTheLadder = function (x, y, size) {
  return canHigeGrabTheLadder(x, y, size) ? false : true;
}

var isHigeInTheClearArea = function (x, y, size) {
  var address1 = getBlueAddress(x, y);
  var address2 = getBlueAddress(x, y + size);
  var address3 = getBlueAddress(x + size, y);
  var address4 = getBlueAddress(x + size, y + size);

  return (stage_data.data[address1] == 255) ||
         (stage_data.data[address2] == 255) ||
         (stage_data.data[address3] == 255) ||
         (stage_data.data[address4] == 255);
}

