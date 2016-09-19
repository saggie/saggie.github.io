
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

