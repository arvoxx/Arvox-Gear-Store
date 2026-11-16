(() => {
    'use strict';

    const form = document.getElementById('login-form');
    if (!form) return;

    const usernameInput = document.getElementById('id_username');
    const passwordInput = document.getElementById('id_password');

    const fieldConfig = [
        {
            element: usernameInput,
            placeholder: 'نام کاربری خودت را وارد کن',
            autocomplete: 'username',
            inputMode: 'text',
            type: 'text',
            direction: 'ltr'
        },
        {
            element: passwordInput,
            placeholder: 'رمز عبور خودت را وارد کن',
            autocomplete: 'current-password',
            type: 'password',
            direction: 'ltr'
        }
    ];

    fieldConfig.forEach((config) => {
        const input = config.element;
        if (!input) return;

        input.classList.add('ag-input');
        input.placeholder = config.placeholder;
        input.autocomplete = config.autocomplete;
        input.type = config.type;
        input.dir = config.direction;
        if (config.inputMode) input.inputMode = config.inputMode;

        const group = input.closest('.field-group');
        if (group?.classList.contains('has-error')) {
            input.setAttribute('aria-invalid', 'true');
        }

        const error = group?.querySelector('.field-error');
        if (error) {
            if (!error.id) error.id = `${input.id}-error`;
            input.setAttribute('aria-describedby', error.id);
        }
    });

    document.querySelectorAll('[data-password-toggle]').forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const target = document.getElementById(toggle.dataset.passwordToggle);
            if (!target) return;

            const shouldShow = target.type === 'password';
            target.type = shouldShow ? 'text' : 'password';
            toggle.setAttribute('aria-pressed', String(shouldShow));
            toggle.setAttribute(
                'aria-label',
                shouldShow ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'
            );

            const icon = toggle.querySelector('i');
            icon?.classList.toggle('fa-eye', !shouldShow);
            icon?.classList.toggle('fa-eye-slash', shouldShow);
            target.focus({ preventScroll: true });
        });
    });

    // Only updates the submit button's appearance. Django receives the normal POST.
    form.addEventListener('submit', () => {
        const button = document.getElementById('login-submit');
        if (!button) return;

        button.classList.add('is-loading');
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');

        const label = button.querySelector('.submit-button__label');
        if (label) label.textContent = 'در حال ورود...';
    });
})();
