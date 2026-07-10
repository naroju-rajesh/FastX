/*
 ==========================================================================
  FASTX RESTAURANT OWNER PORTAL LOGIC & ORDER SIMULATOR
  Manages local state, preloads Meghana Foods menu, manages tabs, handles
  full CRUD for menus, handles kitchen queue actions, and simulates live
  orders via randomized intervals.
 ==========================================================================
*/

const MENU_STORAGE_KEY = "fastx_meghana_menu";
const INCOMING_ORDERS_KEY = "fastx_incoming_orders";
const ACTIVE_ORDERS_KEY = "fastx_active_orders";
const COMPLETED_STATS_KEY = "fastx_completed_stats";
const STORE_STATUS_KEY = "fastx_store_open";

// 1. Initial 17 Menu Items Preloaded (Bengaluru Meghana Foods style)
const defaultMenu = [
  { name: "Meghana Special Chicken Biryani", price: 340.00, category: "Biryani", desc: "Signature boneless chicken biryani cooked with aromatic spices.", veg: false, available: true },
  { name: "Meghana Chicken Biryani", price: 310.00, category: "Biryani", desc: "Traditional bone-in chicken biryani cooked in layers.", veg: false, available: true },
  { name: "Meghana Mutton Biryani", price: 390.00, category: "Biryani", desc: "Tender goat meat cooked with spiced basmati rice.", veg: false, available: true },
  { name: "Meghana Paneer Biryani", price: 270.00, category: "Biryani", desc: "Fresh cottage cheese blocks layered with biryani rice.", veg: true, available: true },
  { name: "Egg Biryani", price: 240.00, category: "Biryani", desc: "Hard boiled eggs tossed in spicy masala, layered with rice.", veg: true, available: true },
  
  { name: "Chicken Kabab (Dry)", price: 220.00, category: "Starters", desc: "Deep-fried spiced chicken chunks, a local favorite.", veg: false, available: true },
  { name: "Chilli Chicken", price: 240.00, category: "Starters", desc: "Spicy Indo-Chinese chicken stir-fried with green chillies.", veg: false, available: true },
  { name: "Lemon Chicken", price: 250.00, category: "Starters", desc: "Tangy and mildly spicy chicken starter with fresh lemon zest.", veg: false, available: true },
  { name: "Paneer 65", price: 210.00, category: "Starters", desc: "Deep-fried spiced paneer chunks tossed in yogurt sauce.", veg: true, available: true },
  { name: "Gobi Manchurian", price: 180.00, category: "Starters", desc: "Crispy cauliflower florets tossed in sweet and tangy soya sauce.", veg: true, available: true },
  
  { name: "Meghana Special Chicken Curry", price: 290.00, category: "Main Course", desc: "Rich coconut-based curry cooked with boneless chicken.", veg: false, available: true },
  { name: "Butter Chicken", price: 280.00, category: "Main Course", desc: "Tandoori chicken shreds cooked in rich creamy tomato butter gravy.", veg: false, available: true },
  { name: "Paneer Butter Masala", price: 230.00, category: "Main Course", desc: "Soft paneer blocks cooked in cream-rich tomato masala.", veg: true, available: true },
  { name: "Dal Tadka", price: 170.00, category: "Main Course", desc: "Yellow lentils tempered with cumin, garlic, and red chillies.", veg: true, available: true },
  
  { name: "Gulab Jamun (2 Pcs)", price: 60.00, category: "Desserts", desc: "Deep-fried milk dumplings soaked in cardamom sugar syrup.", veg: true, available: true },
  { name: "Apricot Delight", price: 120.00, category: "Desserts", desc: "Rich custard layers topped with sweet stewed apricot puree.", veg: true, available: true },
  
  { name: "Sweet Lassi", price: 70.00, category: "Drinks", desc: "Thick sweet yogurt beverage frothed with cardamom.", veg: true, available: true }
];

// Initial Setup
window.addEventListener("DOMContentLoaded", () => {
  initializeDatabase();
  initializeUI();
  startOrderSimulator();
});

