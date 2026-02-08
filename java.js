document.addEventListener('DOMContentLoaded', () => {

    /* --- Random Color Palette Logic --- */
    const palettes = [
        {
            name: "Aroma de Café (Premium)",
            '--bg-color': '#FDF8F5',
            '--surface-color': '#FFFFFF',
            '--text-primary': '#2D1B16',
            '--text-secondary': '#6D5D55',
            '--primary-brand': '#4E342E',
            '--primary-dark': '#2D1B16',
            '--accent-color': '#D08C60',
            '--on-brand': '#FFFFFF',
            '--gradient-hero': 'linear-gradient(135deg, #4E342E 0%, #2D1B16 100%)'
        },
        {
            name: "Selva Tropical (Vibrante)",
            '--bg-color': '#F0F9FF', /* Light Sky instead of pale green for better contrast */
            '--surface-color': '#FFFFFF',
            '--text-primary': '#064E3B',
            '--text-secondary': '#374151',
            '--primary-brand': '#059669',
            '--primary-dark': '#064E3B',
            '--accent-color': '#10B981',
            '--on-brand': '#FFFFFF',
            '--gradient-hero': 'linear-gradient(135deg, #059669 0%, #064E3B 100%)'
        },
        {
            name: "Acero Moderno (Industrial)",
            '--bg-color': '#F1F5F9',
            '--surface-color': '#FFFFFF',
            '--text-primary': '#0F172A',
            '--text-secondary': '#475569',
            '--primary-brand': '#1E293B',
            '--primary-dark': '#020617',
            '--accent-color': '#F59E0B',
            '--on-brand': '#FFFFFF',
            '--gradient-hero': 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
        },
        {
            name: "Guaria Realeza (Elegante)",
            '--bg-color': '#FAF5FF',
            '--surface-color': '#FFFFFF',
            '--text-primary': '#2E1065',
            '--text-secondary': '#6B21A8',
            '--primary-brand': '#7E22CE',
            '--primary-dark': '#581C87',
            '--accent-color': '#D8B4FE',
            '--on-brand': '#FFFFFF',
            '--gradient-hero': 'linear-gradient(135deg, #7E22CE 0%, #581C87 100%)'
        },
        {
            name: "Atardecer Galáctico (Vibrante)",
            '--bg-color': '#FDF2F8',
            '--surface-color': '#FFFFFF',
            '--text-primary': '#4C0519',
            '--text-secondary': '#831843',
            '--primary-brand': '#DB2777',
            '--primary-dark': '#9D174D',
            '--accent-color': '#F97316',
            '--on-brand': '#FFFFFF',
            '--gradient-hero': 'linear-gradient(135deg, #DB2777 0%, #9D174D 100%)'
        },
        {
            name: "Costa Esmeralda (Fresco)",
            '--bg-color': '#F0FDFA',
            '--surface-color': '#FFFFFF',
            '--text-primary': '#042F2E',
            '--text-secondary': '#0D9488',
            '--primary-brand': '#0D9488',
            '--primary-dark': '#0F766E',
            '--accent-color': '#2DD4BF',
            '--on-brand': '#FFFFFF',
            '--gradient-hero': 'linear-gradient(135deg, #0D9488 0%, #042F2E 100%)'
        },
        {
            name: "Volcán Arenal (Energético)",
            '--bg-color': '#FEF2F2',
            '--surface-color': '#FFFFFF',
            '--text-primary': '#450A0A',
            '--text-secondary': '#7F1D1D',
            '--primary-brand': '#B91C1C',
            '--primary-dark': '#7F1D1D',
            '--accent-color': '#FBBF24',
            '--on-brand': '#FFFFFF',
            '--gradient-hero': 'linear-gradient(135deg, #B91C1C 0%, #7F1D1D 100%)'
        }
    ];

    // Select random palette
    const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];

    // Apply variables to root
    const root = document.documentElement;
    for (const [property, value] of Object.entries(randomPalette)) {
        if (property !== 'name') {
            root.style.setProperty(property, value);
        }
    }

    // Log for debugging
    console.log(`🎨 Palette Loaded: ${randomPalette.name}`);


    /* --- Original Functionality --- */

    // Smooth fade-in for cards when scrolling
    const cards = document.querySelectorAll('.card');

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Usamos AJAX para controlar el flujo

            const btn = contactForm.querySelector('.btn-submit');
            const feedbackParams = {
                originalText: btn.innerText,
                originalOpacity: btn.style.opacity || '1'
            };

            // 1. Check Cooldown (5 minutes)
            const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
            const lastSubmission = localStorage.getItem('lastSubmissionTime');

            if (lastSubmission) {
                const timePassed = Date.now() - parseInt(lastSubmission);
                if (timePassed < COOLDOWN_TIME) {
                    const minutesLeft = Math.ceil((COOLDOWN_TIME - timePassed) / 60000);
                    alert(`Por favor espere ${minutesLeft} minuto(s) antes de enviar otro formulario.`);
                    return;
                }
            }

            // 2. Check Terms Acceptance
            const termsBox = document.getElementById('accept-terms');
            if (termsBox && !termsBox.checked) {
                alert('Debe aceptar las condiciones de uso para continuar.');
                return;
            }

            // 3. Prepare Data
            const formData = new FormData(contactForm);

            // 3. UI Feedback
            btn.innerText = 'Enviando...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            try {
                // 4. Send via AJAX (fetch)
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // 5. Success Handling
                    localStorage.setItem('lastSubmissionTime', Date.now().toString());
                    localStorage.removeItem('contactFormData'); // Clear draft

                    alert('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
                    contactForm.reset();
                    window.location.reload(); // Refresh page as requested
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert('Hubo un problema al enviar el formulario. Por favor intente más tarde.');
                    }
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión. Verifique su internet e intente de nuevo.');
                // Restore button
                btn.innerText = feedbackParams.originalText;
                btn.style.opacity = feedbackParams.originalOpacity;
                btn.disabled = false;
            }
        });

        // --- LocalStorage Persistence ---
        const saveFormData = () => {
            const formData = {
                name: document.getElementById('name')?.value || '',
                phone: document.getElementById('phone-number')?.value || '',
                service: document.getElementById('service')?.value || 'transporte'
            };
            localStorage.setItem('contactFormData', JSON.stringify(formData));
        };

        const loadFormData = () => {
            const savedData = localStorage.getItem('contactFormData');
            if (savedData) {
                const formData = JSON.parse(savedData);
                if (document.getElementById('name')) document.getElementById('name').value = formData.name;
                if (document.getElementById('phone-number')) document.getElementById('phone-number').value = formData.phone;
                if (document.getElementById('service')) document.getElementById('service').value = formData.service;
            }
        };

        // Load data on init
        loadFormData();

        // Save data on change
        document.getElementById('name')?.addEventListener('input', saveFormData);
        document.getElementById('phone-number')?.addEventListener('input', (e) => {
            // Remove any non-numeric characters
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            saveFormData();
        });
        document.getElementById('service')?.addEventListener('change', saveFormData);
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.boxShadow = ''; // Clear inline styles if any
        }
    });

    // Bottom Nav Active State
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

});
