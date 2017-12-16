
var kong = (function() {

  var nextTaruThrowingInterval = 0,
      previousTaruThrownTimeFrame = 0,
      drummingCount = 0;

  var states = {
    center1: 0,
    center2: 1,
    left1: 2,
    left2: 3,
    right1: 4,
    right2: 5
  };
  var state = states["center1"];

  var getState = function () { return state; };
  var getStates = function (key) { return states[key]; };

  var _isTaruThrowingFinished = function () {
    return taru.length >= taruManager.getMaxNumber();
  };

  var updateState = function () {
    if (!_isTaruThrowingFinished ()) {
      var dividedInterval = parseInt(nextTaruThrowingInterval / 3);
      var erappesedTimeFrame = globalTimeFrame - previousTaruThrownTimeFrame
      if (erappesedTimeFrame > dividedInterval * 2) {
        state = states["center1"];
        return;
      } else if (erappesedTimeFrame > dividedInterval * 1) {
        state = states["left1"];
        return;
      } else {
        state = states["right1"];
        return;
      }
    } else {
      if (globalTimeFrame % 30 == 0) { drummingCount++; }
      if (drummingCount % 6 == 0 || drummingCount % 6 == 1) { state = states["center2"]; return; }
      if (drummingCount % 6 == 2 || drummingCount % 6 == 4) { state = states["right2"]; return; }
      if (drummingCount % 6 == 3 || drummingCount % 6 == 5) { state = states["left2"]; return; }
    }
  };

  var throwTaru = function () {
    
    if (_isTaruThrowingFinished ()) { return; }
    
    if (globalTimeFrame - previousTaruThrownTimeFrame < nextTaruThrowingInterval) {
      return;
    }
    
    taruManager.generateTaru(Math.random() * 5 + 3, Math.random() * - 3 - 2);
    
    previousTaruThrownTimeFrame = globalTimeFrame;
    
    var isHigeNearTheGoal = (hige.getPy() < screenWidth / 4) ? true : false;
    nextTaruThrowingInterval = isHigeNearTheGoal ? parseInt(Math.random() * 15) + 3
                                                 : parseInt(Math.random() * 18) + 3;
  };

  return {
    getState: getState,
    getStates: getStates,
    updateState: updateState,
    throwTaru: throwTaru
  };

}());
