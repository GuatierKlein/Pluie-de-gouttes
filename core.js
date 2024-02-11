const pixelMatrix = new Array()
let pipiCounter = 0
let mouseTimeOut
const urinePool = document.getElementById("urine")
let urineLevel = 0
let ticks = 0;
let isPeeing = false
var peeAudio = new Audio('pee.mp3');

document.getElementById("button").onclick = () => applyBackground()
initBottle()
addUrineLevel(100)
createFrame(100, 100)
setInterval(() => tick(), 50)

document.body.addEventListener("mouseup", mouseUp)
document.body.addEventListener("mousedown", mouseDown)



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
            pixel.i = i
            pixel.j = j

            pixel.addEventListener("mouseover", (e) => {
                if(!isPeeing) return
                pee(e.target)
            })
        } 
        pixelMatrix.push(pixelVector)   
    }
}

function pee(pixel) {
    if(urineLevel <= 0) {
        peeAudio.pause();
        peeAudio.currentTime = 0;
        return
    }
    pixel.beingClicked = true
    pipiCounter++
    document.getElementById("counter").innerHTML = pipiCounter
    const i = pixel.i 
    const j = pixel.j 
    if(Math.random() > 0.25) {
        touchPixel(pixel, false)
    }
    if(i != 0 && Math.random() > 0.9) {
        touchPixel(pixelMatrix[i - 1][j])
    }
    if(i != pixelMatrix[i].length - 1 && Math.random() > 0.9) {
        touchPixel(pixelMatrix[i + 1][j])
    }
    if(j != 0 && Math.random() > 0.9) {
        touchPixel(pixelMatrix[i][j - 1])
    }
    if(j != pixelMatrix[i].length - 1 && Math.random() > 0.9) {
        touchPixel(pixelMatrix[i][j + 1])
    }
    addUrineLevel(-0.5)
}

function mouseDown() {
    isPeeing = true
    peeAudio.play();
}

function mouseUp() {
    isPeeing = false
    if(mouseTimeOut) window.clearInterval(mouseTimeOut)
    mouseTimeOut = false
    peeAudio.pause();
    peeAudio.currentTime = 0;
}

function addUrineLevel(amount) {
    if(urineLevel + amount < 0 || urineLevel + amount > 100) {
        urineLevel = 100
    } else {
        urineLevel += amount
    }
    urinePool.style.height = `${(urineLevel / 100) * 500}px` 
}

function fun() {
    const img = document.createElement("img")
    img.src = getRandomFunImage()
    img.style.height="100px"
    img.className = "fun fall"
    img.style.left = `${Math.random() * 100}%`
    document.getElementById("global").appendChild(img)
    setTimeout(() => {
        img.remove()
    }, 2000)
}

function getRandomFunImage() {
    const images = ["wc.png", "fun.png", "brosse.png", "bottle.png", "dog.png", "dog2.png"]
    return images[Math.floor(Math.random() * images.length)]
}

//louis ta race

function tick() {
    ticks++
    if(ticks % 25 == 0) {
        ticks = 0
        addUrineLevel(1)
        fun()
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
    pixel.style.backgroundColor = getRandomYellow();
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
        var audio = new Audio('drink.mp3');
        audio.play();
        if(Math.random() < 0.025) {
            window.open("https://www.youtube.com/watch?v=NTQQtsaIfpo", "_blank")
        }
    })
}

function getRandomYellow() {
    let r = 255
    let g = 220
    let b = 101
    const rDelta = Math.random() * 15
    const gDelta = Math.random() * 15
    const bDelta = Math.random() * 15
    if(Math.random() > 0.5) {
        r += rDelta
    } else {
        r -= rDelta
    }
    if(Math.random() > 0.5) {
        g += gDelta
    } else {
        g -= gDelta
    }
    if(Math.random() > 0.5) {
        b += bDelta
    } else {
        b -= bDelta
    }
    return `rgb(${r}, ${g}, ${b})`
}