// ------------------------------------------------------------------------
// Database & Storage Initializations
// ------------------------------------------------------------------------
function initializeDatabase() {
  // Preload Menu
  if (!localStorage.getItem(MENU_STORAGE_KEY)) {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(defaultMenu));
  }
  
  // Preload Store status (default Open)
  if (localStorage.getItem(STORE_STATUS_KEY) === null) {
    localStorage.setItem(STORE_STATUS_KEY, "true");
  }

  // Preload Stats
  if (!localStorage.getItem(COMPLETED_STATS_KEY)) {
    localStorage.setItem(COMPLETED_STATS_KEY, JSON.stringify({
      totalOrders: 42,
      revenue: 14820
    }));
  }

  // Initialize empty order queues if not exist
  if (!localStorage.getItem(INCOMING_ORDERS_KEY)) {
    localStorage.setItem(INCOMING_ORDERS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(ACTIVE_ORDERS_KEY)) {
    // Start with 1 default active kitchen prep order for demonstration
    localStorage.setItem(ACTIVE_ORDERS_KEY, JSON.stringify([
      {
        orderId: "#FX-9048201",
        customer: "Ananya R. (Koramangala)",
        items: [{ name: "Meghana Special Chicken Biryani", qty: 2, price: 340.00 }],
        total: 680.00,
        status: "Preparing"
      }
    ]));
  }
}

function initializeUI() {
  loadStoreStatus();
  loadStats();
  renderMenuManagerTable();
  renderKitchenQueue();
  animateSummaryCharts();
}

// ------------------------------------------------------------------------
// SPA Tab Navigation Controls
// ------------------------------------------------------------------------
function switchTab(tabId) {
  // Remove active from all sidebar buttons
  const buttons = document.querySelectorAll(".sidebar-btn");
  buttons.forEach(btn => btn.classList.remove("active"));

  // Hide all panels
  const panels = document.querySelectorAll(".dashboard-tab-panel");
  panels.forEach(p => p.classList.remove("active"));

  // Activate selected tab & panel
  const activeBtn = document.getElementById(`btn-${tabId}`);
  if (activeBtn) activeBtn.classList.add("active");

  const activePanel = document.getElementById(`panel-${tabId}`);
  if (activePanel) activePanel.classList.add("active");
}

// ------------------------------------------------------------------------
// Stats & Profile Settings
// ------------------------------------------------------------------------
function loadStats() {
  const stats = JSON.parse(localStorage.getItem(COMPLETED_STATS_KEY));
  const active = JSON.parse(localStorage.getItem(ACTIVE_ORDERS_KEY)) || [];
  
  const ordersVal = document.getElementById("stats-orders");
  const revVal = document.getElementById("stats-revenue");
  const activeVal = document.getElementById("stats-active");

  if (ordersVal) ordersVal.textContent = stats.totalOrders;
  if (revVal) revVal.textContent = `₹${stats.revenue.toLocaleString()}`;
  if (activeVal) activeVal.textContent = active.length;
}

function loadStoreStatus() {
  const isOpen = localStorage.getItem(STORE_STATUS_KEY) === "true";
  const toggle = document.getElementById("status-toggle-checkbox");
  const label = document.getElementById("status-label");

  if (toggle) toggle.checked = isOpen;
  if (label) {
    label.textContent = isOpen ? "OPEN FOR ORDERS" : "CLOSED FOR ORDERS";
    label.style.color = isOpen ? "var(--color-success)" : "var(--color-danger)";
  }
}

function toggleStoreStatus(checked) {
  localStorage.setItem(STORE_STATUS_KEY, checked.toString());
  loadStoreStatus();
}

function saveOwnerProfile(event) {
  event.preventDefault();
  const name = document.getElementById("store-name").value;
  const address = document.getElementById("store-address").value;
  
  const brandTitle = document.getElementById("display-restaurant-name");
  if (brandTitle) brandTitle.textContent = name;

  // Save merchant session details if needed
  const session = JSON.parse(localStorage.getItem("fastx_owner_user") || "{}");
  session.restaurantName = name;
  localStorage.setItem("fastx_owner_user", JSON.stringify(session));

  alert(`Profile details updated for "${name}"!`);
}

