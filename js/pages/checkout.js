/*
 ==========================================================================
  FASTX CHECKOUT CONTROLLER
  Manages cart calculations, conditional payment inputs, quantity adjustments
  on checkout page, and mock order submit.
 ==========================================================================
*/

window.addEventListener("DOMContentLoaded", () => {
  renderCheckout();
  prepopulateUserData();
  syncNavbarProfile();

  // Re-render when cart is updated locally
  window.addEventListener("cartUpdated", renderCheckout);
});

// Sync navbar profile identity
function syncNavbarProfile() {
  const session = localStorage.getItem("fastx_user");
  const navContainer = document.getElementById("nav-user-info");
  const loginBtn = document.getElementById("nav-login-btn");
  const profileLink = document.getElementById("nav-profile-link");

  if (session) {
    const user = JSON.parse(session);
    if (loginBtn) loginBtn.style.display = "none";
    if (profileLink) profileLink.style.display = "block";
    if (navContainer) {
      navContainer.style.display = "flex";
      const avatarHtml = user.avatar 
        ? `<img src="${user.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--color-primary);">` 
        : `<div style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">${user.name.charAt(0).toUpperCase()}</div>`;
      
      navContainer.innerHTML = `
        <a href="profile.html" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--color-dark-text-main); font-weight: 600; font-size: 0.875rem;">
          ${avatarHtml}
          <span class="nav-username">${user.name.split(" ")[0]}</span>
        </a>
      `;
    }
  }
}

// Prepopulate address details if user is logged in
function prepopulateUserData() {
  const session = localStorage.getItem("fastx_user");
  if (!session) return;

  const user = JSON.parse(session);
  const fullNameInput = document.getElementById("full-name");
  const phoneInput = document.getElementById("phone-number");
  const addressInput = document.getElementById("street-address");

  if (fullNameInput) fullNameInput.value = user.name || "";
  if (phoneInput) phoneInput.value = user.phone || "";
  if (addressInput) addressInput.value = user.address || "";
}

// 1. Dynamic rendering of checkout page states
function renderCheckout() {
  const cart = getCart();

  const checkoutGrid = document.getElementById("checkout-grid");
  const emptyCartView = document.getElementById("empty-cart-view");

  if (!cart.items || cart.items.length === 0) {
    // Show empty cart panel
    if (checkoutGrid) checkoutGrid.style.display = "none";
    if (emptyCartView) emptyCartView.style.display = "flex";
    return;
  }

  // Show checkout content
  if (checkoutGrid) checkoutGrid.style.display = "grid";
  if (emptyCartView) emptyCartView.style.display = "none";

  // Set Restaurant Name Header
  const restNameHeader = document.getElementById("summary-restaurant-name");
  if (restNameHeader) restNameHeader.textContent = cart.restaurantName;

  // Render items list
  const itemsContainer = document.getElementById("summary-items");
  if (itemsContainer) {
    itemsContainer.innerHTML = "";
    
    cart.items.forEach(item => {
      itemsContainer.innerHTML += `
        <div class="cart-item-row">
          <!-- Thumbnail -->
          <img class="cart-item-img" src="${item.img && item.img.startsWith('assets/') ? '../' + item.img : item.img}" alt="${item.name}" onerror="this.onerror=null; this.src='../assets/illustrations/hero_food_banner.png';">
          
          <!-- Name & Single Price -->
          <div class="cart-item-meta">
            <span class="font-weight-semibold text-sm" style="color: var(--color-dark-text-main);">${item.name}</span>
            <span class="text-xs" style="color: var(--color-primary); font-weight: 600;">$${item.price.toFixed(2)}</span>
          </div>

          <!-- Controls: Add/Minus and Price Total -->
          <div class="cart-item-controls">
            <span class="font-weight-bold text-sm" style="color: var(--color-dark-text-main);">$${(item.price * item.quantity).toFixed(2)}</span>
            
            <div style="display: flex; align-items: center; border: 1px solid var(--color-dark-border); border-radius: var(--radius-sm); overflow: hidden; background-color: var(--color-dark-bg);">
              <button type="button" onclick="changeQty('${item.name}', -1)" style="background: none; border: none; color: var(--color-dark-text-muted); cursor: pointer; padding: 2px 8px; font-size: 0.75rem;">-</button>
              <span class="font-weight-semibold text-xs" style="padding: 0 4px; color: var(--color-dark-text-main);">${item.quantity}</span>
              <button type="button" onclick="changeQty('${item.name}', 1)" style="background: none; border: none; color: var(--color-dark-text-muted); cursor: pointer; padding: 2px 8px; font-size: 0.75rem;">+</button>
            </div>
          </div>
        </div>
      `;
    });
  }

  // Calculate pricing values
  calculatePricing(cart);
}

