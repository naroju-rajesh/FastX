# FastX - AI-Powered Food Delivery Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-supported-orange.svg)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-vanilla-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JS](https://img.shields.io/badge/JavaScript-Vanilla-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Glassmorphism](https://img.shields.io/badge/Theme-Glassmorphism-purple.svg)](#)

FastX is a state-of-the-art, premium food delivery web application built entirely on a hybrid static/vanilla JS architecture. FastX features a gorgeous, dark-themed **Glassmorphism UI** styled with maximum visual fidelity. It leverages client-side storage to deliver a full-featured simulation of user flows—from food browsing and category filtering to cart coordination, checkout verification, real-time driver tracking, and dedicated admin/restaurant portals.

---

## 🚀 Features

* **Premium Visual Design**: Dark-themed layout incorporating frosted glass overlays, HSL tailored neon colors, smooth hover animations, and scale lifts.
* **Smart Shopping Cart**: Handles `localStorage` persistence, quantitative calculations, custom toast notifications, and restaurant mismatch validations.
* **Premium Profile Portal**: Contains dynamic user summaries, platinum/gold/silver membership badges, active wallet balances, reward points trackers, notification configurations, and a mock Base64 profile picture uploader.
* **Live SVGA Tracking**: Simulate the entire order dispatch lifecycle using synchronized SVG road offsets and real-time decrementing ETA timers.
* **Multi-Portal Architecture**: Fully integrated separate portals for **Customers**, **Admins**, and **Restaurant Owners** to manage menus and process simulated orders.

---

## 🎨 Preview & Screenshots

Below is a visual design mockup of the premium customer profile portal:

```
+--------------------------------------------------------------+
|   FastX Navbar                     [Cart]  [User Avatar]     |
+--------------------------------------------------------------+
|  +------------------------+  +----------------------------+  |
|  |  [User Photo]          |  | Personal Info | My Orders  |  |
|  |  Guest User            |  +----------------------------+  |
|  |  [Platinum Badge]      |  | Full Name: Guest User      |  |
|  |  Joined: July 2026     |  | Email: guest@fastx.com     |  |
|  +------------------------+  | Phone: +91 98765 4321      |  |
|  | Wallet:  ₹450.00       |  | Address: Flat 302, Lotus   |  |
|  | Rewards: 120 pts       |  +----------------------------+  |
|  +------------------------+  | Saved Payment Options      |  |
|                              | [Debit Card]  [UPI Mobile] |  |
|                              +----------------------------+  |
+--------------------------------------------------------------+
```

*(Refer to `assets/illustrations/` for visual assets).*

---

## 🛠️ Technologies Used

* **Frontend**: HTML5 (Semantic Structure)
* **Styling**: Vanilla CSS3 (Custom Variables, CSS Flexbox, CSS Grid, Glassmorphism Backdrop Blurs, Keyframe Animations)
* **State & Logic**: Vanilla ES6 JavaScript
* **Database & Persistence**: Web Storage API (`localStorage` cache)

---

## 📦 Folder Structure

```
AI PROJECT/
├── admin/                     # Administrator portal pages
│   ├── dashboard.html
│   └── login.html
├── assets/                    # Image, video, and vector assets
│   └── illustrations/
│       └── categories/
├── css/                       # Stylesheets
│   ├── pages/                 # Page-specific styling rules
│   ├── components.css         # Global reusable component rules
│   └── design-system.css      # Variables, resets, and utility grid
├── customer/                  # User/Customer flow pages
│   ├── category.html
│   ├── checkout.html
│   ├── login.html
│   ├── profile.html
│   ├── register.html
│   ├── restaurant.html
│   └── track.html
├── js/                        # JavaScript controllers
│   ├── pages/                 # Page-specific application logic
│   └── cart.js                # Core cart coordination system & navbar sync
├── restaurant/                # Partner/Restaurant owner portal pages
│   ├── dashboard.html
│   └── login.html
├── .gitignore                 # standard VCS directory filter
├── index.html                 # Homepage entry point
├── LICENSE                    # MIT License credentials
└── README.md                  # Project documentation
```

---

## 💻 Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/naroju-rajesh/FastX.git
   ```
2. **Navigate to the Directory**:
   ```bash
   cd FastX
   ```

---

## 🏃 How to Run the Project

Since this is a static client-side web application, it does not require any background compilation or dependencies:

1. **Direct File Open**:
   * Double-click `index.html` at the root folder to open it in your default web browser.
2. **Local HTTP Server (Recommended)**:
   * To prevent any CORS issues with local asset relative paths, serve it via a simple server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Or using Node.js (npx)
     npx http-server -p 8000
     ```
   * Open `http://localhost:8000` in your web browser.

---

## 📖 Usage Guide

1. **Register & Log In**: Visit the Login page, enter your email and password. Once logged in, notice your name/avatar synchronized in the navigation header.
2. **Explore Food Categories**: Select a category on the homepage (like Breakfast, Lunch, Desserts) to browse filtered items, or browse the sliders.
3. **Cart Flow**: Add items to your cart. Adding items from a different restaurant will trigger a mismatch alert. Once loaded, click the Cart icon to proceed to the Checkout screen.
4. **Checkout**: Verify delivery details, select your mock payment method (UPI, Card, or COD), and submit the order.
5. **Real-time Tracking**: Watch the order timeline progress. Once it hits "Out for Delivery", see the delivery vehicle animate along the map path and the countdown update.
6. **Owner/Admin Portals**: Manage menus, toggle store states, and check metrics via the `/admin` and `/restaurant` routes.

---

## 🔮 Future Enhancements

* **Database Backend Integration**: Replace `localStorage` with a robust Node.js/Express API and MongoDB databases.
* **Interactive Live Maps**: Replace the mock SVG routing map with real-time GPS coordinate telemetry using Mapbox or Leaflet.js.
* **AI Engine Deployment**: Hook a recommendation engine (TensorFlow.js) to serve personalized dinner ideas based on user order trends.
* **WebSockets Integration**: Implement actual real-time bidirectional driver positioning updates.

---

## 🤝 Contributing Guidelines

Contributions are welcome! Please follow these steps to contribute:

1. Fork the Project.
2. Create a Feature Branch (`git checkout -b feature/NewFeature`).
3. Commit your Changes (`git commit -m 'feat: add a premium feature'`).
4. Push to the Branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.

---

## 👤 Author Information

* **Developer**: FastX Core Team
* **E-mail**: ramaraju@example.com (Placeholder)
* **GitHub**: [github.com/naroju-rajesh](https://github.com/naroju-rajesh)
