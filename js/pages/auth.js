/*
 ==========================================================================
  FASTX AUTHENTICATION CONTROLLER
  Manages password visibility, password strength validations, session storage,
  and redirect rules after successful auth logins.
 ==========================================================================
*/

const USER_SESSION_KEY = "fastx_user";

// 1. Password Visibility Toggle
function togglePasswordVisibility(inputFieldId) {
  const input = document.getElementById(inputFieldId);
  if (!input) return;

  const type = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", type);

  // Toggle SVG icon representation (optional visual embellishment)
  const toggleBtn = input.nextElementSibling;
  if (toggleBtn && toggleBtn.tagName === "BUTTON") {
    if (type === "text") {
      toggleBtn.innerHTML = `
        <svg class="icon icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
        </svg>
      `;
    } else {
      toggleBtn.innerHTML = `
        <svg class="icon icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      `;
    }
  }
}

// 2. Dynamic Password Strength Evaluator (Visual indicator)
function checkPasswordStrength(password) {
  const bar1 = document.getElementById("bar-1");
  const bar2 = document.getElementById("bar-2");
  const bar3 = document.getElementById("bar-3");

  if (!bar1 || !bar2 || !bar3) return;

  // Clear previous colors
  bar1.className = "strength-bar";
  bar2.className = "strength-bar";
  bar3.className = "strength-bar";

  if (password.length === 0) return;

  let score = 0;
  if (password.length >= 8) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  // Apply colors based on strength score
  if (score >= 1) {
    bar1.classList.add("weak");
  }
  if (score >= 2) {
    bar2.classList.add("medium");
  }
  if (score >= 3) {
    bar3.classList.add("strong");
  }
}

// 3. Process Login Submission
function processLogin(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const rememberMe = document.getElementById("remember-me").checked;

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Logging In...";

  // Simulate server response wait
  setTimeout(() => {
    // Save mock user session payload
    const userSession = {
      email: email,
      name: email.split("@")[0],
      loggedIn: true,
      remembered: rememberMe
    };
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userSession));

    // Handle conditional redirect logic
    handleAuthRedirect();
  }, 1000);
}

// 4. Process Registration Submission
function processRegister(event) {
  event.preventDefault();

  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("reg-confirm-password").value;

  // Form Validations
  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match. Please re-enter.");
    return;
  }

  const submitBtn = document.getElementById("submit-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating Account...";

  // Simulate register call
  setTimeout(() => {
    const userSession = {
      email: email,
      name: name,
      loggedIn: true
    };
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userSession));

    alert(`Welcome to FastX, ${name}! Your account was created successfully.`);
    handleAuthRedirect();
  }, 1000);
}

// 5. Handles redirection logic after login/signup
function handleAuthRedirect() {
  const referrer = document.referrer;
  
  // If user navigated directly from the checkout cart, return them there
  if (referrer && referrer.includes("checkout.html")) {
    window.location.href = "checkout.html";
  } else {
    // Else return them to the global homepage
    window.location.href = "../index.html";
  }
}

// 6. Forgot Password Mock Handler
function handleForgotPassword(event) {
  event.preventDefault();
  const email = prompt("Please enter your registered email address:");
  if (email) {
    alert(`A password reset link has been dispatched to: ${email}.\nPlease check your inbox/spam folders.`);
  }
}

// 7. Social Sign-In Mock Handler (Google/Github UI Only)
function mockSocialLogin(provider) {
  const button = event.currentTarget;
  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = "Authenticating...";

  setTimeout(() => {
    const userSession = {
      email: `${provider.toLowerCase()}user@fastx.com`,
      name: `${provider} Partner`,
      loggedIn: true
    };
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userSession));
    
    handleAuthRedirect();
  }, 800);
}
