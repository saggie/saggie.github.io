function main() {
    
    var canvas  = document.getElementById('main');
    var context = canvas.getContext('2d');
    
    var sourcePolygon = {
        vertex: [
            { x: -50, y:  50, z: -50 },
            { x:  50, y: -50, z: -50 },
            { x: -50, y: -50, z:  50 }
        ],
        color: [
            { r: 255, g:   0, b:   0 },
            { r:   0, g: 255, b:   0 },
            { r:   0, g:   0, b: 255 }
        ]
    }
    
    function Vertex() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    
    function Color(color) {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
    }
    
    var angleX = parseInt(Math.random() * 180);
    var angleY = parseInt(Math.random() * 180);
    
    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    
    function rotatePolygonForX(sourcePolygon, numVertex, angle) {
       
       var rotatedPolygon = {
           vertex: [ new Vertex(), new Vertex(), new Vertex() ],
           color: [
               new Color(sourcePolygon.color[0]),
               new Color(sourcePolygon.color[1]),
               new Color(sourcePolygon.color[2])
           ]
       }
       
       var cos = Math.cos(toRadians(angle));
       var sin = Math.sin(toRadians(angle));
       for (var i = 0; i < numVertex; i++) {
           rotatedPolygon.vertex[i].x = sourcePolygon.vertex[i].x;
           rotatedPolygon.vertex[i].y = sourcePolygon.vertex[i].y * cos - sourcePolygon.vertex[i].z * sin;
           rotatedPolygon.vertex[i].z = sourcePolygon.vertex[i].y * sin + sourcePolygon.vertex[i].z * cos;
       }
       
       return rotatedPolygon;
    }
        
    function rotatePolygonForY(sourcePolygon, numVertex, angle) {
       
       var rotatedPolygon = {
           vertex: [ new Vertex(), new Vertex(), new Vertex() ],
           color: [
               new Color(sourcePolygon.color[0]),
               new Color(sourcePolygon.color[1]),
               new Color(sourcePolygon.color[2])
           ]
       }
       
       var cos = Math.cos(toRadians(angle));
       var sin = Math.sin(toRadians(angle));
       for (var i = 0; i < numVertex; i++) {
           rotatedPolygon.vertex[i].x = sourcePolygon.vertex[i].x * cos + sourcePolygon.vertex[i].z * sin;
           rotatedPolygon.vertex[i].y = sourcePolygon.vertex[i].y;
           rotatedPolygon.vertex[i].z = -sourcePolygon.vertex[i].x * sin + sourcePolygon.vertex[i].z * cos;
       }
       
       return rotatedPolygon;
    }
    
    function movePolygonToCenter(sourcePolygon, numVertex) {
        
        var movedPolygon = {
            vertex: [ new Vertex(), new Vertex(), new Vertex() ],
            color: [
               new Color(sourcePolygon.color[0]),
               new Color(sourcePolygon.color[1]),
               new Color(sourcePolygon.color[2])
           ]
        }
        
        for (var i = 0; i < numVertex; i++) {
            movedPolygon.vertex[i].x = sourcePolygon.vertex[i].x + canvas.width / 2;
            movedPolygon.vertex[i].y = sourcePolygon.vertex[i].y + canvas.height / 2;
        }
        
        return movedPolygon;
    }
    
    var xBufL = {};
    var xBufR = {};
    var rBufL = {};
    var rBufR = {};
    var gBufL = {};
    var gBufR = {};
    var bBufL = {};
    var bBufR = {};
    
    function scanEdge(vertex0, vertex1, color0, color1) {
        
        var span = Math.abs(parseInt(vertex1.y - vertex0.y)) + 1;
        var addx = (vertex1.x - vertex0.x) / span;
        var addy = (vertex1.y - vertex0.y) / span;
        var addr = (color1.r - color0.r) / span;
        var addg = (color1.g - color0.g) / span;
        var addb = (color1.b - color0.b) / span;
        var xi = vertex0.x;
        var yi = vertex0.y;
        var ri = color0.r;
        var gi = color0.g;
        var bi = color0.b;
        
        for (var i = 0; i < span; i++, xi += addx, yi += addy,
                                       ri += addr, gi += addg, bi += addb) {
            var px = parseInt(xi);
            var py = parseInt(yi);
            
            if (py < 0 || py > canvas.height) { continue; }
            
            if (xBufL[py] > px) {
                xBufL[py] = px;
                rBufL[py] = ri;
                gBufL[py] = gi;
                bBufL[py] = bi;
            }
            
            if (xBufR[py] < px){
                xBufR[py] = px;
                rBufR[py] = ri;
                gBufR[py] = gi;
                bBufR[py] = bi;
            }
        }
    }
    
    function scanEdges(polygon) {
        scanEdge(polygon.vertex[0], polygon.vertex[1], polygon.color[0], polygon.color[1]);
        scanEdge(polygon.vertex[1], polygon.vertex[2], polygon.color[1], polygon.color[2]);
        scanEdge(polygon.vertex[2], polygon.vertex[0], polygon.color[2], polygon.color[0]);
    }
    
    function drawDot(x, y, color) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, y+1);
        context.closePath();
        context.strokeStyle = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
        context.stroke();
    }
    
    function render() {
        
        // clear the edge-bufferes
        for(var i = 0; i < canvas.height; i++) {
            xBufL[i] = Number.MAX_VALUE;
            xBufR[i] = Number.MAX_VALUE * -1;
        }
        
        // rotate and move the polygon
        var translatedPolygon = rotatePolygonForX(sourcePolygon, 3, angleX);
        translatedPolygon = rotatePolygonForY(translatedPolygon, 3, angleY);
        translatedPolygon = movePolygonToCenter(translatedPolygon, 3);
        
        scanEdges(translatedPolygon);
        
        // clear the screen
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = 'rgb(0, 0, 0)';
        context.strokeRect(0, 0, canvas.width, canvas.height);
        
        // draw the polygon along with its edge-buffer
        for(var yi = 0; yi < canvas.height; yi++) {
            
            if (xBufL[yi] > xBufR[yi]) { continue; }
            
            var span = xBufR[yi] - xBufL[yi] + 1;
            var addr = (rBufR[yi] - rBufL[yi]) / span;
            var addg = (gBufR[yi] - gBufL[yi]) / span;
            var addb = (bBufR[yi] - bBufL[yi]) / span;
            var ri = rBufL[yi];
            var gi = gBufL[yi];
            var bi = bBufL[yi];
            
            for (var xi = xBufL[yi]; xi <= xBufR[yi]; xi++, ri += addr, gi += addg, bi += addb ) {
                drawDot(xi, yi, { r: parseInt(ri), g: parseInt(gi), b: parseInt(bi) });
            }
        }
        
        context.fillText("angleX: " + angleX % 360, 10, 10);
        context.fillText("angleY: " + angleY % 360, 10, 20);
    }
    
    function loop() {
        render();
        
        angleX += 1;
        angleY += 2;
    }
    
    var flameRate = 30;
    var sleepTime = parseInt(1000 / flameRate);
    
    setInterval(loop, sleepTime);
}
main();

