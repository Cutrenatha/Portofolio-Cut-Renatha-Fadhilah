/* ===================================================
   Cut Renatha Fadhilah — Portfolio JS
   Galaxy effects, cursor, animations, interactions
=================================================== */

// ===== GALAXY CANVAS =====
const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');

let stars = [], nebulae = [], shootingStars = [];
const NUM_STARS = 280;
const NUM_NEBULAE = 6;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.2,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
      color: pickStarColor(),
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    });
  }
}

function pickStarColor() {
  const colors = [
    'rgba(200,180,255,',
    'rgba(255,255,255,',
    'rgba(180,140,255,',
    'rgba(220,170,255,',
    'rgba(255,220,255,',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function initNebulae() {
  nebulae = [
    { x: canvas.width * 0.85, y: canvas.height * 0.1, r: 380, color: 'rgba(100,20,180,', opacity: 0.04 },
    { x: canvas.width * 0.1, y: canvas.height * 0.7, r: 300, color: 'rgba(150,0,200,', opacity: 0.035 },
    { x: canvas.width * 0.5, y: canvas.height * 0.5, r: 250, color: 'rgba(80,0,150,', opacity: 0.025 },
    { x: canvas.width * 0.75, y: canvas.height * 0.6, r: 200, color: 'rgba(200,0,200,', opacity: 0.025 },
    { x: canvas.width * 0.2, y: canvas.height * 0.2, r: 280, color: 'rgba(120,0,220,', opacity: 0.03 },
    { x: canvas.width * 0.5, y: canvas.height * 0.85, r: 320, color: 'rgba(90,0,170,', opacity: 0.03 },
  ];
}

function spawnShootingStar() {
  if (Math.random() > 0.995) {
    const startX = Math.random() * canvas.width * 0.7;
    const startY = Math.random() * canvas.height * 0.4;
    shootingStars.push({
      x: startX, y: startY,
      len: Math.random() * 180 + 80,
      speed: Math.random() * 8 + 5,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      opacity: 1,
      decay: Math.random() * 0.02 + 0.015,
      trail: [],
    });
  }
}

let t = 0;
function drawGalaxy() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Nebulae
  nebulae.forEach(n => {
    const pulse = 1 + Math.sin(t * 0.001 + n.r * 0.01) * 0.08;
    const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * pulse);
    gradient.addColorStop(0, n.color + (n.opacity * 2) + ')');
    gradient.addColorStop(0.5, n.color + n.opacity + ')');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
    ctx.fill();
  });

  // Stars
  stars.forEach(s => {
    s.phase += s.twinkleSpeed;
    const twinkle = 0.4 + Math.sin(s.phase) * 0.6;
    const glow = s.r * 3;
    const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glow);
    gradient.addColorStop(0, s.color + (s.opacity * twinkle) + ')');
    gradient.addColorStop(0.4, s.color + (s.opacity * twinkle * 0.3) + ')');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(s.x, s.y, glow, 0, Math.PI * 2);
    ctx.fill();
    // Core
    ctx.fillStyle = s.color + (s.opacity * twinkle) + ')';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Shooting Stars
  spawnShootingStar();
  shootingStars = shootingStars.filter(ss => ss.opacity > 0);
  shootingStars.forEach(ss => {
    ss.trail.push({ x: ss.x, y: ss.y, op: ss.opacity });
    if (ss.trail.length > 20) ss.trail.shift();
    ss.x += Math.cos(ss.angle) * ss.speed;
    ss.y += Math.sin(ss.angle) * ss.speed;
    ss.opacity -= ss.decay;
    // Draw trail
    ss.trail.forEach((p, i) => {
      const ratio = i / ss.trail.length;
      ctx.strokeStyle = `rgba(200, 150, 255, ${p.op * ratio * 0.6})`;
      ctx.lineWidth = ss.r || 1.5;
      if (i > 0) {
        const prev = ss.trail[i - 1];
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    });
    // Head glow
    const headGrad = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6);
    headGrad.addColorStop(0, `rgba(220,180,255,${ss.opacity})`);
    headGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.arc(ss.x, ss.y, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  t++;
  requestAnimationFrame(drawGalaxy);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  initNebulae();
  initStars();
});

resizeCanvas();
initStars();
initNebulae();
drawGalaxy();

// Add nebula divs to body
['nebula-1','nebula-2','nebula-3'].forEach(cls => {
  const d = document.createElement('div');
  d.className = 'nebula-pulse ' + cls;
  document.body.appendChild(d);
});

// ===== CUSTOM CURSOR =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor effects on interactive elements
document.querySelectorAll('a, button, .project-card, .cert-card, .stat-item, .timeline-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1.5)';
    cursorDot.style.background = 'var(--neon2)';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorDot.style.background = 'var(--neon)';
  });
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('.section');
  const navAnchors = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => {
    const top = s.offsetTop - 200;
    if (window.scrollY >= top) current = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.dataset.section === current) a.classList.add('active');
  });
}

