/*
 ==========================================================================
  FASTX ADMIN CONTROL PANEL CONTROLLER & PLATFORM SYNC
  Preloads collections of restaurants, customers, drivers, and orders.
  Controls system parameters (GST, Delivery fee) in localStorage.
  Manages platform moderation (approvals, blocks, status toggles).
 ==========================================================================
*/

const SETTINGS_KEY = "fastx_global_settings";
const RESTAURANTS_KEY = "fastx_admin_restaurants";
const CUSTOMERS_KEY = "fastx_admin_customers";
const ORDERS_KEY = "fastx_admin_orders";
const DRIVERS_KEY = "fastx_admin_drivers";
const AUDIT_LOGS_KEY = "fastx_admin_logs";

// 1. Initial Database Preloaded Payload
const defaultSettings = { deliveryCharges: 2.00, gstPercent: 5.0 };

const defaultRestaurants = [
  { id: "1", name: "Toit", area: "Indiranagar", rating: "4.7", status: "Approved", enabled: true },
  { id: "2", name: "Truffles", area: "Koramangala", rating: "4.6", status: "Approved", enabled: true },
  { id: "3", name: "MTR (Mavalli Tiffin Room)", area: "Jayanagar", rating: "4.8", status: "Approved", enabled: true },
  { id: "4", name: "CTR (Shri Sagar)", area: "Malleshwaram", rating: "4.9", status: "Approved", enabled: true },
  { id: "5", name: "Nagarjuna", area: "Indiranagar", rating: "4.6", status: "Approved", enabled: true },
  { id: "6", name: "Empire Restaurant", area: "Koramangala", rating: "4.3", status: "Approved", enabled: true },
  { id: "7", name: "Corner House Ice Creams", area: "Jayanagar", rating: "4.9", status: "Approved", enabled: true },
  { id: "8", name: "Windmills Craftworks", area: "Whitefield", rating: "4.7", status: "Approved", enabled: true },
  { id: "9", name: "The Black Pearl", area: "HSR Layout", rating: "4.4", status: "Approved", enabled: true },
  { id: "10", name: "Taza Thindi", area: "Jayanagar", rating: "4.8", status: "Approved", enabled: true },
  { id: "11", name: "Karavalli", area: "MG Road", rating: "4.8", status: "Approved", enabled: true },
  { id: "12", name: "Glen's Bakehouse", area: "Indiranagar", rating: "4.5", status: "Approved", enabled: true },
  { id: "13", name: "Sly Granny", area: "Indiranagar", rating: "4.4", status: "Approved", enabled: true },
  { id: "14", name: "Hole In The Wall Cafe", area: "Koramangala", rating: "4.6", status: "Approved", enabled: true },
  { id: "15", name: "Brooks and Bonds Brewery", area: "Koramangala", rating: "4.3", status: "Approved", enabled: true },
  { id: "16", name: "O.G. Variar & Sons", area: "Malleshwaram", rating: "4.9", status: "Approved", enabled: true },
  { id: "17", name: "Chutney Chang", area: "MG Road", rating: "4.2", status: "Approved", enabled: true },
  { id: "18", name: "Brahmin's Coffee Bar", area: "JP Nagar", rating: "4.8", status: "Approved", enabled: true },
  { id: "19", name: "Leon's Burgers & Salads", area: "HSR Layout", rating: "4.4", status: "Approved", enabled: true },
  { id: "20", name: "Veena Stores", area: "Malleshwaram", rating: "4.9", status: "Pending", enabled: true }
];

const defaultCustomers = [
  { id: "1", name: "Rohan Gupta", email: "rohan@gmail.com", phone: "+91 98204 84720", status: "Active" },
  { id: "2", name: "Ananya Rao", email: "ananya@yahoo.com", phone: "+91 80492 81928", status: "Active" },
  { id: "3", name: "Deepak Kumar", email: "deepak@gmail.com", phone: "+91 74829 10482", status: "Active" },
  { id: "4", name: "Aishwarya S.", email: "aishwarya@gmail.com", phone: "+91 99304 84729", status: "Active" },
  { id: "5", name: "Vijay Dev", email: "vijay@outlook.com", phone: "+91 88472 91847", status: "Active" },
  { id: "6", name: "Sneha Murthy", email: "sneha@gmail.com", phone: "+91 94820 18492", status: "Active" },
  { id: "7", name: "Ramesh Iyer", email: "ramesh@gmail.com", phone: "+91 90284 74829", status: "Active" },
  { id: "8", name: "Kiran Shah", email: "kiran@gmail.com", phone: "+91 70482 91829", status: "Blocked" },
  { id: "9", name: "Divya Sharma", email: "divya@gmail.com", phone: "+91 88204 84928", status: "Active" },
  { id: "10", name: "Amit Patel", email: "amit@gmail.com", phone: "+91 99201 84820", status: "Active" }
];

