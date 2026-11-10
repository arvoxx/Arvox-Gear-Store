(() => {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gsap = window.gsap;
    document.documentElement.classList.add('motion-ready');
    if (!gsap || reducedMotion) return;

    gsap.defaults({ ease: 'power3.out', duration: 0.72 });

    const visual = document.querySelector('.visual-panel');
    const formInner = document.querySelector('.form-panel__inner');

    if (visual) {
        gsap.from('.brand-header', { y: -14, opacity: 0, duration: 0.75, delay: 0.05 });
        gsap.from('.hero-copy > *', { y: 20, opacity: 0, stagger: 0.12, duration: 0.85, delay: 0.12 });
        gsap.from('.hardware-callout', { opacity: 0, scale: 0.94, stagger: 0.12, duration: 0.8, delay: 0.48 });
        gsap.from('.visual-benefits', { y: 18, opacity: 0, duration: 0.8, delay: 0.5 });
        gsap.from('.visual-footer', { opacity: 0, duration: 0.7, delay: 0.72 });
        gsap.to('.ambient--cyan', { x: 22, y: -16, duration: 7.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.ambient--purple', { x: -18, y: 14, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    if (formInner) {
        gsap.from('.form-topline, .form-heading > *', { y: 15, opacity: 0, stagger: 0.09, duration: 0.7, delay: 0.08 });
        gsap.from('.field-group', { y: 13, opacity: 0, stagger: 0.045, duration: 0.55, delay: 0.2, clearProps: 'transform' });
        gsap.from('.terms-copy, .submit-button, .login-prompt, .form-security-note', {
            y: 10, opacity: 0, stagger: 0.07, duration: 0.58, delay: 0.4, clearProps: 'transform'
        });
    }

    // Subtle pointer parallax only on mouse/trackpad devices.
    if (visual && window.matchMedia('(pointer: fine)').matches) {
        const stage = document.querySelector('.hardware-stage');
        if (stage) {
            let bounds;
            visual.addEventListener('pointermove', (event) => {
                bounds ||= visual.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                gsap.to(stage, { x: x * 7, y: y * 5, duration: 0.75, overwrite: 'auto' });
            }, { passive: true });
            visual.addEventListener('pointerleave', () => {
                bounds = null;
                gsap.to(stage, { x: 0, y: 0, duration: 0.9, overwrite: 'auto' });
            }, { passive: true });
        }
    }
})();
