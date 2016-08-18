
// image data
var bg_img = new Image(),
    hige_img = new Image(),
    taru_img = new Image(),
    kong_img = new Image(),
    clear_img = new Image(),
    stage_img = new Image(),
    stage_data = null;
  
var Images = function() {

  // image loading completion flag
  var bg_img_ready = false,
      hige_img_ready = false,
      taru_img_ready = false,
      kong_img_ready = false,
      clear_img_ready = false,
      stage_img_ready = false;

  bg_img.src = "img/bg.png";
  hige_img.src = "img/hige.png";
  taru_img.src = "img/taru.png";
  kong_img.src = "img/kong.png";
  clear_img.src = "img/clear.png";
  stage_img.src = "img/stagemask.png";

  hige_img.onload = function() { hige_img_ready = true; };
  taru_img.onload = function() { taru_img_ready = true; };
  kong_img.onload = function() { kong_img_ready = true; };
  clear_img.onload = function() { clear_img_ready = true; };

  // load stage data
  var hidden_canvas  = document.getElementById('hidden');
  var hidden_context = hidden_canvas.getContext('2d');
  stage_img.onload = function() {
    stage_img_ready = true;
    hidden_context.drawImage(stage_img, 0, 0);
    stage_data = hidden_context.getImageData(0, 0, hidden_canvas.width, hidden_canvas.height);
  };

  this.areAllImagesReady = function () {
    return bg_img_ready &&
           hige_img_ready &&
           taru_img_ready &&
           kong_img_ready &&
           clear_img_ready &&
           stage_img_ready;
  };

};
