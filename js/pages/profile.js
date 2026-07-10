/*
 ==========================================================================
  FASTX CUSTOMER PROFILE CONTROLLER (Premium Integrated)
  Manages session auth guards, multiple profile tab switching, 
  dynamic profile picture uploads (Base64 localStorage persistence),
  membership status validations, wallet top-ups, past order invoices,
  favorites lists, and navbar user status binding.
 ==========================================================================
*/

const USER_KEY = "fastx_user";
const WALLET_KEY = "fastx_wallet";

// Mock past orders list
const mockOrders = [
  {
    orderId: "FX-3948271",
    restaurant: "Truffles",
    date: "July 06, 2026",
    items: "1x Double Cheese Crunch Burger, 1x Cheesy Loaded Fries",
    price: "₹340.00",
    status: "Delivered",
    restId: "2"
  },
  {
    orderId: "FX-2018472",
    restaurant: "Toit",
    date: "June 28, 2026",
    items: "1x Woodfired Pepperoni Pizza, 1x Craft Ginger Ale",
    price: "₹420.00",
    status: "Delivered",
    restId: "1"
  },
  {
    orderId: "FX-1049281",
    restaurant: "MTR (Mavalli Tiffin Room)",
    date: "June 14, 2026",
    items: "2x MTR Special Masala Dosa, 1x Filter Coffee",
    price: "₹210.00",
    status: "Delivered",
    restId: "3"
  },
  {
    orderId: "FX-0847291",
    restaurant: "CTR (Shri Sagar)",
    date: "May 22, 2026",
    items: "3x Ghee Roast Dosa",
    price: "₹270.00",
    status: "Cancelled",
    restId: "4"
  }
];

window.addEventListener("DOMContentLoaded", () => {
  // 1. Session Auth Guard: Redirect if not logged in
  const session = localStorage.getItem(USER_KEY);
  if (!session) {
    alert("Authentication required. Redirecting to login page...");
    window.location.href = "login.html";
    return;
  }

  // Load user data
  loadUserProfile();
  loadWalletBalance();
  renderOrderHistory();
  renderFavorites();
  syncNavbarProfile();
});

// 1. Load profile data from localStorage
function loadUserProfile() {
  const session = localStorage.getItem(USER_KEY);
  if (!session) return;

  const user = JSON.parse(session);
  
  // Set defaults if user properties are missing
  if (!user.phone) user.phone = "+91 98765 43210";
  if (!user.address) user.address = "Flat 302, Lotus Apts, Koramangala, Bengaluru";
  if (!user.rewards) user.rewards = 120;
  if (!user.membership) user.membership = "Platinum";
  if (!user.joinedDate) user.joinedDate = "July 2026";
  
  // Apply changes to localStorage to keep profile in sync
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Bind UI Elements - Left Column Card
  const avatarElem = document.getElementById("profile-avatar");
  const nameElem = document.getElementById("profile-name");
  const membershipBadge = document.getElementById("membership-badge");
  const joinedDateElem = document.getElementById("joined-date-display");

  if (nameElem) nameElem.textContent = user.name;
  if (joinedDateElem) joinedDateElem.textContent = `Joined: ${user.joinedDate}`;
  
  if (avatarElem) {
    if (user.avatar) {
      avatarElem.innerHTML = `<img src="${user.avatar}" style="width:100%; height:100%; object-fit:cover;">`;
    } else {
      avatarElem.textContent = user.name.charAt(0).toUpperCase();
    }
  }

  // Bind Membership status colors
  if (membershipBadge) {
    membershipBadge.textContent = `${user.membership} Member`;
    membershipBadge.className = "badge"; // Reset classes
    if (user.membership.toLowerCase() === "platinum") {
      membershipBadge.classList.add("badge-success");
      membershipBadge.style.background = "linear-gradient(135deg, #7A5CFF 0%, #4D33B2 100%)";
    } else if (user.membership.toLowerCase() === "gold") {
      membershipBadge.classList.add("badge-warning");
      membershipBadge.style.background = "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)";
    } else {
      membershipBadge.classList.add("badge-secondary");
      membershipBadge.style.background = "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)";
    }
  }

  // Bind Rewards
  const rewardsElem = document.getElementById("reward-points-amount");
  if (rewardsElem) rewardsElem.textContent = `${user.rewards} pts`;

  // Bind UI Elements - Personal Info Tab
  const infoName = document.getElementById("info-name");
  const infoEmail = document.getElementById("info-email");
  const infoPhone = document.getElementById("info-phone");
  const infoMembership = document.getElementById("info-membership");
  const infoAddress = document.getElementById("info-address");

  if (infoName) infoName.textContent = user.name;
  if (infoEmail) infoEmail.textContent = user.email;
  if (infoPhone) infoPhone.textContent = user.phone;
  if (infoMembership) infoMembership.textContent = `${user.membership} Member`;
  if (infoAddress) infoAddress.textContent = user.address;

  // Bind Saved Address Home tab info
  const addressHomeText = document.getElementById("address-home-text");
  if (addressHomeText) addressHomeText.textContent = user.address;
}

