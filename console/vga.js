/* vga.js */

(function () {

  var canvas    = document.createElement('canvas'),
      container = document.createElement('div'),
      context   = canvas.getContext('2d'),
      vgaWidth = 640,
      vgaHeight = 480,
      aspectRatio = vgaWidth / vgaHeight,
      flameRate = 1,
      maxCol = vgaWidth / fontWidth,
      maxRow = vgaHeight / fontHeight,
      dotSize,
      jpmode,
      charIndex = 0;

  var fonts = new Fonts();

  function resize() {
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    if (screenWidth > screenHeight * aspectRatio) {
      screenWidth = screenHeight * aspectRatio;
    } else {
      screenHeight = screenWidth / aspectRatio;
    }
    canvas.style.width  = screenWidth + 'px';
    canvas.style.height = screenHeight + 'px';
    container.style.width  = screenWidth + 'px';
    container.style.height = screenHeight + 'px';
    
    dotSize = parseInt(screenWidth * window.devicePixelRatio / vgaWidth);
    canvas.width  = dotSize * vgaWidth;
    canvas.height = dotSize * vgaHeight;
  }

  function initialize() {
    container.style.margin = '0 auto';
    container.style.overflow = 'hidden';
    container.appendChild(canvas);
    document.body.appendChild(container);
    setPropertiesByQueryString();
  }

  function setPropertiesByQueryString() {
    var queryStrings = window.location.search.slice(1).split('&');
    for (var i = 0; i < queryStrings.length; i++) {
      var queryString = queryStrings[i].split('=');
      
      // set jpmode if ?lang=jp
      if (queryString[0] == "lang") {
        jpmode = (queryString[1] == 'ja') ? true : false;
      }
    }
  }

  function clearScreen() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  function drawDot(color, x, y) {
    context.fillStyle = color;
    context.fillRect(x * dotSize, y * dotSize, dotSize, dotSize);
  }
  
  function drawFont(char, col, row) {
    var fontData = fonts.getData(char);
    for (var i = 0; i < fontData.length; i++) {
      var x = i % fontWidth;
      var y = parseInt(i / fontWidth);
      drawDot(fontData[i], col * fontWidth + x, row * fontHeight + y);
    }
  }
  
  function putChar(char) {
    drawFont(char, charIndex % maxCol, parseInt(charIndex / maxCol));
    charIndex++;
  }
  
  function putString(str) {
    for(var i = 0; i < str.length; i++) {
      putChar(str.charAt(i));
    }
  }
  
  function loop() {
    
    resize();
    clearScreen();
    
    for (var i = 0; i < 64; i++) {
      putString("This is SPARTA!!!! ");
      putString("Is this SPARTA???? ");
    }
    
    charIndex = 0;
  }
  
  initialize();
  
  setInterval(loop, parseInt(1000 / flameRate));
  
})();
