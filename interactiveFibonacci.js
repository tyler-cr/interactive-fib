var canvas;
var gl;
var justOne = 0;

//let vertices = generateDiagonal()
//let vertices = generateSquareOutline()
let vertices = generateSquareFilled()
//let vertices = generateCurve()



function generateFibArray(size){
    let retlist = [1, 1]
    for(let i = 2; i < size; i++){
        retlist.push(retlist[i-2]+retlist[i-1])
    }
    return retlist
}

function makeColorsFromVertices(verts){
    let colors = [];
    for (let i = 0; i < verts.length; i++){
        let x = verts[i][0];
        let y = verts[i][1];
        let r = 0.5 * (x + 1.0);
        let g = 0.5 * (y + 1.0);
        let b = 0.25;
        colors.push(vec3(r, g, b));
    }
    return colors;
}

function makeFilledColorsFromVertices(verts){
    let colors = [];

    for (let i = 0; i < verts.length; i += 6){
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
    
        for (let j = 0; j < 6; j++){
            colors.push(vec3(r,g,b));
        }

    }

    return colors;
}


//takes values of array (assumed to be nums) and takes their sum, and creates a new normalized array
function normalizeArray(inArray){
    
    let retArray = [];
    let total = 0;
    for(let i = inArray.length-1; i >= 0; i--){
        total+=inArray[i]
    }

    for(let i = inArray.length-1; i > 0; i--){
        let distance = (inArray[i]/total);
        retArray.push(2*distance);
    }

    return retArray;
}

function generateDiagonal(size = 11){
    let vertices = [vec2(-1,-1)];
    let lastX = -1;
    let lastY = -1;
    let fibArray = normalizeArray(generateFibArray(size));

    console.log("attempting to generate diagonals...")
    let direction = 0;
    for (let i = 0; i < fibArray.length; i++){
        if(direction == 0){
            lastX +=fibArray[i];
            lastY +=fibArray[i];
            vertices.push(vec2(lastX, lastY));
            //vertices.push(vec2(lastX, lastY));
        }
        else if(direction == 1){
            lastX +=fibArray[i];
            lastY -=fibArray[i];
            vertices.push(vec2(lastX, lastY));
            //vertices.push(vec2(lastX, lastY));
        }
        else if (direction == 2){
            lastX -=fibArray[i];
            lastY -=fibArray[i];
            vertices.push(vec2(lastX, lastY));
            //vertices.push(vec2(lastX, lastY));
        }
        else{
            lastX -=fibArray[i];
            lastY +=fibArray[i];
            vertices.push(vec2(lastX, lastY));
            //vertices.push(vec2(lastX, lastY));
        }
        direction = (direction + 1)%4
    }

    vertices = stetchToFitFib(vertices);
    return vertices;
}

function generateSquareOutline(size = 11){
    let vertices = [];
    let lastX = -1;
    let lastY = -1;
    let fibArray = normalizeArray(generateFibArray(size));
    let mode = 0; //0 is bl, 1 is tl, 2 is tr, 3 is br

    for (let i = 0; i < fibArray.length; i++){
        let bl;
        let br;
        let tl;
        let tr;
        if ( mode == 0 ){
            bl = vec2(lastX, lastY);
            br = vec2(lastX+fibArray[i], lastY);
            tl = vec2(lastX, lastY+fibArray[i]);
            tr = vec2(lastX+fibArray[i], lastY+fibArray[i]); 
            lastX = lastX+fibArray[i];
            lastY = lastY+fibArray[i];
        }
        else if ( mode == 1 ){
            bl = vec2(lastX, lastY-fibArray[i]);
            br = vec2(lastX+fibArray[i], lastY-fibArray[i]);
            tl = vec2(lastX, lastY);
            tr = vec2(lastX+fibArray[i], lastY);
            lastX = lastX+fibArray[i];
            lastY = lastY-fibArray[i];
        }
        else if ( mode == 2 ){
            bl = vec2(lastX-fibArray[i], lastY-fibArray[i]);
            br = vec2(lastX, lastY-fibArray[i]);
            tl = vec2(lastX-fibArray[i], lastY);
            tr = vec2(lastX, lastY);
            lastX = lastX-fibArray[i];
            lastY = lastY-fibArray[i];
        }
        else {
            bl = vec2(lastX - fibArray[i], lastY);
            br = vec2(lastX, lastY);
            tl = vec2(lastX - fibArray[i], lastY + fibArray[i]);
            tr = vec2(lastX, lastY + fibArray[i]);
            lastX -= fibArray[i];
            lastY += fibArray[i];
        }
        mode = (mode+1)%4;
        vertices.push(...[bl, br, tr, tl]);
    }

    vertices = stetchToFitFib(vertices);
    return vertices;
}

