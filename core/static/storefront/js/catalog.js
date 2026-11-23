(() => {
    "use strict";

    const root = document.getElementById("storefront-root");
    if (!root) return;

    const staticRoot = root.dataset.staticRoot || "/static/storefront/";
    const asset = (path) => `${staticRoot}${String(path).replace(/^\/+/, "")}`;
    const faNumber = new Intl.NumberFormat("fa-IR");
    const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[char]);

    // Static frontend catalog for v1. Replace this data source with a Django queryset later.
    const categories = [
        { slug: "graphics", title: "کارت گرافیک", description: "قدرت پردازش گرافیکی نسل جدید", image: "images/categories/category-gpu.webp" },
        { slug: "cpu", title: "پردازنده", description: "قلب تپنده سیستم گیمینگ", image: "images/categories/category-cpu.webp" },
        { slug: "motherboard", title: "مادربرد", description: "پایه‌ای برای ساخت یک سیستم قدرتمند", image: "images/categories/category-motherboard.webp" },
        { slug: "ram", title: "حافظه و رم", description: "سرعت بیشتر، اجرای روان‌تر", image: "images/categories/category-ram.webp" },
        { slug: "storage", title: "ذخیره‌سازی", description: "فضای بیشتر با سرعتی خیره‌کننده", image: "images/categories/category-storage.webp" },
        { slug: "peripherals", title: "تجهیزات گیمینگ", description: "تجربه‌ای کامل‌تر در هر مسابقه", image: "images/categories/category-peripherals.webp" },
    ];

    const products = [
        {
            id: "rog-rtx-5070", name: "ASUS ROG Strix RTX 5070", category: "کارت گرافیک", categorySlug: "graphics",
            image: "images/products/product-rtx-5070.webp", price: 59990000, oldPrice: 67990000,
            badge: "پیشنهاد ویژه", rating: "۴.۹", reviews: "۱۲۸", availability: "موجود در انبار", popularity: 98, newness: 3,
        },
        {
            id: "amd-ryzen-9700x", name: "AMD Ryzen 7 9700X", category: "پردازنده", categorySlug: "cpu",
            image: "images/products/product-ryzen-9700x.webp", price: 27490000, oldPrice: 29990000,
            badge: "انتخاب حرفه‌ای‌ها", rating: "۴.۸", reviews: "۹۶", availability: "موجود در انبار", popularity: 91, newness: 5,
        },
        {
            id: "msi-mpg-b650-edge", name: "MSI MPG B650 EDGE", category: "مادربرد", categorySlug: "motherboard",
            image: "images/products/product-mpg-b650.webp", price: 24990000, oldPrice: 28500000,
            badge: "تخفیف محدود", rating: "۴.۷", reviews: "۷۴", availability: "موجود در انبار", popularity: 86, newness: 2,
        },
        {
            id: "gskill-trident-z5-32gb", name: "G.Skill Trident Z5 RGB 32GB", category: "حافظه و رم", categorySlug: "ram",
            image: "images/products/product-trident-z5.webp", price: 10990000, oldPrice: 12500000,
            badge: "RGB Edition", rating: "۴.۸", reviews: "۵۳", availability: "موجود در انبار", popularity: 82, newness: 4,
        },
        {
            id: "samsung-990-pro-2tb", name: "Samsung 990 PRO 2TB", category: "ذخیره‌سازی", categorySlug: "storage",
            image: "images/products/product-990-pro.webp", price: 17990000, oldPrice: 19900000,
            badge: "سرعت نسل جدید", rating: "۴.۹", reviews: "۸۱", availability: "موجود در انبار", popularity: 89, newness: 1,
        },
    ];

    const categoryGrid = document.getElementById("category-grid");
    const productGrid = document.getElementById("product-grid");
    const productsCount = document.getElementById("products-count");

    if (categoryGrid) {
        categoryGrid.innerHTML = categories.map((category) => `
            <button class="category-card reveal" type="button" data-category-filter="${escapeHTML(category.slug)}" aria-label="نمایش محصولات دسته ${escapeHTML(category.title)}">
                <span class="category-image">
                    <img src="${escapeHTML(asset(category.image))}" alt="${escapeHTML(category.title)}" loading="lazy" width="520" height="400">
                </span>
                <span class="category-info">
                    <strong>${escapeHTML(category.title)}</strong>
                    <small>${escapeHTML(category.description)}</small>
                </span>
                <span class="category-arrow" aria-hidden="true"><i data-lucide="arrow-up-left"></i></span>
            </button>
        `).join("");
    }

    const discountFor = (product) => product.oldPrice > product.price
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : 0;

    const productCard = (product) => {
        const discount = discountFor(product);
        return `
            <article class="product-card reveal" data-product-id="${escapeHTML(product.id)}" data-category="${escapeHTML(product.categorySlug)}" data-popularity="${product.popularity}" data-newness="${product.newness}">
                <div class="product-image-wrap">
                    ${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ""}
                    <img src="${escapeHTML(asset(product.image))}" alt="${escapeHTML(product.name)}" loading="lazy" width="600" height="445">
                </div>
                <div class="product-rating"><i data-lucide="star" aria-hidden="true"></i><span>${escapeHTML(product.rating)}</span><small>(${escapeHTML(product.reviews)} نظر نمایشی)</small></div>
                <h3 class="product-name">${escapeHTML(product.name)}</h3>
                <p class="product-category">${escapeHTML(product.category)}</p>
                <div class="product-price-row">
                    <strong class="product-price">${faNumber.format(product.price)}</strong>
                    <span class="product-currency">تومان</span>
                    ${discount ? `<span class="product-old-price">${faNumber.format(product.oldPrice)}</span><span class="product-discount">${faNumber.format(discount)}٪ تخفیف</span>` : ""}
                </div>
                <div class="product-availability">${escapeHTML(product.availability)}</div>
            </article>
        `;
    };

    let activeSort = "featured";
    let activeCategory = "all";

    const getSortedProducts = () => {
        let result = products.filter((product) => activeCategory === "all" || product.categorySlug === activeCategory);
        if (activeSort === "popular") result = [...result].sort((a, b) => b.popularity - a.popularity);
        else if (activeSort === "newest") result = [...result].sort((a, b) => b.newness - a.newness);
        return result;
    };

    const renderProducts = () => {
        if (!productGrid) return;
        const visibleProducts = getSortedProducts();
        productGrid.innerHTML = visibleProducts.length
            ? visibleProducts.map(productCard).join("")
            : '<p class="catalog-empty">در این دسته هنوز محصولی برای نمایش ثبت نشده است.</p>';
        if (productsCount) {
            productsCount.textContent = `${faNumber.format(visibleProducts.length)} محصول${activeCategory === "all" ? " منتخب" : " در این دسته"}`;
        }
        window.lucide?.createIcons?.();
        if ("IntersectionObserver" in window) {
            document.querySelectorAll("#product-grid .reveal").forEach((element) => {
                element.classList.add("is-visible");
            });
        } else {
            document.querySelectorAll("#product-grid .reveal").forEach((element) => element.classList.add("is-visible"));
        }
    };

    categoryGrid?.addEventListener("click", (event) => {
        const card = event.target.closest("[data-category-filter]");
        if (!card) return;
        activeCategory = card.dataset.categoryFilter || "all";
        renderProducts();
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.querySelectorAll("[data-product-sort]").forEach((button) => {
        button.addEventListener("click", () => {
            activeSort = button.dataset.productSort || "featured";
            document.querySelectorAll("[data-product-sort]").forEach((tab) => {
                const active = tab === button;
                tab.classList.toggle("is-active", active);
                tab.setAttribute("aria-pressed", String(active));
            });
            renderProducts();
        });
    });

    renderProducts();
    window.ARVOXGEAR_CATALOG = Object.freeze({ categories, products });
})();
