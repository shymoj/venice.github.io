/* ==========================================================================
   VENICE TILE & MARBLE — INTERACTIVE SLIDER ENGINE
   Powers:
   1. Full-Collection Cinema Stage Slider + Synchronized Thumbnail Filmstrip
   2. Multi-Card Curated Spotlight Carousel Slider
   3. Homepage Hero Showcase Slider & Interactive Collection Tab Slider
   ========================================================================== */

(function () {
  'use strict';

  /**
   * Initialize the Gallery Page Dual-Slider System
   * @param {string} categoryKey - 'rare-precious-stone' | 'bathroom' | 'indoor' | 'outdoor' | 'kitchen'
   */
  window.initGalleryPageSlider = function (categoryKey) {
    const allSlides = (window.VENICE_GALLERIES && window.VENICE_GALLERIES[categoryKey]) || [];
    if (!allSlides.length) return;

    const featuredSlides = allSlides.filter((s) => s.featured);
    let activeList = allSlides;
    let currentIndex = 0;
    let isPlaying = false;
    let autoplayDuration = 4500;
    let progressTimer = null;
    let progressStart = 0;

    // DOM Elements
    const stageWrapper = document.getElementById('cinema-stage-wrapper');
    const mainImg = document.getElementById('cinema-main-img');
    const ambientBg = document.getElementById('cinema-ambient-bg');
    const counterPill = document.getElementById('cinema-counter-pill');
    const slideTitle = document.getElementById('cinema-slide-title');
    const slideSubtitle = document.getElementById('cinema-slide-subtitle');
    const prevBtn = document.getElementById('cinema-prev-btn');
    const nextBtn = document.getElementById('cinema-next-btn');
    const progressBar = document.getElementById('cinema-autoplay-progress');

    // Toolbar controls
    const filterAllBtn = document.getElementById('filter-all-btn');
    const filterFeaturedBtn = document.getElementById('filter-featured-btn');
    const playToggleBtn = document.getElementById('slider-play-btn');
    const speedSelect = document.getElementById('slider-speed-select');
    const fitToggleBtn = document.getElementById('slider-fit-btn');
    const fullscreenBtn = document.getElementById('slider-fullscreen-btn');

    // Scrubber & Quick Jump controls
    const rangeInput = document.getElementById('cinema-range-input');
    const scrubberText = document.getElementById('scrubber-pos-text');
    const stepFirstBtn = document.getElementById('step-first-btn');
    const stepBack10Btn = document.getElementById('step-back10-btn');
    const stepFwd10Btn = document.getElementById('step-fwd10-btn');
    const stepLastBtn = document.getElementById('step-last-btn');

    // Thumbnail Filmstrip
    const thumbStrip = document.getElementById('thumb-strip');
    const thumbLeftBtn = document.getElementById('thumb-scroll-left');
    const thumbRightBtn = document.getElementById('thumb-scroll-right');

    // Secondary Multi-Card Spotlight Slider
    const spotlightTrack = document.getElementById('spotlight-slider-track');
    const spotlightPrev = document.getElementById('spotlight-prev-btn');
    const spotlightNext = document.getElementById('spotlight-next-btn');

    // Populate filter counts
    if (filterAllBtn) {
      filterAllBtn.textContent = `All Slides (${allSlides.length})`;
    }
    if (filterFeaturedBtn) {
      if (featuredSlides.length > 0 && featuredSlides.length < allSlides.length) {
        filterFeaturedBtn.textContent = `Featured Highlights (${featuredSlides.length})`;
      } else {
        filterFeaturedBtn.style.display = 'none';
      }
    }

    function formatNum(n, total) {
      const digits = Math.max(2, String(total).length);
      return String(n).padStart(digits, '0');
    }

    // Build Thumbnail Filmstrip
    function renderThumbnails() {
      if (!thumbStrip) return;
      thumbStrip.innerHTML = '';
      const frag = document.createDocumentFragment();

      activeList.forEach((slide, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'thumb-item' + (idx === currentIndex ? ' active' : '');
        btn.setAttribute('aria-label', `Go to slide ${idx + 1}: ${slide.title}`);
        btn.dataset.index = idx;

        const img = document.createElement('img');
        img.src = `${slide.src}?format=300w`;
        img.alt = slide.title;
        img.loading = 'lazy';
        img.decoding = 'async';

        const badge = document.createElement('span');
        badge.className = 'thumb-index';
        badge.textContent = idx + 1;

        btn.appendChild(img);
        if (slide.featured) {
          const dot = document.createElement('span');
          dot.className = 'thumb-featured-dot';
          dot.title = 'Featured Highlight';
          btn.appendChild(dot);
        }
        btn.appendChild(badge);

        btn.addEventListener('click', () => {
          goToSlide(idx);
          resetAutoplayTimer();
        });

        frag.appendChild(btn);
      });

      thumbStrip.appendChild(frag);
      if (rangeInput) {
        rangeInput.max = Math.max(1, activeList.length);
        rangeInput.value = currentIndex + 1;
      }
    }

    // Center active thumbnail in filmstrip
    function syncThumbnailScroll() {
      if (!thumbStrip) return;
      const thumbs = thumbStrip.querySelectorAll('.thumb-item');
      thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === currentIndex);
      });
      const activeThumb = thumbs[currentIndex];
      if (activeThumb) {
        const stripRect = thumbStrip.getBoundingClientRect();
        const thumbRect = activeThumb.getBoundingClientRect();
        const offset =
          activeThumb.offsetLeft -
          thumbStrip.offsetLeft -
          stripRect.width / 2 +
          thumbRect.width / 2;
        thumbStrip.scrollTo({ left: offset, behavior: 'smooth' });
      }
    }

    // Preload adjacent high-res images
    function preloadAdjacent(idx) {
      const nextIdx = (idx + 1) % activeList.length;
      const prevIdx = (idx - 1 + activeList.length) % activeList.length;
      [nextIdx, prevIdx].forEach((i) => {
        const pre = new Image();
        pre.src = `${activeList[i].src}?format=1500w`;
      });
    }

    // Update Main Cinema Stage
    function goToSlide(idx) {
      if (!activeList.length) return;
      currentIndex = ((idx % activeList.length) + activeList.length) % activeList.length;
      const slide = activeList[currentIndex];

      if (mainImg) {
        mainImg.classList.add('switching');
        const targetSrc = `${slide.src}?format=1500w`;
        const loader = new Image();
        loader.onload = () => {
          mainImg.src = targetSrc;
          mainImg.alt = slide.title;
          mainImg.classList.remove('switching');
        };
        loader.onerror = () => {
          mainImg.src = slide.src;
          mainImg.classList.remove('switching');
        };
        loader.src = targetSrc;
      }

      if (ambientBg) {
        ambientBg.style.backgroundImage = `url("${slide.src}?format=300w")`;
      }

      if (counterPill) {
        const featTag = slide.featured ? ' • ★ FEATURED' : '';
        counterPill.textContent = `SLIDE ${formatNum(currentIndex + 1, activeList.length)} / ${formatNum(activeList.length, activeList.length)}${featTag}`;
      }

      if (slideTitle) {
        slideTitle.textContent = slide.title;
      }
      if (slideSubtitle) {
        slideSubtitle.textContent = slide.subtitle || '';
      }

      if (rangeInput) {
        rangeInput.value = currentIndex + 1;
      }
      if (scrubberText) {
        scrubberText.textContent = `${currentIndex + 1} of ${activeList.length}`;
      }

      syncThumbnailScroll();
      preloadAdjacent(currentIndex);
    }

    // Autoplay Engine
    function stopAutoplay() {
      isPlaying = false;
      if (progressTimer) {
        cancelAnimationFrame(progressTimer);
        progressTimer = null;
      }
      if (progressBar) progressBar.style.width = '0%';
      if (playToggleBtn) {
        playToggleBtn.classList.remove('active');
        playToggleBtn.innerHTML = '▶ Play Slideshow';
      }
    }

    function tickAutoplay(timestamp) {
      if (!isPlaying) return;
      if (!progressStart) progressStart = timestamp;
      const elapsed = timestamp - progressStart;
      const pct = Math.min(100, (elapsed / autoplayDuration) * 100);
      if (progressBar) progressBar.style.width = `${pct}%`;

      if (elapsed >= autoplayDuration) {
        progressStart = timestamp;
        goToSlide(currentIndex + 1);
      }
      progressTimer = requestAnimationFrame(tickAutoplay);
    }

    function startAutoplay() {
      isPlaying = true;
      progressStart = 0;
      if (playToggleBtn) {
        playToggleBtn.classList.add('active');
        playToggleBtn.innerHTML = '⏸ Pause Slideshow';
      }
      progressTimer = requestAnimationFrame(tickAutoplay);
    }

    function resetAutoplayTimer() {
      if (isPlaying) {
        progressStart = performance.now();
        if (progressBar) progressBar.style.width = '0%';
      }
    }

    // Render Secondary 3-Up Spotlight Carousel
    function renderSpotlightCarousel() {
      if (!spotlightTrack) return;
      const source = featuredSlides.length >= 6 ? featuredSlides : allSlides.slice(0, 18);
      spotlightTrack.innerHTML = '';

      source.forEach((slide) => {
        const card = document.createElement('article');
        card.className = 'multi-slide-card';
        card.innerHTML = `
          <div class="multi-slide-img-wrap">
            <img src="${slide.src}?format=750w" alt="${slide.title}" loading="lazy" decoding="async" />
            <span class="multi-slide-tag">Slide #${slide.index}</span>
          </div>
          <div class="multi-slide-body">
            <div>
              <h3 class="multi-slide-title">${slide.title}</h3>
              <p class="multi-slide-meta">${slide.subtitle}</p>
            </div>
            <span class="multi-slide-action">View in Cinema Slider →</span>
          </div>
        `;
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          // Ensure "All Slides" is active if slide not in current filter
          const targetIdx = activeList.findIndex((s) => s.id === slide.id);
          if (targetIdx !== -1) {
            goToSlide(targetIdx);
          } else {
            activeList = allSlides;
            if (filterAllBtn) filterAllBtn.classList.add('active');
            if (filterFeaturedBtn) filterFeaturedBtn.classList.remove('active');
            renderThumbnails();
            const fullIdx = activeList.findIndex((s) => s.id === slide.id);
            goToSlide(fullIdx !== -1 ? fullIdx : 0);
          }
          if (stageWrapper) {
            stageWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
        spotlightTrack.appendChild(card);
      });
    }

    // Bind Controls
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoplayTimer();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoplayTimer();
      });
    }

    if (playToggleBtn) {
      playToggleBtn.addEventListener('click', () => {
        if (isPlaying) stopAutoplay();
        else startAutoplay();
      });
    }

    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => {
        autoplayDuration = Number(e.target.value) || 4500;
        resetAutoplayTimer();
      });
    }

    if (fitToggleBtn && stageWrapper) {
      fitToggleBtn.addEventListener('click', () => {
        const isFill = stageWrapper.classList.toggle('fill-mode');
        fitToggleBtn.classList.toggle('active', isFill);
        fitToggleBtn.textContent = isFill ? '⊞ Fit Whole Slab' : '⛶ Fill Stage';
      });
    }

    if (fullscreenBtn && stageWrapper) {
      fullscreenBtn.addEventListener('click', () => {
        const isFs = stageWrapper.classList.toggle('fullscreen-mode');
        fullscreenBtn.classList.toggle('active', isFs);
        fullscreenBtn.textContent = isFs ? '✕ Exit Fullscreen' : '⛶ Fullscreen Stage';
      });
    }

    if (filterAllBtn) {
      filterAllBtn.addEventListener('click', () => {
        if (activeList === allSlides) return;
        activeList = allSlides;
        currentIndex = 0;
        filterAllBtn.classList.add('active');
        if (filterFeaturedBtn) filterFeaturedBtn.classList.remove('active');
        renderThumbnails();
        goToSlide(0);
      });
    }

    if (filterFeaturedBtn) {
      filterFeaturedBtn.addEventListener('click', () => {
        if (!featuredSlides.length || activeList === featuredSlides) return;
        activeList = featuredSlides;
        currentIndex = 0;
        filterFeaturedBtn.classList.add('active');
        if (filterAllBtn) filterAllBtn.classList.remove('active');
        renderThumbnails();
        goToSlide(0);
      });
    }

    // Scrubber & Quick Jump bindings
    if (rangeInput) {
      rangeInput.addEventListener('input', (e) => {
        goToSlide(Number(e.target.value) - 1);
        resetAutoplayTimer();
      });
    }
    if (stepFirstBtn) {
      stepFirstBtn.addEventListener('click', () => {
        goToSlide(0);
        resetAutoplayTimer();
      });
    }
    if (stepBack10Btn) {
      stepBack10Btn.addEventListener('click', () => {
        goToSlide(currentIndex - 10);
        resetAutoplayTimer();
      });
    }
    if (stepFwd10Btn) {
      stepFwd10Btn.addEventListener('click', () => {
        goToSlide(currentIndex + 10);
        resetAutoplayTimer();
      });
    }
    if (stepLastBtn) {
      stepLastBtn.addEventListener('click', () => {
        goToSlide(activeList.length - 1);
        resetAutoplayTimer();
      });
    }

    // Filmstrip scroll buttons
    if (thumbLeftBtn && thumbStrip) {
      thumbLeftBtn.addEventListener('click', () => {
        thumbStrip.scrollBy({ left: -460, behavior: 'smooth' });
      });
    }
    if (thumbRightBtn && thumbStrip) {
      thumbRightBtn.addEventListener('click', () => {
        thumbStrip.scrollBy({ left: 460, behavior: 'smooth' });
      });
    }

    // Spotlight Carousel buttons
    if (spotlightPrev && spotlightTrack) {
      spotlightPrev.addEventListener('click', () => {
        spotlightTrack.scrollBy({ left: -440, behavior: 'smooth' });
      });
    }
    if (spotlightNext && spotlightTrack) {
      spotlightNext.addEventListener('click', () => {
        spotlightTrack.scrollBy({ left: 440, behavior: 'smooth' });
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1);
        resetAutoplayTimer();
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1);
        resetAutoplayTimer();
      } else if (e.key === 'Escape' && stageWrapper?.classList.contains('fullscreen-mode')) {
        stageWrapper.classList.remove('fullscreen-mode');
        if (fullscreenBtn) {
          fullscreenBtn.classList.remove('active');
          fullscreenBtn.textContent = '⛶ Fullscreen Stage';
        }
      }
    });

    // Touch / Drag Swipe support on Cinema Stage
    if (stageWrapper) {
      let touchStartX = 0;
      stageWrapper.addEventListener(
        'touchstart',
        (e) => {
          touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );
      stageWrapper.addEventListener(
        'touchend',
        (e) => {
          const deltaX = e.changedTouches[0].screenX - touchStartX;
          if (Math.abs(deltaX) > 45) {
            if (deltaX < 0) goToSlide(currentIndex + 1);
            else goToSlide(currentIndex - 1);
            resetAutoplayTimer();
          }
        },
        { passive: true }
      );
    }

    // Initialize
    renderThumbnails();
    renderSpotlightCarousel();
    goToSlide(0);
  };

  /**
   * Initialize Homepage Hero Showcase Slider & Live Collection Tab Slider
   */
  window.initHomeSliders = function () {
    const highlights = window.VENICE_HIGHLIGHTS || [];
    const heroContainer = document.getElementById('hero-slider-stage');
    const heroDots = document.getElementById('hero-slider-dots');
    const heroPrev = document.getElementById('hero-prev-btn');
    const heroNext = document.getElementById('hero-next-btn');

    if (heroContainer && highlights.length) {
      let heroIdx = 0;
      let heroTimer = null;

      heroContainer.innerHTML = '';
      if (heroDots) heroDots.innerHTML = '';

      highlights.forEach((item, i) => {
        const slide = document.createElement('div');
        slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
        slide.innerHTML = `
          <img src="${item.src}?format=1500w" alt="${item.title}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} />
          <div class="hero-slide-overlay">
            <span class="hero-slide-badge">${item.category} • ${item.count}</span>
            <h2 class="hero-slide-title">${item.title}</h2>
            <p class="hero-slide-sub">${item.subtitle}</p>
            <div>
              <a href="${item.link}" class="btn btn-gold">Open ${item.category} Slider →</a>
            </div>
          </div>
        `;
        heroContainer.appendChild(slide);

        if (heroDots) {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
          dot.setAttribute('aria-label', `Show highlight ${i + 1}`);
          dot.addEventListener('click', () => {
            setHeroSlide(i);
            restartHeroTimer();
          });
          heroDots.appendChild(dot);
        }
      });

      const slideEls = heroContainer.querySelectorAll('.hero-slide');
      const dotEls = heroDots ? heroDots.querySelectorAll('.hero-dot') : [];

      function setHeroSlide(idx) {
        heroIdx = ((idx % highlights.length) + highlights.length) % highlights.length;
        slideEls.forEach((el, i) => el.classList.toggle('active', i === heroIdx));
        dotEls.forEach((el, i) => el.classList.toggle('active', i === heroIdx));
      }

      function restartHeroTimer() {
        if (heroTimer) clearInterval(heroTimer);
        heroTimer = setInterval(() => setHeroSlide(heroIdx + 1), 5000);
      }

      if (heroPrev) {
        heroPrev.addEventListener('click', () => {
          setHeroSlide(heroIdx - 1);
          restartHeroTimer();
        });
      }
      if (heroNext) {
        heroNext.addEventListener('click', () => {
          setHeroSlide(heroIdx + 1);
          restartHeroTimer();
        });
      }

      // Touch swipe support on Home Hero Slider
      let heroTouchX = 0;
      heroContainer.addEventListener(
        'touchstart',
        (e) => {
          heroTouchX = e.changedTouches[0].screenX;
        },
        { passive: true }
      );
      heroContainer.addEventListener(
        'touchend',
        (e) => {
          const dx = e.changedTouches[0].screenX - heroTouchX;
          if (Math.abs(dx) > 40) {
            if (dx < 0) setHeroSlide(heroIdx + 1);
            else setHeroSlide(heroIdx - 1);
            restartHeroTimer();
          }
        },
        { passive: true }
      );

      restartHeroTimer();
    }

    // Interactive Collection Preview Slider on Home Page
    const tabButtons = document.querySelectorAll('[data-collection-tab]');
    const homeTrack = document.getElementById('home-collection-track');
    const homePrev = document.getElementById('home-col-prev');
    const homeNext = document.getElementById('home-col-next');
    const homeExploreLink = document.getElementById('home-col-explore-link');

    const pageNames = {
      'rare-precious-stone': { name: 'Rare Precious Stone', href: 'rare-precious-stone.html' },
      kitchen: { name: 'Kitchen', href: 'kitchen.html' },
      bathroom: { name: 'Bathroom', href: 'bathroom.html' },
      indoor: { name: 'Indoor', href: 'indoor.html' },
      outdoor: { name: 'Outdoor', href: 'outdoor.html' }
    };

    function renderHomeCollectionSlider(catKey) {
      if (!homeTrack || !window.VENICE_GALLERIES) return;
      const list = window.VENICE_GALLERIES[catKey] || [];
      const featured = list.filter((s) => s.featured);
      const displayItems = (featured.length >= 6 ? featured : list).slice(0, 12);
      const info = pageNames[catKey] || { name: 'Collection', href: `${catKey}.html` };

      homeTrack.innerHTML = '';
      displayItems.forEach((slide) => {
        const card = document.createElement('a');
        card.href = `${info.href}`;
        card.className = 'multi-slide-card';
        card.innerHTML = `
          <div class="multi-slide-img-wrap">
            <img src="${slide.src}?format=750w" alt="${slide.title}" loading="lazy" decoding="async" />
            <span class="multi-slide-tag">${info.name} • #${slide.index}</span>
          </div>
          <div class="multi-slide-body">
            <div>
              <h3 class="multi-slide-title">${slide.title}</h3>
              <p class="multi-slide-meta">${slide.subtitle}</p>
            </div>
            <span class="multi-slide-action">Explore in Full ${info.name} Slider (${list.length} Photos) →</span>
          </div>
        `;
        homeTrack.appendChild(card);
      });

      if (homeExploreLink) {
        homeExploreLink.href = info.href;
        homeExploreLink.textContent = `Launch Full ${info.name} Slider (${list.length} Photos) →`;
      }
      homeTrack.scrollTo({ left: 0, behavior: 'smooth' });
    }

    if (tabButtons.length && homeTrack) {
      tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          tabButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          renderHomeCollectionSlider(btn.dataset.collectionTab);
        });
      });
      renderHomeCollectionSlider('rare-precious-stone');
    }

    if (homePrev && homeTrack) {
      homePrev.addEventListener('click', () => {
        homeTrack.scrollBy({ left: -440, behavior: 'smooth' });
      });
    }
    if (homeNext && homeTrack) {
      homeNext.addEventListener('click', () => {
        homeTrack.scrollBy({ left: 440, behavior: 'smooth' });
      });
    }
  };
})();
