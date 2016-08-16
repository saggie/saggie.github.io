
var Kong = function() {
  
  var nextTaruThrowingInterval = 0;
  var previousTaruThrownTimeFrame = 0;
  var drummingCount = 0;
  var states = {
    center1: 0,
    center2: 1,
    left1: 2,
    left2: 3,
    right1: 4,
    right2: 5
  };
  var state = states["center1"];
  
  this.getState = function () {
    return state;
  };
  
  this.getStates = function (key) {
    return states[key];
  };
  
  var isTaruThrowingFinished = function () {
    return taru.length >= numTaruMax;
  };
  
  this.updateState = function () {
    if (!isTaruThrowingFinished ()) {
      var dividedInterval = parseInt(nextTaruThrowingInterval / 3);
      var erappesedFrame = globalTimeFrame - previousTaruThrownTimeFrame
      if (erappesedFrame > dividedInterval * 2) {
        state = states["center1"];
        return;
      } else if (erappesedFrame > dividedInterval * 1) {
        state = states["left1"];
        return;
      } else {
        state = states["right1"];
        return;
      }
    } else {
      if (globalTimeFrame % 30 == 0) { drummingCount++; }
      if (drummingCount % 6 == 0 || drummingCount % 6 == 1) { state = states["center2"]; return; }
      if (drummingCount % 6 == 2 || drummingCount % 6 == 4) { state = states["left2"]; return; }
      if (drummingCount % 6 == 3 || drummingCount % 6 == 5) { state = states["right2"]; return; }
    }
  };
  
  this.throwTaru = function () {
    
    if (isTaruThrowingFinished ()) { return; }
    
    if (globalTimeFrame - previousTaruThrownTimeFrame < nextTaruThrowingInterval) {
      return;
    }

    var newTaru = makeTaru(Math.random() * 5 + 3, Math.random() * -3 - 2);

    previousTaruThrownTimeFrame = globalTimeFrame;
    nextTaruThrowingInterval = parseInt(Math.random() * 18) + 3;
  };
  
};
