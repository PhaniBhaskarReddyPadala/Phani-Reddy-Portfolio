/* ════════════════════════════════════════════════════════════
   FUTURISTIC PORTFOLIO — SCRIPT.JS
   Phani Bhaskara Reddy Padala
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ─── LOADER ─────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loader-bar');
  const msg = document.getElementById('loader-msg');
  const counter = document.getElementById('loader-counter');
  const messages = [
    'Initializing Portfolio...',
    'Loading Projects...',
    'Activating Interface...',
    'Welcome to Phani\'s Portfolio 🚀'
  ];

  let progress = 0;
  let msgIdx = 0;

  function tick() {
    progress += Math.random() * 4 + 1;
    if (progress > 100) progress = 100;

    bar.style.width = progress + '%';
    counter.textContent = Math.round(progress) + '%';

    const mIdx = Math.floor((progress / 100) * (messages.length - 1));
    if (mIdx !== msgIdx) {
      msgIdx = mIdx;
      msg.style.opacity = '0';
      setTimeout(() => {
        msg.textContent = messages[msgIdx];
        msg.style.opacity = '1';
        msg.style.transition = 'opacity 0.3s';
      }, 150);
    }

    if (progress < 100) {
      setTimeout(tick, 60 + Math.random() * 80);
    } else {
      msg.textContent = messages[messages.length - 1];
      setTimeout(() => {
        loader.classList.add('hidden');
        loader.addEventListener('transitionend', () => loader.remove(), { once: true });
        document.body.style.overflow = '';
      }, 600);
    }
  }

  document.body.style.overflow = 'hidden';
  tick();
})();

/* ─── CUSTOM CURSOR ──────────────────────────────────────── */
(function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const main = document.getElementById('cursor-main');
  const aura = document.getElementById('cursor-aura');
  if (!dot || !main || !aura) return;

  let mouseX = 0, mouseY = 0;
  let mainX = 0, mainY = 0;
  let auraX = 0, auraY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot is pinned to mouse
    dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
  });

  function animateLayers() {
    // Main ring follows with lag
    mainX += (mouseX - mainX) * 0.15;
    mainY += (mouseY - mainY) * 0.15;
    main.style.transform = `translate(${mainX - 23}px, ${mainY - 23}px)`;

    // Aura follows with more lag
    auraX += (mouseX - auraX) * 0.08;
    auraY += (mouseY - auraY) * 0.08;
    aura.style.transform = `translate(${auraX - 40}px, ${auraY - 40}px)`;

    requestAnimationFrame(animateLayers);
  }
  animateLayers();

  const hoverableSelector = 'a, button, .btn, .skill-card, .project-card, .cert-item, .contact-link, .cert-hover-view-btn, .modal-close, .cert-modal-close, .slider-nav, .clickable-cert, .view-details-btn-new, .tech-tag-item, .training-cert-preview, .training-preview-img, .modal-full-img, .stagger-tag, .training-badge-pulse, .progress-item';

  document.addEventListener('mouseover', e => {
    const target = e.target.closest(hoverableSelector);
    if (target) {
      dot.classList.add('hovered');
      main.classList.add('hovered');
      aura.classList.add('hovered');
    }
  });

  document.addEventListener('mouseout', e => {
    const target = e.target.closest(hoverableSelector);
    if (target) {
      dot.classList.remove('hovered');
      main.classList.remove('hovered');
      aura.classList.remove('hovered');
    }
  });
})();