// ------------------------------------------------------------------------
// Menu Management CRUD Logic
// ------------------------------------------------------------------------
function getMenu() {
  return JSON.parse(localStorage.getItem(MENU_STORAGE_KEY)) || [];
}

function saveMenu(menu) {
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu));
}

function renderMenuManagerTable(filteredMenu = null) {
  const tbody = document.getElementById("menu-items-table-body");
  if (!tbody) return;

  const menu = filteredMenu || getMenu();
  tbody.innerHTML = "";

  if (menu.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--color-dark-text-muted);">No dishes found in menu registry.</td></tr>`;
    return;
  }

  const globalMenuIndex = getMenu(); // Reference index matching true storage position

  menu.forEach((dish, displayIndex) => {
    // Find index of this item in actual storage (needed for edit/delete)
    const storageIndex = globalMenuIndex.findIndex(m => m.name === dish.name);
    
    const typeDot = dish.veg ? "🟢 Veg" : "🔴 Non-Veg";
    const checked = dish.available ? "checked" : "";

    tbody.innerHTML += `
      <tr>
        <td class="font-weight-bold" style="color: var(--color-dark-text-main);">${dish.name}</td>
        <td><span class="badge badge-warning" style="font-size: 0.7rem; padding: 2px 6px;">${dish.category}</span></td>
        <td style="color: var(--color-primary); font-weight: 700;">₹${dish.price.toFixed(2)}</td>
        <td style="font-size: 0.8125rem;">${typeDot}</td>
        <td>
          <label class="switch-toggle" style="width: 32px; height: 16px;">
            <input type="checkbox" ${checked} onchange="toggleAvailability(${storageIndex}, this.checked)">
            <span class="slider-switch"></span>
          </label>
        </td>
        <td>
          <div style="display: flex; gap: var(--space-2);">
            <button class="btn btn-secondary" onclick="openEditMenuModal(${storageIndex})" style="padding: 4px 8px; font-size: 0.75rem;">Edit</button>
            <button class="btn btn-outline" onclick="deleteMenuItem(${storageIndex})" style="padding: 4px 8px; font-size: 0.75rem; border-color: var(--color-danger); color: var(--color-danger);">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });
}

function filterMenuTable(searchTerm) {
  const menu = getMenu();
  const filtered = menu.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  renderMenuManagerTable(filtered);
}

function toggleAvailability(index, checked) {
  const menu = getMenu();
  if (menu[index]) {
    menu[index].available = checked;
    saveMenu(menu);
  }
}

// Modals Triggers
function openAddMenuModal() {
  document.getElementById("modal-title").textContent = "Add Menu Item";
  document.getElementById("form-item-index").value = ""; // Clear index indicator
  document.getElementById("menu-item-form").reset();
  document.getElementById("menu-modal-overlay").style.display = "flex";
}

function openEditMenuModal(index) {
  const menu = getMenu();
  const dish = menu[index];
  if (!dish) return;

  document.getElementById("modal-title").textContent = "Edit Menu Item";
  document.getElementById("form-item-index").value = index;
  
  document.getElementById("form-item-name").value = dish.name;
  document.getElementById("form-item-price").value = dish.price;
  document.getElementById("form-item-category").value = dish.category;
  document.getElementById("form-item-desc").value = dish.desc || "";
  document.getElementById("form-item-veg").checked = dish.veg;

  document.getElementById("menu-modal-overlay").style.display = "flex";
}

function closeMenuModal() {
  document.getElementById("menu-modal-overlay").style.display = "none";
}

// Save dish (CRUD Add / Edit)
function saveMenuItem(event) {
  event.preventDefault();
  const name = document.getElementById("form-item-name").value;
  const price = parseFloat(document.getElementById("form-item-price").value);
  const category = document.getElementById("form-item-category").value;
  const desc = document.getElementById("form-item-desc").value;
  const veg = document.getElementById("form-item-veg").checked;
  
  const indexVal = document.getElementById("form-item-index").value;

  const menu = getMenu();

  const dishObj = {
    name: name,
    price: price,
    category: category,
    desc: desc,
    veg: veg,
    available: true
  };

  if (indexVal !== "") {
    // Edit existing dish
    const index = parseInt(indexVal);
    menu[index] = dishObj;
    alert(`Dish "${name}" details updated.`);
  } else {
    // Add new dish
    menu.push(dishObj);
    alert(`Dish "${name}" added to menu registry.`);
  }

  saveMenu(menu);
  renderMenuManagerTable();
  closeMenuModal();
}

function deleteMenuItem(index) {
  const menu = getMenu();
  const dish = menu[index];
  if (!dish) return;

  const confirmDelete = confirm(`Are you sure you want to permanently delete "${dish.name}" from your menu?`);
  if (confirmDelete) {
    menu.splice(index, 1);
    saveMenu(menu);
    renderMenuManagerTable();
  }
}

// ------------------------------------------------------------------------
// Kitchen Queue (Incoming Orders & Prep Stages)
// ------------------------------------------------------------------------
function getQueue(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveQueue(key, queue) {
  localStorage.setItem(key, JSON.stringify(queue));
}

function renderKitchenQueue() {
  const newContainer = document.getElementById("new-orders-container");
  const activeContainer = document.getElementById("active-prep-container");

  if (!newContainer || !activeContainer) return;

  const newOrders = getQueue(INCOMING_ORDERS_KEY);
  const activeOrders = getQueue(ACTIVE_ORDERS_KEY);

  // Render New Orders Pool
  newContainer.innerHTML = "";
  if (newOrders.length === 0) {
    newContainer.innerHTML = `<div class="card" style="text-align: center; padding: 30px; color: var(--color-dark-text-muted);">✓ No new order requests pending review.</div>`;
  } else {
    newOrders.forEach((order, index) => {
      newContainer.innerHTML += `
        <div class="kitchen-order-card new-pulse">
          <div>
            <span class="font-weight-bold" style="color: var(--color-primary);">${order.orderId}</span>
            <p class="text-xs" style="color: var(--color-dark-text-muted); margin-top: 2px;">Customer: ${order.customer}</p>
          </div>

          <table class="order-items-table">
            ${order.items.map(item => `
              <tr>
                <td style="color: var(--color-dark-text-main); font-weight: 500;">${item.name}</td>
                <td style="text-align: right; color: var(--color-dark-text-muted);">x${item.qty}</td>
              </tr>
            `).join("")}
          </table>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-dark-border); padding-top: var(--space-2); margin-top: var(--space-2);">
            <span class="font-weight-bold" style="color: var(--color-success);">₹${order.total.toFixed(2)}</span>
            <div style="display: flex; gap: var(--space-2);">
              <button class="btn btn-outline" onclick="rejectIncomingOrder(${index})" style="padding: 6px 12px; font-size: 0.75rem; border-color: var(--color-danger); color: var(--color-danger);">Reject</button>
              <button class="btn btn-primary" onclick="acceptIncomingOrder(${index})" style="padding: 6px 12px; font-size: 0.75rem;">Accept</button>
            </div>
          </div>
        </div>
      `;
    });
  }

  // Render Active Prep Queue
  activeContainer.innerHTML = "";
  if (activeOrders.length === 0) {
    activeContainer.innerHTML = `<div class="card" style="text-align: center; padding: 30px; color: var(--color-dark-text-muted);">No active orders in kitchen queue.</div>`;
  } else {
    activeOrders.forEach((order, index) => {
      // Calculate status buttons
      let statusBtnHTML = "";
      if (order.status === "Preparing") {
        statusBtnHTML = `<button class="btn btn-primary" onclick="updatePrepStatus(${index}, 'Ready for Pickup')" style="padding: 6px 12px; font-size: 0.75rem;">Mark Ready</button>`;
      } else if (order.status === "Ready for Pickup") {
        statusBtnHTML = `<button class="btn btn-primary" onclick="updatePrepStatus(${index}, 'Handed to Delivery')" style="padding: 6px 12px; font-size: 0.75rem; background-color: var(--color-success); border-color: var(--color-success);">Handover to Driver</button>`;
      }

      activeContainer.innerHTML += `
        <div class="kitchen-order-card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span class="font-weight-bold" style="color: var(--color-dark-text-main);">${order.orderId}</span>
              <p class="text-xs" style="color: var(--color-dark-text-muted);">Deliver to: ${order.customer}</p>
            </div>
            <span class="badge badge-warning" style="font-size: 0.65rem;">${order.status}</span>
          </div>

          <table class="order-items-table">
            ${order.items.map(item => `
              <tr>
                <td style="color: var(--color-dark-text-main); font-weight: 500;">${item.name}</td>
                <td style="text-align: right; color: var(--color-dark-text-muted);">x${item.qty}</td>
              </tr>
            `).join("")}
          </table>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-dark-border); padding-top: var(--space-2); margin-top: var(--space-2);">
            <span class="font-weight-bold" style="color: var(--color-dark-text-muted);">₹${order.total.toFixed(2)}</span>
            ${statusBtnHTML}
          </div>
        </div>
      `;
    });
  }

  loadStats(); // Update dashboard active counter
}

// Queue Actions
function acceptIncomingOrder(index) {
  const newOrders = getQueue(INCOMING_ORDERS_KEY);
  const activeOrders = getQueue(ACTIVE_ORDERS_KEY);

  const acceptedOrder = newOrders.splice(index, 1)[0];
  acceptedOrder.status = "Preparing";
  
  activeOrders.push(acceptedOrder);

  saveQueue(INCOMING_ORDERS_KEY, newOrders);
  saveQueue(ACTIVE_ORDERS_KEY, activeOrders);

  renderKitchenQueue();
}

function rejectIncomingOrder(index) {
  const newOrders = getQueue(INCOMING_ORDERS_KEY);
  const order = newOrders[index];

  const confirmReject = confirm(`Are you sure you want to REJECT order ${order.orderId}?`);
  if (confirmReject) {
    newOrders.splice(index, 1);
    saveQueue(INCOMING_ORDERS_KEY, newOrders);
    renderKitchenQueue();
  }
}

function updatePrepStatus(index, newStatus) {
  const activeOrders = getQueue(ACTIVE_ORDERS_KEY);
  const order = activeOrders[index];

  if (!order) return;

  if (newStatus === "Handed to Delivery") {
    // Order completes and exits queue! Add to completed stats
    activeOrders.splice(index, 1);
    
    const stats = JSON.parse(localStorage.getItem(COMPLETED_STATS_KEY));
    stats.totalOrders += 1;
    stats.revenue += order.total;
    localStorage.setItem(COMPLETED_STATS_KEY, JSON.stringify(stats));

    alert(`Order ${order.orderId} handed to delivery rider. Completed!`);
  } else {
    // Status progresses to next state
    order.status = newStatus;
  }

  saveQueue(ACTIVE_ORDERS_KEY, activeOrders);
  renderKitchenQueue();
}

// ------------------------------------------------------------------------
// Incoming Order Simulation Script
// ------------------------------------------------------------------------
function startOrderSimulator() {
  // Simulates an order every 20-60 seconds if store status is OPEN
  function loop() {
    const randomDelay = Math.floor(Math.random() * (60000 - 20000 + 1)) + 20000;
    
    setTimeout(() => {
      const isOpen = localStorage.getItem(STORE_STATUS_KEY) === "true";
      if (isOpen) {
        generateMockOrder();
      }
      loop(); // recurse
    }, randomDelay);
  }
  
  loop();
}

function generateMockOrder() {
  const menu = getMenu().filter(m => m.available);
  if (menu.length === 0) return;

  // 1. Pick 1 to 3 random menu items
  const itemCount = Math.floor(Math.random() * 3) + 1;
  const itemsSelected = [];
  let totalAmount = 0;

  for (let i = 0; i < itemCount; i++) {
    const item = menu[Math.floor(Math.random() * menu.length)];
    const qty = Math.floor(Math.random() * 2) + 1;
    
    // Avoid duplicates in item description
    if (!itemsSelected.some(existing => existing.name === item.name)) {
      itemsSelected.push({
        name: item.name,
        qty: qty,
        price: item.price
      });
      totalAmount += item.price * qty;
    }
  }

  if (itemsSelected.length === 0) return;

  // 2. Mock customer profile meta
  const customers = [
    "Rahul K. (Indiranagar)", "Sneha M. (Koramangala)", "Aditya S. (HSR Layout)",
    "Pooja G. (Jayanagar)", "Vijay D. (Malleshwaram)", "Deepa R. (JP Nagar)"
  ];
  const chosenCustomer = customers[Math.floor(Math.random() * customers.length)];
  const randId = Math.floor(1000 + Math.random() * 9000);
  const orderId = `#FX-${randId}`;

  const newOrder = {
    orderId: orderId,
    customer: chosenCustomer,
    items: itemsSelected,
    total: totalAmount,
    status: "Pending Review"
  };

  // 3. Save to storage
  const incoming = getQueue(INCOMING_ORDERS_KEY);
  incoming.push(newOrder);
  saveQueue(INCOMING_ORDERS_KEY, incoming);

  // 4. Trigger audio chime mock & toast notifications
  triggerToast(newOrder);
  renderKitchenQueue();
}

