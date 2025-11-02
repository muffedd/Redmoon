// Contact Page - EmailJS Integration
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const emailInput = document.getElementById('emailInput');
    const formStatus = document.getElementById('formStatus');

    // Initialize EmailJS
    emailjs.init("-52PFE4tsNxGootEZ");

    // Email validation regex - strict pattern
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    // Real-time email validation
    emailInput.addEventListener('input', function() {
        if (this.value && !emailRegex.test(this.value)) {
            this.style.color = '#ff2300';
            this.style.fontWeight = 'bold';
        } else {
            this.style.color = '#000000';
            this.style.fontWeight = '400';
        }
    });

    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        // Validate email
        if (!emailRegex.test(email)) {
            showStatus('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }

        // Disable button during submission
        const sendButton = contactForm.querySelector('.send-button');
        sendButton.style.pointerEvents = 'none';
        sendButton.style.opacity = '0.6';

        try {
            // Send email TO the user who submitted the form
            const response = await emailjs.send(
                'service_qx473fq',
                'template_hnswx5f',
                {
                    user_name: email,
                    user_email: email,
                    message: `Thank you for contacting Red Moon! We've received your message and will get back to you soon.`,
                    reply_to: 'deeplearn.ra@gmail.com'
                }
            );

            console.log('Email sent successfully:', response);

            // Show success message
            showStatus('✓ Message sent! We\'ll get back to you soon.', 'success');

            // Clear form
            emailInput.value = '';

            // Redirect back to home after 3 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);

        } catch (error) {
            console.error('EmailJS Error:', error);

            // Show error message
            showStatus('✗ Failed to send. Please email us at deeplearn.ra@gmail.com', 'error');

        } finally {
            // Re-enable button
            sendButton.style.pointerEvents = '';
            sendButton.style.opacity = '1';
        }
    });

    // Show status message
    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + type;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            formStatus.className = 'form-status';
        }, 5000);
    }
});
