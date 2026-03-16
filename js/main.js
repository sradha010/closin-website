/* =========================
   Mouse (Reveal Only)
========================= */
const mouse = {
  x: null,
  y: null,
  radius: 140
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

/* =========================
   Canvas Setup
========================= */
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* =========================
   Particle Class
========================= */
const particles = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = 2;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    let opacity = 0.12;
    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) opacity = 0.85;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 140, 255, ${opacity})`;
    ctx.fill();
  }
}

/* =========================
   Init Particles
========================= */
function initParticles() {
  particles.length = 0;
  for (let i = 0; i < 130; i++) {
    particles.push(new Particle());
  }
}

/* =========================
   Local Network (Reveal)
========================= */
function drawLocalNetwork() {
  if (!mouse.x || !mouse.y) return;
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    const dxm = mouse.x - p1.x;
    const dym = mouse.y - p1.y;
    const mouseDist = Math.sqrt(dxm * dxm + dym * dym);
    if (mouseDist > mouse.radius) continue;
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        ctx.strokeStyle = `rgba(180, 140, 255, ${(1 - dist / 90) * 0.45})`;
        ctx.lineWidth = 0.5;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(180, 140, 255, 0.35)";
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
}

/* =========================
   Mouse Anchor Lines
========================= */
function drawMouseConnections() {
  if (!mouse.x || !mouse.y) return;
  particles.forEach(p => {
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < mouse.radius) {
      ctx.strokeStyle = `rgba(200, 160, 255, ${1 - dist / mouse.radius})`;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 18;
      ctx.shadowColor = "rgba(168, 162, 175, 0.8)";
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  });
}

/* =========================
   Animation Loop
========================= */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.move(); p.draw(); });
  drawLocalNetwork();
  drawMouseConnections();
  requestAnimationFrame(animate);
}

/* =========================
   Start — Desktop Only
========================= */
function isMobile() {
  return window.innerWidth <= 768;
}

if (!isMobile()) {
  canvas.style.display = 'block';
  initParticles();
  animate();
} else {
  canvas.style.display = 'none';
}

window.addEventListener('resize', () => {
  if (!isMobile()) {
    canvas.style.display = 'block';
    if (particles.length === 0) {
      initParticles();
      animate();
    }
  } else {
    canvas.style.display = 'none';
    particles.length = 0; // ← clear particles on mobile
  }
});
/* =========================
   Navbar Toggle
========================= */
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

/* =========================
   Draggable Client Scroll
========================= */
const scrollContainer = document.querySelector('.clients-scroll-wrapper');
let isDown = false;
let startX;
let scrollLeft;

scrollContainer.addEventListener('mousedown', (e) => {
  isDown = true;
  scrollContainer.style.cursor = 'grabbing';
  startX = e.pageX - scrollContainer.offsetLeft;
  scrollLeft = scrollContainer.scrollLeft;
  document.querySelector('.clients-scroll').style.animationPlayState = 'paused';
});

scrollContainer.addEventListener('mouseleave', () => {
  isDown = false;
  scrollContainer.style.cursor = 'grab';
  document.querySelector('.clients-scroll').style.animationPlayState = 'running';
});

scrollContainer.addEventListener('mouseup', () => {
  isDown = false;
  scrollContainer.style.cursor = 'grab';
  document.querySelector('.clients-scroll').style.animationPlayState = 'running';
});

scrollContainer.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.offsetLeft;
  const walk = (x - startX) * 2;
  scrollContainer.scrollLeft = scrollLeft - walk;
});

// Touch support for mobile
scrollContainer.addEventListener('touchstart', (e) => {
  startX = e.touches[0].pageX - scrollContainer.offsetLeft;
  scrollLeft = scrollContainer.scrollLeft;
  document.querySelector('.clients-scroll').style.animationPlayState = 'paused';
});

scrollContainer.addEventListener('touchend', () => {
  document.querySelector('.clients-scroll').style.animationPlayState = 'running';
});

scrollContainer.addEventListener('touchmove', (e) => {
  const x = e.touches[0].pageX - scrollContainer.offsetLeft;
  const walk = (x - startX) * 2;
  scrollContainer.scrollLeft = scrollLeft - walk;
});

/* =========================
   Scroll Reveal Animation
========================= */
const revealElements = document.querySelectorAll(
  '.why-card, .service-card, .reason-card, .process-step, .testimonial-card'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));
