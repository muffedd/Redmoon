/* ============================================
   REDMOON — Lenis Smooth Scroll + Core Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    /* ------------------------------------------
       1. Lenis Smooth Scroll
       ------------------------------------------ */
    let lenis;
    try {
        lenis = new Lenis({
            duration: 0.9,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            syncTouch: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } catch (e) {
        console.warn('Lenis failed to initialize');
    }

    /* ------------------------------------------
       DOM refs
       ------------------------------------------ */
    const nav = document.getElementById('nav');
    const menuBtn = document.getElementById('menuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = menuOverlay.querySelectorAll('a');
    const constellationLines = document.querySelectorAll('.constellation-line');
    const constellationStars = document.querySelectorAll('.constellation-star');

    let ticking = false;

    function requestScrollUpdate() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateNav();
            updateStickyHero();
            updateStickyStatement();
            ticking = false;
        });
    }

    /* ------------------------------------------
       Navigation — Scroll State
       ------------------------------------------ */
    function updateNav() {
        if (window.scrollY > 80) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    }
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    if (lenis) lenis.on('scroll', requestScrollUpdate);

    /* ------------------------------------------
       Scroll Indicator — Click to scroll down
       ------------------------------------------ */
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator && lenis) {
        scrollIndicator.addEventListener('click', () => {
            lenis.scrollTo(window.innerHeight, { duration: 1.2 });
        });
    }

    /* ------------------------------------------
       Sticky Hero — Scroll-Reactive Contrast
       ------------------------------------------ */
    const stickyHero = document.querySelector('.sticky-hero');
    const stickyBg = document.querySelector('.sticky-hero__bg');
    const stickyTextDark = document.querySelector('.sticky-hero__text-dark');
    const ctaDark = document.querySelector('.sticky-hero__cta-dark');
    const ctaLight = document.querySelector('.sticky-hero__cta-light');

    function updateStickyHero() {
        if (stickyHero && stickyBg && stickyTextDark) {
            const rect = stickyHero.getBoundingClientRect();
            const heroHeight = stickyHero.offsetHeight;
            const viewportHeight = window.innerHeight;
            const rawProgress = -rect.top / (heroHeight - viewportHeight);
            const progress = Math.max(0, Math.min(1, rawProgress));

            const heroMaxTranslate = -((heroHeight - viewportHeight) / heroHeight) * 100;
            const bgTranslate = progress * heroMaxTranslate;
            stickyBg.style.transform = `translateY(${bgTranslate}%)`;

            const textStart = 0.30;
            const textEnd = 0.70;
            const textProgress = Math.max(0, Math.min(1, (progress - textStart) / (textEnd - textStart)));
            const insetValue = (1 - textProgress) * 100;
            const textClip = `inset(${insetValue}% 0 0 0)`;
            stickyTextDark.style.clipPath = textClip;
            stickyTextDark.style.webkitClipPath = textClip;

            if (ctaDark && ctaLight) {
                const ctaStart = 0.35;
                const ctaEnd = 0.65;
                const ctaProgress = Math.max(0, Math.min(1, (progress - ctaStart) / (ctaEnd - ctaStart)));
                ctaDark.style.opacity = ctaProgress;
                ctaLight.style.opacity = 1 - ctaProgress;
            }
        }
    }

    /* ------------------------------------------
       Sticky Statement — Scroll-Reactive Contrast
       ------------------------------------------ */
    const stickyStatement = document.querySelector('.sticky-statement');
    const statementBg = document.querySelector('.sticky-statement__bg');
    const statementTextLight = document.querySelector('.sticky-statement__text-light');
    const statementCtaLight = document.querySelector('.sticky-statement__cta-light');
    const statementCtaDark = document.querySelector('.sticky-statement__cta-dark');

    function updateStickyStatement() {
        if (stickyStatement && statementBg && statementTextLight) {
            const rect = stickyStatement.getBoundingClientRect();
            const sectionHeight = stickyStatement.offsetHeight;
            const viewportHeight = window.innerHeight;
            const rawProgress = -rect.top / (sectionHeight - viewportHeight);
            const progress = Math.max(0, Math.min(1, rawProgress));

            const maxTranslate = -((sectionHeight - viewportHeight) / sectionHeight) * 100;
            const bgTranslate = progress * maxTranslate;
            statementBg.style.transform = `translateY(${bgTranslate}%)`;

            const textStart = 0.30;
            const textEnd = 0.70;
            const textProgress = Math.max(0, Math.min(1, (progress - textStart) / (textEnd - textStart)));
            const insetValue = (1 - textProgress) * 100;
            const textClip = `inset(${insetValue}% 0 0 0)`;
            statementTextLight.style.clipPath = textClip;
            statementTextLight.style.webkitClipPath = textClip;

            if (statementCtaLight && statementCtaDark) {
                const ctaStart = 0.35;
                const ctaEnd = 0.65;
                const ctaProgress = Math.max(0, Math.min(1, (progress - ctaStart) / (ctaEnd - ctaStart)));
                statementCtaLight.style.opacity = ctaProgress;
                statementCtaDark.style.opacity = 1 - ctaProgress;
            }

            // Constellation draw animation
            if (constellationLines.length) {
                const drawStart = 0.25;
                const drawEnd = 0.80;
                const drawProgress = Math.max(0, Math.min(1, (progress - drawStart) / (drawEnd - drawStart)));
                constellationLines.forEach(line => {
                    line.style.strokeDashoffset = 300 * (1 - drawProgress);
                });
                constellationStars.forEach((star, i) => {
                    const starThreshold = drawStart + (i / constellationStars.length) * (drawEnd - drawStart);
                    const starProg = progress > starThreshold ? Math.min(1, (progress - starThreshold) / 0.08) : 0;
                    star.style.opacity = starProg;
                    star.style.transform = `scale(${0.5 + starProg * 0.5})`;
                });
            }
        }
    }

    requestScrollUpdate();

    /* ------------------------------------------
       Line Mask Reveal — editorial text animation
       ------------------------------------------ */
    function initLineReveals() {
        const reveals = document.querySelectorAll('.line-reveal');
        if (!reveals.length) return;

        function splitIntoLines(el) {
            const text = el.innerText.trim();
            const words = text.split(/\s+/);
            el.innerHTML = '';

            // Temporarily wrap each word in an inline span to measure line breaks
            const wordSpans = words.map(word => {
                const span = document.createElement('span');
                span.textContent = word + '\u00A0'; // non-breaking space
                span.style.display = 'inline';
                return span;
            });

            wordSpans.forEach(span => el.appendChild(span));

            // Group words by their rendered top position
            const lines = [];
            let currentLine = [];
            let currentTop = null;

            wordSpans.forEach(span => {
                const rect = span.getBoundingClientRect();
                if (currentTop === null || Math.abs(rect.top - currentTop) < 3) {
                    currentLine.push(span);
                    currentTop = rect.top;
                } else {
                    lines.push(currentLine);
                    currentLine = [span];
                    currentTop = rect.top;
                }
            });
            if (currentLine.length) lines.push(currentLine);

            // Rebuild DOM with line mask structure
            el.innerHTML = '';
            lines.forEach((lineWords, i) => {
                const lineWrap = document.createElement('span');
                lineWrap.className = 'line-reveal__line';

                const textWrap = document.createElement('span');
                textWrap.className = 'line-reveal__text';

                lineWords.forEach(w => textWrap.appendChild(w));
                // Normalize word spans back to plain text nodes
                Array.from(textWrap.querySelectorAll('span')).forEach(child => {
                    const textNode = document.createTextNode(child.textContent);
                    child.parentNode.replaceChild(textNode, child);
                });

                lineWrap.appendChild(textWrap);
                el.appendChild(lineWrap);

                if (i < lines.length - 1) {
                    el.appendChild(document.createTextNode(' '));
                }
            });
        }

        reveals.forEach(el => splitIntoLines(el));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    }

    initLineReveals();

    /* ------------------------------------------
       Premium Microinteractions — lightweight path
       (Scroll reveals now handled by GSAP + ScrollTrigger)
       ------------------------------------------ */
    const premiumCards = document.querySelectorAll('.project-card, .h-gallery-card__link, .editorial__card-link, .portrait-card, .team-photo');
    premiumCards.forEach(card => {
        card.classList.add('premium-hover-surface');
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--pointer-x', `${x}%`);
            card.style.setProperty('--pointer-y', `${y}%`);
        });
    });

    const magneticItems = document.querySelectorAll('.projects-cta__link, .editorial__link, .sticky-hero__cta, .contact-form__submit');
    magneticItems.forEach(item => {
        item.classList.add('magnetic-action');
        item.addEventListener('pointermove', (event) => {
            const rect = item.getBoundingClientRect();
            const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
            const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
            item.style.setProperty('--magnet-x', `${x}px`);
            item.style.setProperty('--magnet-y', `${y}px`);
        });
        item.addEventListener('pointerleave', () => {
            item.style.setProperty('--magnet-x', '0px');
            item.style.setProperty('--magnet-y', '0px');
        });
    });

    /* ------------------------------------------
       Horizontal Gallery — drag to scroll
       ------------------------------------------ */
    const hTrack = document.querySelector('.horizontal-gallery__track');
    if (hTrack) {
        let isDown = false;
        let startX;
        let scrollLeft;

        hTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            hTrack.style.cursor = 'grabbing';
            startX = e.pageX - hTrack.offsetLeft;
            scrollLeft = hTrack.scrollLeft;
        });

        hTrack.addEventListener('mouseleave', () => {
            isDown = false;
            hTrack.style.cursor = 'grab';
        });

        hTrack.addEventListener('mouseup', () => {
            isDown = false;
            hTrack.style.cursor = 'grab';
        });

        hTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - hTrack.offsetLeft;
            const walk = (x - startX) * 1.5;
            hTrack.scrollLeft = scrollLeft - walk;
        });

        hTrack.style.cursor = 'grab';
    }

    /* ------------------------------------------
       Mobile Menu Toggle
       ------------------------------------------ */
    function toggleMenu() {
        const isOpen = menuOverlay.classList.contains('menu-overlay--open');
        if (isOpen) {
            menuOverlay.classList.remove('menu-overlay--open');
            menuBtn.classList.remove('nav__menu-btn--active');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        } else {
            menuOverlay.classList.add('menu-overlay--open');
            menuBtn.classList.add('nav__menu-btn--active');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        }
    }

    // Ensure overlay is hidden on load
    menuOverlay.classList.remove('menu-overlay--open');
    menuBtn.classList.remove('nav__menu-btn--active');

    menuBtn.addEventListener('click', toggleMenu);
    const menuClose = document.getElementById('menuClose');
    if (menuClose) menuClose.addEventListener('click', toggleMenu);
    menuLinks.forEach(link => link.addEventListener('click', toggleMenu));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('menu-overlay--open')) {
            toggleMenu();
        }
    });

    /* ------------------------------------------
       Smooth Anchor Scroll (Lenis)
       ------------------------------------------ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(targetElement, { offset: -nav.offsetHeight });
                } else {
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    });

    /* ------------------------------------------
       Active Nav State
       ------------------------------------------ */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .menu-overlay__nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('nav__link--active');
        }
    });

    /* ------------------------------------------
       Scroll-to-Top Button
       ------------------------------------------ */
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 16V4M6 8l4-4 4 4"/></svg>';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            scrollTopBtn.classList.add('scroll-top--visible');
        } else {
            scrollTopBtn.classList.remove('scroll-top--visible');
        }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        if (lenis) {
            lenis.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    /* ------------------------------------------
       Contact Form — submits to Formspree
       Replace the action URL in contact.html
       with your own endpoint.
       ------------------------------------------ */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('.contact-form__submit');
        const originalText = submitBtn ? submitBtn.textContent : 'Send inquiry';

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!submitBtn) return;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { Accept: 'application/json' }
                });

                if (response.ok) {
                    submitBtn.textContent = 'Message sent';
                    submitBtn.style.background = 'var(--dark-green)';
                    submitBtn.style.borderColor = 'var(--dark-green)';
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                submitBtn.textContent = 'Failed to send';
                submitBtn.style.background = '#8a3a20';
                submitBtn.style.borderColor = '#8a3a20';
            }

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    }

    /* ------------------------------------------
       Lightbox for Detail Gallery
       ------------------------------------------ */
    const galleryItems = document.querySelectorAll('.detail-gallery__item img');
    if (galleryItems.length) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = '<div class="lightbox__backdrop"></div><button class="lightbox__close" aria-label="Close"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button><img class="lightbox__img" src="" alt=""><div class="lightbox__caption"></div>';
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('.lightbox__img');
        const lightboxCaption = lightbox.querySelector('.lightbox__caption');

        galleryItems.forEach((img, i) => {
            img.parentElement.style.cursor = 'zoom-in';
            img.parentElement.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = img.alt;
                lightbox.classList.add('lightbox--open');
                if (lenis) lenis.stop();
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('lightbox--open');
            if (lenis) lenis.start();
            document.body.style.overflow = '';
        }

        lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox__backdrop').addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('lightbox--open')) closeLightbox();
        });
    }

});
