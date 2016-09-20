
var UTIL = {
  BLACK:     "#000000",
  DARKGRAY:  "#404040",
  GRAY:      "#808080",
  LIGHTGRAY: "#C6C6C6",
  WHITE:     "#FFFFFF",
  RED:       "#FF0000", // for test
  
  clamp: function(input, min, max) {
    return input < min ? min : input > max ? max : input;
  },
  
  // Bresenham's line algorithm
  getCoordinatesBetween: function(x0, y0, x1, y1) {
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;
    
    var ret = [x0, y0];
    
    while (!((x0 == x1) && (y0 == y1))) {
      var e2 = err << 1;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
      ret.push(x0);
      ret.push(y0);
    }
    return ret;
  },
  
  disableImageSmoothing: function(context) {
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
  },
  
  drawString: function(g, col, text, x, y) {
    g.fillStyle = col;
    g.fillText(text, x, y);
  },
  
  drawRect: function(g, col, x, y, w, h) {
    g.fillStyle = col;
    g.fillRect(x, y, w, h);
  },
  
  drawDot: function(g, col, x, y, size) {
    g.fillStyle = col;
    g.fillRect(x * size, y * size, size, size);
  }
};

