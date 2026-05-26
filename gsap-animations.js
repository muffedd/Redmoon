/**
 * GSAP + ScrollTrigger Animations
 * Safe, non-destructive scroll-driven reveals.
 * Does NOT modify innerHTML of any element.
 */
(function() {
    'use strict';

    // Skip if GSAP not loaded or user prefers reduced motion
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const defaults = { duration: 0.9, ease: 'power3.out' };
    const staggerDefaults = { duration: 0.7, ease: 'power2.out', stagger: 0.12 };

    // ── 1. Hero load-in (no scroll trigger needed) ─────────────────────
    // Hero headline is NOT touched — script.js handles its scroll color swap
    const heroCta = document.querySelector('.sticky-hero__cta');
    if (heroCta) {
        gsap.from(heroCta, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.6,
        });
    }

    // ── 2. Section Headlines (simple fade-up, no text splitting) ────────
    const sectionHeadlines = document.querySelectorAll(
        '.services__title, .editorial__title, .proof__title, .process-section__title, .trust-stats__headline'
    );
    sectionHeadlines.forEach(headline => {
        gsap.from(headline, {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: headline,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    });

    // ── 3. Service Cards ─────────────────────────────────────────────
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length) {
        gsap.from(serviceCards, {
            y: 50,
            opacity: 0,
            ...staggerDefaults,
            scrollTrigger: {
                trigger: serviceCards[0].parentElement,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });
    }

    // ── 4. Project Cards (mobile grid) ────────────────────────────────
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length) {
        gsap.from(projectCards, {
            y: 60,
            opacity: 0,
            ...staggerDefaults,
            scrollTrigger: {
                trigger: projectCards[0].parentElement,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });
    }

    // ── 5. Horizontal Gallery Cards ───────────────────────────────────
    const hGalleryCards = document.querySelectorAll('.h-gallery-card');
    if (hGalleryCards.length) {
        gsap.from(hGalleryCards, {
            x: 80,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.horizontal-gallery__track',
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });
    }

    // ── 6. Editorial Cards ────────────────────────────────────────────
    const editorialCards = document.querySelectorAll('.editorial__card');
    if (editorialCards.length) {
        gsap.from(editorialCards, {
            y: 50,
            opacity: 0,
            ...staggerDefaults,
            scrollTrigger: {
                trigger: editorialCards[0].parentElement,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });
    }

    // ── 7. Portrait / Team Cards ──────────────────────────────────────
    const portraitCards = document.querySelectorAll('.portrait-card, .team-photo');
    if (portraitCards.length) {
        gsap.from(portraitCards, {
            y: 50,
            opacity: 0,
            ...staggerDefaults,
            scrollTrigger: {
                trigger: portraitCards[0].parentElement || portraitCards[0],
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    }

    // ── 8. Trust Stats ───────────────────────────────────────────────
    const trustStats = document.querySelectorAll('.trust-stats__item');
    if (trustStats.length) {
        gsap.from(trustStats, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.trust-stats__inner',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    }

    // ── 9. Work Cards (desktop alternating) ────────────────────────────
    const workCards = document.querySelectorAll('.work-card');
    if (workCards.length) {
        workCards.forEach((card, i) => {
            const isEven = i % 2 === 0;
            gsap.from(card, {
                x: isEven ? -60 : 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            });
        });
    }

    // ── 10. Process Cards ─────────────────────────────────────────────
    const processCards = document.querySelectorAll('.process-card');
    if (processCards.length) {
        gsap.from(processCards, {
            y: 60,
            opacity: 0,
            ...staggerDefaults,
            scrollTrigger: {
                trigger: '.process-grid',
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });
    }

    // ── 11. Sticky Statement ──────────────────────────────────────────
    // Only animate the CTA — the text headline is part of script.js clip-path animation
    const stickyCta = document.querySelector('.sticky-statement__cta');
    if (stickyCta) {
        gsap.from(stickyCta, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.sticky-statement',
                start: 'top 70%',
                toggleActions: 'play none none none',
            },
        });
    }

    // ── 12. Quote Card ────────────────────────────────────────────────
    const quoteCard = document.querySelector('.quote-card');
    if (quoteCard) {
        gsap.from(quoteCard, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: quoteCard,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    }

    // ── 13. Footer ────────────────────────────────────────────────────
    const footerParts = document.querySelectorAll('.footer__top, .footer__bottom, .footer__image');
    if (footerParts.length) {
        gsap.from(footerParts, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 90%',
                toggleActions: 'play none none none',
            },
        });
    }

    // ── 14. Detail Page Reveals ───────────────────────────────────────
    const detailBlocks = document.querySelectorAll('.detail-case__block');
    if (detailBlocks.length) {
        gsap.from(detailBlocks, {
            y: 50,
            opacity: 0,
            ...staggerDefaults,
            scrollTrigger: {
                trigger: detailBlocks[0].parentElement,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });
    }

    const detailGalleryItems = document.querySelectorAll('.detail-gallery__item');
    if (detailGalleryItems.length) {
        gsap.from(detailGalleryItems, {
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.12,
            scrollTrigger: {
                trigger: '.detail-gallery__inner',
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        });
    }

    // ── 15. Nav fade in on load ───────────────────────────────────────
    const nav = document.querySelector('.nav');
    if (nav) {
        gsap.from(nav, {
            y: -20,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.1,
        });
    }

    // ── 16. Mobile Horizontal Gallery — vertical scroll drives horizontal pan ──
    if (window.innerWidth < 768) {
        const hGallery = document.querySelector('.horizontal-gallery');
        const hTrack = document.querySelector('.horizontal-gallery__track');
        if (hGallery && hTrack) {
            const trackWidth = hTrack.scrollWidth;
            const viewportWidth = window.innerWidth;
            const scrollDistance = trackWidth - viewportWidth + parseFloat(getComputedStyle(hTrack).paddingLeft) * 2;

            if (scrollDistance > 0) {
                gsap.to(hTrack, {
                    x: -scrollDistance,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: hGallery,
                        start: 'top top',
                        end: () => `+=${scrollDistance * 1.2}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                    },
                });
            }
        }
    }

    // Refresh ScrollTrigger after fonts load
    if (document.fonts) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
})();