const defaultDrivers = [
  { id: "1", name: "Ramesh Kumar", phone: "+91 94029 48201", vehicle: "KA-03-EX-1294 (Activa)", status: "Online" },
  { id: "2", name: "Suresh Gowda", phone: "+91 88402 91829", vehicle: "KA-51-EM-4829 (Pulsar)", status: "Online" },
  { id: "3", name: "Girish Murthy", phone: "+91 70294 81920", vehicle: "KA-04-HY-9281 (Jupiter)", status: "Offline" },
  { id: "4", name: "Manjunath P.", phone: "+91 99204 82910", vehicle: "KA-02-JP-3928 (Splendor)", status: "Online" },
  { id: "5", name: "Karthik R.", phone: "+91 80294 71928", vehicle: "KA-05-KM-1029 (Access)", status: "Offline" }
];

const defaultLogs = [
  { text: "System Settings updated by Admin console", time: "Just now" },
  { text: "Restaurant 'Veena Stores' registered, pending approval", time: "10 mins ago" },
  { text: "Customer 'Kiran Shah' blocked due to payment discrepancies", time: "1 hour ago" },
  { text: "Rider 'Ramesh Kumar' toggled status to Online", time: "2 hours ago" }
];

// Initialization
window.addEventListener("DOMContentLoaded", () => {
  initializeAdminDatabase();
  initializeAdminUI();
});

