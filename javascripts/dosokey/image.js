
// image load flag
var bg_ready = false,
    stage_ready = false;

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
