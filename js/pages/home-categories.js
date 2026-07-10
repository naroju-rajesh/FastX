/**
 * FastX Homepage Categories Database and Controller
 * Dynamically renders 15 meal categories containing exactly 10 unique food cards each,
 * equipped with scroll carousels, scroll spy observers, and local storage hooks.
 */

const CATEGORIES_DATA = [
  {
    id: "breakfast",
    title: "🍳 Breakfast Specials",
    subtitle: "Warm, fresh, and traditional morning bites to kickstart your day",
    banner: "assets/illustrations/categories/breakfast.jpg",
    items: [
      { id: "b1", name: "Steamed Idli", restaurant: "Veena Stores", rating: "4.8", time: "10-15 mins", price: 60, isVeg: true, imgId: "photo-1589301760014-d929f3979dbc" },
      { id: "b2", name: "Masala Dosa", restaurant: "CTR (Shri Sagar)", rating: "4.9", time: "15-20 mins", price: 90, isVeg: true, imgId: "photo-1668236543090-82eba5ee5976" },
      { id: "b3", name: "Plain Dosa", restaurant: "Brahmin's Coffee Bar", rating: "4.7", time: "10-15 mins", price: 70, isVeg: true, img: "assets/illustrations/plain_dosa.png" },
      { id: "b4", name: "Medu Vada", restaurant: "Taza Thindi", rating: "4.8", time: "10-15 mins", price: 50, isVeg: true, imgId: "photo-1601050690597-df056fb4ce78" },
      { id: "b5", name: "Khara Pongal", restaurant: "MTR", rating: "4.6", time: "15-25 mins", price: 80, isVeg: true, imgId: "photo-1541832676-9b763b0239ab" },
      { id: "b6", name: "Poori & Curry", restaurant: "Veena Stores", rating: "4.7", time: "15-20 mins", price: 90, isVeg: true, imgId: "photo-1610192244261-3f33de3f55e4" },
      { id: "b7", name: "Rava Upma", restaurant: "Brahmin's Coffee Bar", rating: "4.5", time: "10-15 mins", price: 60, isVeg: true, imgId: "photo-1505576399279-565b52d4ac71" },
      { id: "b8", name: "Onion Uttapam", restaurant: "CTR (Shri Sagar)", rating: "4.6", time: "15-20 mins", price: 80, isVeg: true, img: "assets/illustrations/onion_uttapam.png" },
      { id: "b9", name: "Green Pesarattu", restaurant: "Nagarjuna", rating: "4.5", time: "20-25 mins", price: 100, isVeg: true, imgId: "photo-1588633579746-8660f7797672" },
      { id: "b10", name: "Mysore Bonda", restaurant: "Taza Thindi", rating: "4.7", time: "10-15 mins", price: 60, isVeg: true, imgId: "photo-1569562211093-4ed0d0758f12" }
    ]
  },
  {
    id: "lunch",
    title: "🍛 Lunch Specials",
    subtitle: "Hearty lunches, dynamic thalis, and spicy rice combinations",
    banner: "assets/illustrations/categories/lunch.jpg",
    items: [
      { id: "l1", name: "South Veg Meals", restaurant: "MTR", rating: "4.7", time: "15-25 mins", price: 160, isVeg: true, imgId: "photo-1546069901-ba9599a7e63c" },
      { id: "l2", name: "Andhra Chicken Meals", restaurant: "Nagarjuna", rating: "4.6", time: "20-30 mins", price: 240, isVeg: false, imgId: "photo-1626777552726-4a6b54c97e46" },
      { id: "l3", name: "Andhra Mutton Meals", restaurant: "Nagarjuna", rating: "4.7", time: "25-35 mins", price: 280, isVeg: false, imgId: "photo-1563379091339-03b21ab4a4f8" },
      { id: "l4", name: "South Indian Thali", restaurant: "MTR", rating: "4.8", time: "15-25 mins", price: 180, isVeg: true, imgId: "photo-1613292443284-8d10ef9383fe" },
      { id: "l5", name: "North Indian Thali", restaurant: "Empire Restaurant", rating: "4.5", time: "20-30 mins", price: 200, isVeg: false, imgId: "photo-1625220194771-7ebdea0b70b9" },
      { id: "l6", name: "Veg Fried Rice", restaurant: "Chutney Chang", rating: "4.4", time: "15-20 mins", price: 150, isVeg: true, img: "assets/illustrations/veg_fried_rice.png" },
      { id: "l7", name: "Chicken Fried Rice", restaurant: "Chutney Chang", rating: "4.5", time: "15-20 mins", price: 180, isVeg: false, imgId: "photo-1631452180519-c014fe946bc7" },
      { id: "l8", name: "Paneer Biryani", restaurant: "Truffles", rating: "4.6", time: "20-30 mins", price: 220, isVeg: true, imgId: "photo-1633945274405-b6c8069047b0" },
      { id: "l9", name: "Classic Chicken Biryani", restaurant: "Empire Restaurant", rating: "4.8", time: "20-30 mins", price: 260, isVeg: false, imgId: "photo-1589302168068-964664d93dc0" },
      { id: "l10", name: "Fiery Andhra Meals", restaurant: "Nagarjuna", rating: "4.7", time: "20-25 mins", price: 200, isVeg: false, imgId: "photo-1560684352-8497838a2229" }
    ]
  },
  {
    id: "dinner",
    title: "🍽️ Dinner Specials",
    subtitle: "Spicy mughlai gravies, freshly baked clay naans, and family feasts",
    banner: "assets/illustrations/categories/dinner.jpg",
    items: [
      { id: "d1", name: "Butter Chicken", restaurant: "Empire Restaurant", rating: "4.7", time: "20-30 mins", price: 280, isVeg: false, imgId: "photo-1603894584373-5ac82b2ae398" },
      { id: "d2", name: "Paneer Butter Masala", restaurant: "MTR", rating: "4.8", time: "15-25 mins", price: 240, isVeg: true, imgId: "photo-1545247181-516773cae754" },
      { id: "d3", name: "Gourmet Chicken Biryani", restaurant: "Empire Restaurant", rating: "4.8", time: "20-30 mins", price: 260, isVeg: false, img: "assets/illustrations/gourmet_chicken_biryani.png" },
      { id: "d4", name: "Andhra Mutton Biryani", restaurant: "Nagarjuna", rating: "4.9", time: "25-35 mins", price: 320, isVeg: false, imgId: "photo-1608797178974-15b35a61d121" },
      { id: "d5", name: "Tandoori Chicken", restaurant: "The Black Pearl", rating: "4.6", time: "25-35 mins", price: 250, isVeg: false, imgId: "photo-1585238342024-78d387f4a707" },
      { id: "d6", name: "Flame Chicken Tikka", restaurant: "Windmills Craftworks", rating: "4.7", time: "20-30 mins", price: 220, isVeg: false, imgId: "photo-1546833999-b9f581a1996d" },
      { id: "d7", name: "Tandoori Naan", restaurant: "Sly Granny", rating: "4.5", time: "15-20 mins", price: 40, isVeg: true, imgId: "photo-1567188040759-fb8a883dc6d8" },
      { id: "d8", name: "Butter Naan", restaurant: "Sly Granny", rating: "4.7", time: "15-20 mins", price: 50, isVeg: true, imgId: "photo-1544025162-d76694265947" },
      { id: "d9", name: "Veg Pulao", restaurant: "MTR", rating: "4.4", time: "15-25 mins", price: 180, isVeg: true, imgId: "photo-1615485290382-441e4d049cb5" },
      { id: "d10", name: "Cream Dal Makhani", restaurant: "Empire Restaurant", rating: "4.7", time: "20-25 mins", price: 160, isVeg: true, imgId: "photo-1534422298391-e4f8c172dddb" }
    ]
  },
  {
    id: "fast-food",
    title: "🍔 Fast Food Specials",
    subtitle: "Double patty burgers, melting pizzas, and golden french fries",
    banner: "assets/illustrations/categories/fast_food.jpg",
    items: [
      { id: "ff1", name: "Double Cheese Veg Burger", restaurant: "Truffles", rating: "4.6", time: "15-25 mins", price: 170, isVeg: true, imgId: "photo-1592417817098-8f3d6eb19675" },
      { id: "ff2", name: "Crispy Chicken Burger", restaurant: "Truffles", rating: "4.7", time: "15-25 mins", price: 190, isVeg: false, imgId: "photo-1600891964599-f61ba0e24092" },
      { id: "ff3", name: "Margherita Cheese Pizza", restaurant: "Toit", rating: "4.7", time: "25-35 mins", price: 290, isVeg: true, imgId: "photo-1604382354936-07c5d9983bd3" },
      { id: "ff4", name: "Spicy Paneer Pizza", restaurant: "Toit", rating: "4.6", time: "25-35 mins", price: 330, isVeg: true, imgId: "photo-1504674900247-0877df9cc836" },
      { id: "ff5", name: "Peri Peri French Fries", restaurant: "Truffles", rating: "4.5", time: "10-15 mins", price: 110, isVeg: true, imgId: "photo-1498837167922-ddd27525d352" },
      { id: "ff6", name: "Cheesy Veg Frankie Roll", restaurant: "Leon's Burgers", rating: "4.3", time: "15-20 mins", price: 130, isVeg: true, imgId: "photo-1512621776951-a57141f2eefd" },
      { id: "ff7", name: "Leon's Chicken Kathi Roll", restaurant: "Leon's Burgers", rating: "4.5", time: "15-20 mins", price: 160, isVeg: false, imgId: "photo-1473093295043-cdd812d0e601" },
      { id: "ff8", name: "Tandoori Garlic Bread", restaurant: "Toit", rating: "4.5", time: "15-20 mins", price: 140, isVeg: true, imgId: "photo-1476224203421-9ac39bcb3327" },
      { id: "ff9", name: "Pan Fried Veg Momos", restaurant: "Chutney Chang", rating: "4.4", time: "15-25 mins", price: 140, isVeg: true, imgId: "photo-1482049016688-2d3e1b311543" },
      { id: "ff10", name: "Crispy Chicken Nuggets", restaurant: "Leon's Burgers", rating: "4.5", time: "15-20 mins", price: 150, isVeg: false, imgId: "photo-1484723091739-30a097e8f929" }
    ]
  },
  {
    id: "pizza",
    title: "🍕 Gourmet Pizzas",
    subtitle: "Delicious wood-fired crusts loaded with fresh cheese and premium toppings",
    banner: "assets/illustrations/categories/pizza.jpg",
    items: [
      { id: "p1", name: "Margherita Cheese Pizza", restaurant: "Toit", rating: "4.7", time: "25-35 mins", price: 290, isVeg: true, imgId: "photo-1604382354936-07c5d9983bd3" },
      { id: "p2", name: "Spicy Paneer Pizza", restaurant: "Toit", rating: "4.6", time: "25-35 mins", price: 330, isVeg: true, imgId: "photo-1504674900247-0877df9cc836" },
      { id: "p3", name: "Double Cheese Margherita", restaurant: "Truffles", rating: "4.8", time: "20-30 mins", price: 310, isVeg: true, imgId: "photo-1513104890138-7c749659a591" },
      { id: "p4", name: "Veg Supreme Pizza", restaurant: "Toit", rating: "4.5", time: "25-35 mins", price: 340, isVeg: true, imgId: "photo-1574071318508-1cdbab80d002" },
      { id: "p5", name: "BBQ Chicken Pizza", restaurant: "The Black Pearl", rating: "4.7", time: "20-30 mins", price: 380, isVeg: false, imgId: "photo-1565299624946-b28f40a0ae38" },
      { id: "p6", name: "Chicken Tikka Pizza", restaurant: "Empire Restaurant", rating: "4.6", time: "25-35 mins", price: 360, isVeg: false, imgId: "photo-1598214886806-c8761a370988" },
      { id: "p7", name: "Paneer Makhani Pizza", restaurant: "Toit", rating: "4.5", time: "20-30 mins", price: 320, isVeg: true, imgId: "photo-1571066811602-71683a3f680d" },
      { id: "p8", name: "Farmhouse Fresh Pizza", restaurant: "CTR (Shri Sagar)", rating: "4.6", time: "20-30 mins", price: 280, isVeg: true, imgId: "photo-1544982503-9f984c14501a" },
      { id: "p9", name: "Paneer Chilli Pizza", restaurant: "Chutney Chang", rating: "4.4", time: "20-30 mins", price: 300, isVeg: true, imgId: "photo-1585238342024-78d387f4a707" },
      { id: "p10", name: "Spicy Pepperoni Feast", restaurant: "Empire Restaurant", rating: "4.8", time: "25-35 mins", price: 420, isVeg: false, imgId: "photo-1628840042765-356cda07504e" }
    ]
  },
  {
    id: "burgers",
    title: "🍔 Stacked Burgers",
    subtitle: "Thick patties, melting cheese slices, and fresh green lettuce wraps",
    banner: "assets/illustrations/categories/burgers.jpg",
    items: [
      { id: "bu1", name: "Double Cheese Veg Burger", restaurant: "Truffles", rating: "4.6", time: "15-25 mins", price: 170, isVeg: true, imgId: "photo-1592417817098-8f3d6eb19675" },
      { id: "bu2", name: "Crispy Chicken Burger", restaurant: "Truffles", rating: "4.7", time: "15-25 mins", price: 190, isVeg: false, imgId: "photo-1600891964599-f61ba0e24092" },
      { id: "bu3", name: "Spicy Paneer Burger", restaurant: "Truffles", rating: "4.5", time: "15-20 mins", price: 180, isVeg: true, imgId: "photo-1568901346375-23c9450c58cd" },
      { id: "bu4", name: "Grilled Chicken Burger", restaurant: "Leon's Burgers", rating: "4.6", time: "20-25 mins", price: 210, isVeg: false, imgId: "photo-1550547660-d9450f859349" },
      { id: "bu5", name: "Aloo Tikki Burger", restaurant: "Leon's Burgers", rating: "4.3", time: "15-20 mins", price: 110, isVeg: true, imgId: "photo-1586190848861-99aa4a171e90" },
      { id: "bu6", name: "Maharaja Veg Burger", restaurant: "Truffles", rating: "4.7", time: "20-25 mins", price: 220, isVeg: true, imgId: "photo-1565299585323-38d6b0865b47" },
      { id: "bu7", name: "Cheese Blast Burger", restaurant: "Leon's Burgers", rating: "4.4", time: "15-25 mins", price: 160, isVeg: true, imgId: "photo-1571091718767-18b5b1457add" },
      { id: "bu8", name: "BBQ Chicken Burger", restaurant: "Truffles", rating: "4.6", time: "20-25 mins", price: 230, isVeg: false, imgId: "photo-1521305916504-4a1121188589" },
      { id: "bu9", name: "Classic Veg Burger", restaurant: "Taza Thindi", rating: "4.5", time: "15-20 mins", price: 130, isVeg: true, imgId: "photo-1542574271-7f3b92e6c821" },
      { id: "bu10", name: "Bacon & Cheese Burger", restaurant: "Windmills Craftworks", rating: "4.8", time: "20-25 mins", price: 280, isVeg: false, imgId: "photo-1553979459-d2229ba7433b" }
    ]
  },
  {
    id: "biryani",
    title: "🍛 Royal Biryanis",
    subtitle: "Aromatic basmati rice layered with rich spices and local ingredients",
    banner: "assets/illustrations/categories/biryani.jpg",
    items: [
      { id: "by1", name: "Paneer Biryani", restaurant: "Truffles", rating: "4.6", time: "20-30 mins", price: 220, isVeg: true, imgId: "photo-1633945274405-b6c8069047b0" },
      { id: "by2", name: "Classic Chicken Biryani", restaurant: "Empire Restaurant", rating: "4.8", time: "20-30 mins", price: 260, isVeg: false, imgId: "photo-1589302168068-964664d93dc0" },
      { id: "by3", name: "Gourmet Chicken Biryani", restaurant: "Empire Restaurant", rating: "4.8", time: "20-30 mins", price: 260, isVeg: false, img: "assets/illustrations/gourmet_chicken_biryani.png" },
      { id: "by4", name: "Andhra Mutton Biryani", restaurant: "Nagarjuna", rating: "4.9", time: "25-35 mins", price: 320, isVeg: false, imgId: "photo-1608797178974-15b35a61d121" },
      { id: "by5", name: "Veg Biryani Pot", restaurant: "MTR", rating: "4.5", time: "20-30 mins", price: 190, isVeg: true, imgId: "photo-1550547660-d9450f859349" },
      { id: "by6", name: "Egg Biryani Pot", restaurant: "Empire Restaurant", rating: "4.5", time: "20-30 mins", price: 190, isVeg: false, imgId: "photo-1621506289937-a8e4df240d0b" },
      { id: "by7", name: "Hyderabadi Chicken Biryani", restaurant: "Windmills Craftworks", rating: "4.8", time: "20-30 mins", price: 270, isVeg: false, imgId: "photo-1633945274405-b6c8069047b0" },
      { id: "by8", name: "Lucknowi Mutton Biryani", restaurant: "Empire Restaurant", rating: "4.7", time: "25-35 mins", price: 310, isVeg: false, imgId: "photo-1546833999-b9f581a1996d" },
      { id: "by9", name: "Kaju Paneer Biryani", restaurant: "MTR", rating: "4.6", time: "20-30 mins", price: 240, isVeg: true, imgId: "photo-1601050690597-df056fb4ce78" },
      { id: "by10", name: "Special Prawn Biryani", restaurant: "The Black Pearl", rating: "4.8", time: "25-30 mins", price: 340, isVeg: false, imgId: "photo-1563379091339-03b21ab4a4f8" }
    ]
  },
  {
    id: "south-indian",
    title: "🍳 South Indian Specialties",
    subtitle: "Healthy steamed idlis, ghee masala dosas, and chicory filter coffee",
    banner: "assets/illustrations/categories/south_indian.jpg",
    items: [
      { id: "b1", name: "Steamed Idli", restaurant: "Veena Stores", rating: "4.8", time: "10-15 mins", price: 60, isVeg: true, imgId: "photo-1589301760014-d929f3979dbc" },
      { id: "b2", name: "Masala Dosa", restaurant: "CTR (Shri Sagar)", rating: "4.9", time: "15-20 mins", price: 90, isVeg: true, imgId: "photo-1668236543090-82eba5ee5976" },
      { id: "b3", name: "Plain Dosa", restaurant: "Brahmin's Coffee Bar", rating: "4.7", time: "10-15 mins", price: 70, isVeg: true, img: "assets/illustrations/plain_dosa.png" },
      { id: "b4", name: "Medu Vada", restaurant: "Taza Thindi", rating: "4.8", time: "10-15 mins", price: 50, isVeg: true, imgId: "photo-1601050690597-df056fb4ce78" },
      { id: "b5", name: "Khara Pongal", restaurant: "MTR", rating: "4.6", time: "15-25 mins", price: 80, isVeg: true, imgId: "photo-1541832676-9b763b0239ab" },
      { id: "b6", name: "Poori & Curry", restaurant: "Veena Stores", rating: "4.7", time: "15-20 mins", price: 90, isVeg: true, imgId: "photo-1610192244261-3f33de3f55e4" },
      { id: "b7", name: "Rava Upma", restaurant: "Brahmin's Coffee Bar", rating: "4.5", time: "10-15 mins", price: 60, isVeg: true, imgId: "photo-1505576399279-565b52d4ac71" },
      { id: "b8", name: "Onion Uttapam", restaurant: "CTR (Shri Sagar)", rating: "4.6", time: "15-20 mins", price: 80, isVeg: true, img: "assets/illustrations/onion_uttapam.png" },
      { id: "b9", name: "Green Pesarattu", restaurant: "Nagarjuna", rating: "4.5", time: "20-25 mins", price: 100, isVeg: true, imgId: "photo-1588633579746-8660f7797672" },
      { id: "b10", name: "Mysore Bonda", restaurant: "Taza Thindi", rating: "4.7", time: "10-15 mins", price: 60, isVeg: true, imgId: "photo-1569562211093-4ed0d0758f12" }
    ]
  },
  {
    id: "north-indian",
    title: "🍛 North Indian Delights",
    subtitle: "Freshly baked naans, paneer masala gravies, and slow-cooked dals",
    banner: "assets/illustrations/categories/north_indian.jpg",
    items: [
      { id: "d1", name: "Butter Chicken", restaurant: "Empire Restaurant", rating: "4.7", time: "20-30 mins", price: 280, isVeg: false, imgId: "photo-1603894584373-5ac82b2ae398" },
      { id: "d2", name: "Paneer Butter Masala", restaurant: "MTR", rating: "4.8", time: "15-25 mins", price: 240, isVeg: true, imgId: "photo-1545247181-516773cae754" },
      { id: "v1", name: "Paneer Tikka Grill", restaurant: "The Black Pearl", rating: "4.6", time: "20-30 mins", price: 210, isVeg: true, imgId: "photo-1568901346375-23c9450c58cd" },
      { id: "d5", name: "Tandoori Chicken", restaurant: "The Black Pearl", rating: "4.6", time: "25-35 mins", price: 250, isVeg: false, imgId: "photo-1585238342024-78d387f4a707" },
      { id: "d7", name: "Tandoori Naan", restaurant: "Sly Granny", rating: "4.5", time: "15-20 mins", price: 40, isVeg: true, imgId: "photo-1567188040759-fb8a883dc6d8" },
      { id: "d8", name: "Butter Naan", restaurant: "Sly Granny", rating: "4.7", time: "15-20 mins", price: 50, isVeg: true, imgId: "photo-1544025162-d76694265947" },
      { id: "d9", name: "Veg Pulao", restaurant: "MTR", rating: "4.4", time: "15-25 mins", price: 180, isVeg: true, imgId: "photo-1615485290382-441e4d049cb5" },
      { id: "d10", name: "Cream Dal Makhani", restaurant: "Empire Restaurant", rating: "4.7", time: "20-25 mins", price: 160, isVeg: true, imgId: "photo-1534422298391-e4f8c172dddb" },
      { id: "v3", name: "Peshawari Chana Masala", restaurant: "Empire Restaurant", rating: "4.4", time: "15-25 mins", price: 160, isVeg: true, imgId: "photo-1513104890138-7c749659a591" },
      { id: "v4", name: "Aloo Gobi Adraki", restaurant: "MTR", rating: "4.3", time: "15-20 mins", price: 150, isVeg: true, imgId: "photo-1574071318508-1cdbab80d002" }
    ]
  },
  {
    id: "chinese",
    title: "🍜 Chinese wok Specialties",
    subtitle: "Pan-fried momos, classic egg-tossed noodles, and hot manchurians",
    banner: "assets/illustrations/categories/chinese.jpg",
    items: [
      { id: "ch1", name: "Veg Fried Rice", restaurant: "Chutney Chang", rating: "4.4", time: "15-20 mins", price: 150, isVeg: true, img: "assets/illustrations/veg_fried_rice.png" },
      { id: "ch2", name: "Chicken Fried Rice", restaurant: "Chutney Chang", rating: "4.5", time: "15-20 mins", price: 180, isVeg: false, imgId: "photo-1631452180519-c014fe946bc7" },
      { id: "ch3", name: "Pan Fried Veg Momos", restaurant: "Chutney Chang", rating: "4.4", time: "15-25 mins", price: 140, isVeg: true, imgId: "photo-1482049016688-2d3e1b311543" },
      { id: "ch4", name: "Chicken Schezwan Momos", restaurant: "Chutney Chang", rating: "4.6", time: "15-25 mins", price: 160, isVeg: false, imgId: "photo-1504674900247-0877df9cc836" },
      { id: "ch5", name: "Chilli Paneer Dry", restaurant: "Chutney Chang", rating: "4.5", time: "15-20 mins", price: 190, isVeg: true, imgId: "photo-1546069901-ba9599a7e63c" },
      { id: "ch6", name: "Gobi Manchurian", restaurant: "Chutney Chang", rating: "4.4", time: "15-20 mins", price: 140, isVeg: true, imgId: "photo-1574071318508-1cdbab80d002" },
      { id: "ch7", name: "Veg Hakka Noodles", restaurant: "Chutney Chang", rating: "4.3", time: "15-20 mins", price: 160, isVeg: true, imgId: "photo-1512621776951-a57141f2eefd" },
      { id: "ch8", name: "Chicken Hakka Noodles", restaurant: "Chutney Chang", rating: "4.5", time: "15-20 mins", price: 195, isVeg: false, imgId: "photo-1631452180519-c014fe946bc7" },
      { id: "ch9", name: "Veg Spring Rolls", restaurant: "Chutney Chang", rating: "4.2", time: "10-15 mins", price: 110, isVeg: true, imgId: "photo-1541832676-9b763b0239ab" },
      { id: "ch10", name: "Schezwan Chicken Rice", restaurant: "Chutney Chang", rating: "4.6", time: "15-20 mins", price: 200, isVeg: false, imgId: "photo-1555507036-ab1f4038808a" }
    ]
  },
  {
    id: "desserts",
    title: "🍰 Desserts & Sweets",
    subtitle: "Mouthwatering gulab jamuns, chocolate lava cakes, and premium gelatos",
    banner: "assets/illustrations/categories/desserts.jpg",
    items: [
      { id: "ds1", name: "Hot Gulab Jamun (2 pcs)", restaurant: "MTR", rating: "4.8", time: "10-15 mins", price: 70, isVeg: true, imgId: "photo-1490645935967-10de6ba17061" },
      { id: "ds2", name: "Kolkata Rasgulla (2 pcs)", restaurant: "Chutney Chang", rating: "4.6", time: "10-15 mins", price: 60, isVeg: true, imgId: "photo-1467003909585-2f8a72700288" },
      { id: "ds3", name: "Ghee Gajar Halwa", restaurant: "MTR", rating: "4.7", time: "15-20 mins", price: 90, isVeg: true, imgId: "photo-1432139555190-58524dae6a55" },
      { id: "ds4", name: "Elaneer Payasam/Kheer", restaurant: "MTR", rating: "4.8", time: "15-20 mins", price: 80, isVeg: true, imgId: "photo-1540189549336-e6e99c3679fe" },
      { id: "ds5", name: "Fudge Chocolate Cake", restaurant: "Glen's Bakehouse", rating: "4.7", time: "15-20 mins", price: 120, isVeg: true, imgId: "photo-1565299624946-b28f40a0ae38" },
      { id: "ds6", name: "Vanilla Bean Gelato", restaurant: "Corner House", rating: "4.6", time: "10-15 mins", price: 90, isVeg: true, imgId: "photo-1565958011703-44f9829ba187" },
      { id: "ds7", name: "Butterscotch Gold Scoop", restaurant: "Corner House", rating: "4.7", time: "10-15 mins", price: 100, isVeg: true, imgId: "photo-1555939594-58d7cb561ad1" },
      { id: "ds8", name: "Kesar Rasmalai (2 pcs)", restaurant: "MTR", rating: "4.8", time: "10-15 mins", price: 80, isVeg: true, imgId: "photo-1478145046317-39f10e56b5e9" },
      { id: "ds9", name: "Hot Paneer Jalebi (4 pcs)", restaurant: "Veena Stores", rating: "4.7", time: "10-15 mins", price: 70, isVeg: true, imgId: "photo-1455619452474-d2be8b1e70cd" },
      { id: "ds10", name: "Warm Brownie Fudge", restaurant: "Corner House", rating: "4.8", time: "10-15 mins", price: 130, isVeg: true, imgId: "photo-1515003849-abf3fd746cd4" }
    ]
  },
  {
    id: "beverages",
    title: "☕ Coffee & Beverages",
    subtitle: "Authentic chicory filter coffee, spiced chais, and fresh juices",
    banner: "assets/illustrations/categories/beverages.jpg",
    items: [
      { id: "bv1", name: "Bengaluru Filter Coffee", restaurant: "Brahmin's Coffee Bar", rating: "4.9", time: "5-10 mins", price: 30, isVeg: true, imgId: "photo-1506084868230-bb9d95c24759" },
      { id: "bv2", name: "Elachi Masala Chai", restaurant: "Brahmin's Coffee Bar", rating: "4.7", time: "5-10 mins", price: 25, isVeg: true, imgId: "photo-1414235077428-338989a2e8c0" },
      { id: "bv3", name: "Sweet Punjabi Lassi", restaurant: "Chutney Chang", rating: "4.6", time: "10-15 mins", price: 70, isVeg: true, imgId: "photo-1533089860892-a7c6f0a88666" },
      { id: "bv4", name: "Alphonso Mango Lassi", restaurant: "Chutney Chang", rating: "4.7", time: "10-15 mins", price: 90, isVeg: true, imgId: "photo-1551024601-bec78aea704b" },
      { id: "bv5", name: "Fresh Mint Lime Juice", restaurant: "Taza Thindi", rating: "4.5", time: "5-10 mins", price: 40, isVeg: true, imgId: "photo-1567620905732-2d1ec7ab7445" },
      { id: "bv6", name: "Roasted Cold Coffee", restaurant: "Hole In The Wall", rating: "4.6", time: "10-15 mins", price: 110, isVeg: true, imgId: "photo-1568213816046-0ee1c42bd559" },
      { id: "bv7", name: "Virgin Mint Mojito", restaurant: "Hole In The Wall", rating: "4.5", time: "10-15 mins", price: 120, isVeg: true, imgId: "photo-1551183053-bf91a1d81141" },
      { id: "bv8", name: "Cold-Pressed Apple Juice", restaurant: "Glen's Bakehouse", rating: "4.6", time: "10-15 mins", price: 100, isVeg: true, imgId: "photo-1488900128323-24dd03350284" },
      { id: "bv9", name: "Fresh Watermelon Juice", restaurant: "Taza Thindi", rating: "4.6", time: "10-15 mins", price: 80, isVeg: true, imgId: "photo-1504754524776-8f4f37790ca0" },
      { id: "bv10", name: "Ghee Tadka Buttermilk", restaurant: "Veena Stores", rating: "4.7", time: "5-10 mins", price: 35, isVeg: true, imgId: "photo-1470337458703-46ad1756a187" }
    ]
  },
  {
    id: "pure-veg",
    title: "🥦 Pure Veg Favorites",
    subtitle: "Deliciously prepared 100% vegetarian culinary masterpieces",
    banner: "assets/illustrations/categories/pure_veg.jpg",
    items: [
      { id: "v1", name: "Paneer Tikka Grill", restaurant: "The Black Pearl", rating: "4.6", time: "20-30 mins", price: 210, isVeg: true, imgId: "photo-1568901346375-23c9450c58cd" },
      { id: "v2", name: "Veg Biryani Pot", restaurant: "MTR", rating: "4.5", time: "20-30 mins", price: 190, isVeg: true, imgId: "photo-1550547660-d9450f859349" },
      { id: "v3", name: "Peshawari Chana Masala", restaurant: "Empire Restaurant", rating: "4.4", time: "15-25 mins", price: 160, isVeg: true, imgId: "photo-1513104890138-7c749659a591" },
      { id: "v4", name: "Aloo Gobi Adraki", restaurant: "MTR", rating: "4.3", time: "15-20 mins", price: 150, isVeg: true, imgId: "photo-1574071318508-1cdbab80d002" },
      { id: "v5", name: "Yellow Dal Tadka", restaurant: "Veena Stores", rating: "4.6", time: "10-15 mins", price: 130, isVeg: true, imgId: "photo-1573080496219-bb080dd4f877" },
      { id: "v6", name: "Bhindi Masala Fry", restaurant: "Brahmin's Coffee Bar", rating: "4.5", time: "15-20 mins", price: 140, isVeg: true, img: "assets/illustrations/bhindi_masala.png" },
      { id: "v7", name: "Shahi Veg Korma", restaurant: "Nagarjuna", rating: "4.4", time: "20-25 mins", price: 170, isVeg: true, imgId: "photo-1561758033-d89a9ad46330" },
      { id: "v8", name: "Mushroom Masala", restaurant: "Windmills Craftworks", rating: "4.5", time: "20-30 mins", price: 220, isVeg: true, img: "assets/illustrations/mushroom_masala.png" },
      { id: "v9", name: "Mughlai Shahi Paneer", restaurant: "Empire Restaurant", rating: "4.7", time: "20-25 mins", price: 230, isVeg: true, imgId: "photo-1562967914-608f82629710" },
      { id: "v10", name: "Jeera Rice Pot", restaurant: "Taza Thindi", rating: "4.6", time: "10-15 mins", price: 120, isVeg: true, imgId: "photo-1578985545062-69928b1d9587" }
    ]
  },
  {
    id: "non-veg",
    title: "🍗 Non-Veg Delights",
    subtitle: "Spicy chicken lollipops, tender muttons, and coastal fried prawns",
    banner: "assets/illustrations/categories/non_veg.jpg",
    items: [
      { id: "nv1", name: "Homestyle Egg Curry", restaurant: "Empire Restaurant", rating: "4.4", time: "15-20 mins", price: 160, isVeg: false, imgId: "photo-1501443712940-3dec72a86ffd" },
      { id: "nv2", name: "Chicken Korma Mughlai", restaurant: "Empire Restaurant", rating: "4.5", time: "20-30 mins", price: 240, isVeg: false, imgId: "photo-1572490122747-3968b75cc699" },
      { id: "nv3", name: "Mutton Rogan Josh", restaurant: "Nagarjuna", rating: "4.8", time: "25-35 mins", price: 310, isVeg: false, imgId: "photo-1606313564200-e75d5e30476c" },
      { id: "nv4", name: "Kawa Fish Fry", restaurant: "The Black Pearl", rating: "4.5", time: "20-30 mins", price: 260, isVeg: false, imgId: "photo-1541167760496-1628856ab772" },
      { id: "nv5", name: "Goan Prawn Masala", restaurant: "The Black Pearl", rating: "4.6", time: "25-30 mins", price: 290, isVeg: false, imgId: "photo-1576092768241-dec231879fc3" },
      { id: "nv6", name: "Chicken Seekh Kebab", restaurant: "Windmills Craftworks", rating: "4.7", time: "20-25 mins", price: 230, isVeg: false, imgId: "photo-1513558161293-cdaf765ed2fd" },
      { id: "nv7", name: "Mutton Keema Masala", restaurant: "Nagarjuna", rating: "4.7", time: "20-30 mins", price: 280, isVeg: false, imgId: "photo-1497515114629-f71d768fd07c" },
      { id: "nv8", name: "Egg Biryani Pot", restaurant: "Empire Restaurant", rating: "4.5", time: "20-30 mins", price: 190, isVeg: false, imgId: "photo-1621506289937-a8e4df240d0b" },
      { id: "nv9", name: "Crispy Chicken Lollipop", restaurant: "Chutney Chang", rating: "4.6", time: "20-25 mins", price: 210, isVeg: false, imgId: "photo-1555507036-ab1f4038808a" },
      { id: "nv10", name: "Andhra Pepper Chicken", restaurant: "Nagarjuna", rating: "4.8", time: "20-25 mins", price: 240, isVeg: false, imgId: "photo-1598214886806-c8761a370988" }
    ]
  },
  {
    id: "snacks",
    title: "🍿 Tasty Snacks",
    subtitle: "Hot crispy bondas, spicy samosa chaats, rolls, and french fries",
    banner: "assets/illustrations/categories/snacks.jpg",
    items: [
      { id: "sn1", name: "French Fries", restaurant: "Truffles", rating: "4.5", time: "10-15 mins", price: 110, isVeg: true, imgId: "photo-1498837167922-ddd27525d352" },
      { id: "sn2", name: "Garlic Bread Stix", restaurant: "Toit", rating: "4.5", time: "15-20 mins", price: 140, isVeg: true, imgId: "photo-1476224203421-9ac39bcb3327" },
      { id: "sn3", name: "Crispy Chicken Nuggets", restaurant: "Leon's Burgers", rating: "4.5", time: "15-20 mins", price: 150, isVeg: false, imgId: "photo-1484723091739-30a097e8f929" },
      { id: "sn4", name: "Mysore Bonda", restaurant: "Taza Thindi", rating: "4.7", time: "10-15 mins", price: 60, isVeg: true, imgId: "photo-1569562211093-4ed0d0758f12" },
      { id: "sn5", name: "Medu Vada", restaurant: "Taza Thindi", rating: "4.8", time: "10-15 mins", price: 50, isVeg: true, imgId: "photo-1601050690597-df056fb4ce78" },
      { id: "sn6", name: "Veg Frankie Roll", restaurant: "Leon's Burgers", rating: "4.3", time: "15-20 mins", price: 130, isVeg: true, imgId: "photo-1512621776951-a57141f2eefd" },
      { id: "sn7", name: "Crispy Onion Rings", restaurant: "Truffles", rating: "4.4", time: "10-15 mins", price: 120, isVeg: true, imgId: "photo-1542574271-7f3b92e6c821" },
      { id: "sn8", name: "Cheese Corn Balls", restaurant: "Glen's Bakehouse", rating: "4.5", time: "10-15 mins", price: 150, isVeg: true, imgId: "photo-1565958011703-44f9829ba187" },
      { id: "sn9", name: "Potato Wedges", restaurant: "Corner House", rating: "4.4", time: "10-15 mins", price: 110, isVeg: true, imgId: "photo-1504754524776-8f4f37790ca0" },
      { id: "sn10", name: "Paneer Bread Roll", restaurant: "Veena Stores", rating: "4.6", time: "10-15 mins", price: 90, isVeg: true, imgId: "photo-1455619452474-d2be8b1e70cd" }
    ]
  }
];