function initializeAdminDatabase() {
  if (!localStorage.getItem(SETTINGS_KEY)) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  }
  if (!localStorage.getItem(RESTAURANTS_KEY)) {
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(defaultRestaurants));
  }
  if (!localStorage.getItem(CUSTOMERS_KEY)) {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(defaultCustomers));
  }
  if (!localStorage.getItem(DRIVERS_KEY)) {
    localStorage.setItem(DRIVERS_KEY, JSON.stringify(defaultDrivers));
  }
  if (!localStorage.getItem(AUDIT_LOGS_KEY)) {
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(defaultLogs));
  }

  // Preload 100+ sample orders across Bengaluru restaurants
  if (!localStorage.getItem(ORDERS_KEY)) {
    const orders = [];
    const statuses = ["DELIVERED", "DELIVERED", "DELIVERED", "CANCELLED", "DELIVERED"]; // Heavily weighted to Delivered
    const dates = ["July 08, 2026", "July 07, 2026", "July 06, 2026", "July 05, 2026", "July 04, 2026"];
    
    for (let i = 1; i <= 108; i++) {
      const rest = defaultRestaurants[Math.floor(Math.random() * defaultRestaurants.length)];
      const cust = defaultCustomers[Math.floor(Math.random() * defaultCustomers.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const date = dates[Math.floor(Math.random() * dates.length)];
      const total = Math.floor(150 + Math.random() * 750); // ₹150 to ₹900

      orders.push({
        orderId: `FX-${293847 + i}`,
        restaurant: rest.name,
        restaurantId: rest.id,
        customerName: cust.name,
        customerId: cust.id,
        total: total,
        date: date,
        status: status
      });
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
}

function initializeAdminUI() {
  loadOverviewStats();
  renderRestaurantsTable();
  renderCustomersTable();
  renderOrdersTable();
  renderDriversTable();
  renderSettingsForm();
  renderReportsList();
  renderAuditLogs();
}

// Tab Toggling SPA Controls
function switchAdminTab(tabId) {
  const buttons = document.querySelectorAll(".admin-sidebar-btn");
  buttons.forEach(btn => btn.classList.remove("active"));

  const panels = document.querySelectorAll(".admin-tab-panel");
  panels.forEach(panel => panel.classList.remove("active"));

  document.getElementById(`btn-${tabId}`).classList.add("active");
  document.getElementById(`panel-${tabId}`).classList.add("active");
}

// ------------------------------------------------------------------------
// Tab 1: Overview
// ------------------------------------------------------------------------
function loadOverviewStats() {
  const custs = JSON.parse(localStorage.getItem(CUSTOMERS_KEY)) || [];
  const rests = JSON.parse(localStorage.getItem(RESTAURANTS_KEY)) || [];
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  const drivers = JSON.parse(localStorage.getItem(DRIVERS_KEY)) || [];

  const delivered = orders.filter(o => o.status === "DELIVERED");
  const totalRevenue = delivered.reduce((sum, o) => sum + o.total, 0);
  const onlineDrivers = drivers.filter(d => d.status === "Online").length;

  document.getElementById("stats-customers").textContent = custs.length;
  document.getElementById("stats-restaurants").textContent = rests.length;
  document.getElementById("stats-orders").textContent = orders.length;
  document.getElementById("stats-revenue").textContent = `₹${totalRevenue.toLocaleString()}`;
  document.getElementById("stats-drivers").textContent = onlineDrivers;
}

function renderAuditLogs() {
  const logs = JSON.parse(localStorage.getItem(AUDIT_LOGS_KEY)) || [];
  const container = document.getElementById("activity-log-container");
  if (!container) return;

  container.innerHTML = "";
  logs.forEach(log => {
    container.innerHTML += `
      <div style="border-bottom: 1px solid var(--color-dark-border); padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
        <span class="text-xs font-weight-medium" style="color: var(--color-dark-text-main);">${log.text}</span>
        <span class="text-xs" style="color: var(--color-dark-text-muted);">${log.time}</span>
      </div>
    `;
  });
}

function addAuditLog(text) {
  const logs = JSON.parse(localStorage.getItem(AUDIT_LOGS_KEY)) || [];
  logs.unshift({ text: text, time: "Just now" });
  if (logs.length > 5) logs.pop(); // Limit to 5 logs
  localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
  renderAuditLogs();
}

// ------------------------------------------------------------------------
// Tab 2: Restaurant Management
// ------------------------------------------------------------------------
function renderRestaurantsTable(filteredList = null) {
  const tbody = document.getElementById("admin-restaurants-table-body");
  if (!tbody) return;

  const rests = filteredList || JSON.parse(localStorage.getItem(RESTAURANTS_KEY)) || [];
  tbody.innerHTML = "";

  rests.forEach((rest, idx) => {
    const isApproved = rest.status === "Approved";
    const statusClass = isApproved ? "status-approved" : "status-pending";
    const checked = rest.enabled ? "checked" : "";

    tbody.innerHTML += `
      <tr>
        <td class="font-weight-bold" style="color: var(--color-dark-text-main);">${rest.name}</td>
        <td>${rest.area}</td>
        <td style="color: #F59E0B; font-weight: 700;">★ ${rest.rating}</td>
        <td><span class="status-pill ${statusClass}">${rest.status}</span></td>
        <td>
          <label class="switch-toggle" style="width: 32px; height: 16px;">
            <input type="checkbox" ${checked} onchange="toggleRestaurantEnabled('${rest.id}', this.checked)">
            <span class="slider-switch"></span>
          </label>
        </td>
        <td>
          <div style="display: flex; gap: var(--space-2);">
            <button class="btn btn-secondary" onclick="viewRestaurantDetails('${rest.id}')" style="padding: 4px 8px; font-size: 0.75rem;">Details</button>
            ${!isApproved ? `<button class="btn btn-primary" onclick="approveRestaurant('${rest.id}')" style="padding: 4px 8px; font-size: 0.75rem;">Approve</button>` : ""}
          </div>
        </td>
      </tr>
    `;
  });
}

function filterRestaurantsTable(query) {
  const rests = JSON.parse(localStorage.getItem(RESTAURANTS_KEY)) || [];
  const filtered = rests.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));
  renderRestaurantsTable(filtered);
}

function toggleRestaurantEnabled(id, checked) {
  const rests = JSON.parse(localStorage.getItem(RESTAURANTS_KEY)) || [];
  const idx = rests.findIndex(r => r.id === id);
  if (idx > -1) {
    rests[idx].enabled = checked;
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(rests));
    addAuditLog(`Restaurant '${rests[idx].name}' toggled to ${checked ? 'Enabled' : 'Disabled'}`);
  }
}

