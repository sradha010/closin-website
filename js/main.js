/* ============================================================
   STATE & CONFIGURATION
   ============================================================ */
const MOBILE_BREAKPOINT = 900;
let isMobileView = window.innerWidth <= MOBILE_BREAKPOINT;
let animationFrameId = null; 

const mouse = { x: null, y: null, radius: 140 };
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
const mobileContainer = document.getElementById("mobile-animation-container");

/* ============================================================
   PARTICLE ENGINE (Desktop Only)
   ============================================================ */
const particles = [];

class Particle {
    constructor() {
        this.init();
    }
    init() {
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

function drawNetwork() {
    if (!mouse.x || !mouse.y) return;
    for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const dxm = mouse.x - p1.x;
        const dym = mouse.y - p1.y;
        if (Math.sqrt(dxm * dxm + dym * dym) > mouse.radius) continue;

        // Draw connections between dots
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
                ctx.strokeStyle = `rgba(180, 140, 255, ${(1 - dist / 90) * 0.45})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }

        // Draw connections to mouse
        const distToMouse = Math.sqrt(dxm * dxm + dym * dym);
        ctx.strokeStyle = `rgba(200, 160, 255, ${1 - distToMouse / mouse.radius})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
    }
}

function animate() {
    if (isMobileView) return; 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.move();
        p.draw();
    });
    drawNetwork();
    animationFrameId = requestAnimationFrame(animate);
}

/* ============================================================
   RESPONSIVE CONTROLLER
   ============================================================ */
function initCorrectAnimation() {
    isMobileView = window.innerWidth <= MOBILE_BREAKPOINT;

    if (isMobileView) {
        // 1. Kill Desktop Logic
        cancelAnimationFrame(animationFrameId);
        canvas.style.display = "none";
        
        // 2. Start Mobile Logic
        mobileContainer.style.display = "block";
        startMobileAnimation();
    } else {
        // 1. Kill Mobile Logic
        stopMobileAnimation();
        mobileContainer.style.display = "none";

        // 2. Start Desktop Logic
        canvas.style.display = "block";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles.length = 0;
        for (let i = 0; i < 130; i++) particles.push(new Particle());
        animate();
    }
}

function startMobileAnimation() {
    console.log("Senior Dev: Injecting Mobile Bubbles...");
    let bubbleHTML = '<div class="wrapper">';
    for (let i = 0; i < 10; i++) {
        bubbleHTML += '<span class="bubble"></span>';
    }
    bubbleHTML += '</div>';
    mobileContainer.innerHTML = bubbleHTML;
}

function stopMobileAnimation() {
    mobileContainer.innerHTML = ""; 
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

window.addEventListener("resize", () => {
    const check = window.innerWidth <= MOBILE_BREAKPOINT;
    if (check !== isMobileView) {
        initCorrectAnimation();
    } else if (!isMobileView) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Menu Toggle
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
menuToggle.addEventListener("click", () => { navLinks.classList.toggle("show"); });

/* ============================================================
   DRAGGABLE CLIENT SCROLL (Optimized)
   ============================================================ */
const scrollContainer = document.querySelector('.clients-scroll-wrapper');
let isDown = false;
let startX, scrollLeft;

const startDragging = (e) => {
    isDown = true;
    scrollContainer.style.cursor = 'grabbing';
    startX = (e.pageX || e.touches[0].pageX) - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
    document.querySelector('.clients-scroll').style.animationPlayState = 'paused';
};

const stopDragging = () => {
    isDown = false;
    scrollContainer.style.cursor = 'grab';
    document.querySelector('.clients-scroll').style.animationPlayState = 'running';
};

const moveDragging = (e) => {
    if (!isDown) return;
    const x = (e.pageX || e.touches[0].pageX) - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainer.scrollLeft = scrollLeft - walk;
};

scrollContainer.addEventListener('mousedown', startDragging);
scrollContainer.addEventListener('touchstart', startDragging);
window.addEventListener('mouseup', stopDragging);
window.addEventListener('touchend', stopDragging);
scrollContainer.addEventListener('mousemove', moveDragging);
scrollContainer.addEventListener('touchmove', moveDragging);

// START EVERYTHING
initCorrectAnimation();
