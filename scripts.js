// Magnetic Letter Hover Effect
document.addEventListener('DOMContentLoaded', function() {
    const magneticText = document.querySelector('.magnetic-text');
    const letters = document.querySelectorAll('.magnetic-text .letter');

    if (magneticText && letters.length > 0) {
        let mouseX = 0;
        let mouseY = 0;
        let isHovering = false;

        // Track mouse position relative to the text container
        magneticText.addEventListener('mouseenter', function(e) {
            isHovering = true;
        });

        magneticText.addEventListener('mouseleave', function(e) {
            isHovering = false;
            // Reset all letters smoothly
            letters.forEach(letter => {
                letter.style.transform = 'translateY(0) translateX(0) scale(1)';
            });
        });

        magneticText.addEventListener('mousemove', function(e) {
            if (!isHovering) return;

            const rect = magneticText.getBoundingClientRect();
            mouseX = e.clientX;
            mouseY = e.clientY;

            letters.forEach(letter => {
                const letterRect = letter.getBoundingClientRect();
                const letterCenterX = letterRect.left + letterRect.width / 2;
                const letterCenterY = letterRect.top + letterRect.height / 2;

                // Calculate distance from mouse to letter center
                const distanceX = mouseX - letterCenterX;
                const distanceY = mouseY - letterCenterY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                // Smaller radius for precise control
                const maxDistance = 80;

                if (distance < maxDistance) {
                    // Calculate effect strength (1 at center, 0 at maxDistance)
                    const strength = 1 - (distance / maxDistance);

                    // Apply smooth easing curve with stronger effect
                    const easedStrength = Math.pow(strength, 1.5);

                    // Much higher translation values for dramatic lift
                    const maxTranslateY = -80;
                    const maxTranslateX = 10;
                    const maxScale = 1.15;

                    // Calculate translations based on distance and strength
                    const translateY = maxTranslateY * easedStrength;
                    const translateX = -(distanceX * 0.08 * easedStrength);
                    const scale = 1 + (maxScale - 1) * easedStrength;

                    // Apply transform with smooth easing
                    letter.style.transform = `translateY(${translateY}px) translateX(${translateX}px) scale(${scale})`;
                    letter.style.transition = 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)';
                } else {
                    // Reset if out of range
                    letter.style.transform = 'translateY(0) translateX(0) scale(1)';
                    letter.style.transition = 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)';
                }
            });
        });
    }

    // Service Cards Expandable Functionality
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Close other cards
            serviceCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                }
            });

            // Toggle current card
            this.classList.toggle('expanded');
        });
    });

    // Click outside to close
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.service-card')) {
            serviceCards.forEach(card => {
                card.classList.remove('expanded');
            });
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});