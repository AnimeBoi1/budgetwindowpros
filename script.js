// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV TOGGLE =====
const mobileToggle = document.getElementById('mobileToggle');
const mainNav = document.getElementById('mainNav');

mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  mainNav.classList.toggle('active');
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileToggle.classList.remove('active');
    mainNav.classList.remove('active');
  });
});

// ===== HERO FLOATING PARTICLES =====
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    const size = Math.random() * 6 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.bottom = '-10px';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(particle);
  }
}

createParticles();

// ===== ANIMATED COUNTERS =====
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * eased);

    el.textContent = current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statElements = entry.target.querySelectorAll('.stat strong');
      statElements.forEach(stat => {
        const text = stat.textContent.trim();
        let target, suffix;

        if (text.includes('2,500')) {
          target = 2500;
          suffix = '+';
        } else if (text.includes('15')) {
          target = 15;
          suffix = '+';
        } else if (text.includes('98')) {
          target = 98;
          suffix = '%';
        }

        if (target) {
          stat.textContent = '0';
          animateCounter(stat, target, suffix);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== MULTI-STEP QUOTE FORM =====
const quoteForm = document.getElementById('quoteForm');
const formSuccess = document.getElementById('formSuccess');

function showStep(stepNumber) {
  document.querySelectorAll('.form-step').forEach(step => {
    step.classList.remove('active');
  });
  const target = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
  if (target) target.classList.add('active');
}

function validateStep(stepNumber) {
  const step = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
  const requiredFields = step.querySelectorAll('[required]');
  let valid = true;

  requiredFields.forEach(field => {
    const errorMsg = field.parentElement.querySelector('.error-msg');
    field.classList.remove('error');
    if (errorMsg) errorMsg.textContent = '';

    if (!field.value.trim()) {
      valid = false;
      field.classList.add('error');
      if (errorMsg) errorMsg.textContent = 'This field is required';
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      valid = false;
      field.classList.add('error');
      if (errorMsg) errorMsg.textContent = 'Please enter a valid email';
    } else if (field.type === 'tel' && field.value.trim().length < 7) {
      valid = false;
      field.classList.add('error');
      if (errorMsg) errorMsg.textContent = 'Please enter a valid phone number';
    }
  });

  return valid;
}

function nextStep(currentStep) {
  if (validateStep(currentStep)) {
    showStep(currentStep + 1);
  }
}

function prevStep(currentStep) {
  showStep(currentStep - 1);
}

quoteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = quoteForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  const formData = new FormData(quoteForm);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
      });
      formSuccess.classList.add('active');
      quoteForm.reset();
    } else {
      alert('Something went wrong. Please try again or call us at (801) 201-1418.');
    }
  } catch (error) {
    alert('Could not send your request. Please try again or call us at (801) 201-1418.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// ===== PHONE INPUT FORMATTING =====
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);

    if (value.length >= 7) {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length >= 4) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length >= 1) {
      value = `(${value}`;
    }

    e.target.value = value;
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// ===== SCROLL REVEAL ANIMATIONS =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add staggered delay for grid children
      const parent = entry.target.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          c => c.classList.contains('reveal') ||
               c.classList.contains('reveal-left') ||
               c.classList.contains('reveal-right')
        );
        const index = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.12}s`;
      }

      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
});

document.addEventListener('DOMContentLoaded', () => {
  // Service cards, benefit cards, process steps
  document.querySelectorAll(
    '.service-card, .benefit-card, .process-step'
  ).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Section headers
  document.querySelectorAll('.section-header').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // About section: image slides from left, content from right
  const aboutImage = document.querySelector('.about-image');
  const aboutContent = document.querySelector('.about-content');
  if (aboutImage) {
    aboutImage.classList.add('reveal-left');
    revealObserver.observe(aboutImage);
  }
  if (aboutContent) {
    aboutContent.classList.add('reveal-right');
    revealObserver.observe(aboutContent);
  }

  // Quote wrapper
  const quoteWrapper = document.querySelector('.quote-wrapper');
  if (quoteWrapper) {
    quoteWrapper.classList.add('reveal');
    revealObserver.observe(quoteWrapper);
  }

  // CTA content
  const ctaContent = document.querySelector('.cta-content');
  if (ctaContent) {
    ctaContent.classList.add('reveal');
    revealObserver.observe(ctaContent);
  }

  // Gallery items
  document.querySelectorAll('.gallery-item').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Comparison table
  const compTable = document.querySelector('.comparison-table-wrap');
  if (compTable) {
    compTable.classList.add('reveal');
    revealObserver.observe(compTable);
  }

  // Financing calculator
  const calcCard = document.querySelector('.calculator-card');
  if (calcCard) {
    calcCard.classList.add('reveal');
    revealObserver.observe(calcCard);
  }

  // FAQ items
  document.querySelectorAll('.faq-item').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Before/After slider
  const baSliderEl = document.querySelector('.ba-slider');
  if (baSliderEl) {
    baSliderEl.classList.add('reveal');
    revealObserver.observe(baSliderEl);
  }

  // Testimonials carousel wrapper
  const carouselWrapper = document.querySelector('.testimonials-carousel-wrapper');
  if (carouselWrapper) {
    carouselWrapper.classList.add('reveal');
    revealObserver.observe(carouselWrapper);
  }
});

// ===== BACK TO TOP BUTTON =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 600);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== SUBTLE PARALLAX ON HERO (mouse move) =====
const heroContent = document.querySelector('.hero-content');
const heroDecors = document.querySelectorAll('.hero-decor');

document.addEventListener('mousemove', (e) => {
  if (window.innerWidth < 768) return;

  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  heroDecors.forEach((decor, i) => {
    const speed = (i + 1) * 8;
    decor.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});

// ===== TILT EFFECT ON SERVICE CARDS =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-10px) perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== 1. SCROLL PROGRESS BAR =====
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  if (scrollProgress) scrollProgress.style.width = scrollPercent + '%';
});

// ===== 2. PRELOADER =====
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 1600);
  }
});

// ===== 3. BEFORE / AFTER SLIDER =====
const baSlider = document.getElementById('baSlider');
const baHandle = document.getElementById('baHandle');

if (baSlider && baHandle) {
  let isDragging = false;

  function updateSlider(x) {
    const rect = baSlider.getBoundingClientRect();
    let pos = ((x - rect.left) / rect.width) * 100;
    pos = Math.max(5, Math.min(95, pos));

    const beforeEl = baSlider.querySelector('.ba-before');
    beforeEl.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
    baHandle.style.left = pos + '%';
  }

  baSlider.addEventListener('mousedown', (e) => {
    isDragging = true;
    baSlider.classList.add('dragging');
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    baSlider.classList.remove('dragging');
  });

  // Touch support
  baSlider.addEventListener('touchstart', (e) => {
    isDragging = true;
    baSlider.classList.add('dragging');
    updateSlider(e.touches[0].clientX);
  });

  baSlider.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    updateSlider(e.touches[0].clientX);
  });

  baSlider.addEventListener('touchend', () => {
    isDragging = false;
    baSlider.classList.remove('dragging');
  });
}

// ===== 4. TESTIMONIAL CAROUSEL =====
const track = document.getElementById('testimonialsTrack');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
const dotsContainer = document.getElementById('carouselDots');

if (track && prevBtn && nextBtn && dotsContainer) {
  const cards = track.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  let cardsPerView = 3;
  let autoPlayInterval;

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getTotalPages() {
    return Math.max(1, cards.length - cardsPerView + 1);
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const total = getTotalPages();
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(index) {
    const total = getTotalPages();
    currentIndex = Math.max(0, Math.min(index, total - 1));
    const card = cards[0];
    const style = getComputedStyle(card);
    const cardWidth = card.offsetWidth + parseInt(style.marginRight || 0);
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    updateDots();
  }

  function next() { goTo(currentIndex + 1 >= getTotalPages() ? 0 : currentIndex + 1); }
  function prev() { goTo(currentIndex - 1 < 0 ? getTotalPages() - 1 : currentIndex - 1); }

  prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });
  nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });

  function startAutoPlay() {
    autoPlayInterval = setInterval(next, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  function handleResize() {
    cardsPerView = getCardsPerView();
    buildDots();
    goTo(Math.min(currentIndex, getTotalPages() - 1));
  }

  handleResize();
  startAutoPlay();
  window.addEventListener('resize', handleResize);
}

// ===== 5. BUTTON RIPPLE EFFECT =====
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// ===== 6. FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item.active').forEach(openItem => {
      openItem.classList.remove('active');
      openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it wasn't already open)
    if (!isOpen) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== 7. LAZY BLUR-UP IMAGES =====
function initLazyBlur() {
  const images = document.querySelectorAll('.service-img img, .ba-image img, .gallery-item img');
  images.forEach(img => {
    img.classList.add('lazy-blur');

    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    }
  });
}

initLazyBlur();

// ===== 8. STICKY MOBILE CTA =====
const mobileCta = document.getElementById('mobileCta');
if (mobileCta) {
  window.addEventListener('scroll', () => {
    mobileCta.classList.toggle('visible', window.scrollY > 500);
  });
}

// ===== 9. FINANCING CALCULATOR =====
const calcWindows = document.getElementById('calcWindows');
const calcType = document.getElementById('calcType');
const calcTerm = document.getElementById('calcTerm');
const calcAmount = document.getElementById('calcAmount');
const calcTotal = document.getElementById('calcTotal');
const calcWindowsVal = document.getElementById('calcWindowsVal');

function updateCalculator() {
  if (!calcWindows || !calcType || !calcTerm) return;

  const numWindows = parseInt(calcWindows.value);
  const pricePerWindow = parseInt(calcType.value);
  const months = parseInt(calcTerm.value);

  const total = numWindows * pricePerWindow;

  // APR rates by term
  const rates = { 24: 0, 48: 4.9, 60: 5.9, 84: 6.9 };
  const apr = rates[months] || 0;
  let monthly;

  if (apr === 0) {
    monthly = total / months;
  } else {
    const r = apr / 100 / 12;
    monthly = total * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  }

  if (calcAmount) calcAmount.textContent = '$' + Math.round(monthly);
  if (calcTotal) calcTotal.textContent = '$' + total.toLocaleString();
  if (calcWindowsVal) calcWindowsVal.textContent = numWindows + (numWindows === 1 ? ' window' : ' windows');
}

if (calcWindows) calcWindows.addEventListener('input', updateCalculator);
if (calcType) calcType.addEventListener('change', updateCalculator);
if (calcTerm) calcTerm.addEventListener('change', updateCalculator);
updateCalculator();

// ===== 11. LIVE CHAT BUBBLE =====
const chatBubble = document.getElementById('chatBubble');
const chatTrigger = document.getElementById('chatTrigger');
const chatCloseBtn = document.getElementById('chatClose');

if (chatBubble && chatTrigger) {
  chatTrigger.addEventListener('click', () => {
    chatBubble.classList.toggle('open');
  });

  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', () => {
      chatBubble.classList.remove('open');
    });
  }

  // Close chat when clicking a chat option with data-close-chat
  chatBubble.querySelectorAll('[data-close-chat]').forEach(opt => {
    opt.addEventListener('click', () => {
      chatBubble.classList.remove('open');
    });
  });

  // Toggle contact info box on "Call Us Now"
  const chatContactBtn = document.getElementById('chatContactBtn');
  const chatContactBox = document.getElementById('chatContactBox');
  if (chatContactBtn && chatContactBox) {
    chatContactBtn.addEventListener('click', () => {
      chatContactBox.classList.toggle('visible');
    });
  }
}

