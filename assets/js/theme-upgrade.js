/**
 * SSMG Travels - Interactive Theme Upgrade & Scroll-Based Animations
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initBgSource();
    initScrollProgress();
    initStickyNavbar();
    initScrollReveal();
    initAnimatedCounters();
    initFaqAccordion();
    initFloatingActions();
    initTripFinder();
    initMobileNav();
  });

  // Background Image Hydrator Fallback (Only targets hero breadcrumbs, leaves homepage sections completely untouched)
  function initBgSource() {
    document.querySelectorAll('.vs-breadcrumb[data-bg-src], .breadcrumb-wrapper[data-bg-src], .breadcumb-wrapper[data-bg-src]').forEach(function (el) {
      const src = el.getAttribute('data-bg-src');
      if (src && !el.style.backgroundImage) {
        el.style.backgroundImage = 'url(' + src + ')';
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
      }
    });
  }

  // 1. Scroll Progress Bar
  function initScrollProgress() {
    const progressBar = document.getElementById('ssmg-scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrolled + '%';
    }, { passive: true });
  }

  // 2. Sticky Navbar with Smooth Transition
  function initStickyNavbar() {
    const navbar = document.querySelector('.ssmg-navbar-wrapper');
    const header = document.querySelector('.ssmg-header');
    if (!navbar) return;

    const threshold = 100;

    window.addEventListener('scroll', function () {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollY > threshold) {
        if (!navbar.classList.contains('is-sticky')) {
          if (header) {
            header.style.minHeight = header.offsetHeight + 'px';
          }
          navbar.classList.add('is-sticky');
        }
      } else {
        if (navbar.classList.contains('is-sticky')) {
          navbar.classList.remove('is-sticky');
          if (header) {
            header.style.minHeight = '';
          }
        }
      }
    }, { passive: true });
  }

  // 3. Scroll Reveal Animations (IntersectionObserver for 60fps performance)
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.ssmg-reveal');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback
      revealElements.forEach(el => el.classList.add('is-visible'));
    }
  }

  // 4. Animated Counters on Scroll
  function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('.ssmg-counter-num[data-target]');
    if (!counterElements.length) return;

    let hasRun = false;

    const runCounters = () => {
      counterElements.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const countTimer = setInterval(() => {
          frame++;
          const progress = frame / totalFrames;
          // Ease-out expo
          const currentVal = target * (1 - Math.pow(2, -10 * progress));

          if (isDecimal) {
            counter.innerText = currentVal.toFixed(1);
          } else {
            counter.innerText = Math.round(currentVal).toLocaleString('en-IN');
          }

          if (frame === totalFrames) {
            clearInterval(countTimer);
            counter.innerText = isDecimal ? target.toFixed(1) : target.toLocaleString('en-IN');
          }
        }, frameRate);
      });
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasRun) {
            hasRun = true;
            runCounters();
            obs.disconnect();
          }
        });
      }, { threshold: 0.3 });

      const counterSection = document.querySelector('.ssmg-counter-section');
      if (counterSection) observer.observe(counterSection);
    } else {
      runCounters();
    }
  }

  // 5. FAQ Accordion
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.ssmg-faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.ssmg-faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
        // Toggle current
        item.classList.toggle('active', !isActive);
      });
    });
  }

  // 6. Floating Actions (WhatsApp + Scroll To Top)
  function initFloatingActions() {
    const scrollTopBtn = document.querySelector('.ssmg-float-btn.scroll-top');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 7. Interactive Quick Trip Finder (Generates Instant WhatsApp Query)
  function initTripFinder() {
    const finderForm = document.getElementById('ssmg-trip-finder-form');
    if (!finderForm) return;

    finderForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const destination = document.getElementById('ssmg-finder-dest').value;
      const service = document.getElementById('ssmg-finder-service').value;
      const duration = document.getElementById('ssmg-finder-duration').value;

      let message = `Hello SSMG Travels Gorakhpur! 👋\nI am planning a trip:\n`;
      message += `📍 Destination: ${destination}\n`;
      message += `🚗 Service: ${service}\n`;
      message += `⏱️ Duration: ${duration}\n`;
      message += `Please share itinerary options and the best package quotation.`;

      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/917380708008?text=${encodedMsg}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // 8. Mobile Navigation Drawer Integration
  function initMobileNav() {
    const menuWrapper = document.querySelector('.vs-menu-wrapper');
    const menuArea = document.querySelector('.vs-menu-area');

    if (!menuWrapper) return;

    function openMobileMenu() {
      menuWrapper.classList.add('vs-body-visible');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      menuWrapper.classList.remove('vs-body-visible');
      document.body.style.overflow = '';
    }

    function isCloseButton(el) {
      return !!(el.closest('.mobile-logo') || el.querySelector('.fa-xmark') || el.classList.contains('fa-xmark'));
    }

    // Single clean delegated click handler for toggle and backdrop
    document.addEventListener('click', function (e) {
      const toggleBtn = e.target.closest('.vs-menu-toggle');
      if (toggleBtn) {
        e.preventDefault();
        e.stopPropagation();
        if (isCloseButton(toggleBtn)) {
          closeMobileMenu();
        } else {
          if (menuWrapper.classList.contains('vs-body-visible')) {
            closeMobileMenu();
          } else {
            openMobileMenu();
          }
        }
        return;
      }

      // Close on clicking backdrop (outside vs-menu-area while open)
      if (menuWrapper.classList.contains('vs-body-visible')) {
        if (menuArea && !menuArea.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuWrapper.classList.contains('vs-body-visible')) {
        closeMobileMenu();
      }
    });

    // Handle submenu expanding in mobile drawer
    const menuItems = menuWrapper.querySelectorAll('.menu-item-has-children');
    menuItems.forEach(item => {
      const link = item.querySelector(':scope > a');
      const submenu = item.querySelector(':scope > ul, :scope > .sub-menu');

      if (link && submenu) {
        // Add expand indicator icon if not present
        if (!link.querySelector('.submenu-arrow')) {
          const arrow = document.createElement('i');
          arrow.className = 'fa-solid fa-chevron-down submenu-arrow ms-auto';
          arrow.style.fontSize = '12px';
          arrow.style.transition = 'transform 0.25s ease';
          link.style.display = 'flex';
          link.style.alignItems = 'center';
          link.style.justifyContent = 'space-between';
          link.appendChild(arrow);
        }

        link.addEventListener('click', function (e) {
          // If it's a dropdown toggle (href is # or javascript:void)
          const href = link.getAttribute('href');
          if (!href || href === '#' || href.startsWith('javascript:')) {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = submenu.style.display === 'block';
            submenu.style.display = isOpen ? 'none' : 'block';
            const arrow = link.querySelector('.submenu-arrow');
            if (arrow) {
              arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            }
          }
        });
      }
    });
  }

})();