// Run operations when page loads
document.addEventListener("DOMContentLoaded", () => {
  renderSkeletons();
  
  // Simulate network load to present premium skeletons, then swap with beautiful layouts
  setTimeout(() => {
    renderPremiumCategories();
    initScrollSpy();
  }, 750);
});

/**
 * Renders glassmorphic skeleton layouts for the categories system
 */
function renderSkeletons() {
  const root = document.getElementById("homepage-categories-root");
  if (!root) return;

  let html = "";
  // Create skeletons for 3 initial sections (keeps page-load lightweight)
  for (let i = 0; i < 3; i++) {
    html += `
      <div style="display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-8);">
        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
          <div style="width: 40%;">
            <div class="skeleton" style="height: 24px; width: 60%; border-radius: 4px; margin-bottom: var(--space-2);"></div>
            <div class="skeleton" style="height: 14px; width: 90%; border-radius: 4px;"></div>
          </div>
          <div class="skeleton" style="height: 36px; width: 80px; border-radius: var(--radius-md);"></div>
        </div>
        <div class="slider-wrapper">
          <div class="restaurant-row-slider">
            <div class="skeleton" style="flex: 0 0 290px; width: 290px; height: 276px; border-radius: var(--radius-lg);"></div>
            <div class="skeleton" style="flex: 0 0 290px; width: 290px; height: 276px; border-radius: var(--radius-lg);"></div>
            <div class="skeleton" style="flex: 0 0 290px; width: 290px; height: 276px; border-radius: var(--radius-lg);"></div>
            <div class="skeleton" style="flex: 0 0 290px; width: 290px; height: 276px; border-radius: var(--radius-lg);"></div>
          </div>
        </div>
      </div>
    `;
  }
  root.innerHTML = html;
}

