
var Frame = function() {
  var canvas = null;
  var context = null;
  var inner_canvas = document.createElement('canvas');
  var inner_context = inner_canvas.getContext('2d');
  var frameBaseImage = new Image();
  var frameBaseData = null;
  var frameBaseReady = false;
  
  var dotSize;
  var frameSizeTop;
  var frameSizeLeft;
  var grabSize;
  var canvasSx;
  var canvasSy;
  
  frameBaseImage.src = "images/framebase.png";
  frameBaseImage.onload = function() {
    inner_canvas.width = frameBaseImage.width;
    inner_canvas.height = frameBaseImage.height;
    inner_context.drawImage(frameBaseImage, 0, 0);
    frameBaseData = inner_context.getImageData(0, 0, frameBaseImage.width, frameBaseImage.height);
    frameBaseReady = true;
  };
  
  function resize() {
    frameSizeTop = dotSize * 21;
    frameSizeLeft = dotSize * 60;
    grabSize = dotSize * 3;
    canvasSx = frameSizeTop + grabSize;
    canvasSy = frameSizeLeft + grabSize;
  }
  
  function clearFrame() {
    context.fillStyle = UTIL.GRAY;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  function drawFrameTop() {
    //                                     x  y             w             h
    //                                     -  ------------  ------------  ------------
    UTIL.drawRect(context, UTIL.LIGHTGRAY, 0,            0, canvas.width, dotSize * 20);
    UTIL.drawRect(context, UTIL.GRAY,      0, dotSize * 20, canvas.width, dotSize *  1);
    UTIL.drawRect(context, UTIL.DARKGRAY,  0, dotSize * 21, canvas.width, dotSize *  1);
  }
  
  function drawFrameLeft() {
    //                                     x             y  w             h
    //                                     ------------  -  ------------  -------------
    UTIL.drawRect(context, UTIL.WHITE,                0, 0, dotSize *  1, canvas.height);
    UTIL.drawRect(context, UTIL.LIGHTGRAY, dotSize *  1, 0, dotSize * 58, canvas.height);
    UTIL.drawRect(context, UTIL.GRAY,      dotSize * 59, 0, dotSize *  1, canvas.height);
    UTIL.drawRect(context, UTIL.DARKGRAY,  dotSize * 60, 0, dotSize *  1, canvas.height);
  }
  
  function drawFrameRight() {
    //                                     x                           y                 w            h
    //                                     --------------------------  ----------------  -----------  -------------
    UTIL.drawRect(context, UTIL.DARKGRAY,  canvas.width - dotSize * 1,                0, dotSize * 1, canvas.height);
    UTIL.drawRect(context, UTIL.GRAY,      canvas.width - dotSize * 2,                0, dotSize * 1, canvas.height);
    UTIL.drawRect(context, UTIL.LIGHTGRAY, canvas.width - dotSize * 4,                0, dotSize * 2, canvas.height);
    UTIL.drawRect(context, UTIL.WHITE,     canvas.width - dotSize * 5, frameSizeTop - 1, dotSize * 1, canvas.height);
    UTIL.drawRect(context, UTIL.LIGHTGRAY, canvas.width - dotSize * 6, frameSizeTop - 0, dotSize * 1, canvas.height);
  }
  
  function drawFrameBottom() {
    //                                     x            y                            w                            h
    //                                     -----------  ---------------------------  ---------------------------  -----------
    UTIL.drawRect(context, UTIL.DARKGRAY,            0, canvas.height - dotSize * 1, canvas.width - dotSize *  0, dotSize * 1);
    UTIL.drawRect(context, UTIL.GRAY,                0, canvas.height - dotSize * 2, canvas.width - dotSize *  1, dotSize * 1);
    UTIL.drawRect(context, UTIL.LIGHTGRAY, dotSize * 1, canvas.height - dotSize * 4, canvas.width - dotSize *  3, dotSize * 2);
    UTIL.drawRect(context, UTIL.WHITE,     dotSize * 3, canvas.height - dotSize * 5, canvas.width - dotSize *  7, dotSize * 1);
    UTIL.drawRect(context, UTIL.LIGHTGRAY, dotSize * 3, canvas.height - dotSize * 6, canvas.width - dotSize *  8, dotSize * 1);
    UTIL.drawRect(context, UTIL.GRAY,      dotSize * 3, canvas.height - dotSize * 6,                dotSize * 57, dotSize * 1);
  }
  
  function drawFrameBase() {
    if (dotSize < 2) {
      context.putImageData(frameBaseData, 0, 0);
    } else {
      var zoomedWidth = frameBaseImage.width * dotSize;
      var zoomedHeight = frameBaseImage.height * dotSize;
      inner_canvas.width = zoomedWidth;
      inner_canvas.height = zoomedHeight;
      inner_context.imageSmoothingEnabled = false;
      UTIL.disableImageSmoothing(inner_context);
      inner_context.drawImage(frameBaseImage, 0, 0, zoomedWidth, zoomedHeight);
      var zoomedFrameBaseData = inner_context.getImageData(0, 0, zoomedWidth, zoomedHeight);
      context.putImageData(zoomedFrameBaseData, 0, 0);
    }
  }
  
  function drawFrame() {
    if (frameBaseReady) {
      drawFrameTop();
      drawFrameLeft();
      drawFrameBase()
      drawFrameRight();
      drawFrameBottom();
    }
  }
  
  this.init = function(refCanvas, refContext, refDotSize) {
    canvas = refCanvas;
    context = refContext;
    dotSize = refDotSize;
    resize();
  }
  
  this.repaint = function () {
    clearFrame();
    drawFrame();
  }
  
  this.isReady = function() { return frameBaseReady; }
  this.getCanvasSx = function() { return canvasSx; }
  this.getCanvasSy = function() { return canvasSy; }
};
