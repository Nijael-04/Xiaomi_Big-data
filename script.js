/* ============================================
   XIAOMI PRESENTATION — SLIDE ENGINE
   ============================================ */

(function () {
    'use strict';

    // --- State ---
    let currentSlide = 1;
    const totalSlides = document.querySelectorAll('.slide').length;
    let isAnimating = false;
    let touchStartX = 0;
    let touchStartY = 0;

    // --- DOM Elements ---
    const progressBar = document.getElementById('progressBar');
    const slideCounter = document.getElementById('slideCounter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // --- Init ---
    function init() {
        updateUI();
        createParticles('particles-1');
        createParticles('particles-20');
        bindEvents();
    }

    // --- Navigation ---
    window.changeSlide = function (direction) {
        if (isAnimating) return;
        const newSlide = currentSlide + direction;
        if (newSlide < 1 || newSlide > totalSlides) return;
        navigateTo(newSlide);
    };

    window.goToSlide = function (slideNum) {
        if (isAnimating || slideNum === currentSlide) return;
        if (slideNum < 1 || slideNum > totalSlides) return;
        navigateTo(slideNum);
    };

    function navigateTo(slideNum) {
        isAnimating = true;

        // Remove active from current
        const current = document.getElementById('slide-' + currentSlide);
        if (current) {
            current.classList.remove('active');
            resetAnimations(current);
        }

        currentSlide = slideNum;

        // Activate new slide
        const next = document.getElementById('slide-' + currentSlide);
        if (next) {
            next.classList.add('active');
        }

        updateUI();

        setTimeout(function () {
            isAnimating = false;
        }, 600);
    }

    function resetAnimations(slide) {
        const animated = slide.querySelectorAll(
            '.animate-fade-down, .animate-fade-up, .animate-fade-up-delay, .animate-scale-in, .animate-width'
        );
        // Reset handled by CSS transition when active class is removed
    }

    function updateUI() {
        // Progress bar
        const progress = (currentSlide / totalSlides) * 100;
        progressBar.style.width = progress + '%';

        // Counter
        slideCounter.textContent = currentSlide + ' / ' + totalSlides;

        // Button states
        prevBtn.style.opacity = currentSlide === 1 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentSlide === 1 ? 'none' : 'auto';
        nextBtn.style.opacity = currentSlide === totalSlides ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentSlide === totalSlides ? 'none' : 'auto';
    }

    // --- Event Binding ---
    function bindEvents() {
        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    changeSlide(1);
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    changeSlide(-1);
                    break;
                case 'Home':
                    e.preventDefault();
                    goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    goToSlide(totalSlides);
                    break;
                case 'Escape':
                    closeImageModal();
                    break;
                case 'f':
                case 'F':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        toggleFullscreen();
                    }
                    break;
            }
        });

        // Mouse wheel navigation
        let wheelTimeout = null;
        document.addEventListener('wheel', function (e) {
            if (wheelTimeout) return;
            wheelTimeout = setTimeout(function () {
                wheelTimeout = null;
            }, 800);

            if (e.deltaY > 30) {
                changeSlide(1);
            } else if (e.deltaY < -30) {
                changeSlide(-1);
            }
        }, { passive: true });

        // Touch navigation
        document.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', function (e) {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Check if horizontal swipe is dominant
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
                if (diffX > 0) {
                    changeSlide(1);
                } else {
                    changeSlide(-1);
                }
            }
        }, { passive: true });
    }

    // --- Fullscreen ---
    window.toggleFullscreen = function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(function () { });
        } else {
            document.exitFullscreen().catch(function () { });
        }
    };

    // --- Image Modal ---
    window.openImageModal = function (imgElement) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        modalImg.src = imgElement.src;
        modalImg.alt = imgElement.alt;
        modal.classList.add('active');
    };

    window.closeImageModal = function () {
        const modal = document.getElementById('imageModal');
        modal.classList.remove('active');
    };

    // --- Particles ---
    function createParticles(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const colors = [
            'rgba(255, 105, 0, 0.3)',
            'rgba(132, 94, 247, 0.2)',
            'rgba(0, 201, 167, 0.2)',
            'rgba(59, 130, 246, 0.2)'
        ];

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            container.appendChild(particle);
        }
    }

    // --- Start ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