/**
 * Swaps skeletons out for the fully responsive category lists and triggers micro-animations
 */
function renderPremiumCategories() {
  const root = document.getElementById("homepage-categories-root");
  if (!root) return;

  // Retrieve favorited indices from localStorage
  const favorites = JSON.parse(localStorage.getItem("fastx_favorites") || "[]");

  let html = "";

  CATEGORIES_DATA.forEach(cat => {
    html += `
      <!-- Category Row: ${cat.title} -->
      <section id="${cat.id}" style="display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-8); scroll-margin-top: 85px;">
        <div class="section-header-flex">
          <div class="header-text">
            <h2>${cat.title}</h2>
            <p>${cat.subtitle}</p>
          </div>
          <a href="customer/category.html?type=${cat.id}" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.8125rem;">View All</a>
        </div>
        
        <div class="slider-wrapper">
          <!-- Floating glass arrows -->
          <button class="slider-arrow arrow-left" onclick="scrollSlider('slider-${cat.id}', -1)" aria-label="Scroll Left">‹</button>
          
          <div class="restaurant-row-slider" id="slider-${cat.id}">
            <!-- Large Promotional Card -->
            <div class="card category-banner-card" style="position: relative; overflow: hidden; padding: 0 !important; cursor: default;">
              <!-- Banner Image with lazy loading, alt text, and fallback -->
              <img class="category-banner-img" src="${cat.banner}" alt="${cat.title} Category Banner" loading="lazy" onerror="this.onerror=null; this.src='assets/illustrations/hero_food_banner.png';" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; z-index: 0;">
              
              <!-- Content Wrapper above image and gradient overlay -->
              <div style="position: relative; z-index: 2; padding: var(--space-4); display: flex; flex-direction: column; height: 100%; justify-content: flex-end; width: 100%;">
                <span class="badge badge-warning" style="align-self: flex-start; margin-bottom: var(--space-2); font-size: 0.7rem; letter-spacing: 0.5px; position: relative; z-index: 2;">Premium Selection</span>
                <h3 class="text-xl font-weight-bold" style="color: #FFFFFF; margin-bottom: 2px; position: relative; z-index: 2; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">${cat.title}</h3>
                <p class="text-xs" style="color: rgba(255,255,255,0.85); position: relative; z-index: 2; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">${cat.subtitle}</p>
              </div>
            </div>
            
            ${cat.items.map(item => {
              const isFav = favorites.includes(item.id);
              const indicatorClass = item.isVeg ? "indicator-veg" : "indicator-nonveg";
              const indicatorTitle = item.isVeg ? "Veg" : "Non-Veg";
              
              const escapedName = item.name.replace(/'/g, "\\'");
              const escapedRest = item.restaurant.replace(/'/g, "\\'");

              // Support local images if defined in the item record, fallback to Unsplash
              const imageUrl = item.img ? item.img : `https://images.unsplash.com/${item.imgId}?w=320&h=240&auto=format&fit=crop&q=65`;

              return `
                <!-- Food Card: ${item.name} -->
                <div class="card glass-card restaurant-card" style="position: relative;">
                  <!-- Favorite Heart Button overlay -->
                  <button class="fav-heart-btn ${isFav ? 'active' : ''}" onclick="toggleFavHeart('${item.id}', this)" aria-label="Add to Favorites">♥</button>
                  
                  <div class="restaurant-img-wrapper" style="overflow: hidden; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
                    <img class="lazy-load-img" src="assets/illustrations/hero_food_banner.png" data-src="${imageUrl}" alt="${item.name}" loading="lazy" onerror="this.onerror=null; this.src='assets/illustrations/hero_food_banner.png'; this.style.filter='none';" style="transition: filter 0.5s ease; filter: blur(5px);">
                    
                    <div class="restaurant-badge-overlay" style="display: flex; gap: 4px;">
                      <span class="${indicatorClass}" title="${indicatorTitle}"></span>
                      <span class="badge badge-success" style="font-size: 0.65rem;">${item.time}</span>
                    </div>
                  </div>
                  
                  <div class="restaurant-details" style="padding: var(--space-4); display: flex; flex-direction: column; flex-grow: 1;">
                    <h3 class="text-lg font-weight-bold" style="color: var(--color-dark-text-main); line-height: 1.2;">${item.name}</h3>
                    <p class="text-xs font-weight-semibold" style="color: var(--color-dark-text-muted); margin-top: 2px;">${item.restaurant}</p>
                    
                    <div class="restaurant-meta" style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-2);">
                      <span class="restaurant-rating" style="font-size: 0.8125rem;">★ ${item.rating}</span>
                      <span style="color: var(--color-primary); font-weight: 700; font-size: 1rem;">₹${item.price}</span>
                    </div>
                    
                    <button class="btn btn-primary btn-block" style="margin-top: var(--space-3); padding: 8px 12px; font-size: 0.8125rem; font-weight: 600;" onclick="addHomepageItemToCart('${item.id}', '${escapedRest}', '${escapedName}', ${item.price})">
                      Add to Cart
                    </button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
          
          <button class="slider-arrow arrow-right" onclick="scrollSlider('slider-${cat.id}', 1)" aria-label="Scroll Right">›</button>
        </div>
      </section>
    `;
  });

  root.innerHTML = html;

  // Execute lazy loading image replacement
  lazyLoadImages();
}

