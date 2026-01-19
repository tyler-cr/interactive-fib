var canvas;
var gl;
var justOne = 0;

let vertices = generateVertexListForFibList()

function generateFibArray(size=5){
    let retlist = [1, 1]
    for(let i = 2; i < size; i++){
        retlist.push(retlist[i-2]+retlist[i-1])
        console.log(retlist[i])
    }
    return retlist
}

//takes values of array (assumed to be nums) and takes their sum, and creates a new normalized array
function normalizeArray(inArray){
    
    let side;
    let retArray = [];
    
    for(let i = inArray.length-1; i > 0; i--){
        side = inArray[i] + inArray[i-1];
        let distance = (inArray[i]/side);
        retArray.push(2*distance);
    }

    return retArray;
}

function generateVertexListForFibList(size = 5){
    let vertices = [vec2(-1,-1)];
    let lastX = -1;
    let lastY = -1;
    let fibArray = normalizeArray(generateFibArray(size));

    console.log("attempting to generate...")
    let direction = 0;
    for (let i = 0; i < fibArray.length; i++){
        console.log(fibArray[i]);
        if(direction == 0){
            lastX +=fibArray[i];
            lastY +=Math.sqrt(2)*fibArray[i];
            vertices.push(vec2(lastX, lastY));
            //vertices.push(vec2(lastX, lastY));
        }
        else if(direction == 1){
            lastX +=Math.sqrt(2)*fibArray[i];
            lastY -=fibArray[i];
            vertices.push(vec2(lastX, lastY));
            //vertices.push(vec2(lastX, lastY));
        }
        else if (direction == 2){
            lastX -=fibArray[i];
            lastY -=Math.sqrt(2)*fibArray[i];
            vertices.push(vec2(lastX, lastY));
            //vertices.push(vec2(lastX, lastY));
        }
        else{
            lastX -=Math.sqrt(2)*fibArray[i];
            lastY +=fibArray[i];
            vertices.push(vec2(lastX, lastY));
            //vertices.push(vec2(lastX, lastY));
        }
        console.log(`${lastX} : ${lastY}`)
        direction = (direction + 1)%4
    }

    return vertices;
}

window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.clearColor(1,1,1,1);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    justOne = 0;
	render();
}

function render() {
    


    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays(gl.LINE_STRIP, 0, vertices.length);
}