// Visual Alert Toasts at bottom right
function triggerToast(order) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  // Play browser simple mock sound
  playNotificationSound();

  const toast = document.createElement("div");
  toast.className = "toast-alert";
  toast.innerHTML = `
    <div style="font-size: 1.5rem;">🔔</div>
    <div style="flex-grow: 1;">
      <p class="font-weight-bold" style="font-size: 0.875rem;">New Order: ${order.orderId}</p>
      <p class="text-xs" style="color: var(--color-dark-text-muted);">${order.items.length} items • ₹${order.total.toFixed(0)}</p>
    </div>
    <button class="btn btn-primary" onclick="acceptToastOrder('${order.orderId}', this)" style="padding: 4px 8px; font-size: 0.7rem;">Accept</button>
  `;

  container.appendChild(toast);

  // Auto remove toast after 10 seconds if unanswered
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 10000);
}

function acceptToastOrder(orderId, btnElement) {
  const newOrders = getQueue(INCOMING_ORDERS_KEY);
  const activeOrders = getQueue(ACTIVE_ORDERS_KEY);

  const index = newOrders.findIndex(o => o.orderId === orderId);
  if (index > -1) {
    const acceptedOrder = newOrders.splice(index, 1)[0];
    acceptedOrder.status = "Preparing";
    activeOrders.push(acceptedOrder);

    saveQueue(INCOMING_ORDERS_KEY, newOrders);
    saveQueue(ACTIVE_ORDERS_KEY, activeOrders);

    renderKitchenQueue();
  }

  // Remove the parent toast card
  const toast = btnElement.closest(".toast-alert");
  if (toast) toast.remove();
}

// Synthesized audio helper
function playNotificationSound() {
  try {
    // Generate soft synthesizer beep using Web Audio API
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = 587.33; // D5 pitch chime note
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime); // Low volume
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    oscillator.stop(audioCtx.currentTime + 0.8);
  } catch (e) {
    console.log("Audio notification skipped due to browser gesture constraints.");
  }
}

// ------------------------------------------------------------------------
// CSS Graphs Rendering Actions
// ------------------------------------------------------------------------
function animateSummaryCharts() {
  const bars = document.querySelectorAll(".chart-bar");
  bars.forEach(bar => {
    const height = bar.style.height;
    bar.style.height = "0%";
    setTimeout(() => {
      bar.style.height = height;
    }, 150);
  });
}

// ------------------------------------------------------------------------
// Logout redirection
// ------------------------------------------------------------------------
function processOwnerLogout() {
  localStorage.removeItem("fastx_owner_user");
  alert("Log out successful! Returning to homepage.");
  window.location.href = "../index.html";
}