/**
 * Replaces blurry placeholder images with high-quality source URLs once visible in the viewport
 */
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll(".lazy-load-img");
  
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => {
            img.style.filter = "none";
          };
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => observer.observe(img));
  } else {
    // Fallback if IntersectionObserver is not supported
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.style.filter = "none";
    });
  }
}

/**
 * Double-click heart or single-tap heart toggles the favorites register
 */
function toggleFavHeart(itemId, element) {
  let favorites = JSON.parse(localStorage.getItem("fastx_favorites") || "[]");
  
  if (favorites.includes(itemId)) {
    favorites = favorites.filter(id => id !== itemId);
    element.classList.remove("active");
  } else {
    favorites.push(itemId);
    element.classList.add("active");
  }

  localStorage.setItem("fastx_favorites", JSON.stringify(favorites));
}

/**
 * Handles scrolling logic of horizontal carousels smoothly
 */
function scrollSlider(sliderId, direction) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;
  
  // Width of card (290px) + Gap (24px) = 314px. Scroll 2 cards at a time.
  const scrollOffset = 314 * 2;
  
  slider.scrollBy({
    left: direction * scrollOffset,
    behavior: "smooth"
  });
}

/**
 * Pushes homepage dynamic items straight into checkout and global cart persistence
 */
