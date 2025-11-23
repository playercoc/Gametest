const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let chicken = {
    x: canvas.width / 2,
    y: canvas.height - 120,
    size: 40,
    color: "yellow"
};

let cars = [];
let score = 0;
let speed = 4;

// Spawn mobil
setInterval(() => {
    cars.push({
        x: Math.random() * canvas.width,
        y: -50,
        width: 50,
        height: 80,
        color: "red"
    });
}, 700);

// Kontrol geser (Android touch)
let touchX = null;

canvas.addEventListener("touchstart", e => {
    touchX = e.touches[0].clientX;
});

canvas.addEventListener("touchmove", e => {
    const current = e.touches[0].clientX;
    if (touchX === null) return;

    const diff = current - touchX;

    chicken.x += diff * 0.3;
    touchX = current;
});

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar ayam
    ctx.fillStyle = chicken.color;
    ctx.fillRect(chicken.x, chicken.y, chicken.size, chicken.size);

    // Gambar & gerakkan mobil
    cars.forEach((car, i) => {
        car.y += speed;

        ctx.fillStyle = car.color;
        ctx.fillRect(car.x, car.y, car.width, car.height);

        // Jika nabrak
        if (
            chicken.x < car.x + car.width &&
            chicken.x + chicken.size > car.x &&
            chicken.y < car.y + car.height &&
            chicken.y + chicken.size > car.y
        ) {
            alert("Game Over! Score: " + score);
            location.reload();
        }

        // Score & hapus mobil yang lewat
        if (car.y > canvas.height) {
            cars.splice(i, 1);
            score++;
        }
    });

    requestAnimationFrame(update);
}

update();
