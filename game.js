const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let speed = 6;
let lanes = 4;

const scoreBox = document.getElementById("scoreBox");

// Ayam (player)
let chicken = {
    x: canvas.width / 2,
    y: canvas.height - 140,
    size: 45,
    color: "#ffeb3b"
};

// Mobil
let cars = [];

// Spawn mobil tiap detik
setInterval(() => {
    const laneWidth = canvas.width / lanes;

    cars.push({
        lane: Math.floor(Math.random() * lanes),
        x: 0,
        y: -80,
        width: laneWidth * 0.7,
        height: 100,
        color: randomColor()
    });
}, 600);

function randomColor() {
    const colors = ["#ff5252", "#40c4ff", "#ffd740", "#69f0ae", "#ff4081"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Touch control (Android)
let lastTouchX = null;

canvas.addEventListener("touchstart", (e) => {
    lastTouchX = e.touches[0].clientX;
});

canvas.addEventListener("touchmove", (e) => {
    const touchX = e.touches[0].clientX;
    if (lastTouchX === null) return;

    const diff = touchX - lastTouchX;
    chicken.x += diff * 0.4;
    lastTouchX = touchX;
});

// Draw lane lines
function drawRoad() {
    const laneWidth = canvas.width / lanes;

    for (let i = 1; i < lanes; i++) {
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(laneWidth * i, 0);
        ctx.lineTo(laneWidth * i, canvas.height);
        ctx.stroke();
    }
}

// Render game
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();

    // Gambar ayam
    ctx.fillStyle = chicken.color;
    ctx.beginPath();
    ctx.arc(chicken.x, chicken.y, chicken.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Gerakan & gambar mobil
    cars.forEach((car, i) => {
        const laneWidth = canvas.width / lanes;
        car.x = (car.lane * laneWidth) + laneWidth * 0.15;
        car.y += speed;

        ctx.fillStyle = car.color;
        ctx.fillRect(car.x, car.y, car.width, car.height);

        // Cek tabrakan
        if (
            chicken.x + chicken.size / 2 > car.x &&
            chicken.x - chicken.size / 2 < car.x + car.width &&
            chicken.y + chicken.size / 2 > car.y &&
            chicken.y - chicken.size / 2 < car.y + car.height
        ) {
            alert("💀 Game Over!\nScore kamu: " + score);
            location.reload();
        }

        // Delete mobil yg lewat + tambah score
        if (car.y > canvas.height) {
            cars.splice(i, 1);
            score++;
            scoreBox.textContent = "Score: " + score;
        }
    });

    requestAnimationFrame(update);
}

update();
