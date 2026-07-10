/*
 ==========================================================================
  FASTX RESTAURANT DETAIL LOGIC (Dynamic Cart Enabled)
  This script reads the restaurant ID from the URL query parameters,
  populates the profile & menu items, and integrates the cart quantity adjusters.
 ==========================================================================
*/

// Dynamically import cart.js if not loaded
if (typeof getCart === "undefined") {
  const script = document.createElement("script");
  script.src = "../js/cart.js";
  script.async = false; // Execute synchronously after loading
  document.head.appendChild(script);
  script.onload = () => {
    initPage();
  };
} else {
  window.addEventListener("DOMContentLoaded", initPage);
}

// 1. Restaurant Database (Detailed menus for Bengaluru establishments)
const restaurantsDatabase = {
  "1": {
    name: "Toit",
    tagline: "Indiranagar's Legendary Woodfired Pizzeria & Grill",
    cuisines: "Italian • Pizza • Brewpub",
    rating: "4.7",
    reviews: "500+",
    time: "25-35 mins",
    cost: "₹800 for two",
    cover: "../assets/illustrations/pizza_menu_item.png",
    address: "298, 100 Feet Rd, Near KFC Stage 2, Indiranagar, Bengaluru",
    menu: {
      "Starters": [
        { name: "Toit Baked Potatoes", price: "$5.99", desc: "Cheesy loaded baked potatoes with fresh herbs and sour cream garlic dip.", veg: true, img: "../assets/illustrations/hero_food_banner.png" },
        { name: "Spiced Chicken Skewers", price: "$7.99", desc: "Tender grilled chicken skewers seasoned with local spices and lemon glaze.", veg: false, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Main Course": [
        { name: "Woodfired Pepperoni Pizza", price: "$12.99", desc: "Traditional pepperoni slices with rich marinara sauce and fresh mozzarella.", veg: false, img: "../assets/illustrations/pizza_menu_item.png" },
        { name: "Pesto Basil Pasta", price: "$10.49", desc: "Penne pasta tossed in freshly made basil pesto sauce with pine nuts.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Desserts": [
        { name: "Warm Chocolate Fudge", price: "$4.99", desc: "Hot molten chocolate fudge cake served with vanilla bean ice cream.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Drinks": [
        { name: "Craft Ginger Ale", price: "$2.99", desc: "In-house carbonated spicy ginger brew (non-alcoholic).", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ]
    }
  },
  "2": {
    name: "Truffles",
    tagline: "Koramangala's Favorite Hub for Juicy Burgers & Shakes",
    cuisines: "Burgers • American • Cafe",
    rating: "4.6",
    reviews: "800+",
    time: "20-30 mins",
    cost: "₹450 for two",
    cover: "../assets/illustrations/burger_menu_item.png",
    address: "22, Bel Air, 80 Feet Rd, Koramangala 4th Block, Bengaluru",
    menu: {
      "Starters": [
        { name: "Cheesy Loaded Fries", price: "$4.99", desc: "Golden fries smothered in hot cheddar cheese sauce and spring onions.", veg: true, img: "../assets/illustrations/hero_food_banner.png" },
        { name: "Crispy Chicken Tenders", price: "$6.49", desc: "Golden-fried spiced chicken strips served with honey mustard dip.", veg: false, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Main Course": [
        { name: "Double Cheese Crunch Burger", price: "$8.99", desc: "Two beef patties, double cheddar cheese, fresh lettuce, and secret burger sauce.", veg: false, img: "../assets/illustrations/burger_menu_item.png" },
        { name: "Spicy Lava Chicken Burger", price: "$7.49", desc: "Crispy chicken breast dipped in hot buffalo sauce with sliced jalapeños.", veg: false, img: "../assets/illustrations/burger_menu_item.png" }
      ],
      "Desserts": [
        { name: "Sizzling Chocolate Brownie", price: "$5.49", desc: "Fudgy brownie served sizzling hot with chocolate sauce and ice cream.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Drinks": [
        { name: "Cold Coffee Gold", price: "$3.49", desc: "Creamy classic blended cold coffee topped with cocoa powder.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ]
    }
  },
  "3": {
    name: "MTR (Mavalli Tiffin Room)",
    tagline: "Historic Heritage Destination for Legendary South Indian Flavors",
    cuisines: "South Indian • Pure Veg • Jayanagar",
    rating: "4.8",
    reviews: "1.2k+",
    time: "15-25 mins",
    cost: "₹300 for two",
    cover: "../assets/illustrations/hero_food_banner.png",
    address: "Near Lalbagh Main Gate, Jayanagar, Bengaluru",
    menu: {
      "Starters": [
        { name: "Idli Vada Combo", price: "$2.49", desc: "Two steamed rice cakes and one crispy lentil donut, served with hot sambar and coconut chutney.", veg: true, img: "../assets/illustrations/hero_food_banner.png" },
        { name: "Crispy Masala Vada", price: "$1.99", desc: "Deep-fried split pea fritters infused with curry leaves and ginger.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Main Course": [
        { name: "MTR Special Masala Dosa", price: "$3.99", desc: "Golden-brown rice crepe cooked with pure ghee, stuffed with potato mash.", veg: true, img: "../assets/illustrations/hero_food_banner.png" },
        { name: "Bisi Bele Bath", price: "$3.49", desc: "Classic hot lentil rice dish loaded with vegetables and cooked with local spices.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Desserts": [
        { name: "Special Rava Kesari", price: "$2.29", desc: "Sweet semolina pudding cooked with ghee, saffron, and roasted cashew nuts.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Drinks": [
        { name: "MTR Filter Coffee", price: "$1.49", desc: "Authentic, freshly brewed chicory-coffee decoction frothed with hot milk.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ]
    }
  }
};

// 2. Generic Menu Templates for other IDs (4-20) to ensure ALL links load beautifully
const menuTemplates = {
  southIndian: {
    tagline: "Authentic Traditional South Indian Delicacies",
    cover: "../assets/illustrations/hero_food_banner.png",
    menu: {
      "Starters": [
        { name: "Steamed Rava Idli", price: "$2.29", desc: "Signature semolina cakes steamed with carrot shreds and cashews.", veg: true, img: "../assets/illustrations/hero_food_banner.png" },
        { name: "Crispy Uddina Vada", price: "$1.99", desc: "Crispy deep-fried lentil donuts served with local coconut chutney.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Main Course": [
        { name: "Ghee Roast Masala Dosa", price: "$3.79", desc: "Super crispy rice crepe coated with pure ghee, served with potato bhaji.", veg: true, img: "../assets/illustrations/hero_food_banner.png" },
        { name: "Classic Khara Bath", price: "$2.49", desc: "Savoury roasted semolina porridge cooked with vegetables and mustard.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Desserts": [
        { name: "Ghee Mysore Pak", price: "$2.49", desc: "Rich melt-in-mouth traditional gram flour dessert made with premium ghee.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Drinks": [
        { name: "Madras Filter Coffee", price: "$1.49", desc: "Strong frothed milk coffee served in traditional brass dabarah.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ]
    }
  },
  burgersCafe: {
    tagline: "Modern Cafe Menu loaded with Gourmet Burgers and Snacks",
    cover: "../assets/illustrations/burger_menu_item.png",
    menu: {
      "Starters": [
        { name: "Crispy Onion Rings", price: "$3.99", desc: "Thick onion rings double-battered and fried until golden brown.", veg: true, img: "../assets/illustrations/hero_food_banner.png" },
        { name: "Cheesy Loaded Fries", price: "$4.99", desc: "Thick cut golden fries loaded with garlic spread and hot cheese.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Main Course": [
        { name: "Flame Grilled Crunch Burger", price: "$7.99", desc: "Grilled gourmet patty topped with cheddar, lettuce, onions, and spicy mayo.", veg: false, img: "../assets/illustrations/burger_menu_item.png" },
        { name: "Spicy Crispy Chicken Wrap", price: "$6.99", desc: "Tender fried chicken rolled in a flour tortilla with lettuce and garlic cream.", veg: false, img: "../assets/illustrations/burger_menu_item.png" }
      ],
      "Desserts": [
        { name: "Hot Chocolate Brownie", price: "$4.49", desc: "Decadent warm chocolate brownie topped with chocolate chips.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Drinks": [
        { name: "Iced Caramel Macchiato", price: "$3.99", desc: "Fresh espresso poured over cold milk and sweetened with caramel sauce.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ]
    }
  },
  pizzaItalian: {
    tagline: "Fine-crust sourdough pizzas and authentic Italian pastas",
    cover: "../assets/illustrations/pizza_menu_item.png",
    menu: {
      "Starters": [
        { name: "Garlic Bread with Cheese", price: "$4.49", desc: "Freshly baked bread slices with garlic butter and melted mozzarella.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Main Course": [
        { name: "Pepperoni Paradise Pizza", price: "$12.99", desc: "Loaded pepperoni slices, thick shredded mozzarella, and classic pizza sauce.", veg: false, img: "../assets/illustrations/pizza_menu_item.png" },
        { name: "Spicy Arrabbiata Pasta", price: "$9.99", desc: "Penne pasta cooked in a fiery chili tomato sauce with garlic and olives.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Desserts": [
        { name: "Tiramisu Cups", price: "$5.49", desc: "Traditional coffee-flavored Italian dessert layers with cream cheese.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ],
      "Drinks": [
        { name: "Lemon Mint Mojito", price: "$2.99", desc: "Refreshing mixture of lime juice, fresh mint leaves, and carbonated soda.", veg: true, img: "../assets/illustrations/hero_food_banner.png" }
      ]
    }
  }
};

// 3. Fallback info lookup for remaining IDs using the list elements
const fallbackDirectory = {
  "4": { name: "CTR (Shri Sagar)", cuisines: "South Indian • Pure Veg • Malleshwaram", rating: "4.9", reviews: "2k+", time: "10-20 mins", cost: "₹150 for two", address: "7th Cross, Margosa Rd, Malleshwaram, Bengaluru", type: "southIndian" },
  "5": { name: "Nagarjuna", cuisines: "Andhra • Biryani • Indiranagar", rating: "4.6", reviews: "600+", time: "20-30 mins", cost: "₹500 for two", address: "Double Road, Indiranagar, Bengaluru", type: "southIndian" },
  "6": { name: "Empire Restaurant", cuisines: "North Indian • Mughlai • Koramangala", rating: "4.3", reviews: "1.5k+", time: "25-35 mins", cost: "₹400 for two", address: "80 Feet Road, Koramangala, Bengaluru", type: "burgersCafe" },
  "7": { name: "Corner House Ice Creams", cuisines: "Desserts • Ice Cream • Jayanagar", rating: "4.9", reviews: "900+", time: "15-20 mins", cost: "₹250 for two", address: "9th Block, Jayanagar, Bengaluru", type: "burgersCafe" },
  "8": { name: "Windmills Craftworks", cuisines: "Microbrewery • American • Whitefield", rating: "4.7", reviews: "350+", time: "35-45 mins", cost: "₹1000 for two", address: "EPIP Zone, Whitefield, Bengaluru", type: "pizzaItalian" },
  "9": { name: "The Black Pearl", cuisines: "North Indian • Barbecue • HSR Layout", rating: "4.4", reviews: "450+", time: "30-40 mins", cost: "₹700 for two", address: "14th Main Rd, Sector 5, HSR Layout, Bengaluru", type: "burgersCafe" },
  "10": { name: "Taza Thindi", cuisines: "South Indian • Pure Veg • Jayanagar", rating: "4.8", reviews: "1.8k+", time: "15-25 mins", cost: "₹100 for two", address: "4th T Block, Jayanagar, Bengaluru", type: "southIndian" },
  "11": { name: "Karavalli", cuisines: "Mangalorean • Seafood • MG Road", rating: "4.8", reviews: "250+", time: "40-50 mins", cost: "₹1200 for two", address: "The Gateway Hotel, Residency Rd, Bengaluru", type: "southIndian" },
  "12": { name: "Glen's Bakehouse", cuisines: "Bakery • Desserts • Indiranagar", rating: "4.5", reviews: "700+", time: "20-30 mins", cost: "₹350 for two", address: "Toit Lane, Indiranagar, Bengaluru", type: "pizzaItalian" },
  "13": { name: "Sly Granny", cuisines: "European • Continental • Indiranagar", rating: "4.4", reviews: "180+", time: "35-45 mins", cost: "₹900 for two", address: "3rd Stage, Indiranagar, Bengaluru", type: "pizzaItalian" },
  "14": { name: "Hole In The Wall Cafe", cuisines: "Cafe • American Breakfast • Koramangala", rating: "4.6", reviews: "550+", time: "30-40 mins", cost: "₹400 for two", address: "4th Block, Koramangala, Bengaluru", type: "burgersCafe" },
  "15": { name: "Brooks and Bonds Brewery", cuisines: "Finger Food • Pizza • Koramangala", rating: "4.3", reviews: "220+", time: "25-35 mins", cost: "₹600 for two", address: "5th Block, Koramangala, Bengaluru", type: "pizzaItalian" },
  "16": { name: "O.G. Variar & Sons", cuisines: "Bakery • Tea Time Snacks • Malleshwaram", rating: "4.9", reviews: "400+", time: "15-25 mins", cost: "₹150 for two", address: "2nd Main Road, Malleshwaram, Bengaluru", type: "southIndian" },
  "17": { name: "Chutney Chang", cuisines: "Chinese • Buffet • MG Road", rating: "4.2", reviews: "300+", time: "30-40 mins", cost: "₹600 for two", address: "Museum Rd, Shantala Nagar, Bengaluru", type: "burgersCafe" },
  "18": { name: "Brahmin's Coffee Bar", cuisines: "South Indian • Coffee • JP Nagar", rating: "4.8", reviews: "1.1k+", time: "15-20 mins", cost: "₹100 for two", address: "2nd Phase, JP Nagar, Bengaluru", type: "southIndian" },
  "19": { name: "Leon's Burgers & Salads", cuisines: "Burgers • Fast Food • HSR Layout", rating: "4.4", reviews: "650+", time: "20-30 mins", cost: "₹300 for two", address: "19th Main, Sector 1, HSR Layout, Bengaluru", type: "burgersCafe" },
  "20": { name: "Veena Stores", cuisines: "South Indian • Pure Veg • Malleshwaram", rating: "4.9", reviews: "1.3k+", time: "15-25 mins", cost: "₹100 for two", address: "Margosa Rd, Malleshwaram, Bengaluru", type: "southIndian" }
};

// Global active states
let activeRestaurantId = "1";
let activeRestaurant = null;

// Initialize dynamic rendering
function initPage() {
  const urlParams = new URLSearchParams(window.location.search);
  activeRestaurantId = urlParams.get("id") || "1";

  // Fetch restaurant details
  if (restaurantsDatabase[activeRestaurantId]) {
    activeRestaurant = restaurantsDatabase[activeRestaurantId];
  } else if (fallbackDirectory[activeRestaurantId]) {
    const fallbackMeta = fallbackDirectory[activeRestaurantId];
    const template = menuTemplates[fallbackMeta.type];
    
    activeRestaurant = {
      name: fallbackMeta.name,
      tagline: template.tagline,
      cuisines: fallbackMeta.cuisines,
      rating: fallbackMeta.rating,
      reviews: fallbackMeta.reviews,
      time: fallbackMeta.time,
      cost: fallbackMeta.cost,
      cover: template.cover,
      address: fallbackMeta.address,
      menu: template.menu
    };
  } else {
    activeRestaurant = restaurantsDatabase["1"];
  }

  // Populate UI
  document.title = `${activeRestaurant.name} Menu - FastX`;
  const coverImage = document.querySelector(".restaurant-cover-image");
  if (coverImage) coverImage.src = activeRestaurant.cover;

  const profileCard = document.querySelector(".restaurant-profile-card");
  if (profileCard) {
    profileCard.innerHTML = `
      <div class="restaurant-profile-grid">
        <div class="profile-main-info">
          <div class="profile-title-row">
            <h1 class="text-3xl">${activeRestaurant.name}</h1>
            <span class="badge badge-success">Open Now</span>
          </div>
          <p class="profile-tagline">${activeRestaurant.cuisines}</p>
          <p class="text-xs" style="color: var(--color-dark-text-muted); margin-top: 4px;">📍 ${activeRestaurant.address}</p>
          <p class="text-xs" style="color: var(--color-dark-text-muted); font-style: italic; margin-top: 2px;">"${activeRestaurant.tagline}"</p>
        </div>

        <div class="profile-metrics-row">
          <div class="metric-item rating">
            <span>★</span> ${activeRestaurant.rating} (${activeRestaurant.reviews} reviews)
          </div>
          <div style="width: 1px; height: 16px; background-color: var(--color-dark-border);"></div>
          <div class="metric-item">
            <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${activeRestaurant.time}
          </div>
          <div style="width: 1px; height: 16px; background-color: var(--color-dark-border);"></div>
          <div class="metric-item">
            ${activeRestaurant.cost}
          </div>
        </div>
      </div>
    `;
  }

  renderMenu();
  syncNavCartBadge();

  // Listen for global cart updates
  window.addEventListener("cartUpdated", () => {
    renderMenu();
    syncNavCartBadge();
  });
}

// Render Menu Group listings dynamically
function renderMenu() {
  const menuContainer = document.querySelector(".menu-group-container");
  const sidebar = document.querySelector(".menu-sidebar");
  const mobileBar = document.querySelector(".mobile-category-bar");
  
  if (!menuContainer || !activeRestaurant) return;

  const currentCart = getCart();
  menuContainer.innerHTML = "";
  
  let sidebarHTML = `<h3 class="text-sm font-weight-bold" style="color: var(--color-dark-text-muted); margin-bottom: var(--space-3); padding-left: 14px; text-transform: uppercase; letter-spacing: 1px;">Categories</h3>`;
  let mobileBarHTML = "";
  let isFirstCategory = true;

  for (const [categoryName, items] of Object.entries(activeRestaurant.menu)) {
    const categoryId = categoryName.toLowerCase().replace(/\s+/g, "-");

    // 1. Sidebar Links
    sidebarHTML += `
      <a href="#${categoryId}" class="sidebar-category-link ${isFirstCategory ? 'active' : ''}">${categoryName}</a>
    `;

    // 2. Mobile Buttons
    mobileBarHTML += `
      <button class="mobile-category-btn ${isFirstCategory ? 'active' : ''}" onclick="document.getElementById('${categoryId}').scrollIntoView({behavior: 'smooth'})">${categoryName}</button>
    `;

    // 3. Dish Cards
    let itemsCardsHTML = "";
    items.forEach(dish => {
      const dotClass = dish.veg ? "tag-veg" : "tag-nonveg";
      const dotTitle = dish.veg ? "Vegetarian" : "Non-Vegetarian";

      // Check if this item is in the cart (and belongs to this restaurant)
      const cartItem = (currentCart.restaurantId === activeRestaurantId)
        ? currentCart.items.find(i => i.name === dish.name)
        : null;
      let btnMarkup = "";

      const escapedDishName = dish.name.replace(/'/g, "\\'");
      const escapedDishPrice = dish.price.replace(/'/g, "\\'");
      const escapedDishImg = dish.img.replace(/'/g, "\\'");

      if (cartItem) {
        // Display - Qty + Capsule
        btnMarkup = `
          <div class="dish-qty-control" style="display: flex; align-items: center; justify-content: space-between; border: 1.5px solid var(--color-primary); border-radius: var(--radius-md); background: var(--color-dark-card); width: 80px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); overflow: hidden;">
            <button class="qty-btn" onclick="handleQtyChange('${escapedDishName}', -1)" style="background: none; border: none; color: var(--color-primary); font-weight: 700; cursor: pointer; padding: 6px 10px; font-size: 0.875rem;">-</button>
            <span style="color: var(--color-dark-text-main); font-weight: 700; font-size: 0.875rem;">${cartItem.quantity}</span>
            <button class="qty-btn" onclick="handleQtyChange('${escapedDishName}', 1)" style="background: none; border: none; color: var(--color-primary); font-weight: 700; cursor: pointer; padding: 6px 10px; font-size: 0.875rem;">+</button>
          </div>
        `;
      } else {
        // Display Simple ADD Button
        btnMarkup = `
          <button class="dish-add-btn" onclick="handleAddClick('${escapedDishName}', '${escapedDishPrice}', ${dish.veg}, '${escapedDishImg}')" aria-label="Add ${dish.name} to Cart">ADD</button>
        `;
      }

      itemsCardsHTML += `
        <div class="dish-card">
          <div class="dish-info">
            <div class="dish-tag-row">
              <span class="tag-indicator ${dotClass}" title="${dotTitle}"></span>
            </div>
            <h3 class="dish-name">${dish.name}</h3>
            <span class="dish-price">${dish.price}</span>
            <p class="dish-description">${dish.desc}</p>
          </div>
          
          <div class="dish-media-wrapper">
            <img class="dish-image" src="${dish.img}" alt="${dish.name} preview image">
            <div class="dish-add-button-container">
              ${btnMarkup}
            </div>
          </div>
        </div>
      `;
    });

    menuContainer.innerHTML += `
      <div id="${categoryId}" class="menu-group">
        <h2 class="text-2xl menu-group-title">${categoryName}</h2>
        ${itemsCardsHTML}
      </div>
    `;

    isFirstCategory = false;
  }

  if (sidebar) sidebar.innerHTML = sidebarHTML;
  if (mobileBar) mobileBar.innerHTML = mobileBarHTML;
  setupSidebarScrollHighlight(sidebar);
}

// Click Actions
function handleAddClick(name, price, veg, img) {
  addToCart(activeRestaurantId, activeRestaurant.name, {
    name: name,
    price: price,
    veg: veg,
    img: img
  });
}

function handleQtyChange(name, change) {
  updateCartQuantity(name, change);
}

// Synchronize navbar cart bubble count
function syncNavCartBadge() {
  const cartBtn = document.querySelector(".navbar .btn-secondary");
  if (!cartBtn) return;

  // Make cart button link to checkout page
  cartBtn.onclick = () => {
    window.location.href = "checkout.html";
  };

  let badge = cartBtn.querySelector(".cart-badge");
  const count = getCartCount();

  if (count > 0) {
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-badge";
      badge.style.position = "absolute";
      badge.style.top = "-5px";
      badge.style.right = "-5px";
      badge.style.background = "var(--color-primary)";
      badge.style.color = "#FFFFFF";
      badge.style.fontSize = "0.7rem";
      badge.style.fontWeight = "700";
      badge.style.borderRadius = "50%";
      badge.style.padding = "2px 6px";
      badge.style.lineHeight = "1";
      cartBtn.style.position = "relative";
      cartBtn.appendChild(badge);
    }
    badge.textContent = count;
  } else {
    if (badge) badge.remove();
  }
}

// Category links dynamic highlighting
function setupSidebarScrollHighlight(sidebarElement) {
  if (!sidebarElement) return;
  const links = sidebarElement.querySelectorAll(".sidebar-category-link");
  const sections = document.querySelectorAll(".menu-group");

  window.addEventListener("scroll", () => {
    let currentActiveId = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentActiveId = section.getAttribute("id");
      }
    });

    links.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentActiveId}`) {
        link.classList.add("active");
      }
    });
  });
}
