
var square = function(val) {
    return val * val;
}

var abs = function (val) {
    return (val >= 0) ? val : val * -1;
}

var distance = function (val1, val2) {
    return abs(val1 - val2);
}

var isHit = function (x0, y0, x1, y1, distance) {
    var dist1 = square(x1 - x0) + square(y1 - y0);
    var dist2 = square(distance);
    return dist1 < dist2;
}

var isHitRectAndCircle = function(rectPx, rectPy, rectWidth, rectHeight,
                                  circlePx, circlePy, circleRadius) {
  // rename
  var rx1 = rectPx;
  var ry1 = rectPy;
  var rx2 = rectPx + rectWidth;
  var ry2 = rectPy + rectHeight;
  var cx = circlePx;
  var cy = circlePy;
  var r = circleRadius;
  
  // check upper and lower side
  if ((rx1 < cx) && (cx < rx2) && (ry1 - r < cy) && (cy < ry2 + r)) {
    return true;
  }

  // check left and right side
  if ((rx1 - r < cx) && (cx < rx2 + r) && (ry1 < cy) && (cy < ry2)) {
    return true;
  }

  if (isHit(rx1, ry1, cx, cy, r)) { return true; } // check upper-left edge
  if (isHit(rx2, ry1, cx, cy, r)) { return true; } // check upper-right edge
  if (isHit(rx1, ry2, cx, cy, r)) { return true; } // check lower-left edge
  if (isHit(rx2, ry2, cx, cy, r)) { return true; } // check lower-right edge
  
  return false;
}