function approveRestaurant(id) {
  const rests = JSON.parse(localStorage.getItem(RESTAURANTS_KEY)) || [];
  const idx = rests.findIndex(r => r.id === id);
  if (idx > -1) {
    rests[idx].status = "Approved";
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(rests));
    addAuditLog(`Restaurant '${rests[idx].name}' approved for listing`);
    renderRestaurantsTable();
    loadOverviewStats();
  }
}

function viewRestaurantDetails(id) {
  const rests = JSON.parse(localStorage.getItem(RESTAURANTS_KEY)) || [];
  const rest = rests.find(r => r.id === id);
  if (!rest) return;

  const modalBody = document.getElementById("detail-modal-body");
  document.getElementById("detail-modal-title").textContent = "Restaurant Profile Detail";
  
  modalBody.innerHTML = `
    <div class="detail-summary-list">
      <div class="detail-summary-item" style="border-top: none; padding-top: 0;">
        <span class="detail-label">Restaurant Name</span>
        <span class="detail-value">${rest.name}</span>
      </div>
      <div class="detail-summary-item">
        <span class="detail-label">Cuisines / Area</span>
        <span class="detail-value">North Indian, Fast Food • ${rest.area}</span>
      </div>
      <div class="detail-summary-item">
        <span class="detail-label">Overall Rating</span>
        <span class="detail-value" style="color: #F59E0B; font-weight: 700;">★ ${rest.rating}</span>
      </div>
      <div class="detail-summary-item">
        <span class="detail-label">Registration Status</span>
        <span class="detail-value">${rest.status}</span>
      </div>
    </div>
  `;

  document.getElementById("admin-detail-modal").style.display = "flex";
}

// ------------------------------------------------------------------------
// Tab 3: Customer Management
// ------------------------------------------------------------------------
function renderCustomersTable(filteredList = null) {
  const tbody = document.getElementById("admin-customers-table-body");
  if (!tbody) return;

  const custs = filteredList || JSON.parse(localStorage.getItem(CUSTOMERS_KEY)) || [];
  tbody.innerHTML = "";

  custs.forEach(cust => {
    const isActive = cust.status === "Active";
    const statusClass = isActive ? "status-active" : "status-blocked";

    tbody.innerHTML += `
      <tr>
        <td class="font-weight-bold" style="color: var(--color-dark-text-main);">${cust.name}</td>
        <td>${cust.email}</td>
        <td>${cust.phone}</td>
        <td><span class="status-pill ${statusClass}">${cust.status}</span></td>
        <td>
          <button class="btn btn-outline" onclick="toggleCustomerBlock('${cust.id}')" 
            style="padding: 4px 8px; font-size: 0.75rem; border-color: var(--color-danger); color: var(--color-danger);">
            ${isActive ? "Block" : "Unblock"}
          </button>
        </td>
        <td>
          <button class="btn btn-secondary" onclick="viewCustomerOrders('${cust.id}')" style="padding: 4px 8px; font-size: 0.75rem;">View Orders</button>
        </td>
      </tr>
    `;
  });
}

function filterCustomersTable(query) {
  const custs = JSON.parse(localStorage.getItem(CUSTOMERS_KEY)) || [];
  const filtered = custs.filter(c => c.email.toLowerCase().includes(query.toLowerCase()));
  renderCustomersTable(filtered);
}

function toggleCustomerBlock(id) {
  const custs = JSON.parse(localStorage.getItem(CUSTOMERS_KEY)) || [];
  const idx = custs.findIndex(c => c.id === id);
  if (idx > -1) {
    const isAct = custs[idx].status === "Active";
    custs[idx].status = isAct ? "Blocked" : "Active";
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(custs));
    addAuditLog(`Customer '${custs[idx].name}' toggled to ${custs[idx].status}`);
    renderCustomersTable();
  }
}

