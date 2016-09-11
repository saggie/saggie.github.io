/* fonts.js */

var fontWidth = 8,
    fontHeight = 16,
    emFontWidth = 16;

var Fonts = function() {
  
  var fontsImage = new Image(),
      fontsData = null,
      fontsReady = false,
      emFontsImage = new Image(),
      emFontsData = null,
      emFontsReady = false,
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
  
  emFontsImage.src = "img/em-fonts.png";
  emFontsImage.onload = function() {
    inner_context.drawImage(emFontsImage, 0, 96);
    emFontsData = inner_context.getImageData(0, 96, emFontsImage.width, emFontsImage.height);
    emFontsReady = true;
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
  
  function getRgbFromEmFontsData(x, y) {
    var red   = emFontsData.data[getRedAddress(x, y, emFontsData.width)];
    var green = emFontsData.data[getGreenAddress(x, y, emFontsData.width)];
    var blue  = emFontsData.data[getBlueAddress(x, y, emFontsData.width)];
    return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
  }
  
  this.getFontRgbData = function (char) {
    var charCode = (char == "DEL") ? 127 : char.charCodeAt(0);
    
    if (charCode > 127) { return getEmFontRgbData(charCode); }
    
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
  
  function getEmFontRgbData (charCode) {
    
    var x, ret = [];
    
    switch (charCode) {
      case 26085: x = 0 * emFontWidth; break; // 日
      case 26376: x = 1 * emFontWidth; break; // 月
      case 28779: x = 2 * emFontWidth; break; // 火
      case 27700: x = 3 * emFontWidth; break; // 水
      case 26408: x = 4 * emFontWidth; break; // 木
      case 37329: x = 5 * emFontWidth; break; // 金
      case 22303: x = 6 * emFontWidth; break; // 土
    }
    
    for (var i = 0; i < emFontWidth; i++) {
      for (var j = 0; j < fontHeight; j++) {
        ret[i + j * emFontWidth] = getRgbFromEmFontsData(x + i, 0 + j);
      }
    }
    return ret;
  }
};
