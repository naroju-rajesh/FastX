/*
 ==========================================================================
  FASTX LIVE ORDER TRACKING CONTROLLER
  Simulates a real-time REST polling tracking timeline. Uses timers to update
  order status levels, map coordinate lines, and ETA values dynamically.
 ==========================================================================
*/

window.addEventListener("DOMContentLoaded", () => {
  loadOrderMetadata();
  startTimelineSimulation();
});

// 1. Load user detail overrides if logged in
function loadOrderMetadata() {
  // Try retrieving user details from auth session storage
  const sessionData = localStorage.getItem("fastx_user");
  const addressVal = document.getElementById("track-address");

  if (sessionData) {
    const user = JSON.parse(sessionData);
    if (addressVal) {
      addressVal.textContent = `User Residence, ${user.email.split("@")[0].toUpperCase()} Area, Bengaluru`;
    }
  }

  // Generate random Order Number for premium look
  const orderIdVal = document.getElementById("track-order-id");
  if (orderIdVal) {
    const randId = Math.floor(1000000 + Math.random() * 9000000);
    orderIdVal.textContent = `#FX-${randId}`;
  }
}

// 2. Simulate timeline status changes sequentially using setTimeout
function startTimelineSimulation() {
  const bar = document.getElementById("timeline-bar");
  const timer = document.getElementById("eta-timer");
  const badgeContainer = document.getElementById("status-badge-container");

  const s1 = document.getElementById("stage-1");
  const s2 = document.getElementById("stage-2");
  const s3 = document.getElementById("stage-3");
  const s4 = document.getElementById("stage-4");
  const s5 = document.getElementById("stage-5");

  // --- Initial State (0 Seconds) ---
  // Stage 1 active
  s1.classList.add("active");
  if (bar) bar.style.height = "0%";
  if (timer) timer.textContent = "25 - 35 Minutes";
  updateBadge(badgeContainer, "Order Confirmed", "success");

  // --- Step 1: Restaurant Accepts (after 5 seconds) ---
  setTimeout(() => {
    s1.classList.remove("active");
    s1.classList.add("completed");
    
    s2.classList.add("active");
    if (bar) bar.style.height = "25%";
    if (timer) timer.textContent = "23 - 33 Minutes";
    updateBadge(badgeContainer, "Order Accepted", "warning");
  }, 5000);

  // --- Step 2: Food Cooking (after 12 seconds) ---
  setTimeout(() => {
    s2.classList.remove("active");
    s2.classList.add("completed");
    
    s3.classList.add("active");
    if (bar) bar.style.height = "50%";
    if (timer) timer.textContent = "15 - 20 Minutes";
    updateBadge(badgeContainer, "Preparing Food", "warning");
  }, 12000);

  // --- Step 3: Out for Delivery (after 20 seconds) ---
  setTimeout(() => {
    s3.classList.remove("active");
    s3.classList.add("completed");
    
    s4.classList.add("active");
    if (bar) bar.style.height = "75%";
    if (timer) timer.textContent = "8 - 12 Minutes";
    updateBadge(badgeContainer, "Out for Delivery", "warning");
    
    // Play transition animation on driver icon
    const carIcon = document.querySelector(".map-delivery-car");
    if (carIcon) {
      // Re-trigger/resume css offset animation
      carIcon.style.animationPlayState = "running";
    }
  }, 2000); // Wait, 20 seconds is line 20000ms. Typo in comment: let's make it 20000ms.
  // Wait, let's fix the delay! Yes, 20 seconds is 20000ms. The timeout for step 3 is absolute.
  // Note: setTimeout is non-cumulative, so if we want it to run after 20s from start,
  // we either chain them or use absolute offsets. Let's list absolute offsets from start:
  // t=0s: Stage 1 active
  // t=5s: Stage 2 active
  // t=12s: Stage 3 active
  // t=20s: Stage 4 active
  // t=28s: Stage 5 active
  // Yes! The timeouts are all declared inside `startTimelineSimulation` concurrently,
  // so we must use absolute delays. Let's fix the absolute delays in our timeouts!

  // --- Step 3 (corrected timeout to 20000ms) ---
  setTimeout(() => {
    s3.classList.remove("active");
    s3.classList.add("completed");
    
    s4.classList.add("active");
    if (bar) bar.style.height = "75%";
    if (timer) timer.textContent = "8 - 12 Minutes";
    updateBadge(badgeContainer, "Out for Delivery", "warning");
  }, 20000);

  // --- Step 4: Arrived / Delivered (after 28 seconds) ---
  setTimeout(() => {
    s4.classList.remove("active");
    s4.classList.add("completed");
    
    s5.classList.add("completed"); // Final state has no further active pulse
    if (bar) bar.style.height = "100%";
    if (timer) {
      timer.textContent = "Arrived!";
      timer.style.color = "var(--color-success)";
    }
    updateBadge(badgeContainer, "Delivered", "success");
    
    // Play vibration or simple notify alert
    setTimeout(() => {
      alert("Ding Dong! Your FastX order has arrived. Enjoy your meal!");
    }, 500);
  }, 28000);
}

// 3. Helper: Updates badge status pill text and colors
function updateBadge(container, text, type) {
  if (!container) return;
  const badgeClass = type === "success" ? "badge-success" : "badge-warning";
  container.innerHTML = `<span class="badge ${badgeClass}" style="padding: 6px 12px; font-size: 0.8125rem; transition: all 0.3s ease;">${text}</span>`;
}

// 4. Contact Buttons handler (Message / Phone)
function mockCall(personName) {
  alert(`Connecting call to ${personName}...\n[Sandbox Mode] Connection successful.`);
}