// 2. Perform Calculations
function calculatePricing(cart) {
  const subtotal = getCartSubtotal();
  
  // Retrieve administrative system settings dynamically from localStorage
  const settingsData = localStorage.getItem("fastx_global_settings");
  const settings = settingsData ? JSON.parse(settingsData) : { deliveryCharges: 2.00, gstPercent: 5.0 };

  // Custom Premium Rule: Free delivery if order subtotal exceeds $15!
  const deliveryFee = subtotal >= 15.00 ? 0.00 : settings.deliveryCharges;
  
  const taxPercent = settings.gstPercent / 100;
  const taxes = subtotal * taxPercent;
  const grandTotal = subtotal + deliveryFee + taxes;

  // Bind values to DOM
  const subtotalElem = document.getElementById("summary-subtotal");
  const deliveryElem = document.getElementById("summary-delivery");
  const taxesElem = document.getElementById("summary-taxes");
  const grandTotalElem = document.getElementById("summary-grandtotal");

  if (subtotalElem) subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
  
  if (deliveryElem) {
    deliveryElem.textContent = deliveryFee === 0.00 ? "FREE" : `$${deliveryFee.toFixed(2)}`;
    if (deliveryFee === 0.00) {
      deliveryElem.style.color = "var(--color-success)";
      deliveryElem.style.fontWeight = "700";
    } else {
      deliveryElem.style.color = "inherit";
      deliveryElem.style.fontWeight = "inherit";
    }
  }

  if (taxesElem) taxesElem.textContent = `$${taxes.toFixed(2)}`;
  if (grandTotalElem) grandTotalElem.textContent = `$${grandTotal.toFixed(2)}`;
}

// 3. Checkout Qty adjustments
function changeQty(name, change) {
  updateCartQuantity(name, change);
}

// 4. Payment selections toggles (UPI, Card, COD)
function togglePaymentFields(method) {
  // Reset active classes on visual cards
  document.getElementById("pay-upi-label").classList.remove("active");
  document.getElementById("pay-card-label").classList.remove("active");
  document.getElementById("pay-cod-label").classList.remove("active");

  // Hide all conditional detail panels
  document.getElementById("upi-details-panel").style.display = "none";
  document.getElementById("card-details-panel").style.display = "none";
  document.getElementById("cod-details-panel").style.display = "none";

  // Deactivate required attribute rules
  document.getElementById("upi-id").required = false;
  document.getElementById("card-number").required = false;
  document.getElementById("card-expiry").required = false;
  document.getElementById("card-cvv").required = false;

  // Activate chosen card
  if (method === "UPI") {
    document.getElementById("pay-upi-label").classList.add("active");
    document.getElementById("upi-details-panel").style.display = "block";
    document.getElementById("upi-id").required = true;
  } else if (method === "CARD") {
    document.getElementById("pay-card-label").classList.add("active");
    document.getElementById("card-details-panel").style.display = "block";
    document.getElementById("card-number").required = true;
    document.getElementById("card-expiry").required = true;
    document.getElementById("card-cvv").required = true;
  } else if (method === "COD") {
    document.getElementById("pay-cod-label").classList.add("active");
    document.getElementById("cod-details-panel").style.display = "block";
  }
}

// 5. Place Mock Order Form Action
function handlePlaceOrder(event) {
  event.preventDefault(); // Block native page refresh submit

  // Verify form validations passed
  const form = document.getElementById("checkout-form");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Clear cart local cache
  clearCart();

  // Trigger Mock Success Modal Popup
  const modal = document.getElementById("success-modal-overlay");
  if (modal) modal.style.display = "flex";
}

// 6. Redirect actions
function redirectToHome() {
  window.location.href = "../index.html";
}
