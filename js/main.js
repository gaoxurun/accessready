/* ============================================================
   CampusAble — Interactive Behaviors (Artistic Edition)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ==========================================
  // Navigation scroll effect
  // ==========================================
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = function() {
      if (window.scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ==========================================
  // Fade-in on scroll (IntersectionObserver)
  // ==========================================
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if (fadeElements.length && 'IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(function(el, index) {
      // Stagger the animations slightly
      el.style.transitionDelay = (index % 6) * 80 + 'ms';
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    fadeElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // ==========================================
  // Feature card expand/collapse
  // ==========================================
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(function(card) {
    const expandBtn = card.querySelector('.feature-expand');
    if (expandBtn) {
      expandBtn.addEventListener('click', function(e) {
        e.preventDefault();
        card.classList.toggle('expanded');
        const text = expandBtn.querySelector('span');
        if (text) {
          if (card.classList.contains('expanded')) {
            text.textContent = 'Show less';
          } else {
            text.textContent = 'Learn more';
          }
        }
      });
    }
  });

  // ==========================================
  // Smooth scroll for anchor links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = 90;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // Animated counter for stats
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 2200;
          const startTime = performance.now();

          function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutCubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }
          requestAnimationFrame(animate);
          statsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    statNumbers.forEach(function(el) {
      statsObserver.observe(el);
    });
  }

  // ==========================================
  // Parallax effect for hero backgrounds
  // ==========================================
  const heroBgImg = document.querySelector('.hero-bg img, .page-hero-bg img');
  if (heroBgImg && window.innerWidth > 768) {
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const scrolled = window.pageYOffset;
          const heroSection = heroBgImg.closest('.hero, .page-hero');
          if (heroSection) {
            const heroHeight = heroSection.offsetHeight;
            if (scrolled < heroHeight) {
              heroBgImg.style.transform = 'translateY(' + (scrolled * 0.25) + 'px) scale(1.05)';
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ==========================================
  // Magnetic button effect (subtle)
  // ==========================================
  const buttons = document.querySelectorAll('.btn-primary, .nav-cta');
  buttons.forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.08) + 'px, ' + (y * 0.1 - 3) + 'px)';
    });
    btn.addEventListener('mouseleave', function() {
      btn.style.transform = '';
    });
  });

  // ==========================================
  // Image reveal on hover (subtle zoom)
  // ==========================================
  const colImages = document.querySelectorAll('.col-image');
  colImages.forEach(function(img) {
    img.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

  // ==========================================
  // Smooth page load transition
  // ==========================================
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease-out';
  window.addEventListener('load', function() {
    requestAnimationFrame(function() {
      document.body.style.opacity = '1';
    });
  });

  // ==========================================
  // Cursor follower for hero (desktop only)
  // ==========================================
  const hero = document.querySelector('.hero');
  if (hero && window.innerWidth > 1024) {
    const heroContent = hero.querySelector('.hero-content');
    if (heroContent) {
      hero.addEventListener('mousemove', function(e) {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroContent.style.transform = 'translate(' + (x * 10) + 'px, ' + (y * 10) + 'px)';
      });
      hero.addEventListener('mouseleave', function() {
        heroContent.style.transform = '';
      });
      heroContent.style.transition = 'transform 0.3s ease-out';
    }
  }

});