function addHomepageItemToCart(itemId, restName, itemName, itemPrice) {
  // Parse clean numerical restaurant ID from item ID string (e.g. b1 -> 20, l1 -> 3, ff1 -> 2, etc.)
  let parsedRestId = "1";
  if (itemId.startsWith("b")) parsedRestId = "20"; // Veena Stores
  else if (itemId.startsWith("l")) parsedRestId = "3"; // MTR
  else if (itemId.startsWith("d")) parsedRestId = "6"; // Empire
  else if (itemId.startsWith("v")) parsedRestId = "9"; // The Black Pearl
  else if (itemId.startsWith("nv")) parsedRestId = "5"; // Nagarjuna
  else if (itemId.startsWith("ff")) parsedRestId = "2"; // Truffles
  else if (itemId.startsWith("ds")) parsedRestId = "7"; // Corner House
  else if (itemId.startsWith("bv")) parsedRestId = "18"; // Brahmin's Coffee Bar

  // Find actual image of the item from CATEGORIES_DATA lookup
  let itemImg = "assets/illustrations/hero_food_banner.png";
  if (typeof CATEGORIES_DATA !== "undefined") {
    for (const cat of CATEGORIES_DATA) {
      const found = cat.items.find(i => i.id === itemId);
      if (found) {
        itemImg = found.img ? found.img : `https://images.unsplash.com/${found.imgId}?w=320&h=240&auto=format&fit=crop&q=65`;
        break;
      }
    }
  }

  const isVeg = itemId.startsWith("v") || itemId.startsWith("b") || itemId.startsWith("ds") || itemId.startsWith("bv");
  addToCart(parsedRestId, restName, {
    name: itemName,
    price: itemPrice,
    veg: isVeg,
    img: itemImg
  });
}