function viewCustomerOrders(id) {
  const custs = JSON.parse(localStorage.getItem(CUSTOMERS_KEY)) || [];
  const cust = custs.find(c => c.id === id);
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  
  const custOrders = orders.filter(o => o.customerId === id);

  const modalBody = document.getElementById("detail-modal-body");
  document.getElementById("detail-modal-title").textContent = `Order History: ${cust.name}`;

  if (custOrders.length === 0) {
    modalBody.innerHTML = `<p class="text-xs" style="color: var(--color-dark-text-muted);">No orders found for this customer.</p>`;
  } else {
    modalBody.innerHTML = `
      <div style="max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: var(--space-3);">
        ${custOrders.map(o => `
          <div style="border-bottom: 1px solid var(--color-dark-border); padding-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span class="text-xs font-weight-bold" style="color: var(--color-dark-text-main);">${o.restaurant}</span>
              <p class="text-xs" style="color: var(--color-dark-text-muted);">${o.date}</p>
            </div>
            <span style="color: var(--color-primary); font-weight: 700; font-size: 0.875rem;">₹${o.total}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  document.getElementById("admin-detail-modal").style.display = "flex";
}

// ------------------------------------------------------------------------
// Tab 4: Order Management
// ------------------------------------------------------------------------
function renderOrdersTable(filteredList = null) {
  const tbody = document.getElementById("admin-orders-table-body");
  if (!tbody) return;

  const orders = filteredList || JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  tbody.innerHTML = "";

  // Show top 25 orders to prevent DOM lagging
  const list = orders.slice(0, 25);

  list.forEach(order => {
    let statusClass = "status-pending";
    if (order.status === "DELIVERED") statusClass = "status-active";
    if (order.status === "CANCELLED") statusClass = "status-blocked";

    tbody.innerHTML += `
      <tr>
        <td class="font-weight-bold" style="color: var(--color-primary);">${order.orderId}</td>
        <td>${order.restaurant}</td>
        <td style="font-weight: 700;">₹${order.total}</td>
        <td style="font-size: 0.8125rem;">${order.date}</td>
        <td><span class="status-pill ${statusClass}">${order.status}</span></td>
        <td>
          <div style="display: flex; gap: var(--space-2);">
            <button class="btn btn-secondary" onclick="viewOrderDetails('${order.orderId}')" style="padding: 4px 8px; font-size: 0.75rem;">Details</button>
            ${order.status !== "DELIVERED" && order.status !== "CANCELLED" ? `
              <button class="btn btn-outline" onclick="cancelOrder('${order.orderId}')" style="padding: 4px 8px; font-size: 0.75rem; border-color: var(--color-danger); color: var(--color-danger);">Cancel</button>
            ` : ""}
          </div>
        </td>
      </tr>
    `;
  });
}

function filterOrdersTable(status) {
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  if (status === "ALL") {
    renderOrdersTable(orders);
  } else {
    const filtered = orders.filter(o => o.status === status);
    renderOrdersTable(filtered);
  }
}

function cancelOrder(orderId) {
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  const idx = orders.findIndex(o => o.orderId === orderId);
  if (idx > -1) {
    orders[idx].status = "CANCELLED";
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    addAuditLog(`Order ${orderId} cancelled by Admin`);
    renderOrdersTable();
    loadOverviewStats();
  }
}

function viewOrderDetails(orderId) {
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  const o = orders.find(ord => ord.orderId === orderId);
  if (!o) return;

  const modalBody = document.getElementById("detail-modal-body");
  document.getElementById("detail-modal-title").textContent = `Order Details: ${o.orderId}`;
  
  modalBody.innerHTML = `
    <div class="detail-summary-list">
      <div class="detail-summary-item" style="border-top: none; padding-top: 0;">
        <span class="detail-label">Restaurant Source</span>
        <span class="detail-value">${o.restaurant}</span>
      </div>
      <div class="detail-summary-item">
        <span class="detail-label">Customer Placement</span>
        <span class="detail-value">${o.customerName}</span>
      </div>
      <div class="detail-summary-item">
        <span class="detail-label">Total Invoice amount</span>
        <span class="detail-value" style="color: var(--color-primary); font-weight: 700;">₹${o.total}</span>
      </div>
      <div class="detail-summary-item">
        <span class="detail-label">Status Summary</span>
        <span class="detail-value">${o.status}</span>
      </div>
    </div>
  `;

  document.getElementById("admin-detail-modal").style.display = "flex";
}

// ------------------------------------------------------------------------
// Tab 5: Drivers / Delivery Partners
// ------------------------------------------------------------------------
function renderDriversTable() {
  const tbody = document.getElementById("admin-drivers-table-body");
  if (!tbody) return;

  const drivers = JSON.parse(localStorage.getItem(DRIVERS_KEY)) || [];
  tbody.innerHTML = "";

  drivers.forEach((driver, idx) => {
    const isOnline = driver.status === "Online";
    const statusClass = isOnline ? "status-online" : "status-offline";
    const checked = isOnline ? "checked" : "";

    tbody.innerHTML += `
      <tr>
        <td class="font-weight-bold" style="color: var(--color-dark-text-main);">${driver.name}</td>
        <td>${driver.phone}</td>
        <td>${driver.vehicle}</td>
        <td><span class="status-pill ${statusClass}">${driver.status}</span></td>
        <td>
          <label class="switch-toggle" style="width: 32px; height: 16px;">
            <input type="checkbox" ${checked} onchange="toggleDriverStatus('${driver.id}', this.checked)">
            <span class="slider-switch"></span>
          </label>
        </td>
      </tr>
    `;
  });
}

function toggleDriverStatus(id, checked) {
  const drivers = JSON.parse(localStorage.getItem(DRIVERS_KEY)) || [];
  const idx = drivers.findIndex(d => d.id === id);
  if (idx > -1) {
    drivers[idx].status = checked ? "Online" : "Offline";
    localStorage.setItem(DRIVERS_KEY, JSON.stringify(drivers));
    addAuditLog(`Rider '${drivers[idx].name}' status changed to ${drivers[idx].status}`);
    renderDriversTable();
    loadOverviewStats();
  }
}

// ------------------------------------------------------------------------
// Tab 6: Reports & Top Selling List
// ------------------------------------------------------------------------
function renderReportsList() {
  const container = document.getElementById("top-restaurants-list");
  if (!container) return;

  container.innerHTML = `
    <div>
      <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 6px;">
        <span class="font-weight-semibold">Toit (Indiranagar)</span>
        <span style="color: var(--color-primary); font-weight: 700;">₹42,800</span>
      </div>
      <div style="height: 6px; background-color: var(--color-dark-border); border-radius: var(--radius-full); overflow: hidden;">
        <div style="height: 100%; width: 85%; background-color: var(--color-primary); border-radius: var(--radius-full);"></div>
      </div>
    </div>
    <div>
      <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 6px;">
        <span class="font-weight-semibold">Truffles (Koramangala)</span>
        <span style="color: var(--color-primary); font-weight: 700;">₹36,200</span>
      </div>
      <div style="height: 6px; background-color: var(--color-dark-border); border-radius: var(--radius-full); overflow: hidden;">
        <div style="height: 100%; width: 72%; background-color: var(--color-primary); border-radius: var(--radius-full);"></div>
      </div>
    </div>
    <div>
      <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 6px;">
        <span class="font-weight-semibold">MTR (Jayanagar)</span>
        <span style="color: var(--color-primary); font-weight: 700;">₹24,800</span>
      </div>
      <div style="height: 6px; background-color: var(--color-dark-border); border-radius: var(--radius-full); overflow: hidden;">
        <div style="height: 100%; width: 50%; background-color: var(--color-primary); border-radius: var(--radius-full);"></div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------------------
// Tab 7: System Settings (GST / Delivery Charge)
// ------------------------------------------------------------------------
function renderSettingsForm() {
  const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || defaultSettings;
  
  const dcInput = document.getElementById("settings-delivery-charge");
  const gstInput = document.getElementById("settings-gst-percent");

  if (dcInput) dcInput.value = settings.deliveryCharges;
  if (gstInput) gstInput.value = settings.gstPercent;
}

function savePlatformSettings(event) {
  event.preventDefault();
  
  const deliveryFee = parseFloat(document.getElementById("settings-delivery-charge").value);
  const gst = parseFloat(document.getElementById("settings-gst-percent").value);

  const updatedSettings = {
    deliveryCharges: deliveryFee,
    gstPercent: gst
  };

  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
  addAuditLog(`Platform Settings updated: Delivery Fee = $${deliveryFee}, GST = ${gst}%`);
  
  alert("Platform Settings committed! Sync with Customer Checkout module active.");
}

// Close Modal helper
function closeDetailModal() {
  document.getElementById("admin-detail-modal").style.display = "none";
}

// Log Out redirect
function processAdminLogout() {
  localStorage.removeItem("fastx_admin_user");
  alert("Log out successful! Returning to homepage.");
  window.location.href = "../index.html";
}
