var canvas;
var gl;
let vertices;
let draw;
let mode = 1;
let colors;
let size = 9;
let positionBuffer;
let colorBuffer;

function decideGeneration(mode = 3){
    
    if (mode === 0){
        vertices =  generateDiagonal(size);
        colors = makeColorsFromVertices(vertices);
        draw = drawDiagonals;
    }
    else if (mode === 1){
        vertices = generateSquareOutline(size);
        colors = makeColorsFromVertices(vertices);
        draw = drawSquareOutlines;
    }
    else if (mode === 2){
        vertices = generateSquareFilled(size);
        colors = makeFilledColorsFromVertices(vertices);
        draw = drawSquareFilled
    }
    else {
        vertices = generateCurve(8, size);
        colors = makeColorsFromVertices(vertices);
        draw = drawSpiral
        
    }
}


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
    
        for (let j = 0; j < 4; j++){
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
        vertices.push(...[tl, tr, bl, br]);
    }

    vertices = stetchToFitFib(vertices);
    return vertices;
}

function generateCurve(depth = 8, size = 11){
    let vertices = [];
    let fibArray = normalizeArray(generateFibArray(size));
    let lastX = -1+fibArray[0];
    let lastY = -1;
    let mode = 0; //0 is bl, 1 is tl, 2 is tr, 3 is br
    
    for (let i = 0; i < fibArray.length-1; i++){
        vertices.push(...createQuarterCicle(depth, [lastX, lastY], mode, fibArray[i]));
        if (mode === 0){
            lastY = lastY+fibArray[i]-fibArray[i+1];
        }
        else if (mode === 1){
            lastX = lastX+fibArray[i]-fibArray[i+1];
        }
        else if (mode === 2){
            lastY -= fibArray[i]-fibArray[i+1];
        }
        else{
            lastX -= fibArray[i]-fibArray[i+1];
        }
        mode = (mode+1)%4;
    }

    vertices = stetchToFitFib(vertices);
    return vertices;
}

function createQuarterCicle(depth = 8,center = [0, 0], mode = 0, radius = 1){
    let vertices = []
    let modeMulX;
    let modeMulY;
    
    const quarter = Math.PI / 2;
    const ratio = 1/depth;

    if (mode === 0){
        modeMulX = -1;
        modeMulY = 1;
    }
    else if (mode === 1){
        modeMulX = 1;
        modeMulY = 1;
    }
    else if (mode === 2){
        modeMulX = 1;
        modeMulY = -1;
    }
    else{
        modeMulX = -1;
        modeMulY = -1;
    }

    for (let i = 0; i <= depth; i++){
        vertices.push(vec2(radius*modeMulX*Math.cos(quarter*ratio*i)+center[0], radius*modeMulY*Math.sin(quarter*ratio*i)+center[1]));
    }

    return vertices;
}

//I'm confident there is in fact a more mathematical / less hacky way to go about this
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

    decideGeneration(mode); 

    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(1,1,1,1);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    document.getElementById("mode").addEventListener("change", (e) => {
        const v = e.target.value;

        if (v === "diagonal") mode = 0;
        else if (v === "squares-outline") mode = 1;
        else if (v === "squares-filled") mode = 2;
        else mode = 3;

        decideGeneration(mode);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

        render();
    });

    enableCanvasResize();


    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    draw();
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

    for (let i = 0; i < vertices.length/4; i++){
        let tri1 = 4*(i-1);
        let tri2 = tri1 + 1;        
        gl.drawArrays(gl.TRIANGLES, tri1, 3);
        gl.drawArrays(gl.TRIANGLES, tri2, 3);
    }
}

function drawSpiral(depth = 8){
    const arcLen = depth + 1;
    for (let i = 0; i < vertices.length; i += arcLen){
        gl.drawArrays(gl.LINE_STRIP, i, arcLen);
    }
}

function enableCanvasResize() {
  const wrap = document.getElementById("canvas-wrap");
  const canvas = document.getElementById("gl-canvas");
  const handle = document.getElementById("resize-handle");

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startW = 0;
  let startH = 0;

  const minW = 150;
  const minH = 150;

  function setCanvasSize(w, h) {
    w = Math.max(minW, Math.floor(w));
    h = Math.max(minH, Math.floor(h));

    canvas.width = Math.floor(w);
    canvas.height = Math.floor(h);

    gl.viewport(0, 0, canvas.width, canvas.height);
    render();
  }

  handle.addEventListener("pointerdown", (e) => {
    dragging = true;
    handle.setPointerCapture(e.pointerId);

    const rect = wrap.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startW = rect.width;
    startH = rect.height;

   e.preventDefault(); // prevent unintended behavior
  });

  handle.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    setCanvasSize(startW + dx, startH + dy);
  });

  handle.addEventListener("pointerup", (e) => {
    dragging = false;
    try {
      handle.releasePointerCapture(e.pointerId);
    } catch (_) {}
  });

  //get info of new size and share it to canvas
  const rect = wrap.getBoundingClientRect();
  setCanvasSize(rect.width, rect.height);
}