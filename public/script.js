// ===== NAVBAR SCROLL BEHAVIOR =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.navbar__link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Toggle scrolled class
  navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);

  // Update active nav link based on scroll position
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

// Create overlay element
const navOverlay = document.createElement('div');
navOverlay.classList.add('nav-overlay');
document.body.appendChild(navOverlay);

function toggleMenu() {
  const isOpen = hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
  navOverlay.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);
navOverlay.addEventListener('click', toggleMenu);

// Close menu on link click
navLinksContainer.querySelectorAll('.navbar__link').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinksContainer.classList.contains('open')) {
      toggleMenu();
    }
  });
});

// ===== PARALLAX HERO =====
const heroBg = document.querySelector('.hero__bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
  }, { passive: true });
}

// ===== SCROLL ANIMATIONS =====
const animatedElements = document.querySelectorAll('[data-animate]');

const observerCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay * 200);
    }
  });
};

const observer = new IntersectionObserver(observerCallback, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

animatedElements.forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
const statNumbers = document.querySelectorAll('.stat__number[data-target]');
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  statNumbers.forEach(stat => {
    const target = parseInt(stat.dataset.target);
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (target === 100) {
        stat.textContent = current + '٪';
      } else {
        stat.textContent = '+' + current.toLocaleString('ar-EG');
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

const statsSection = document.querySelector('.about__stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  }, { threshold: 0.3 });
  statsObserver.observe(statsSection);
}

// ===== PROCESS LINE FILL =====
const processLine = document.getElementById('processLineFill');
if (processLine) {
  const processSection = document.getElementById('process');
  window.addEventListener('scroll', () => {
    const rect = processSection.getBoundingClientRect();
    const sectionHeight = rect.height;
    const scrolled = window.innerHeight - rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
    processLine.style.width = (progress * 100) + '%';
  }, { passive: true });
}

// ===== PORTFOLIO FILTER =====
const filterButtons = document.querySelectorAll('.portfolio__filter');
const portfolioItems = document.querySelectorAll('.portfolio__item');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    portfolioItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.hidden = false;
      } else {
        item.hidden = true;
      }
    });
  });
});

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let currentLightboxIndex = 0;
let visibleItems = [];

function getVisibleItems() {
  return Array.from(portfolioItems).filter(item => !item.hidden);
}

function openLightbox(index) {
  visibleItems = getVisibleItems();
  currentLightboxIndex = index;
  const img = visibleItems[index].querySelector('img');
  lightboxImg.src = img.src.replace('w=600', 'w=1200');
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  visibleItems = getVisibleItems();
  currentLightboxIndex = (currentLightboxIndex + direction + visibleItems.length) % visibleItems.length;
  const img = visibleItems[currentLightboxIndex].querySelector('img');
  lightboxImg.src = img.src.replace('w=600', 'w=1200');
  lightboxImg.alt = img.alt;
}

portfolioItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    const visibleIndex = getVisibleItems().indexOf(item);
    openLightbox(visibleIndex);
  });
});

document.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox__prev').addEventListener('click', () => navigateLightbox(-1));
document.querySelector('.lightbox__next').addEventListener('click', () => navigateLightbox(1));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') navigateLightbox(-1); // RTL
  if (e.key === 'ArrowLeft') navigateLightbox(1);  // RTL
});

// ===== TESTIMONIALS CAROUSEL =====
const track = document.getElementById('testimonialsTrack');
const dots = document.querySelectorAll('.testimonials__dot');
const prevBtn = document.getElementById('testimonialPrev');
const nextBtn = document.getElementById('testimonialNext');
let currentSlide = 0;
const totalSlides = dots.length;
let autoPlayInterval;

function goToSlide(index) {
  currentSlide = (index + totalSlides) % totalSlides;
  // RTL: positive translateX to go forward
  track.style.transform = `translateX(${currentSlide * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentSlide].classList.add('active');
}

function startAutoPlay() {
  autoPlayInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

function resetAutoPlay() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

prevBtn.addEventListener('click', () => {
  goToSlide(currentSlide - 1);
  resetAutoPlay();
});

nextBtn.addEventListener('click', () => {
  goToSlide(currentSlide + 1);
  resetAutoPlay();
});

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index));
    resetAutoPlay();
  });
});

startAutoPlay();

// ===== CONTACT FORM → WHATSAPP =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  let whatsappMessage = `مرحباً، أنا ${name}`;
  whatsappMessage += `\nرقم الهاتف: ${phone}`;
  whatsappMessage += `\nنوع الخدمة: ${service}`;
  if (message) {
    whatsappMessage += `\nالتفاصيل: ${message}`;
  }

  const encoded = encodeURIComponent(whatsappMessage);
  window.open(`https://wa.me/963966667043?text=${encoded}`, '_blank');
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.offsetTop - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});
