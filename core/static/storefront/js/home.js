(() => {
    "use strict";

    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    const navigation = document.getElementById("main-navigation");
    const newsletterForm = document.getElementById("newsletter-form");
    const newsletterMessage = document.getElementById("newsletter-message");
    const newsletterEmail = document.getElementById("newsletter-email");
    const backToTop = document.getElementById("back-to-top");
    const siteHeader = document.querySelector(".site-header");

    if (mobileToggle && navigation) {
        mobileToggle.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("is-open");
            mobileToggle.setAttribute("aria-expanded", String(isOpen));
            mobileToggle.setAttribute("aria-label", isOpen ? "بستن منو" : "باز کردن منو");
            mobileToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
            window.lucide?.createIcons?.();
        });

        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navigation.classList.remove("is-open");
                mobileToggle.setAttribute("aria-expanded", "false");
                mobileToggle.setAttribute("aria-label", "باز کردن منو");
                mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
                window.lucide?.createIcons?.();
            });
        });

        document.addEventListener("click", (event) => {
            if (!navigation.classList.contains("is-open")) return;
            if (navigation.contains(event.target) || mobileToggle.contains(event.target)) return;
            navigation.classList.remove("is-open");
            mobileToggle.setAttribute("aria-expanded", "false");
            mobileToggle.setAttribute("aria-label", "باز کردن منو");
            mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
            window.lucide?.createIcons?.();
        });
    }

    if (newsletterForm && newsletterMessage && newsletterEmail) {
        newsletterForm.addEventListener("submit", (event) => {
            event.preventDefault();
            newsletterMessage.classList.remove("is-error");

            if (!newsletterEmail.checkValidity()) {
                newsletterMessage.textContent = "لطفاً یک آدرس ایمیل معتبر وارد کن.";
                newsletterMessage.classList.add("is-error");
                newsletterEmail.focus();
                return;
            }

            newsletterMessage.textContent = "آدرس ایمیل از نظر قالب معتبر است؛ ثبت عضویت پس از اتصال سرویس خبرنامه فعال می‌شود.";
        });
    }

    const year = document.getElementById("current-year");
    if (year) year.textContent = new Date().getFullYear();

    backToTop?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const updateScrollState = () => {
        siteHeader?.classList.toggle("is-scrolled", window.scrollY > 15);
        backToTop?.classList.toggle("is-visible", window.scrollY > 520);
    };
    window.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    window.lucide?.createIcons?.();
})();