// Sync user identity to navigation bar
function syncNavbarProfile() {
  const session = localStorage.getItem(USER_KEY);
  const navContainer = document.getElementById("nav-user-profile");
  if (!session || !navContainer) return;

  const user = JSON.parse(session);
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

// 2. Load wallet balance
function loadWalletBalance() {
  let balance = localStorage.getItem(WALLET_KEY);
  if (!balance) {
    balance = "450.00";
    localStorage.setItem(WALLET_KEY, balance);
  }
  
  const amountElem = document.getElementById("wallet-amount");
  if (amountElem) {
    amountElem.textContent = `₹${parseFloat(balance).toFixed(2)}`;
  }
}

// 3. Render Order History List
function renderOrderHistory() {
  const container = document.getElementById("orders-history-container");
  if (!container) return;

  container.innerHTML = "";

  mockOrders.forEach(order => {
    const isCancelled = order.status === "Cancelled";
    const badgeClass = isCancelled ? "badge-danger" : "badge-success";

    container.innerHTML += `
      <div class="order-history-card">
        <!-- Header -->
        <div class="order-card-header">
          <div>
            <h3 class="order-card-restaurant">${order.restaurant}</h3>
            <span class="order-card-date">${order.date} • Order ${order.orderId}</span>
          </div>
          <span class="badge ${badgeClass}">${order.status}</span>
        </div>

        <!-- Body -->
        <div class="order-card-body">
          <p class="order-card-items">${order.items}</p>
          <span class="order-card-price">Total Paid: ${order.price}</span>
        </div>

        <!-- Actions -->
        <div class="order-card-actions">
          <button class="btn btn-secondary" onclick="alert('Viewing Details for Order: ${order.orderId}\\n[Sandbox Mode] Full invoice view verified.')" style="padding: 6px 12px; font-size: 0.75rem;">
            View Details
          </button>
          <button class="btn btn-primary" onclick="reorder('${order.restId}', '${order.restaurant}')" style="padding: 6px 12px; font-size: 0.75rem;">
            Reorder
          </button>
        </div>
      </div>
    `;
  });
}

// 4. Render Favorites
function renderFavorites() {
  const container = document.getElementById("favorites-container");
  if (!container) return;

  // We can render standard default list, or dynamic from local storage
  const favoritesList = JSON.parse(localStorage.getItem("fastx_favorites") || "[]");
  
  if (favoritesList.length === 0) {
    // Show mock favorites to keep it visually premium
    container.innerHTML = `
      <!-- Favorite Card 1 -->
      <div class="card card-interactive restaurant-card" onclick="window.location.href='restaurant.html?id=2'">
        <div class="restaurant-img-wrapper">
          <img src="../assets/illustrations/burger_menu_item.png" alt="Truffles cover photo">
        </div>
        <div class="restaurant-details">
          <h3 class="text-lg font-weight-bold">Truffles</h3>
          <p class="text-xs">Burgers • American • Koramangala</p>
          <div class="restaurant-meta">
            <span class="restaurant-rating">★ 4.6</span>
            <span>20-30 mins</span>
          </div>
        </div>
      </div>

      <!-- Favorite Card 2 -->
      <div class="card card-interactive restaurant-card" onclick="window.location.href='restaurant.html?id=1'">
        <div class="restaurant-img-wrapper">
          <img src="../assets/illustrations/pizza_menu_item.png" alt="Toit cover photo">
        </div>
        <div class="restaurant-details">
          <h3 class="text-lg font-weight-bold">Toit</h3>
          <p class="text-xs">Italian • Pizza • Indiranagar</p>
          <div class="restaurant-meta">
            <span class="restaurant-rating">★ 4.7</span>
            <span>25-35 mins</span>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Match IDs to mock restaurants
  container.innerHTML = "";
  // Map some mock favorites
  favoritesList.forEach(id => {
    let name = "Local Partner";
    let cuisines = "Veg • South Indian";
    let rating = "4.5";
    let img = "../assets/illustrations/hero_food_banner.png";
    let restId = "1";

    if (id.startsWith("b")) {
      name = "Veena Stores"; cuisines = "South Indian Breakfast"; restId = "20";
    } else if (id.startsWith("l")) {
      name = "MTR"; cuisines = "Traditional South Thalis"; restId = "3";
    } else if (id.startsWith("d")) {
      name = "Empire Restaurant"; cuisines = "Mughlai Non-Veg"; restId = "6";
    } else if (id.startsWith("ff")) {
      name = "Truffles"; cuisines = "Burgers & Steaks"; restId = "2"; img = "../assets/illustrations/burger_menu_item.png";
    } else {
      name = "Toit Pizzeria"; cuisines = "Gourmet Woodfired Pizza"; restId = "1"; img = "../assets/illustrations/pizza_menu_item.png";
    }

    container.innerHTML += `
      <div class="card card-interactive restaurant-card" onclick="window.location.href='restaurant.html?id=${restId}'">
        <div class="restaurant-img-wrapper">
          <img src="${img}" alt="${name}">
        </div>
        <div class="restaurant-details">
          <h3 class="text-lg font-weight-bold">${name}</h3>
          <p class="text-xs">${cuisines}</p>
          <div class="restaurant-meta">
            <span class="restaurant-rating">★ ${rating}</span>
            <span>15-25 mins</span>
          </div>
        </div>
      </div>
    `;
  });
}

// 5. Tab Switching logic
function switchTab(tabId) {
  // Reset tabs headers
  const buttons = document.querySelectorAll('.profile-tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  // Hide all panels
  const panels = document.querySelectorAll('.profile-tab-panel');
  panels.forEach(p => p.classList.remove('active'));

  // Set active tab & panel
  const activeBtn = document.getElementById(`tab-${tabId}`);
  const activePanel = document.getElementById(`panel-${tabId}`);
  
  if (activeBtn) activeBtn.classList.add("active");
  if (activePanel) activePanel.classList.add("active");
}

// 6. Profile Edit Modal Toggles
function openEditModal() {
  const session = localStorage.getItem(USER_KEY);
  if (!session) return;
  
  const user = JSON.parse(session);

  // Populate form fields
  document.getElementById("edit-name").value = user.name;
  document.getElementById("edit-email").value = user.email;
  document.getElementById("edit-phone").value = user.phone || "+91 98765 43210";
  document.getElementById("edit-address").value = user.address || "Flat 302, Lotus Apts, Koramangala, Bengaluru";
  document.getElementById("edit-avatar-base64").value = user.avatar || "";

  // Preview existing avatar
  const preview = document.getElementById("edit-avatar-preview");
  if (preview) {
    if (user.avatar) {
      preview.innerHTML = `<img src="${user.avatar}" style="width:100%; height:100%; object-fit:cover;">`;
    } else {
      preview.textContent = user.name.charAt(0).toUpperCase();
    }
  }

  // Show modal overlay
  document.getElementById("edit-modal-overlay").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("edit-modal-overlay").style.display = "none";
}

// Handle Avatar file upload and convert to base64
function handleAvatarFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Data = e.target.result;
    document.getElementById("edit-avatar-base64").value = base64Data;
    
    // Update preview
    const preview = document.getElementById("edit-avatar-preview");
    if (preview) {
      preview.innerHTML = `<img src="${base64Data}" style="width:100%; height:100%; object-fit:cover;">`;
    }
  };
  reader.readAsDataURL(file);
}

// Save profile updates
function saveProfileChanges(event) {
  event.preventDefault();

  const newName = document.getElementById("edit-name").value;
  const newEmail = document.getElementById("edit-email").value;
  const newPhone = document.getElementById("edit-phone").value;
  const newAddress = document.getElementById("edit-address").value;
  const newAvatar = document.getElementById("edit-avatar-base64").value;

  const session = localStorage.getItem(USER_KEY);
  if (!session) return;
  
  const user = JSON.parse(session);
  user.name = newName;
  user.email = newEmail;
  user.phone = newPhone;
  user.address = newAddress;
  user.avatar = newAvatar;

  localStorage.setItem(USER_KEY, JSON.stringify(user));
  
  // Reload details
  loadUserProfile();
  syncNavbarProfile();
  closeEditModal();
  
  alert("Profile settings updated successfully!");
}

// 7. Wallet Top up Simulator
function mockTopUp() {
  const topUpValue = prompt("Enter amount to add to wallet (₹):");
  if (!topUpValue || isNaN(topUpValue) || parseFloat(topUpValue) <= 0) {
    alert("Please enter a valid numeric top-up value.");
    return;
  }

  let currentBalance = parseFloat(localStorage.getItem(WALLET_KEY) || "450.00");
  currentBalance += parseFloat(topUpValue);

  localStorage.setItem(WALLET_KEY, currentBalance.toString());
  loadWalletBalance();

  alert(`Top-up successful! ₹${parseFloat(topUpValue).toFixed(2)} added to your wallet.`);
}

// 8. Mock Reorder logic (clears cart, sets metadata, routes)
function reorder(restId, restName) {
  const confirmReorder = confirm(`Discard current cart and reorder from "${restName}"?`);
  if (!confirmReorder) return;

  // Clear cart and prepare new structure
  localStorage.setItem("fastx_cart", JSON.stringify({
    restaurantId: restId,
    restaurantName: restName,
    items: [
      {
        name: "Double Cheese Crunch Burger",
        price: 340.00,
        quantity: 1,
        veg: false,
        img: "../assets/illustrations/burger_menu_item.png"
      }
    ]
  }));

  alert("Items added to cart! Redirecting to checkout...");
  window.location.href = "checkout.html";
}

// Settings checkbox toggler mock
function toggleSetting(settingName) {
  alert(`Settings changed: ${settingName.toUpperCase()} notifications update verified.`);
}

// Session log out
function processLogout() {
  localStorage.removeItem(USER_KEY);
  alert("Log out successful! Returning to homepage.");
  window.location.href = "../index.html";
}
