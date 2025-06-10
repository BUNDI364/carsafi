// Load cart from localStorage or start new
let cart = JSON.parse(localStorage.getItem("carsafiCart")) || {};

// Max quantity in stock for each product
const stockLimits = {
  "Waterless Wash Spray": 5,
  "Dashboard Polish": 8,
  "Microfiber Cloth Pack": 10,
  "Tire Shine Gel": 7,
};

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("carsafiCart", JSON.stringify(cart));
}

// Add product to cart
function addToCart(productName, price) {
  if (!cart[productName]) {
    cart[productName] = { quantity: 1, price };
  } else {
    if (cart[productName].quantity >= stockLimits[productName]) {
      alert("Only " + stockLimits[productName] + " in stock for " + productName);
      return;
    }
    cart[productName].quantity += 1;
  }
  saveCart();
  updateCartDisplay();
}

// Remove product from cart
function removeFromCart(productName) {
  delete cart[productName];
  saveCart();
  updateCartDisplay();
}

// Change product quantity
function changeQuantity(productName, amount) {
  if (cart[productName]) {
    cart[productName].quantity += amount;
    if (cart[productName].quantity <= 0) {
      removeFromCart(productName);
    } else if (cart[productName].quantity > stockLimits[productName]) {
      cart[productName].quantity = stockLimits[productName];
      alert("Stock limit reached.");
    }
    saveCart();
    updateCartDisplay();
  }
}

// Update cart display in DOM
function updateCartDisplay() {
  const cartItemsDiv = document.getElementById("cart-items");
  cartItemsDiv.innerHTML = "";

  let total = 0;
  for (const product in cart) {
    const item = cart[product];
    const itemTotal = item.quantity * item.price;
    total += itemTotal;

    cartItemsDiv.innerHTML += `
      <div style="border-bottom:1px solid #ccc; padding:10px 0;">
        <strong>${product}</strong><br>
        Quantity:
        <button onclick="changeQuantity('${product}', -1)">➖</button>
        ${item.quantity}
        <button onclick="changeQuantity('${product}', 1)">➕</button><br>
        Subtotal: KES ${itemTotal}
        <button onclick="removeFromCart('${product}')">🗑️ Remove</button>
      </div>
    `;
  }

  document.getElementById("cart-total").innerText = total;
}

// Confirm and redirect to WhatsApp
function checkoutCart() {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let confirmOrder = "You're about to order:\n";
  for (const product in cart) {
    const item = cart[product];
    confirmOrder += `- ${product} x ${item.quantity} = KES ${item.quantity * item.price}\n`;
  }
  const total = document.getElementById("cart-total").innerText;
  confirmOrder += `\nTotal: KES ${total}`;

  if (confirm(confirmOrder + "\n\nProceed to WhatsApp checkout?")) {
    const whatsappURL = `https://wa.me/254716520944?text=${encodeURIComponent(confirmOrder)}`;
    window.open(whatsappURL, "_blank");
  }
}

// Run on page load
updateCartDisplay();
