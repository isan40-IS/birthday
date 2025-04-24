const candle = document.getElementById("candle");
const wishText = document.getElementById("wish-text");
const photosContainer = document.getElementById("photos-container");
const music = document.getElementById("music");
const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");

const photoList = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "11.jpg",
  "12.jpg",
  "13.jpg",
  "14.jpg",
  "15.jpg",
  "16.jpg",
  "17.jpg",
  "18.jpg",
  "19.jpg",
  "21.jpg",
];

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const placedPhotos = []; // Pindahkan ke luar event listener!

function getRandomPosition(imgWidth, imgHeight, placedPhotos) {
  const paddingX = window.innerWidth * 0.05;
  const paddingY = window.innerHeight * 0.05;
  const rangeWidth = window.innerWidth * 0.9 - imgWidth;
  const rangeHeight = window.innerHeight * 0.9 - imgHeight;

  const maxPhotoSize = Math.max(imgWidth, imgHeight);
  const minDistance = 0.8 * maxPhotoSize;

  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const x = paddingX + Math.random() * rangeWidth;
    const y = paddingY + Math.random() * rangeHeight;

    let tooClose = false;
    for (let pos of placedPhotos) {
      const dx = pos.x - x;
      const dy = pos.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDistance) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      placedPhotos.push({ x, y, width: imgWidth, height: imgHeight });
      return { x, y };
    }

    attempts++;
  }

  // Kalau gagal, tetap taruh acak
  const fallbackX = paddingX + Math.random() * rangeWidth;
  const fallbackY = paddingY + Math.random() * rangeHeight;
  placedPhotos.push({
    x: fallbackX,
    y: fallbackY,
    width: imgWidth,
    height: imgHeight,
  });
  return { x: fallbackX, y: fallbackY };
}

let positiveRotationCount = 0;
let totalPhotos = photoList.length; // Set nanti saat klik candle

function getRandomRotation() {
  const positiveRotationLimit = 0.6 * totalPhotos;

  let rotation;
  if (positiveRotationCount >= positiveRotationLimit) {
    // Sudah terlalu banyak rotasi positif, paksa negatif
    rotation = -(Math.random() * 20); // -0 to -20 deg
  } else {
    // Boleh positif atau negatif
    rotation = Math.random() * 40 - 20; // -20 to +20 deg

    if (rotation > 0) {
      positiveRotationCount++;
    }
  }
  return rotation;
}

function getRandomSize() {
  return Math.random() * (250 - 150) + 100; // 100px to 180px
}

candle.addEventListener("click", () => {
  candle.style.display = "none";
  wishText.style.display = "none";
  music.play();
  launchConfetti();

  photoList.forEach((photoSrc, index) => {
    const img = document.createElement("img");
    img.src = `img/${photoSrc}`;
    img.classList.add("photo");

    img.onload = function () {
      const size = getRandomSize();
      img.style.width = `${size}px`;

      const { x, y } = getRandomPosition(size, size, placedPhotos);
      const rotation = getRandomRotation();

      img.style.position = "absolute";
      img.style.top = `${y}px`;
      img.style.left = `${x}px`;
      img.style.transform = `rotate(${rotation}deg)`;
      img.style.opacity = 0;

      photosContainer.appendChild(img);

      setTimeout(() => {
        img.style.opacity = 1;
      }, 100 * index);
    };
  });
});

// Simple Confetti Effect
let confettis = [];

function launchConfetti() {
  for (let i = 0; i < 200; i++) {
    confettis.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 100 + 10,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      tilt: Math.random() * 20 - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
    });
  }
  requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettis.forEach((c) => {
    ctx.beginPath();
    ctx.lineWidth = c.r;
    ctx.strokeStyle = c.color;
    ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
    ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
    ctx.stroke();
  });
  updateConfetti();
  requestAnimationFrame(drawConfetti);
}

function updateConfetti() {
  confettis.forEach((c) => {
    c.tiltAngle += c.tiltAngleIncremental;
    c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
    c.x += Math.sin(c.d);
    c.tilt = Math.sin(c.tiltAngle) * 15;
    if (c.y > confettiCanvas.height) {
      c.x = Math.random() * confettiCanvas.width;
      c.y = -20;
    }
  });
}
