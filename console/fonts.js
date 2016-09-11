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
  
  function getImageXAddress(charCode) { return ((charCode - 32) % 16) * fontWidth; }
  function getImageYAddress(charCode) { return ((charCode - 32) / 16 | 0) * fontHeight; }
  
  function getRedAddress(x, y, width)   { return (x * colorOffset + redOffset)   + (y * width * colorOffset); }
  function getGreenAddress(x, y, width) { return (x * colorOffset + greenOffset) + (y * width * colorOffset); }
  function getBlueAddress(x, y, width)  { return (x * colorOffset + blueOffset)  + (y * width * colorOffset); }
  
  function getRgbFromFontsData(x, y) {
    var red   = fontsData.data[getRedAddress(x, y, fontsData.width)];
    var green = fontsData.data[getGreenAddress(x, y, fontsData.width)];
    var blue  = fontsData.data[getBlueAddress(x, y, fontsData.width)];
    return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
  }
  
  this.getFontRgbData = function (char) {
    var charCode = (char == "DEL") ? 127 : char.charCodeAt(0);
    var x = getImageXAddress(charCode);
    var y = getImageYAddress(charCode);
    var ret = [];
    for (var i = 0; i < fontWidth; i++) {
      for (var j = 0; j < fontHeight; j++) {
        ret[i + j * fontWidth] = getRgbFromFontsData(x + i, y + j);
      }
    }
    return ret;
  };
};
