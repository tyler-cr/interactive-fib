var canvas;
var gl;
var justOne = 0;

let vertices = generateVertexListForFibList()

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

//takes values of array (assumed to be nums) and takes their sum, and creates a new normalized array
function normalizeArray(inArray){
    
    let side;
    let retArray = [];
    let total = 0;
    for(let i = inArray.length-1; i >= 0; i--){
        total+=inArray[i]
    }

    for(let i = inArray.length-1; i > 0; i--){
        side = inArray[i] + inArray[i-1];
        let distance = (inArray[i]/total);
        retArray.push(2*distance);
    }

    return retArray;
}

function generateVertexListForFibList(size = 11){
    let vertices = [vec2(-1,-1)];
    let lastX = -1;
    let lastY = -1;
    let fibArray = normalizeArray(generateFibArray(size));

    console.log("attempting to generate...")
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

//I'm confident there is in fact a more mathematical / less hacky way to go about this. But I'm a computer scientist as
//much as I am a math teacher.
function stetchToFitFib(vecarray){
    const topY   = vecarray[1][1];
    const rightX = vecarray[2][0];

    const sx = 2 / (rightX + 1);
    const sy = 2 / (topY + 1);

    for (let i = 0; i < vecarray.length; i++){
        vecarray[i][0] = -1 + sx * (vecarray[i][0] + 1);
        vecarray[i][1] = -1 + sy * (vecarray[i][1] + 1);
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

    var colors = makeColorsFromVertices(vertices);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    render();
}

function render() {
    


    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays(gl.LINE_STRIP, 0, vertices.length);
}