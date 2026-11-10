(() => {
    'use strict';

    const form = document.getElementById('registration-form');
    if (!form) return;

    const fieldConfig = {
        id_username: { placeholder: 'یک نام کاربری برای خودت انتخاب کن', autocomplete: 'username', inputMode: 'text', dir: 'ltr', type: 'text' },
        id_first_name: { placeholder: 'نام خودت را وارد کن', autocomplete: 'given-name', inputMode: 'text', dir: 'rtl', type: 'text' },
        id_last_name: { placeholder: 'نام خانوادگی خودت را وارد کن', autocomplete: 'family-name', inputMode: 'text', dir: 'rtl', type: 'text' },
        id_email: { placeholder: 'name@example.com', autocomplete: 'email', inputMode: 'email', dir: 'ltr', type: 'email' },
        id_phonenumber: { placeholder: 'مثلاً 09123456789 یا +49...', autocomplete: 'tel', inputMode: 'tel', dir: 'ltr', type: 'tel' },
        id_password1: { placeholder: 'رمز عبور قدرتمندی انتخاب کن', autocomplete: 'new-password', dir: 'ltr', type: 'password' },
        id_password2: { placeholder: 'رمز عبورت را دوباره وارد کن', autocomplete: 'new-password', dir: 'ltr', type: 'password' }
    };

    Object.entries(fieldConfig).forEach(([id, config]) => {
        const input = document.getElementById(id);
        if (!input) return;

        input.classList.add('ag-input');
        input.placeholder = config.placeholder;
        input.autocomplete = config.autocomplete;
        input.type = config.type;
        input.dir = config.dir;
        if (config.inputMode) input.inputMode = config.inputMode;

        const group = input.closest('.field-group');
        if (group?.classList.contains('has-error')) input.setAttribute('aria-invalid', 'true');
        const error = group?.querySelector('.field-error');
        if (error) {
            if (!error.id) error.id = `${id}-error`;
            input.setAttribute('aria-describedby', error.id);
        }
    });

    document.querySelectorAll('[data-password-toggle]').forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const target = document.getElementById(toggle.dataset.passwordToggle);
            if (!target) return;

            const showPassword = target.type === 'password';
            target.type = showPassword ? 'text' : 'password';
            toggle.setAttribute('aria-pressed', String(showPassword));
            toggle.setAttribute('aria-label', showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور');

            const icon = toggle.querySelector('i');
            icon?.classList.toggle('fa-eye', !showPassword);
            icon?.classList.toggle('fa-eye-slash', showPassword);
            target.focus({ preventScroll: true });
        });
    });

    const passwordInput = document.getElementById('id_password1');
    const confirmationInput = document.getElementById('id_password2');
    const strengthMeter = document.getElementById('strength-meter');
    const strengthLabel = document.getElementById('strength-label');
    const matchMessage = document.getElementById('password-match-message');
    const confirmControl = document.getElementById('confirm-password-control');

    function getPasswordScore(value) {
        if (!value) return 0;
        let score = 0;
        if (value.length >= 8) score += 1;
        if (value.length >= 12) score += 1;
        if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
        if (/\d/.test(value)) score += 1;
        if (/[^A-Za-z0-9]/.test(value)) score += 1;
        return score;
    }

    function updatePasswordStrength() {
        if (!passwordInput || !strengthMeter || !strengthLabel) return;
        const score = getPasswordScore(passwordInput.value);
        const widths = [0, 20, 40, 60, 80, 100];
        const labels = ['قدرت رمز عبور', 'بسیار ضعیف', 'ضعیف', 'متوسط', 'خوب', 'بسیار قوی'];
        strengthMeter.style.width = `${widths[score]}%`;
        strengthMeter.dataset.score = String(score);
        strengthLabel.textContent = labels[score];
    }

    function updatePasswordMatch() {
        if (!passwordInput || !confirmationInput || !matchMessage || !confirmControl) return;
        const first = passwordInput.value;
        const second = confirmationInput.value;
        matchMessage.classList.remove('is-match', 'is-mismatch');
        confirmControl.classList.remove('is-match', 'is-mismatch');

        if (!second) {
            matchMessage.textContent = 'رمز عبورت را برای تأیید دوباره وارد کن.';
            return;
        }
        if (first === second) {
            matchMessage.textContent = 'رمزهای عبور با هم مطابقت دارند.';
            matchMessage.classList.add('is-match');
            confirmControl.classList.add('is-match');
        } else {
            matchMessage.textContent = 'رمزهای عبور یکسان نیستند.';
            matchMessage.classList.add('is-mismatch');
            confirmControl.classList.add('is-mismatch');
        }
    }

    passwordInput?.addEventListener('input', () => {
        updatePasswordStrength();
        updatePasswordMatch();
    });
    confirmationInput?.addEventListener('input', updatePasswordMatch);
    updatePasswordStrength();
    updatePasswordMatch();

    // این listener فقط وضعیت نمایشی دکمه را عوض می‌کند؛ ارسال استاندارد POST پابرجاست.
    form.addEventListener('submit', () => {
        const button = document.getElementById('register-submit');
        if (!button) return;
        button.classList.add('is-loading');
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        const label = button.querySelector('.submit-button__label');
        if (label) label.textContent = 'در حال ساخت حساب...';
    });
})();
