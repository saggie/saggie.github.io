/* vga.js */

(function () {

  var canvas    = document.createElement('canvas'),
      container = document.createElement('div'),
      context   = canvas.getContext('2d'),
      vgaWidth = 640 - 14 * fontWidth,
      vgaHeight = 480 + 6 * fontHeight,
      aspectRatio = vgaWidth / vgaHeight,
      flameRate = 1,
      dotSize,
      year = null,
      jpmode = false,
      indicateToday = true,
      blinkCursor = true,
      currentLine = 0,
      fonts = new Fonts(),
      calendar = new Calendar();
  
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
    
    var scale = screenWidth * window.devicePixelRatio / vgaWidth * 2;
    dotSize = (scale < 1) ? scale : parseInt(scale);
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
  
  function clamp(input, min, max) {
    return input < min ? min : input > max ? max : input;
  }
  
  function setPropertiesByQueryString() {
    var queryStrings = window.location.search.slice(1).split('&');
    for (var i = 0; i < queryStrings.length; i++) {
      var queryString = queryStrings[i].split('=');
      
      if (queryString[0] == "year") {
        year = clamp(queryString[1], 0, 9999);
      }
      
      // set jpmode if "?lang=jp"
      if (queryString[0] == "lang") {
        jpmode = (queryString[1] == 'ja') ? true : false;
      }
      
      if (queryString[0] == "indicateToday") {
        indicateToday = (queryString[1] == 1) ? true : false;
      }
      
      if (queryString[0] == "blinkCursor") {
        blinkCursor = (queryString[1] == 1) ? true : false;
      }
    }
  }

  function clearScreen() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  function drawDot(color, x, y) {
    context.fillStyle = color;
    var leftMargin = fontWidth * dotSize;
    context.fillRect(x * dotSize + leftMargin, y * dotSize, dotSize, dotSize);
  }
  
  function drawFont(char, column, line, highlightMode) {
    var fontRgbData = fonts.getFontRgbData(char);
    
    var targetColumnPosition = column * fontWidth;
    var targetLinePositioin = line * fontHeight;
    
    for (var i = 0; i < fontRgbData.length; i++) {
      var xi = i % fontWidth;
      var yi = i / fontWidth | 0;
      
      if (highlightMode) {
        if      (fontRgbData[i] == 'rgb(0, 0, 0)')       { fontRgbData[i] = 'rgb(170, 170, 170)'; }
        else if (fontRgbData[i] == 'rgb(170, 170, 170)') { fontRgbData[i] = 'rgb(0, 0, 0)'; }
      } else {
        if (fontRgbData[i] == 'rgb(0, 0, 0)') { continue; } // to improve performance
      }
      
      drawDot(fontRgbData[i], targetColumnPosition + xi, targetLinePositioin + yi);
    }
  }
  
  function printLine(str) {
    for (var i = 0; i < str.length; i++) {
      if (str.charAt(i) == ' ') { continue; } // to improve performance
      drawFont(str.charAt(i), i, currentLine, false);
    }
    currentLine++;
  }
  
  function printCursor() {
    drawFont("$", 0, currentLine);
    if (!blinkCursor || (new Date().getSeconds() % 2) == 0) {
      drawFont("DEL", 2, currentLine);
    }
  }
  
  function indicateTodaysDate() {
    var today = new Date();
    if (!indicateToday || year != today.getFullYear()) { return; }
    
    var todaysFont1 = (today.getDate() < 10) ? " " : today.getDate() / 10 | 0;
    var todaysFont2 = today.getDate() % 10;
    
    drawFont(todaysFont1.toString(), calendar.getTodaysColumnPosition(),     calendar.getTodaysLinePosition() + 1, true);
    drawFont(todaysFont2.toString(), calendar.getTodaysColumnPosition() + 1, calendar.getTodaysLinePosition() + 1, true);
  }
  
  function updatePageTitle() {
    document.title = "$ cal " + year;
  }
  
  function loop() {
    
    resize();
    clearScreen();
    
    year = (year == null) ? new Date().getFullYear() : year;
    
    printLine("$ cal " + year);
    var calendarData = calendar.getData(year, jpmode);
    for (var i = 0; i < calendarData.length; i++) {
      printLine(calendarData[i]);
    }
    printCursor();
    indicateTodaysDate();
    
    currentLine = 0;
    updatePageTitle();
  }
  
  initialize();
  
  setInterval(loop, parseInt(1000 / flameRate));
  
})();