/* ─── PARTICLE CANVAS ────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = canvas.offsetWidth;
  let H = canvas.height = canvas.offsetHeight;

  const COLORS = ['#00F5FF', '#8A2BE2', '#FF2ED1', '#22D3EE', '#FF007F', '#7C3AED'];

  class Particle {
    constructor() { this.reset(true); }
    reset(random) {
      this.x = Math.random() * W;
      this.y = random ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.6 + 0.2);
      this.alpha = Math.random() * 0.6 + 0.2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.pulseFactor = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulseFactor += 0.02;
      this.alpha = (Math.sin(this.pulseFactor) * 0.25 + 0.45);
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from({ length: 120 }, () => new Particle());

  // Mouse-reactive particles
  let mx = -9999, my = -9999;
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  });

  function drawConnections() {
    const maxDist = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / maxDist) * 0.12;
          ctx.strokeStyle = '#00F5FF';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  });
})();

/* ─── NAVBAR ─────────────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  // Close on link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });

  // Active section indicator
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const indicator = document.getElementById('nav-indicator');

  function updateActiveSection() {
    const scrollY = window.scrollY + 120;
    let currentActive = null;
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[data-section="${sec.id}"]`);
        if (active) {
          active.classList.add('active');
          currentActive = active;
        }
      }
    });

    if (currentActive && indicator) {
      indicator.style.opacity = '1';
      indicator.style.width = `${currentActive.offsetWidth}px`;
      indicator.style.left = `${currentActive.offsetLeft}px`;
    } else if (indicator) {
      indicator.style.opacity = '0';
    }
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  // Call once on load, and also on resize to recalculate indicator position
  window.addEventListener('resize', updateActiveSection);
  setTimeout(updateActiveSection, 100);
})();

/* ─── TYPING ANIMATION ───────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'I am good at problem solving',
    'I build data-driven solutions',
    'I analyze complex datasets'
  ];

  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const phrase = phrases[phraseIdx];
    const speed = isDeleting ? 40 : 80;

    el.textContent = phrase.slice(0, charIdx);

    if (!isDeleting) {
      charIdx++;
      if (charIdx > phrase.length) {
        isDeleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
    }

    setTimeout(type, speed + Math.random() * 30);
  }

  setTimeout(type, 1500);
})();

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // If it's a grid with children, we can use the element's direct styles for staggering, 
        // which we added inline. Otherwise fallback to the old calculation if no inline delay.
        if (!e.target.style.transitionDelay) {
          const delay = Array.from(e.target.parentElement.children).indexOf(e.target) * 80;
          setTimeout(() => e.target.classList.add('in-view'), delay);
        } else {
          e.target.classList.add('in-view');
        }
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));

  // Heading Underline Reveal
  const titles = document.querySelectorAll('.section-title');
  const titleObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active-underline');
      }
    });
  }, { threshold: 0.5 });
  titles.forEach(t => titleObs.observe(t));
})();

/* ─── ANIMATED COUNTERS ──────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const end = parseInt(el.dataset.count, 10);
        const sfx = el.dataset.suffix || '';
        let start = 0;
        const dur = 1800;
        const step = dur / 60;

        const timer = setInterval(() => {
          start += end / (dur / step);
          if (start >= end) {
            el.textContent = end.toLocaleString() + sfx;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(start).toLocaleString() + sfx;
          }
        }, step);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();

/* ─── 3D TILT ────────────────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * 8;
      const rotY = dx * 8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
      card.style.boxShadow = `${-dx * 8}px ${-dy * 8}px 30px rgba(0,245,255,0.2), 0 0 40px rgba(138,43,226,0.15)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();

/* ─── MAGNETIC BUTTONS ───────────────────────────────────── */
(function initMagnetic() {
  const btns = document.querySelectorAll('.magnetic');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // Ripple effect
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        width: 8px; height: 8px;
        left: ${e.clientX - rect.left - 4}px;
        top:  ${e.clientY - rect.top - 4}px;
        transform: scale(0);
        animation: ripple 0.5s ease-out forwards;
        pointer-events: none;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to { transform: scale(30); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ─── CERTIFICATIONS (Interactive) ───────────────────────── */
(function initCertifications() {
  const grid = document.getElementById('certs-grid');
  if (!grid) return;

  // ── Certificate Data ──────────────────────────────────────
  const certs = [
    {
      title: 'Data Analysis and Visualization with Python',
      desc: 'Data analysis using Python, visualization techniques, working with datasets to extract insights, and utilizing analytical libraries.',
      platform: 'Coursera',
      badge: 'COURSERA',
      badgeClass: 'badge-coursera',
      date: 'Mar 2026',
      skills: ['Data Analysis', 'Python', 'Coursera'],
      link: 'https://coursera.org/share/48b8ca70c3ba5e6d628dd3006a816bc8',
      image: 'coursera (2).png',
      imgGradient: 'linear-gradient(135deg,#0056D2,#002040)',
      imgAccent: 'rgba(0,86,210,0.35)'
    },
    {
      title: 'Getting Started with AI',
      desc: 'Foundational concepts of artificial intelligence, machine learning workflows, and IBM Watson tools.',
      platform: 'IBM Skillsbuild',
      badge: 'IBM',
      badgeClass: 'badge-ibm',
      date: 'Jul 2025',
      skills: ['AI Fundamentals', 'Machine Learning', 'IBM Watson', 'NLP'],
      link: 'https://drive.google.com/file/d/1kc2frho_VV26U9gVfbleWo5QY53GzlAc/view',
      image: '1.png',
      imgGradient: 'linear-gradient(135deg,#050520,#1a0550)',
      imgAccent: 'rgba(96,165,250,0.35)'
    },
    {
      title: 'DBMS for Science Graduates',
      desc: 'Relational database design, SQL querying, normalization and ER modelling.',
      platform: 'Infosys Springboard',
      badge: 'INFOSYS',
      badgeClass: 'badge-infosys',
      date: 'Jun 2025',
      skills: ['SQL', 'Database Design', 'ER Diagrams', 'Normalization'],
      link: 'https://drive.google.com/file/d/1e75p9wBHiKU8mvRd6keJwAZ0XIGrx_o_/view?usp=sharing',
      image: '2.png',
      imgGradient: 'linear-gradient(135deg,#000d2e,#002060)',
      imgAccent: 'rgba(56,189,248,0.35)'
    },
    {
      title: 'Python Essential 1',
      desc: 'Core Python programming: data types, control flow, functions, and object-oriented concepts.',
      platform: 'Cisco Networking Academy',
      badge: 'CISCO',
      badgeClass: 'badge-cisco',
      date: 'Jun 2025',
      skills: ['Python', 'OOP', 'Control Flow', 'Functions'],
      link: 'https://drive.google.com/file/d/1vB9eOH7Tib0Ri5SZt47gOsEe0xzihMQi/view?usp=sharing',
      image: '3.png',
      imgGradient: 'linear-gradient(135deg,#021520,#03385a)',
      imgAccent: 'rgba(125,211,252,0.35)'
    },
    {
      title: 'Power BI for Business Professionals',
      desc: 'Building interactive dashboards, data modelling with DAX, and business intelligence reporting.',
      platform: 'Infosys Springboard',
      badge: 'INFOSYS',
      badgeClass: 'badge-infosys',
      date: 'Jun 2025',
      skills: ['Power BI', 'DAX', 'Data Modeling', 'Dashboards'],
      link: 'https://drive.google.com/file/d/16RNacGQUPlBsCKkc9Cj0WncfT--u8GZ7/view?usp=sharing',
      image: '4.png',
      imgGradient: 'linear-gradient(135deg,#000d2e,#001840)',
      imgAccent: 'rgba(56,189,248,0.4)'
    },
    {
      title: 'Privacy and Security in Online Social Media',
      desc: 'Cybersecurity principles, privacy laws, social engineering threats and mitigation strategies.',
      platform: 'NPTEL',
      badge: 'NPTEL',
      badgeClass: 'badge-nptel',
      date: 'Apr 2025',
      skills: ['Cybersecurity', 'Privacy Laws', 'Security Threats', 'Risk Mitigation'],
      link: 'https://drive.google.com/file/d/1VAz4MQjl1rn5bQAJ43FuTYn-5w-Jnf_a/view?usp=sharing',
      image: '5.png',
      imgGradient: 'linear-gradient(135deg,#1a0000,#4a0000)',
      imgAccent: 'rgba(248,113,113,0.35)'
    },
    {
      title: 'Python for Data Science',
      desc: 'Data analysis using Pandas, NumPy, and Matplotlib for scientific computing and visualisation.',
      platform: 'IBM Skillsbuild',
      badge: 'IBM',
      badgeClass: 'badge-ibm',
      date: 'Apr 2024',
      skills: ['Pandas', 'NumPy', 'Matplotlib', 'Data Wrangling'],
      link: 'https://drive.google.com/file/d/1jGrKte3jfHTjRAq0UfQjpNDjrWsYOTv-/view?usp=sharing',
      image: '6.png',
      imgGradient: 'linear-gradient(135deg,#050520,#1a0550)',
      imgAccent: 'rgba(167,139,250,0.4)'
    },
    {
      title: 'Responsive Web Design Developer Certification',
      desc: 'Modern HTML5, CSS Grid, Flexbox and accessibility principles for cross-device web layouts.',
      platform: 'Free Code Camp',
      badge: 'FCC',
      badgeClass: 'badge-fcc',
      date: 'Nov 2023',
      skills: ['HTML5', 'CSS Grid', 'Flexbox', 'Accessibility'],
      link: 'https://drive.google.com/file/d/1TTgTLQ0JyfF30LSFiCpyQWFz218JHFlI/view?usp=sharing',
      image: '7.png',
      imgGradient: 'linear-gradient(135deg,#000e00,#003000)',
      imgAccent: 'rgba(74,222,128,0.35)'
    }
  ];

  // ── Build Cards ───────────────────────────────────────────
  certs.forEach((cert, idx) => {
    const item = document.createElement('div');
    item.className = 'cert-item';
    item.style.transitionDelay = `${idx * 0.07}s`;

    item.innerHTML = `
      <div class="cert-inner">
        <div class="cert-img-wrap">
          ${cert.image ?
        `<img src="${cert.image}" alt="${cert.title}" class="cert-actual-img">` :
        `<div style="
              width:100%;height:100%;
              background:${cert.imgGradient};
              background-image:radial-gradient(circle at 30% 50%,${cert.imgAccent} 0%,transparent 60%),
                radial-gradient(circle at 75% 30%,rgba(138,43,226,0.2) 0%,transparent 50%),
                ${cert.imgGradient};
            "></div>`
      }
          <div class="cert-img-overlay">
            <button class="cert-hover-view-btn">View Certificate</button>
          </div>
          <span class="cert-provider-badge ${cert.badgeClass}">${cert.badge}</span>
        </div>
        <div class="cert-body">
          <h3 class="cert-course">${cert.title}</h3>
          <p class="cert-desc-short">${cert.desc}</p>
          <div class="cert-meta">
            <span class="cert-platform">${cert.platform}</span>
            <span class="cert-date">${cert.date}</span>
          </div>
        </div>
      </div>
    `;

    // ── Modal Logic ──────────────────────────────────────────
    const modal = document.getElementById('cert-modal-overlay');
    const modalImg = document.getElementById('modal-cert-img');
    const modalTitle = document.getElementById('modal-cert-title');
    const modalOrg = document.getElementById('modal-cert-org');
    const modalDate = document.getElementById('modal-cert-date');

    const openModal = () => {
      modalImg.src = cert.image || '';
      modalTitle.textContent = cert.title;
      modalOrg.textContent = cert.platform;
      modalDate.textContent = cert.date;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    // "View Certificate" hover button opens modal
    const viewBtn = item.querySelector('.cert-hover-view-btn');
    viewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal();
    });

    // Clicking the card also opens the modal
    item.addEventListener('click', (e) => {
      if (e.target.closest('.cert-hover-view-btn')) return;
      openModal();
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });

    grid.appendChild(item);
  });

  // ── Global Modal Close Logic ──────────────────────────────
  const modalOverlay = document.getElementById('cert-modal-overlay');
  const closeModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  const closeBtn = document.getElementById('cert-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // ── Scroll Reveal via IntersectionObserver ────────────────
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('cert-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  grid.querySelectorAll('.cert-item').forEach(el => io.observe(el));

  // ── Drag-to-Scroll Logic ──────────────────────────────────
  let isDown = false;
  let startX;
  let scrollLeft;

  grid.addEventListener('mousedown', (e) => {
    isDown = true;
    grid.classList.add('active');
    startX = e.pageX - grid.offsetLeft;
    scrollLeft = grid.scrollLeft;
    grid.style.scrollSnapType = 'none'; // Disable snap during drag
  });

  grid.addEventListener('mouseleave', () => {
    isDown = false;
    grid.style.scrollSnapType = 'x mandatory';
  });

  grid.addEventListener('mouseup', () => {
    isDown = false;
    grid.style.scrollSnapType = 'x mandatory';
  });

  grid.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - grid.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed
    grid.scrollLeft = scrollLeft - walk;
  });

  // ── Button Navigation ─────────────────────────────────────
  const prevBtn = document.getElementById('cert-prev');
  const nextBtn = document.getElementById('cert-next');

  if (prevBtn && nextBtn) {
    const scrollAmount = 384; // Card width (360) + gap (24)

    prevBtn.addEventListener('click', () => {
      grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Optional: Hide/Disable buttons at ends
    grid.addEventListener('scroll', () => {
      const isAtStart = grid.scrollLeft <= 0;
      const isAtEnd = grid.scrollLeft + grid.offsetWidth >= grid.scrollWidth - 5;

      prevBtn.style.opacity = isAtStart ? '0.3' : '1';
      prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';

      nextBtn.style.opacity = isAtEnd ? '0.3' : '1';
      nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
    }, { passive: true });

    // Initial check
    prevBtn.style.opacity = '0.3';
    prevBtn.style.pointerEvents = 'none';
  }
})();



/* ─── GITHUB CONTRIBUTION GRID ───────────────────────────── */
(function initGithubGrid() {
  const grid = document.getElementById('contrib-grid');
  if (!grid) return;

  for (let i = 0; i < 52 * 7; i++) {
    const cell = document.createElement('div');
    const r = Math.random();
    const level = r < 0.55 ? 0 : r < 0.70 ? 1 : r < 0.83 ? 2 : r < 0.93 ? 3 : 4;
    cell.classList.add('contrib-cell', `contrib-${level}`);
    // Randomize neon color per active cell for multicolor effect
    if (level > 0) {
      const neonColors = [
        `rgba(0,245,255,${0.2 * level})`,
        `rgba(138,43,226,${0.2 * level})`,
        `rgba(255,46,209,${0.2 * level})`,
        `rgba(34,211,238,${0.2 * level})`
      ];
      cell.style.background = neonColors[Math.floor(Math.random() * neonColors.length)];
      if (level === 4) cell.style.boxShadow = '0 0 6px rgba(0,245,255,0.5)';
    }
    grid.appendChild(cell);
  }
})();

/* ─── CONTACT FORM ───────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('submit-btn');
  if (!form || !btn) return;

  // Initialize EmailJS with your Public Key
  // emailjs.init("YOUR_PUBLIC_KEY"); 

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Check if EmailJS is initialized
    // If you haven't provided the keys, this will show an alert
    const publicKey = "btEkk328TCyzXADBH"; // REPLACE WITH YOUR PUBLIC KEY
    const serviceId = "service_k9l2eoe"; // REPLACE WITH YOUR SERVICE ID
    const templateId = "template_ol7jjao"; // REPLACE WITH YOUR TEMPLATE ID

    if (publicKey === "YOUR_PUBLIC_KEY") {
      alert("Please configure your EmailJS IDs in script.js to make the form work!");
      return;
    }

    const label = btn.querySelector('.btn-label');
    const origText = label.textContent;
    label.textContent = 'Sending...';
    btn.disabled = true;

    emailjs.sendForm(serviceId, templateId, form, publicKey)
      .then(() => {
        label.textContent = '✅ Message Sent!';
        setTimeout(() => {
          label.textContent = origText;
          btn.disabled = false;
          form.reset();
        }, 2500);
      }, (error) => {
        console.error('EmailJS Error:', error);
        label.textContent = '❌ Failed to Send';
        setTimeout(() => {
          label.textContent = origText;
          btn.disabled = false;
        }, 2500);
      });
  });
})();

/* ─── PARALLAX HERO ORBS ─────────────────────────────────── */
(function initParallax() {
  const orbs = document.querySelectorAll('.hero-orb');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.12;
      orb.style.transform = `translateY(${sy * speed}px)`;
    });
  }, { passive: true });
})();

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
/* ─── ALGORITHMIC BACKGROUND (TRAINING) ──────────────────── */
(function initAlgoBackground() {
  const canvas = document.getElementById('algo-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = canvas.offsetWidth;
  let H = canvas.height = canvas.offsetHeight;

  const nodes = [];
  const nodeCount = 40;

  class Node {
    constructor() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(138, 43, 226, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < nodeCount; i++) nodes.push(new Node());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    nodes.forEach(n => {
      n.update();
      n.draw();
    });

    // Draw connections
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  });
})();

/* ─── TRAINING CONTENT (Compact + Modal) ─────────────────── */
(function initTrainingContent() {
  const grid = document.getElementById('training-grid');
  const modal = document.getElementById('training-modal');
  const body = document.getElementById('modal-body');
  const close = document.getElementById('modal-close');
  const bdrop = document.getElementById('modal-backdrop');
  if (!grid || !modal || !body) return;

  const trainingData = [
    {
      title: 'Mastering DSA',
      org: 'Centre for Professional Enhancement, LPU',
      date: 'Jun 2025 – Jul 2025',
      shortDesc: 'Attended a structured skill development program focused on mastering advanced concepts of Data Structures and Algorithms.',
      fullDesc: 'Attended a structured skill development program focused on mastering advanced concepts of Data Structures and Algorithms. Gained hands-on experience in optimizing problem solving techniques and improving algorithmic efficiency.',
      tech: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs', 'Sorting', 'Searching', 'Algorithm Optimization'],
      certImg: 'training.png'
    }
  ];

  function renderGrid() {
    grid.innerHTML = trainingData.map((item, idx) => `
      <div class="training-card-compact glass-card reveal-scale" style="transition-delay: ${idx * 0.15}s">
        <div class="training-card-inner">
          <div class="training-cert-preview clickable-cert" data-index="${idx}">
            <img src="${item.certImg}" alt="${item.title}" class="training-preview-img" style="animation: floatAnim 4s ease-in-out infinite;">
            <div class="training-img-overlay">
              <span>View Certificate</span>
            </div>
          </div>
          <div class="training-details">
            <div class="training-header">
              <div class="training-title-wrap">
                <h3 class="highlight-cyan">${item.title}</h3>
                <p class="training-org-name">${item.org}</p>
              </div>
              <div class="training-meta-info">
                <span class="cert-type-badge">Certificate</span>
                <span class="training-duration">${item.date}</span>
              </div>
            </div>
            <div class="training-summary">
              <p>${item.shortDesc}</p>
            </div>
            <button class="view-details-btn-new magnetic" data-index="${idx}">View Details</button>
          </div>
        </div>
      </div>
    `).join('');

    // Re-run reveal observer
    const revealEls = grid.querySelectorAll('.reveal-scale');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in-view');
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));

    // Add click listeners to both visual elements and buttons
    grid.querySelectorAll('.clickable-cert, .view-details-btn-new').forEach(el => {
      el.addEventListener('click', () => openModal(el.dataset.index));
    });
  }

  function openModal(index) {
    const item = trainingData[index];
    body.innerHTML = `
      <div class="modal-body-content">
        <div class="modal-cert-full-wrap">
          <img src="${item.certImg}" alt="Certificate" class="modal-full-img">
        </div>
        
        <div class="modal-text-content">
          <div class="training-header">
            <div class="training-title-wrap">
              <h3>${item.title}</h3>
              <p class="training-org">${item.org}</p>
            </div>
            <div class="training-meta">
              <span class="cert-label">Certificate</span>
              <span class="training-date">${item.date}</span>
            </div>
          </div>

          <div class="training-about">
            <h4>About the Program</h4>
            <p>${item.fullDesc}</p>
          </div>

          <div class="training-tech">
            <h4>Technologies Learned</h4>
            <div class="tech-tags-grid">
              ${item.tech.map(t => `<span class="tech-tag-item">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  close.addEventListener('click', closeModal);
  bdrop.addEventListener('click', closeModal);

  // Close on Escape
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  renderGrid();
})();

// Cursor hoverables are now handled globally by delegate in initCursor

/* ─── PROJECTS DRAG-TO-SCROLL ───────────────────────────── */
(function initProjectDragScroll() {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  grid.addEventListener('mousedown', (e) => {
    isDown = true;
    grid.classList.add('active');
    startX = e.pageX - grid.offsetLeft;
    scrollLeft = grid.scrollLeft;
    grid.style.scrollBehavior = 'auto';
  });

  grid.addEventListener('mouseleave', () => {
    isDown = false;
    grid.classList.remove('active');
  });

  grid.addEventListener('mouseup', () => {
    isDown = false;
    grid.classList.remove('active');
    grid.style.scrollBehavior = 'smooth';
  });

  grid.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - grid.offsetLeft;
    const walk = (x - startX) * 2;
    grid.scrollLeft = scrollLeft - walk;
  });

  grid.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });
})();

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
