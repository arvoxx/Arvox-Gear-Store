(() => {
    "use strict";
    document.documentElement.classList.add("js-enabled");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = document.querySelectorAll(".reveal");

    if (reducedMotion) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, activeObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                activeObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    if (window.gsap) {
        window.gsap.fromTo(".hero-copy > *", { opacity: 0, y: 15 }, {
            opacity: 1, y: 0, duration: 0.65, stagger: 0.09, ease: "power2.out", delay: 0.1,
            clearProps: "transform",
        });
        window.gsap.fromTo(".hero-visual", { opacity: 0, x: -18 }, {
            opacity: 1, x: 0, duration: 0.9, ease: "power2.out", delay: 0.2,
            clearProps: "transform",
        });
    }
})();
