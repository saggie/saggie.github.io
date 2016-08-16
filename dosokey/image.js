
// image load flag
var bg_ready = false,
    stage_ready = false,
    hige_ready = false,
    taru_ready = false,
    kong_ready = false;

// load background image
var bg_img = new Image();
bg_img.src = "img/bgx2.png";
bg_img.onload = function() {
  bg_ready = true;
}

// load stage data
var hidden_canvas  = document.getElementById('hidden');
var hidden_context = hidden_canvas.getContext('2d');
var stage_img = new Image();
var stage_data = null;
stage_img.src = "img/stagemask.png";
stage_img.onload = function() {
  stage_ready = true;
  hidden_context.drawImage(stage_img, 0, 0);
  stage_data = hidden_context.getImageData(0, 0, hidden_canvas.width, hidden_canvas.height);
}

// load hige images
var hige_img = new Image();
hige_img.src = "img/hige.png";
hige_img.onload = function() {
  hige_ready = true;
}

// load taru images
var taru_img = new Image();
taru_img.src = "img/taru.png";
taru_img.onload = function() {
  taru_ready = true;
}

// load kong images
var kong_img = new Image();
kong_img.src = "img/kong.png";
kong_img.onload = function() {
  kong_ready = true;
}
