/* fonts.js */

var fontWidth = 8,
    fontHeight = 16;

var Fonts = function() {
  
  var fontsImage = new Image(),
      fontsData = null,
      fontsReady = false,
      inner_canvas = document.createElement('canvas'),
      inner_context = inner_canvas.getContext('2d'),
      colorOffset = 4, // for RGBA
      redOffset = 0,
      greenOffset = 1,
      blueOffset = 2;
  
  fontsImage.src = "img/fonts.png";
  fontsImage.onload = function() {
    inner_context.drawImage(fontsImage, 0, 0);
    fontsData = inner_context.getImageData(0, 0, fontsImage.width, fontsImage.height);
    fontsReady = true;
  };
  
  function getImageXAddress(char) {
    return ((char.charCodeAt(0) - 32) % 16) * fontWidth;
  }
  
  function getImageYAddress(char) {
    return parseInt((char.charCodeAt(0) - 32) / 16) * fontHeight;
  }
  
  function getRedAddress(x, y) {
    return (x * colorOffset + redOffset) + (y * fontsData.width * colorOffset);
  }
  
  function getGreenAddress(x, y) {
    return (x * colorOffset + greenOffset) + (y * fontsData.width * colorOffset);
  }
  
  function getBlueAddress(x, y) {
    return (x * colorOffset + blueOffset) + (y * fontsData.width * colorOffset);
  }
  
  function getRgb(x, y) {
    var red = fontsData.data[getRedAddress(x, y)];
    var green = fontsData.data[getGreenAddress(x, y)];
    var blue = fontsData.data[getBlueAddress(x, y)];
    return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
  }
  
  this.getData = function (char) {
    var x = getImageXAddress(char);
    var y = getImageYAddress(char);
    var ret = [];
    for (var i = 0; i < fontWidth; i++) {
      for (var j = 0; j < fontHeight; j++) {
        ret[i + j * fontWidth] = getRgb(x + i, y + j);
      }
    }
    return ret;
  };
};
