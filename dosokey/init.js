// Canvas 要素やグローバル変数の定義など

var canvas  = document.getElementById('main');
var context = canvas.getContext('2d');

var scale = 2;
context.scale(scale, scale);

var screenWidth = canvas.width / scale;
var screenHeight = canvas.height / scale;

var gravity = 0.3;

var taru = []; // タルリスト

