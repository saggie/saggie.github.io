// Canvas 要素やグローバル変数の定義など

var canvas  = document.getElementById('main'),
    context = canvas.getContext('2d');

var scale = 2,
    screenWidth = canvas.width / scale,
    screenHeight = canvas.height / scale;

var gravity = 0.3;

var taru = []; // タルリスト
var globalTimeFrame = 0;
