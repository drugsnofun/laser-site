document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const contactInfo = document.querySelector('.contact-info');

    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        contactInfo.classList.toggle('active');
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
                // Close mobile menu if open
                if (mobileMenuBtn.classList.contains('active')) {
                    mobileMenuBtn.click();
                }
            }
        });
    });

    // Appointment button functionality
    const appointmentBtn = document.querySelector('.appointment-btn');
    appointmentBtn.addEventListener('click', function() {
        // Here you can add your appointment form logic
        alert('Форма записи на прием будет доступна в ближайшее время');
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all service cards and sections
    document.querySelectorAll('.service-card, section').forEach(element => {
        observer.observe(element);
    });

    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Testimonials slider
    const testimonialSlider = {
        currentSlide: 0,
        slides: document.querySelectorAll('.testimonial-card'),
        prevBtn: document.querySelector('.nav-prev'),
        nextBtn: document.querySelector('.nav-next'),

        init() {
            if (!this.slides.length) return;
            
            this.showSlide(0);
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        },

        showSlide(n) {
            this.slides.forEach(slide => slide.style.display = 'none');
            this.slides[n].style.display = 'block';
        },

        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            this.showSlide(this.currentSlide);
        },

        prevSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.showSlide(this.currentSlide);
        }
    };

    // Before/After image hover effect
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach(card => {
        const before = card.querySelector('.before');
        const after = card.querySelector('.after');
        
        if (before && after) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = (x / rect.width) * 100;
                
                after.style.opacity = percent / 100;
            });
            
            card.addEventListener('mouseleave', () => {
                after.style.opacity = 0;
            });
        }
    });

    // Appointment form handling
    const appointmentForm = document.querySelector('.appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = appointmentForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            
            const formData = new FormData(appointmentForm);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('http://localhost:3000/api/appointment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                
                if (result.success) {
                    alert('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.');
                    appointmentForm.reset();
                } else {
                    throw new Error(result.message || 'Произошла ошибка при отправке формы');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert(error.message || 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Записаться';
            }
        });
    }

    // Phone number formatting
    const phoneInput = document.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 11) {
                    value = value.replace(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/, '+$1 ($2) $3-$4-$5');
                }
                e.target.value = value;
            }
        });
    }

    // Initialize components
    testimonialSlider.init();
});