// ===== TYPEWRITER =====
const roles = ['Data Scientist', 'Web Developer', 'UI/UX Designer', 'ML Engineer', 'Problem Solver'];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typeTarget = document.getElementById('typewriter');

function typeWrite() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typeTarget.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typeTarget.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }
  let delay = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === current.length) { delay = 2000; isDeleting = true; }
  if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 300; }
  setTimeout(typeWrite, delay);
}
setTimeout(typeWrite, 800);

// ===== PHOTO UPLOAD =====
const photoArea = document.getElementById('photoArea');
const photoInput = document.getElementById('photoInput');
const heroPhoto = document.getElementById('heroPhoto');

photoArea.addEventListener('click', () => photoInput.click());
photoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    heroPhoto.src = ev.target.result;
    heroPhoto.style.display = 'block';
    photoArea.querySelector('.photo-upload-hint').style.display = 'none';
  };
  reader.readAsDataURL(file);
});

// ===== INTERSECTION OBSERVER — REVEAL CARDS =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const cards = entry.target.closest('.skills-grid, .projects-grid, .cert-grid')
        ? entry.target.closest('.skills-grid, .projects-grid, .cert-grid').querySelectorAll('.reveal-card')
        : [entry.target];
      let delay = 0;
      const allCards = document.querySelectorAll('.reveal-card');
      allCards.forEach(c => {
        if (!c.classList.contains('visible')) {
          const rect = c.getBoundingClientRect();
          if (rect.top < window.innerHeight + 100) {
            setTimeout(() => c.classList.add('visible'), delay);
            delay += 80;
          }
        }
      });
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-card').forEach(card => revealObserver.observe(card));

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
          else el.textContent = Math.floor(current);
        }, 16);
      });
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) counterObserver.observe(statsSection);

// ===== SKILL BARS =====
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        const width = bar.dataset.width;
        setTimeout(() => { bar.style.width = width + '%'; }, i * 120);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

// ===== PROJECTS FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach((card, i) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      if (matches) {
        card.classList.remove('hidden');
        card.style.animationDelay = (i * 0.05) + 's';
        setTimeout(() => card.classList.add('visible'), 10);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-primary');
  btn.querySelector('span').textContent = 'Message Sent! ✨';
  btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
  setTimeout(() => {
    btn.querySelector('span').textContent = 'Send Message';
    btn.style.background = '';
    contactForm.reset();
  }, 3000);
});

// ===== MOUSE PARALLAX for hero =====
document.addEventListener('mousemove', e => {
  const px = (e.clientX / window.innerWidth - 0.5) * 2;
  const py = (e.clientY / window.innerHeight - 0.5) * 2;
  const photo = document.querySelector('.photo-frame');
  const orbits = document.querySelectorAll('.photo-orbit');
  if (photo) photo.style.transform = `translateX(${px * 8}px) translateY(${py * 8}px)`;
  orbits.forEach((o, i) => {
    const factor = (i + 1) * 3;
    o.style.transform = `translateX(${px * factor}px) translateY(${py * factor}px)`;
  });
  const chips = document.querySelectorAll('.floating-chip');
  chips.forEach((c, i) => {
    c.style.transform = `translateX(${px * (i + 1) * 5}px) translateY(${py * (i + 1) * 5}px)`;
  });
  // Nebula parallax
  document.querySelectorAll('.nebula-pulse').forEach((n, i) => {
    const f = (i + 1) * 15;
    n.style.transform = `translate(${px * f}px, ${py * f}px)`;
  });
});

// ===== GLITCH EFFECT on hero name (subtle) =====
const heroName = document.querySelector('.hero-name');
let glitchInterval;
function startGlitch() {
  clearInterval(glitchInterval);
  glitchInterval = setInterval(() => {
    if (Math.random() > 0.97) {
      heroName.style.textShadow = `${Math.random()*6-3}px 0 var(--neon), ${Math.random()*-6+3}px 0 var(--neon2)`;
      heroName.style.filter = `blur(${Math.random()}px)`;
      setTimeout(() => {
        heroName.style.textShadow = '';
        heroName.style.filter = '';
      }, 80);
    }
  }, 200);
}
startGlitch();

// ===== CARD TILT EFFECT =====
function addTilt(selector, intensity = 10) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) rotateX(${-dy * intensity * 0.5}deg) rotateY(${dx * intensity * 0.5}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transformStyle = '';
    });
  });
}
addTilt('.project-card', 8);
addTilt('.cert-card', 6);
addTilt('.skill-category', 5);

// ===== SCROLL PROGRESS GLOW =====
window.addEventListener('scroll', () => {
  const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const hue = 270 + scrollPct * 60;
  document.documentElement.style.setProperty('--neon', `hsl(${hue}, 100%, 65%)`);
});

// ===== INITIAL TRIGGER visible on load =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.reveal-card').forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setTimeout(() => card.classList.add('visible'), i * 80);
      }
    });
  }, 300);
});