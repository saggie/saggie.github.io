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
