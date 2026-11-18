/* ============================================================
   CampusAble — WOW Effects (Dynamic, Cinematic, Premium)
   ============================================================ */

(function() {
  'use strict';

  // ==========================================
  // 1. SCROLL PROGRESS BAR
  // ==========================================
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    function updateProgress() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ==========================================
  // 2. CUSTOM CURSOR — glow + dot
  // ==========================================
  function initCustomCursor() {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.innerWidth < 1024) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(glow);
    document.body.appendChild(dot);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Smooth follow for glow
    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // Hover state for interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .feature-card, .team-card, .audience-card, .step-item, .dashboard-card, .tilt-card'
    );
    hoverTargets.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        dot.classList.add('hover');
      });
      el.addEventListener('mouseleave', function() {
        dot.classList.remove('hover');
      });
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', function() {
      glow.style.opacity = '0';
      dot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function() {
      glow.style.opacity = '1';
      dot.style.opacity = '1';
    });
  }

  // ==========================================
  // 3. PARTICLE SYSTEM (for hero sections)
  // ==========================================
  function initParticles() {
    const canvases = document.querySelectorAll('.particles-canvas');
    if (!canvases.length) return;

    canvases.forEach(function(canvas) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      let width, height;
      let animationId;
      let mouseX = -1000;
      let mouseY = -1000;

      function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
      }

      function createParticles() {
        particles = [];
        const count = Math.min(Math.floor(width * height / 15000), 80);
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? '139, 168, 140' : '212, 165, 116'
          });
        }
      }

      function draw() {
        ctx.clearRect(0, 0, width, height);

        // Draw particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + p.color + ', ' + p.opacity + ')';
          ctx.fill();

          // Draw connecting lines
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = 'rgba(139, 168, 140, ' + (0.15 * (1 - dist / 120)) + ')';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }

          // Mouse interaction
          const mdx = p.x - mouseX;
          const mdy = p.y - mouseY;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 150) {
            const force = (150 - mdist) / 150;
            p.x += (mdx / mdist) * force * 0.5;
            p.y += (mdy / mdist) * force * 0.5;
          }

          // Move
          p.x += p.speedX;
          p.y += p.speedY;

          // Wrap around
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        animationId = requestAnimationFrame(draw);
      }

      canvas.parentElement.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });

      canvas.parentElement.addEventListener('mouseleave', function() {
        mouseX = -1000;
        mouseY = -1000;
      });

      resize();
      createParticles();
      draw();

      window.addEventListener('resize', function() {
        resize();
        createParticles();
      });

      // Pause when not visible
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              if (!animationId) draw();
            } else {
              cancelAnimationFrame(animationId);
              animationId = null;
            }
          });
        }, { threshold: 0 });
        io.observe(canvas);
      }
    });
  }

  // ==========================================
  // 4. 3D CARD TILT EFFECT
  // ==========================================
  function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    if (!cards.length || window.innerWidth < 768) return;

    cards.forEach(function(card) {
      let rafId;

      card.addEventListener('mousemove', function(e) {
        if (rafId) return;
        rafId = requestAnimationFrame(function() {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -8;
          const rotateY = ((x - centerX) / centerX) * 8;

          card.style.transform =
            'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';

          // Move shine layer
          const shine = card.querySelector('.tilt-shine');
          if (shine) {
            const shineX = (x / rect.width) * 100;
            const shineY = (y / rect.height) * 100;
            shine.style.background =
              'radial-gradient(circle at ' + shineX + '% ' + shineY + '%, rgba(255,255,255,0.15) 0%, transparent 50%)';
          }

          rafId = null;
        });
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        const shine = card.querySelector('.tilt-shine');
        if (shine) {
          shine.style.background = '';
        }
      });
    });
  }

  // ==========================================
  // 5. TEXT REVEAL — per character animation
  // ==========================================
  function initTextReveal() {
    const elements = document.querySelectorAll('.text-reveal');
    if (!elements.length) return;

    elements.forEach(function(el) {
      const text = el.textContent;
      el.innerHTML = '';
      for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        span.style.transitionDelay = (i * 0.03) + 's';
        el.appendChild(span);
      }
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      elements.forEach(function(el) {
        observer.observe(el);
      });
    } else {
      elements.forEach(function(el) {
        el.classList.add('visible');
      });
    }
  }

  // ==========================================
  // 6. MAGNETIC ELEMENTS (enhanced)
  // ==========================================
  function initMagnetic() {
    const magnets = document.querySelectorAll('.magnetic');
    if (!magnets.length || window.innerWidth < 768) return;

    magnets.forEach(function(el) {
      el.addEventListener('mousemove', function(e) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.2) + 'px)';
      });
      el.addEventListener('mouseleave', function() {
        el.style.transform = '';
      });
    });
  }

  // ==========================================
  // 7. PARALLAX IMAGES (multi-layer)
  // ==========================================
  function initParallaxImages() {
    const parallaxEls = document.querySelectorAll('.parallax-element');
    if (!parallaxEls.length || window.innerWidth < 768) return;

    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          const scrollY = window.pageYOffset;
          parallaxEls.forEach(function(el) {
            const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.2;
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const relative = scrollY - elementTop + window.innerHeight;
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              el.style.transform = 'translateY(' + (relative * speed * -0.3) + 'px)';
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ==========================================
  // 8. COUNTER ANIMATION (enhanced with glow)
  // ==========================================
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });

      counters.forEach(function(c) { observer.observe(c); });
    }
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2500;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = Math.floor(target * eased);
      el.textContent = val.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ==========================================
  // 9. MORPHING SHAPE — random positions
  // ==========================================
  function initMorphShapes() {
    const shapes = document.querySelectorAll('.morph-shape');
    shapes.forEach(function(shape, i) {
      shape.style.animationDelay = (i * 2) + 's';
      shape.style.animationDuration = (8 + i * 2) + 's';
    });
  }

  // ==========================================
  // 10. NAV — active link highlighting on scroll
  // ==========================================
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    function onScroll() {
      const scrollY = window.pageYOffset + 150;
      sections.forEach(function(section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector('.nav-links a[href="#' + id + '"]');
        if (!link) return;
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ==========================================
  // 11. AUDIO PLAYER — Playback, Progress, Volume
  // ==========================================
  function initAudioPlayer() {
    // Find the active audio player (hero player on index, floating widget on inner pages)
    const heroPlayer = document.getElementById('heroAudioPlayer');
    const floatingWidget = document.getElementById('floatingAudioWidget');

    // Determine which player element to use as the active one
    let playerContainer = heroPlayer || floatingWidget;
    if (!playerContainer) return;

    const audio = playerContainer.querySelector('.audio-source');
    const playBtn = playerContainer.querySelector('.audio-play-btn');
    const progressBar = playerContainer.querySelector('.audio-progress');
    const progressFill = playerContainer.querySelector('.audio-progress-fill');
    const progressThumb = playerContainer.querySelector('.audio-progress-thumb');
    const currentTimeEl = playerContainer.querySelector('.audio-current');
    const durationTimeEl = playerContainer.querySelector('.audio-duration');
    const volumeBtn = playerContainer.querySelector('.audio-volume-btn');
    const volumeSlider = playerContainer.querySelector('.audio-volume-slider');
    const volumeFill = playerContainer.querySelector('.audio-volume-fill');
    const volumeThumb = playerContainer.querySelector('.audio-volume-thumb');

    if (!audio || !playBtn) return;

    let isDragging = false;
    let isVolumeDragging = false;

    // Format time helper
    function formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    // Play / Pause toggle
    function togglePlay() {
      if (audio.paused) {
        audio.play().catch(function(err) {
          console.log('Audio play failed:', err);
        });
      } else {
        audio.pause();
      }
    }

    playBtn.addEventListener('click', togglePlay);

    // Update play button state
    audio.addEventListener('play', function() {
      playBtn.classList.add('playing');
      playBtn.setAttribute('aria-label', 'Pause theme music');
    });

    audio.addEventListener('pause', function() {
      playBtn.classList.remove('playing');
      playBtn.setAttribute('aria-label', 'Play theme music');
    });

    // Load metadata to get duration
    audio.addEventListener('loadedmetadata', function() {
      durationTimeEl.textContent = formatTime(audio.duration);
    });

    // Update progress bar during playback
    audio.addEventListener('timeupdate', function() {
      if (isDragging) return;
      const percent = (audio.currentTime / audio.duration) * 100;
      if (!isNaN(percent)) {
        progressFill.style.width = percent + '%';
        progressThumb.style.left = percent + '%';
      }
      currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    // Seek functionality — click on progress bar
    function seekTo(event) {
      const rect = progressBar.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      if (!isNaN(audio.duration)) {
        audio.currentTime = percent * audio.duration;
        progressFill.style.width = (percent * 100) + '%';
        progressThumb.style.left = (percent * 100) + '%';
        currentTimeEl.textContent = formatTime(percent * audio.duration);
      }
    }

    progressBar.addEventListener('click', function(e) {
      seekTo(e);
    });

    // Drag progress bar
    progressBar.addEventListener('mousedown', function(e) {
      isDragging = true;
      seekTo(e);
    });

    document.addEventListener('mousemove', function(e) {
      if (isDragging) {
        seekTo(e);
      }
    });

    document.addEventListener('mouseup', function() {
      isDragging = false;
    });

    // Touch support for progress bar
    progressBar.addEventListener('touchstart', function(e) {
      isDragging = true;
      seekTo({ clientX: e.touches[0].clientX });
    }, { passive: true });

    progressBar.addEventListener('touchmove', function(e) {
      if (isDragging) {
        seekTo({ clientX: e.touches[0].clientX });
      }
    }, { passive: true });

    progressBar.addEventListener('touchend', function() {
      isDragging = false;
    });

    // Volume control
    let lastVolume = 0.7;
    audio.volume = lastVolume;

    function setVolume(percent) {
      percent = Math.max(0, Math.min(1, percent));
      audio.volume = percent;
      volumeFill.style.width = (percent * 100) + '%';
      volumeThumb.style.left = (percent * 100) + '%';

      // Update volume icon
      const icon = volumeBtn.querySelector('i');
      if (percent === 0) {
        icon.className = 'fas fa-volume-mute';
      } else if (percent < 0.5) {
        icon.className = 'fas fa-volume-down';
      } else {
        icon.className = 'fas fa-volume-up';
      }
    }

    // Mute toggle
    volumeBtn.addEventListener('click', function() {
      if (audio.volume > 0) {
        lastVolume = audio.volume;
        setVolume(0);
      } else {
        setVolume(lastVolume || 0.7);
      }
    });

    // Volume slider click
    function adjustVolume(event) {
      const rect = volumeSlider.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      setVolume(percent);
      if (percent > 0) lastVolume = percent;
    }

    volumeSlider.addEventListener('click', function(e) {
      adjustVolume(e);
    });

    // Drag volume slider
    volumeSlider.addEventListener('mousedown', function(e) {
      isVolumeDragging = true;
      adjustVolume(e);
    });

    document.addEventListener('mousemove', function(e) {
      if (isVolumeDragging) {
        adjustVolume(e);
      }
    });

    document.addEventListener('mouseup', function() {
      isVolumeDragging = false;
    });

    // Floating widget toggle (only for inner pages)
    if (floatingWidget) {
      const toggleBtn = floatingWidget.querySelector('.audio-widget-toggle');
      const widgetBody = floatingWidget.querySelector('.audio-widget-body');
      const minimizeBtn = floatingWidget.querySelector('.audio-widget-minimize');

      function openWidget() {
        widgetBody.classList.add('open');
        toggleBtn.classList.add('active');
      }

      function closeWidget() {
        widgetBody.classList.remove('open');
        toggleBtn.classList.remove('active');
      }

      toggleBtn.addEventListener('click', openWidget);
      if (minimizeBtn) {
        minimizeBtn.addEventListener('click', closeWidget);
      }
    }

    // Audio ended — reset play button
    audio.addEventListener('ended', function() {
      playBtn.classList.remove('playing');
      progressFill.style.width = '0%';
      progressThumb.style.left = '0%';
      currentTimeEl.textContent = '0:00';
    });
  }

  // ==========================================
  // INIT EVERYTHING
  // ==========================================
  function init() {
    initScrollProgress();
    initCustomCursor();
    initParticles();
    initTiltCards();
    initTextReveal();
    initMagnetic();
    initParallaxImages();
    initCounters();
    initMorphShapes();
    initScrollSpy();
    initAudioPlayer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
