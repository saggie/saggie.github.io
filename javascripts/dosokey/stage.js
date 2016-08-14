
const colorOffset = 4,        // R[i+0], G[i+1], B[1+2], A[i+3], ...
      greenOffset = 1;
const stageThickness = 8;     // 障害物オブジェクトの厚さ

var getGreenAddress = function (x, y) {
  return (x * colorOffset + greenOffset) + (y * stage_data.width * colorOffset);
}

var isKabeNoNaka = function (x, y, region) {
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

var getEscapeDistance = function (x, y, region) {
    var upperEscapeDistance = getUpperEscapeDistance(x, y, region);
    var lowerEscapeDistance = getLowerEscapeDistance(x, y, region);

    return (upperEscapeDistance > lowerEscapeDistance) ?  lowerEscapeDistance : -upperEscapeDistance;
}

var getUpperEscapeDistance = function (x, y, region) {
    for (var i = 1; i < stageThickness + taruSize; i++) {
      if (!isKabeNoNaka(x, y - i, region)) {
          return i - 1;
      }
    }
    return stageThickness + taruSize + 1;
}

var getLowerEscapeDistance = function (x, y, region) {
    for (var i = 1; i < stageThickness + taruSize; i++) {
      if (!isKabeNoNaka(x, y + i, region)) {
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
  var greenAddress1 = getGreenAddress(x, y);
  var greenAddress2 = getGreenAddress(x, y - 1);
  var greenAddress3 = getGreenAddress(x, y + 1);
  if (stage_data.data[greenAddress1] == 255 ||
      stage_data.data[greenAddress2] == 255 ||
      stage_data.data[greenAddress3] == 255) {
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
