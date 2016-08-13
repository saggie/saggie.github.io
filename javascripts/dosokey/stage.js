
const colorOffset = 4;        // R[i+0], G[i+1], B[1+2], A[i+3], ...
const screenRegionOffset = 0; // 画面左右の「見えない壁」用オフセット
const stageThickness = 8;     // 障害物オブジェクトの厚さ

var isKabeNoNaka = function (x, y, region) {
  var parsedX = parseInt(x);
  var parsedY = parseInt(y);
  var centerX = parsedX * colorOffset;
  var centerY = parsedY * stage_data.width * colorOffset;
  var leftX = (parsedX - region) * colorOffset;
  var rightX = (parsedX + region) * colorOffset;
  var topY = (parsedY - region) * stage_data.width * colorOffset;
  var bottomY = (parsedY + region) * stage_data.width * colorOffset;

  return (stage_data.data[leftX + centerY] == 0) ||
         (stage_data.data[rightX + centerY] == 0) ||
         (stage_data.data[centerX + topY] == 0) ||
         (stage_data.data[centerX + bottomY] == 0);
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
