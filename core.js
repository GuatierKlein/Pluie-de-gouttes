const pixelMatrix = new Array()
let pipiCounter = 0

createFrame(100, 100)
setInterval(() => tick(), 50)

document.getElementById("button").onclick = () => applyBackground()

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

            pixel.addEventListener("click", (e) => {
                e.target.style.backgroundColor = "yellow";
                e.target.touched = true
                pipiCounter++
                document.getElementById("counter").innerHTML = pipiCounter
            })
        } 
        pixelMatrix.push(pixelVector)   
    }
}

//louis ta race

function tick() {
    console.log("tick")
    for (let i = pixelMatrix.length - 1; i >= 0; i--) {
        for (let j = pixelMatrix[i].length - 1; j >= 0; j--) {
            if(!pixelMatrix[i][j].touched) continue 

            //au sol 
            if(i === pixelMatrix.length - 1) continue; 
            //un en dessous 
            if(pixelMatrix[i+1][j].touched) continue
            //tombe 
            pixelMatrix[i][j].touched = false 
            pixelMatrix[i+1][j].touched = true
            pixelMatrix[i][j].style.backgroundColor = "rgba(255,211,62,0.1)";
            pixelMatrix[i+1][j].style.backgroundColor = "rgb(255,220,101)";
        }
    }
}

function applyBackground() {
    const url = document.getElementById("pictureInput").value
    document.getElementById("frame").style.backgroundImage = `url(${url})`

}