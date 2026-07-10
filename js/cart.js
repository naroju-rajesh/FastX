/*
 ==========================================================================
  FASTX SHARED CART UTILITY
  Handles localStorage cart state, quantity updates, restaurant mismatch
  validations, and calculation of counts/subtotals.
 ==========================================================================
*/

const CART_KEY = "fastx_cart";

// Retrieve cart from localStorage
function getCart() {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : { restaurantId: null, restaurantName: null, items: [] };
}

// Save cart back to localStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Broadcast update event for navbar sync
  window.dispatchEvent(new Event("cartUpdated"));
}

// Add an item to the cart
function addToCart(restaurantId, restaurantName, item) {
  let cart = getCart();

  // Validate restaurant mismatch
  if (cart.restaurantId && cart.restaurantId !== restaurantId) {
    const confirmClear = confirm(
      `Your cart contains items from "${cart.restaurantName}".\nDiscard those items and start a new order at "${restaurantName}"?`
    );
    if (confirmClear) {
      cart = { restaurantId: restaurantId, restaurantName: restaurantName, items: [] };
    } else {
      return false; // Cancelled addition
    }
  }

  // Set active restaurant metadata
  cart.restaurantId = restaurantId;
  cart.restaurantName = restaurantName;

  // Search if item already exists
  const existingItemIndex = cart.items.findIndex(i => i.name === item.name);
  
  // Parse price cleanly, handling string with currency symbols and numbers
  let parsedPrice = 0;
  if (typeof item.price === "number") {
    parsedPrice = item.price;
  } else if (typeof item.price === "string") {
    parsedPrice = parseFloat(item.price.replace(/[^0-9.]/g, ""));
  }

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += 1;
  } else {
    cart.items.push({
      name: item.name,
      price: parsedPrice,
      quantity: 1,
      veg: item.veg,
      img: item.img || "assets/illustrations/hero_food_banner.png"
    });
  }

  saveCart(cart);
  showToast("Item added to cart");
  return true;
}

// Display a beautiful glassmorphic success toast notification
function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.bottom = "24px";
    container.style.right = "24px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "8px";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.style.background = "rgba(16, 185, 129, 0.9)"; // Success emerald green tint with glassmorphism
  toast.style.backdropFilter = "blur(10px)";
  toast.style.webkitBackdropFilter = "blur(10px)";
  toast.style.color = "#FFFFFF";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "12px";
  toast.style.fontWeight = "600";
  toast.style.fontSize = "0.875rem";
  toast.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.35)";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "8px";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(20px)";
  toast.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
  
  toast.innerHTML = `<span>✔</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger entrance transition
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 10);

  // Trigger fade out and removal
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-20px)";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Update quantity of an item (+1 or -1)
function updateCartQuantity(itemName, change) {
  let cart = getCart();
  const index = cart.items.findIndex(i => i.name === itemName);

  if (index > -1) {
    cart.items[index].quantity += change;
    
    // If quantity is 0, remove item
    if (cart.items[index].quantity <= 0) {
      cart.items.splice(index, 1);
    }
    
    // If cart is empty, reset metadata
    if (cart.items.length === 0) {
      cart = { restaurantId: null, restaurantName: null, items: [] };
    }
    
    saveCart(cart);
  }
}

// Clear entire cart
function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cartUpdated"));
}

// Calculate total item count (for nav cart badge)
function getCartCount() {
  const cart = getCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

// Calculate subtotal
function getCartSubtotal() {
  const cart = getCart();
  return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Shared Navbar Session Sync logic
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", syncNavbarProfileShared);
} else {
  syncNavbarProfileShared();
}

function syncNavbarProfileShared() {
  const session = localStorage.getItem("fastx_user");
  const navContainer = document.getElementById("nav-user-info");
  const loginBtn = document.getElementById("nav-login-btn");
  const profileLink = document.getElementById("nav-profile-link");

  if (session) {
    try {
      const user = JSON.parse(session);
      if (!user) return;

      const userName = user.name || "User";
      
      // Determine path prefix based on whether we are in /customer/ folder
      const isCustomerFolder = window.location.pathname.includes("/customer/");
      const profilePath = isCustomerFolder ? "profile.html" : "customer/profile.html";

      if (loginBtn) {
        loginBtn.style.display = "none";
      }
      if (profileLink) {
        profileLink.style.display = "block";
        profileLink.href = profilePath;
      }
      
      if (navContainer) {
        navContainer.style.display = "flex";
        const avatarHtml = user.avatar 
          ? `<img src="${user.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--color-primary);">` 
          : `<div style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">${userName.charAt(0).toUpperCase()}</div>`;
        
        navContainer.innerHTML = `
          <a href="${profilePath}" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--color-dark-text-main); font-weight: 600; font-size: 0.875rem;">
            ${avatarHtml}
            <span class="nav-username">${userName.split(" ")[0]}</span>
          </a>
        `;
      }
    } catch (e) {
      console.error("Error parsing user session:", e);
      localStorage.removeItem("fastx_user");
    }
  }
}
