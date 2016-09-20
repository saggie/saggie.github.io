
(function () {

  var canvas    = document.createElement('canvas');
  var container = document.createElement('div');
  var context   = canvas.getContext('2d');
  var frameRate = 1;
  var dotSize = 2;
  var frame = new Frame();
  var mouse = new Mouse();
  var isFirstTime = true;
  
  function resize() {
    
    console.log("resizing...");
    
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    canvas.style.width  = screenWidth + 'px';
    canvas.style.height = screenHeight + 'px';
    container.style.width  = screenWidth + 'px';
    container.style.height = screenHeight + 'px';
    
    canvas.width  = screenWidth * window.devicePixelRatio;
    canvas.height = screenHeight * window.devicePixelRatio;
    
    frame.init(canvas, context, dotSize);
    frame.repaint();
    
    mouse.init(canvas, context, dotSize);
  }
  
  window.addEventListener('resize', function(event) { resize(); });
  
  function setPropertiesByQueryString() {
    var queryStrings = window.location.search.slice(1).split('&');
    for (var i = 0; i < queryStrings.length; i++) {
      var queryString = queryStrings[i].split('=');
      
      if (queryString[0] == "someValue") {
        someValue = UTIL.clamp(queryString[1], 0, 9999);
      }
    }
  }
  
  function initialize() {
    container.style.margin = '0 auto';
    container.style.overflow = 'hidden';
    container.appendChild(canvas);
    document.body.appendChild(container);
    setPropertiesByQueryString();
  }
  
  function areAllComponentsReady() {
    return frame.isReady();
  }
  
  function loop() {
    
    if (!areAllComponentsReady()) { return; }
    
    if (isFirstTime) {
      isFirstTime = false;
      resize();
    }
    
    console.log("rendering...");
  }
  
  initialize();
  
  setInterval(loop, parseInt(1000 / frameRate));
  
})();