/**
 * Custom function to smooth scroll to a section with sticky navbar offset
 */
window.scrollToSection = (sectionId) => {
  const target = document.getElementById(sectionId);
  if (!target) return;
  const navbarHeight = 85; // navbar height + buffer
  const elementPosition = target.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  });
};

/**
 * Scroll Spy to highlight active category card
 */
function initScrollSpy() {
  const categories = [
    "breakfast", "lunch", "dinner", "fast-food", "pizza", "burgers", 
    "biryani", "south-indian", "north-indian", "chinese", "desserts", 
    "beverages", "pure-veg", "non-veg", "snacks"
  ];
  
  const observerOptions = {
    root: null,
    rootMargin: "-120px 0px -50% 0px",
    threshold: 0.15
  };
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        
        // Remove active highlights from all cards
        document.querySelectorAll(".category-explore-card").forEach(card => {
          card.style.borderColor = "rgba(255, 255, 255, 0.15)";
          card.style.boxShadow = "0 20px 50px rgba(0, 0, 0, 0.35)";
        });
        
        // Add highlight to matching card
        const activeCard = document.querySelector(`.category-explore-card[href$="#${id}"]`);
        if (activeCard) {
          activeCard.style.borderColor = "var(--color-primary)";
          activeCard.style.boxShadow = "0 0 15px rgba(255, 90, 54, 0.3)";
        }
      }
    });
  }, observerOptions);
  
  categories.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}
