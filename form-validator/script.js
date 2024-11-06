document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const emailInput = document.getElementById('email');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const submitButton = document.querySelector('.submit-btn');

  const passwordRequirements = {
    length: (str) => str.length >= 8,
    uppercase: (str) => /[A-Z]/.test(str),
    lowercase: (str) => /[a-z]/.test(str),
    number: (str) => /[0-9]/.test(str),
    special: (str) => /[^A-Za-z0-9]/.test(str),
  };

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }

  function validateUsername(username) {
    const re = /^[a-zA-Z0-9_]{4,20}$/;
    return re.test(username);
  }

  function calculatePasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;

    return score;
  }

  function updatePasswordStrength(password) {
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.querySelector('.strength-text');
    const score = calculatePasswordStrength(password);

    strengthMeter.style.width = `${score}%`;

    if (score === 0) {
      strengthMeter.style.background = '#dfe6e9';
      strengthText.textContent = 'Password Strength: Too Weak';
    } else if (score <= 40) {
      strengthMeter.style.background = '#ff7675';
      strengthText.textContent = 'Password Strength: Weak';
    } else if (score <= 70) {
      strengthMeter.style.background = '#ffeaa7';
      strengthText.textContent = 'Password Strength: Medium';
    } else {
      strengthMeter.style.background = '#00b894';
      strengthText.textContent = 'Password Strength: Strong';
    }

    // Update requirement indicators
    Object.keys(passwordRequirements).forEach((req) => {
      const reqElement = document.querySelector(`[data-requirement="${req}"]`);
      if (passwordRequirements[req](password)) {
        reqElement.classList.add('met');
      } else {
        reqElement.classList.remove('met');
      }
    });
  }

  function validateInput(input, validationFn) {
    const container = input.closest('.form-group');
    const isValid = validationFn(input.value);

    container.classList.remove('valid', 'invalid');
    container.classList.add(isValid ? 'valid' : 'invalid');

    updateSubmitButton();
    return isValid;
  }

  function validatePasswordMatch() {
    const container = confirmPasswordInput.closest('.form-group');
    const isValid =
      passwordInput.value === confirmPasswordInput.value &&
      confirmPasswordInput.value !== '';

    container.classList.remove('valid', 'invalid');
    container.classList.add(isValid ? 'valid' : 'invalid');

    updateSubmitButton();
    return isValid;
  }

  function updateSubmitButton() {
    const isEmailValid = validateEmail(emailInput.value);
    const isUsernameValid = validateUsername(usernameInput.value);
    const isPasswordValid = Object.values(passwordRequirements).every((req) =>
      req(passwordInput.value)
    );
    const isConfirmValid =
      passwordInput.value === confirmPasswordInput.value &&
      confirmPasswordInput.value !== '';

    submitButton.disabled = !(
      isEmailValid &&
      isUsernameValid &&
      isPasswordValid &&
      isConfirmValid
    );
  }

  // Event Listeners
  emailInput.addEventListener('input', () => {
    validateInput(emailInput, validateEmail);
  });

  usernameInput.addEventListener('input', () => {
    validateInput(usernameInput, validateUsername);
  });

  passwordInput.addEventListener('input', () => {
    validateInput(passwordInput, (password) =>
      Object.values(passwordRequirements).every((req) => req(password))
    );
    updatePasswordStrength(passwordInput.value);
    if (confirmPasswordInput.value) {
      validatePasswordMatch();
    }
  });

  confirmPasswordInput.addEventListener('input', validatePasswordMatch);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!submitButton.disabled) {
      // Here you would typically send the form data to your server
      console.log('Form submitted successfully!');
      alert('Account created successfully!');
    } else {
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    }
  });
});