function generateSquareFilled(size = 11){
    let vertices = [];
    let lastX = -1;
    let lastY = -1;
    let fibArray = normalizeArray(generateFibArray(size));
    let mode = 0; //0 is bl, 1 is tl, 2 is tr, 3 is br

    for (let i = 0; i < fibArray.length; i++){
        let bl;
        let br;
        let tl;
        let tr;
        if ( mode == 0 ){
            bl = vec2(lastX, lastY);
            br = vec2(lastX+fibArray[i], lastY);
            tl = vec2(lastX, lastY+fibArray[i]);
            tr = vec2(lastX+fibArray[i], lastY+fibArray[i]); 
            lastX = lastX+fibArray[i];
            lastY = lastY+fibArray[i];
        }
        else if ( mode == 1 ){
            bl = vec2(lastX, lastY-fibArray[i]);
            br = vec2(lastX+fibArray[i], lastY-fibArray[i]);
            tl = vec2(lastX, lastY);
            tr = vec2(lastX+fibArray[i], lastY);
            lastX = lastX+fibArray[i];
            lastY = lastY-fibArray[i];
        }
        else if ( mode == 2 ){
            bl = vec2(lastX-fibArray[i], lastY-fibArray[i]);
            br = vec2(lastX, lastY-fibArray[i]);
            tl = vec2(lastX-fibArray[i], lastY);
            tr = vec2(lastX, lastY);
            lastX = lastX-fibArray[i];
            lastY = lastY-fibArray[i];
        }
        else {
            bl = vec2(lastX - fibArray[i], lastY);
            br = vec2(lastX, lastY);
            tl = vec2(lastX - fibArray[i], lastY + fibArray[i]);
            tr = vec2(lastX, lastY + fibArray[i]);
            lastX -= fibArray[i];
            lastY += fibArray[i];
        }
        mode = (mode+1)%4;
        vertices.push(...[bl, br, tr, bl, tr, tl]);
    }

    vertices = stetchToFitFib(vertices);
    return vertices;
}

function generateCurve(depth = 8){

}

function filledStretch(vecarray){
    let x_max = -Infinity;
    let y_max = -Infinity;
}

//I'm confident there is in fact a more mathematical / less hacky way to go about this. But I'm a computer scientist as
//much as I am a math teacher.
function stetchToFitFib(vecarray){
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    for (let i = 0; i < vecarray.length; i++){
        const x = vecarray[i][0];
        const y = vecarray[i][1];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    }

    const w = (maxX - minX) || 1;
    const h = (maxY - minY) || 1;

    const sx = 2 / w;
    const sy = 2 / h;

    for (let i = 0; i < vecarray.length; i++){
        if (vecarray[i][0] !== -1){ 
        vecarray[i][0] = -1 + (vecarray[i][0] - minX) * sx;}
        
        if (vecarray[i][1] !== -1){
        vecarray[i][1] = -1 + (vecarray[i][1] - minY) * sy;}
    }

    return vecarray;
}



window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(1,1,1,1);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //var colors = makeColorsFromVertices(vertices);
    var colors = makeFilledColorsFromVertices(vertices); //for filled squares

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    for (let i = 0; i < vertices.length; i++){
        console.log(`${vertices[i][0]} : ${vertices[i][1]}`);
    }

    render();
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    //drawDiagonals();
    drawSquareFilled();
}

function drawDiagonals(){
    gl.drawArrays(gl.LINE_STRIP, 0, vertices.length);
}

function drawSquareOutlines(){
    
    for (let i = 0; i < vertices.length; i += 4) {
        gl.drawArrays(gl.LINE_LOOP, i, 4);
    }

}

function drawSquareFilled(){
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
}