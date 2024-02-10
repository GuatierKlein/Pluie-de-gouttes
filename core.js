const pixelMatrix = new Array()
let pipiCounter = 0
let mouseTimeOut
const urinePool = document.getElementById("urine")
let urineLevel = 0
let ticks = 0;

document.getElementById("button").onclick = () => applyBackground()
initBottle()
addUrineLevel(100)
createFrame(100, 100)
setInterval(() => tick(), 50)

document.body.addEventListener("mouseup", removeMouseInterval)

function createFrame(width, height) {
    const frame = document.getElementById("frame")
    console.log(frame)
    for (let i = 0; i < height; i++) {
        const pixelVector = new Array()
        const line = document.createElement("div")
        frame.appendChild(line)
        line.className = "pixelLine";
        for (let j = 0; j < width; j++) {
            const pixel = document.createElement("div")
            pixel.className = "pixel";
            line.appendChild(pixel)
            pixelVector.push(pixel)
            pixel.touched = false
            pixel.locked = false
            pixel.new = false
            pixel.beingClicked = false

            pixel.addEventListener("mousedown", (e) => {
                let occCounter = 0
                mouseTimeOut = setInterval(() => {
                    occCounter++
                    if(occCounter > 20) return
                    mouseDown(e.target)
                }, 100);
            })
        } 
        pixelMatrix.push(pixelVector)   
    }
}

function mouseDown(pixel) {
    if(urineLevel <= 0) return
    pixel.beingClicked = true
    pipiCounter++
    document.getElementById("counter").innerHTML = pipiCounter
    touchPixel(pixel, false)
    addUrineLevel(-1)
}

function mouseUp(pixel) {
    pixel.beingClicked = false
}

function removeMouseInterval() {
    if(mouseTimeOut) window.clearInterval(mouseTimeOut)
    mouseTimeOut = false
}

function addUrineLevel(amount) {
    if(urineLevel + amount < 0 || urineLevel + amount > 100) {
        urineLevel = 100
    } else {
        urineLevel += amount
    }
    urinePool.style.height = `${(urineLevel / 100) * 500}px` 
}

//louis ta race

function tick() {
    ticks++
    if(ticks % 25 == 0) {
        ticks = 0
        addUrineLevel(1)
    }
    
    for (let i = pixelMatrix.length - 1; i >= 0; i--) {
        for (let j = pixelMatrix[i].length - 1; j >= 0; j--) {
            if(!pixelMatrix[i][j].touched || pixelMatrix[i][j].locked) continue 
            if(pixelMatrix[i][j].new) {
                pixelMatrix[i][j].new = false
                continue
            }

            //au sol 
            if(i === pixelMatrix.length - 1) {
                lockPixel(pixelMatrix[i][j])
                continue
            }
            //un en dessous 
            if(pixelMatrix[i+1][j].touched) {
                flowToClosestEmpty(i, j)
                continue
            }

            //tombe 
            unTouchPixel(pixelMatrix[i][j])
            touchPixel(pixelMatrix[i + 1][j], false)
        }
    }
}

function flowToSide(i, j) {

    return true
}

function flowToClosestEmpty(iStart, jStart) {
    let distLeft = 0
    let distRight = 0
    //right
    let rightCounter = 0;
    for (let j = jStart + 1; j < pixelMatrix[iStart].length; j++) {
        rightCounter++
        if(!pixelMatrix[iStart + 1][j].touched) {
            distRight = rightCounter;
            // pixelMatrix[iStart + 1][j].style.backgroundColor = "blue";
            break;
        }
    }
    //left
    let leftCounter = 0;
    for (let j = jStart - 1; j >= 0; j--) {
        leftCounter++
        if(!pixelMatrix[iStart + 1][j].touched) {
            distLeft = leftCounter;
            // pixelMatrix[iStart + 1][j].style.backgroundColor = "red";
            break;
        }
    }

    // console.log(distLeft)
    // console.log(distRight)
    //compare 
    if(distLeft != 0 && distLeft < distRight && distLeft < 20) {
        console.log("go left")
        unTouchPixel(pixelMatrix[iStart][jStart])
        touchPixel(pixelMatrix[iStart][jStart - 1], true)
        return true
    } 
    if(distRight != 0 && distRight < distLeft && distRight < 20) {
        console.log("go right")
        unTouchPixel(pixelMatrix[iStart][jStart])
        touchPixel(pixelMatrix[iStart][jStart + 1], true)
        return true
    }
    if(distRight == distLeft && distRight != 0 && distLeft != 0 && distRight < 20 && distLeft < 20) {
        console.log("random")
        if(Math.random() > 0.5) {
            unTouchPixel(pixelMatrix[iStart][jStart])
            touchPixel(pixelMatrix[iStart][jStart - 1], true)
            return true
        } else {
            unTouchPixel(pixelMatrix[iStart][jStart])
            touchPixel(pixelMatrix[iStart][jStart + 1], true)
            return true
        }
    }
    console.log("locked")
    lockPixel(pixelMatrix[iStart][jStart])
    return false
}

function lockPixel(pixel) {
    pixel.locked = true
}

function touchPixel(pixel, isNew) {
    pixel.touched = true 
    pixel.new = isNew
    pixel.style.backgroundColor = "rgb(255,220,101)";
}
function unTouchPixel(pixel) {
    pixel.touched = false 
    pixel.style.backgroundColor = "rgba(255,211,62,0.1)";
}

function applyBackground() {
    console.log("test")
    const url = document.getElementById("pictureInput").value
    document.getElementById("frame").style.backgroundImage = `url(${url})`
    console.log(url)
}

function initBottle() {
    const bottle = document.getElementById("bottle")
    bottle.addEventListener("click", () => {
        addUrineLevel(10)
        if(Math.random() < 0.05) {
            window.open("https://www.youtube.com/watch?v=NTQQtsaIfpo", "_blank")
        }
    })
}