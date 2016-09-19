var Mouse = function() {
  
  var mouseX;
  var mouseY;
  var isDrawing = false;
  
  var canvas;
  var context;
  var dotSize;
  
  this.init = function(refCanvas, refContext, refDotSize) {
    canvas = refCanvas;
    context = refContext;
    dotSize = refDotSize;
    
    canvas.addEventListener('mousemove', onMove, false);
    canvas.addEventListener('mousedown', onClick, false);
    canvas.addEventListener('mouseup', drawEnd, false);
    canvas.addEventListener('mouseout', drawEnd, false);
    canvas.addEventListener("contextmenu", function(e) { e.preventDefault(); }, false);
  }
  
  function handleLeftClick(clientX, clientY, rect) {
    var x = Math.floor(clientX - rect.left);
    var y = Math.floor(clientY - rect.top);
    draw(x, y, UTIL.BLACK);
  }
  
  function handleRightClick(clientX, clientY, rect) {
    var x = Math.floor(clientX - rect.left);
    var y = Math.floor(clientY - rect.top);
    draw(x, y, UTIL.WHITE);
  }
  
  function onClick(e) {
    var rect = e.target.getBoundingClientRect();
    if (e.button == 0 || e.buttons == 1) { handleLeftClick(e.clientX, e.clientY, rect); return; }
    if (e.button == 2 || e.buttons == 2) { handleRightClick(e.clientX, e.clientY, rect); return; }
  };
  
  function onMove(e) {
    var rect = e.target.getBoundingClientRect();
    if (e.buttons == 1 || e.witch == 1) { handleLeftClick(e.clientX, e.clientY, rect); return; }
    if (e.buttons == 2 || e.witch == 3) { handleRightClick(e.clientX, e.clientY, rect); return; }
  };
  
  // TODO temporary
  function draw(x, y, color) {
    context.beginPath();
    if (!isDrawing) { context.moveTo(x, y); }
    else             { context.moveTo(mouseX, mouseY); }
    context.lineTo(x, y);
    context.lineCap = "square";
    context.lineWidth = dotSize;
    context.strokeStyle = color;
    context.stroke();
    mouseX = x;
    mouseY = y;
    isDrawing = true;
  };
  
  function drawEnd() { isDrawing = false; }
  
};