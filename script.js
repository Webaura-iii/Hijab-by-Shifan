// DEFAULT SEED DATA INCLUDING ALL ITEMS FROM DESIGNS
const DEFAULT_PRODUCTS = [
    {
        id: "1",
        category: "Hijabs",
        name: "Noir Silk Premium Hijab",
        price: 799,
        badge: "Bestseller",
        image: "noir-silk.jpg",
        description: "A liquid-black silk hijab with a quiet sheen. Drapes clean, holds a pin, and photographs like evening light. Finished with a hand-rolled edge — the piece you reach for when the occasion asks for less, not more.",
        featured: true,
        colors: ["Noir", "Espresso"],
        sizes: ["Standard 180×70", "Large 200×80"]
    },
    {
        id: "2",
        category: "Hijabs",
        name: "Blush Chiffon Hijab",
        price: 699,
        badge: "",
        image: "blush-chiffon.jpg",
        description: "An airy, lightweight textured chiffon hijab in a soft dusty rose hue. Breathable and effortless for all-day comfort.",
        featured: true,
        colors: ["Blush", "Rosewood"],
        sizes: ["Standard 180×70"]
    },
    {
        id: "3",
        category: "Hijabs",
        name: "Ivory Modal Everyday Hijab",
        price: 649,
        badge: "",
        image: "ivory-modal.jpg",
        description: "Ultra-soft modal fabric with slight stretch. Perfect structure without needing under-caps or pins.",
        featured: true,
        colors: ["Ivory", "Off-White"],
        sizes: ["Standard 180×70"]
    },
    {
        id: "4",
        category: "Hijabs",
        name: "Leopard Luxe Print Hijab",
        price: 899,
        badge: "Limited",
        image: "leopard-print.jpg",
        description: "Bold leopard pattern on buttery modal silk blend. Styled for statement looks and refined drapes.",
        featured: false,
        colors: ["Classic Tan"],
        sizes: ["Standard 180×70"]
    },
    {
        id: "5",
        category: "Bouquets",
        name: "Tulip Hijab Bouquet",
        price: 1499,
        badge: "Gift",
        image: "tulip-bouquet.jpg",
        description: "Fresh pink tulip arrangement beautifully wrapped together with a premium silk hijab.",
        featured: false,
        colors: ["Soft Pink"],
        sizes: ["Standard"]
    },
    {
        id: "6",
        category: "Bouquets",
        name: "Peony Blush Bouquet",
        price: 1699,
        badge: "",
        image: "peony-bouquet.jpg",
        description: "Full peony and garden rose arrangement encased with a chiffon modal wrap.",
        featured: false,
        colors: ["Blush White"],
        sizes: ["Standard"]
    },
    {
        id: "7",
        category: "Hampers",
        name: "Luxury Gold Hamper",
        price: 2999,
        badge: "Signature",
        image: "luxury-hamper.jpg",
        description: "Curated gift box featuring two silk hijabs, gold geometric accessory tray, and floral spray.",
        featured: false,
        colors: ["Gold & Black"],
        sizes: ["Deluxe Box"]
    },
    {
        id: "8",
        category: "Hampers",
        name: "Hello Hijabi Starter Hamper",
        price: 1999,
        badge: "",
        image: "starter-hamper.jpg",
        description: "Round keepsake gift box with two modal everyday hijabs, crystal pin set, and perfume mini.",
        featured: false,
        colors: ["Pastel Mix"],
        sizes: ["Standard Box"]
    },
    {
        id: "9",
        category: "Pins",
        name: "Pearl & Crystal Pin Set",
        price: 249,
        badge: "",
        image: "pearl-pins.jpg",
        description: "Handcrafted geometric gold pins set with freshwater pearls and fine crystals.",
        featured: false,
        colors: ["Gold/Pearl"],
        sizes: ["Set of 6"]
    },
    {
        id: "10",
        category: "Nameplates",
        name: "Gold Geometric Nameplate",
        price: 449,
        badge: "",
        image: "nameplate.jpg",
        description: "Custom acrylic gold-rimmed hexagonal desk frame with personalized calligraphy.",
        featured: false,
        colors: ["Gold Clear"],
        sizes: ["15cm Hexagon"]
    }
];

// STORAGE HELPERS
function getStoredProducts() {
    const data = localStorage.getItem('hbs_products');
    if (!data) {
        localStorage.setItem('hbs_products', JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
    }
    return JSON.parse(data);
}

function getStoredOrders() {
    return JSON.parse(localStorage.getItem('hbs_orders') || '[]');
}

function saveOrderToStorage(newOrder) {
    const orders = getStoredOrders();
    orders.unshift(newOrder);
    localStorage.setItem('hbs_orders', JSON.stringify(orders));
}

// STATE
let PRODUCTS = getStoredProducts();
let cart = [];
let selectedProduct = PRODUCTS[0] || {};
let selectedColor = 'Default';
let selectedSize = 'Standard';
let selectedQty = 1;
let currentShopCategory = 'All';
let currentShopSearch = '';
let toastTimeout;

// INIT
document.addEventListener('DOMContentLoaded', () => {
    PRODUCTS = getStoredProducts();
    renderFeaturedProducts();
    renderShopProducts();
    updateCartCount();
});

window.addEventListener('storage', (e) => {
    if (e.key === 'hbs_products') {
        PRODUCTS = getStoredProducts();
        renderFeaturedProducts();
        renderShopProducts();
    }
});

// ROUTING
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active-view'));
    const target = document.getElementById(`view-${viewId}`);
    if(target) target.classList.add('active-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    if(viewId === 'home') document.getElementById('nav-home')?.classList.add('active');
    if(viewId === 'shop') document.getElementById('nav-shop')?.classList.add('active');
    if(viewId === 'cart') document.getElementById('nav-cart')?.classList.add('active');

    if(viewId === 'shop') renderShopProducts();
    if(viewId === 'cart') renderCartView();
    if(viewId === 'checkout') renderCheckoutView();
}

// TOAST
function showCartToast(productName) {
    const toast = document.getElementById('cart-toast');
    const nameEl = document.getElementById('toast-product-name');
    if(!toast || !nameEl) return;

    nameEl.innerText = productName;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// FEATURED HOME
function renderFeaturedProducts() {
    const container = document.getElementById('featured-products-grid');
    if(!container) return;

    PRODUCTS = getStoredProducts();
    const featuredList = PRODUCTS.filter(p => p.featured || String(p.id) <= "3");

    container.innerHTML = featuredList.map(p => `
        <div class="product-card" onclick="openProductDetail('${p.id}')">
            <div class="product-img-box">
                ${p.badge ? `<span class="badge-bestseller">${p.badge.toUpperCase()}</span>` : ''}
                <img src="${p.image}" alt="${p.name}">
            </div>
            <span class="product-cat">${p.category}</span>
            <div class="product-info-row">
                <h4 class="product-name">${p.name}</h4>
                <span class="product-price">₹${p.price}</span>
            </div>
            <div class="product-actions" onclick="event.stopPropagation();">
                <button class="btn-add-cart" onclick="quickAddToCart('${p.id}')">Add to cart</button>
                <button class="btn-view" onclick="openProductDetail('${p.id}')">View</button>
            </div>
        </div>
    `).join('');
}

// SHOP PAGE RENDER & FILTERING
function renderShopProducts() {
    const container = document.getElementById('full-shop-products-grid');
    const countEl = document.getElementById('shop-pieces-count');
    if(!container) return;

    PRODUCTS = getStoredProducts();

    let filtered = PRODUCTS.filter(p => {
        const matchesCategory = (currentShopCategory === 'All') || (p.category.toLowerCase() === currentShopCategory.toLowerCase());
        const matchesSearch = p.name.toLowerCase().includes(currentShopSearch.toLowerCase()) || 
                              p.category.toLowerCase().includes(currentShopSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if(countEl) countEl.innerText = filtered.length;

    if(filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-muted);">
                <p style="font-size: 16px;">No pieces found matching your criteria.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(p => `
        <div class="product-card" onclick="openProductDetail('${p.id}')">
            <div class="product-img-box">
                ${p.badge ? `<span class="badge-bestseller">${p.badge.toUpperCase()}</span>` : ''}
                <img src="${p.image}" alt="${p.name}">
            </div>
            <span class="product-cat">${p.category}</span>
            <div class="product-info-row">
                <h4 class="product-name">${p.name}</h4>
                <span class="product-price">₹${p.price}</span>
            </div>
            <div class="product-actions" onclick="event.stopPropagation();">
                <button class="btn-add-cart" onclick="quickAddToCart('${p.id}')">Add to cart</button>
                <button class="btn-view" onclick="openProductDetail('${p.id}')">View</button>
            </div>
        </div>
    `).join('');
}

function filterShopCategory(categoryName) {
    currentShopCategory = categoryName;

    document.querySelectorAll('.filter-pill').forEach(btn => {
        if(btn.innerText.trim().toLowerCase() === categoryName.toLowerCase()) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderShopProducts();
}

function handleShopSearch(query) {
    currentShopSearch = query;
    renderShopProducts();
}

// DETAIL VIEW
function openProductDetail(id) {
    selectedProduct = PRODUCTS.find(p => String(p.id) === String(id)) || PRODUCTS[0];
    const colors = selectedProduct.colors || ['Standard'];
    const sizes = selectedProduct.sizes || ['Standard'];
    
    selectedColor = colors[0];
    selectedSize = sizes[0];
    selectedQty = 1;

    const container = document.getElementById('product-detail-container');
    container.innerHTML = `
        <div class="detail-gallery">
            <img src="${selectedProduct.image}" alt="${selectedProduct.name}">
        </div>
        <div class="detail-info">
            <span class="detail-tag">${selectedProduct.category}</span>
            <div class="detail-title-wrap">
                <h2 class="detail-title">${selectedProduct.name}</h2>
            </div>
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                <span class="detail-price">₹${selectedProduct.price}</span>
                ${selectedProduct.badge ? `<span class="badge-inline">${selectedProduct.badge.toUpperCase()}</span>` : ''}
            </div>
            <p class="detail-desc">${selectedProduct.description}</p>

            <div class="option-group">
                <span class="option-label">Colour</span>
                <div class="option-btns">
                    ${colors.map(c => `
                        <button class="opt-btn ${c === selectedColor ? 'active' : ''}" onclick="selectColor('${c}')">${c}</button>
                    `).join('')}
                </div>
            </div>

            <div class="option-group">
                <span class="option-label">Size</span>
                <div class="option-btns">
                    ${sizes.map(s => `
                        <button class="opt-btn ${s === selectedSize ? 'active' : ''}" onclick="selectSize('${s}')">${s}</button>
                    `).join('')}
                </div>
            </div>

            <div class="qty-and-cart">
                <div class="qty-picker">
                    <button onclick="changeQty(-1)">-</button>
                    <span id="detail-qty">${selectedQty}</span>
                    <button onclick="changeQty(1)">+</button>
                </div>
                <button class="btn-add-main" onclick="addToCartFromDetail()">Add to cart</button>
            </div>

            <p class="detail-policy-text">
                Prepaid orders only. No COD, refund, or return. Personalised details are confirmed on WhatsApp after checkout.
            </p>
        </div>
    `;

    showView('product');
}

function selectColor(color) {
    selectedColor = color;
    openProductDetail(selectedProduct.id);
}

function selectSize(size) {
    selectedSize = size;
    openProductDetail(selectedProduct.id);
}

function changeQty(delta) {
    selectedQty = Math.max(1, selectedQty + delta);
    const qtyEl = document.getElementById('detail-qty');
    if(qtyEl) qtyEl.innerText = selectedQty;
}

// CART ACTIONS
function quickAddToCart(productId) {
    const p = PRODUCTS.find(prod => String(prod.id) === String(productId));
    const defaultColor = (p.colors && p.colors[0]) ? p.colors[0] : 'Standard';
    const defaultSize = (p.sizes && p.sizes[0]) ? p.sizes[0] : 'Standard';
    addToCart(p, defaultColor, defaultSize, 1);
}

function addToCartFromDetail() {
    addToCart(selectedProduct, selectedColor, selectedSize, selectedQty);
}

function addToCart(product, color, size, qty) {
    const existingIndex = cart.findIndex(item => String(item.product.id) === String(product.id) && item.color === color && item.size === size);
    if(existingIndex > -1) {
        cart[existingIndex].qty += qty;
    } else {
        cart.push({ product, color, size, qty });
    }
    updateCartCount();
    showCartToast(product.name);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartEl = document.getElementById('cart-count');
    if(cartEl) cartEl.innerText = totalItems;
}

function updateItemQty(index, delta) {
    cart[index].qty += delta;
    if(cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartCount();
    renderCartView();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCartView();
}

// CART VIEW RENDER
function renderCartView() {
    const container = document.getElementById('cart-content-area');
    if(!container) return;

    if(cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty-state">
                <div class="empty-icon">
                    <svg class="icon" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 28px; margin-bottom: 8px;">Your bag is empty</h3>
                <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 24px;">The edit is waiting — hijabs, hampers, and bouquets packed in Bhiwandi.</p>
                <button class="btn-primary" onclick="showView('shop');">Browse the shop</button>
            </div>
        `;
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

    container.innerHTML = `
        <div class="cart-layout">
            <div>
                ${cart.map((item, index) => `
                    <div class="cart-item-card">
                        <img src="${item.product.image}" class="cart-item-img" alt="${item.product.name}">
                        <div class="cart-item-info">
                            <h4 class="cart-item-title">${item.product.name}</h4>
                            <p class="cart-item-variant">${item.color} · ${item.size}</p>
                            <div class="qty-picker" style="display:inline-flex;">
                                <button onclick="updateItemQty(${index}, -1)">-</button>
                                <span>${item.qty}</span>
                                <button onclick="updateItemQty(${index}, 1)">+</button>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight:600; font-size:15px; margin-bottom:12px;">₹${item.product.price * item.qty}</div>
                            <button onclick="removeItem(${index})" style="color:var(--text-muted);">
                                <svg class="icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="cart-summary-card">
                <h3 class="summary-title">Summary</h3>
                <div class="summary-row">
                    <span>Items</span>
                    <span>${cart.reduce((s,i) => s + i.qty, 0)}</span>
                </div>
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>₹${subtotal}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>Calculated on WhatsApp</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>₹${subtotal}</span>
                </div>
                <button class="btn-checkout" onclick="showView('checkout')">Proceed to checkout</button>
            </div>
        </div>
    `;
}

// CHECKOUT VIEW RENDER
function renderCheckoutView() {
    const summaryContainer = document.getElementById('checkout-order-summary');
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

    if(summaryContainer) {
        summaryContainer.innerHTML = cart.map(item => `
            <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:8px;">
                <div>
                    <strong>${item.product.name}</strong><br>
                    <span style="color:var(--text-muted); font-size:11px;">×${item.qty} · ${item.color}</span>
                </div>
                <div>₹${item.product.price * item.qty}</div>
            </div>
        `).join('');
    }

    const totalEl = document.getElementById('checkout-total-price');
    if(totalEl) totalEl.innerText = `₹${subtotal}`;
}

// WHATSAPP SUBMISSION
function submitOrderToWhatsApp() {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const city = document.getElementById('cust-city').value.trim();
    const pincode = document.getElementById('cust-pincode').value.trim();
    const note = document.getElementById('cust-note').value.trim();

    if(!name || !phone || !address || !city || !pincode) {
        alert('Please fill in all mandatory delivery details.');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    const orderId = 'ord-' + Math.random().toString(36).substring(2, 11);
    const dateStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const orderRecord = {
        id: orderId,
        customerName: name,
        phone: phone,
        address: `${address}, ${city} - ${pincode}`,
        items: cart.map(item => `${item.product.name} (${item.color}, ${item.size}) × ${item.qty}`),
        totalAmount: subtotal,
        status: 'pending',
        date: dateStr
    };

    saveOrderToStorage(orderRecord);

    let text = `*NEW ORDER - Hijab by Shifan*\n\n`;
    text += `*Order ID:* ${orderId}\n`;
    text += `*Customer Details:*\n`;
    text += `Name: ${name}\n`;
    text += `Phone: ${phone}\n`;
    text += `Address: ${address}, ${city} - ${pincode}\n`;
    if(note) text += `Note: ${note}\n`;

    text += `\n*Order Items:*\n`;
    cart.forEach(item => {
        text += `• ${item.product.name} (${item.color}, ${item.size}) × ${item.qty} - ₹${item.product.price * item.qty}\n`;
    });

    text += `\n*Total Amount:* ₹${subtotal}\n`;
    text += `\n_Prepaid order to be processed._`;

    const encodedMsg = encodeURIComponent(text);
    const whatsappNumber = "919876543210";
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

    cart = [];
    updateCartCount();

    renderConfirmationView(orderId, subtotal, waUrl);
    showView('confirmation');
    window.open(waUrl, '_blank');
}

// CONFIRMATION VIEW RENDER
function renderConfirmationView(orderId, totalAmount, waUrl) {
    const container = document.getElementById('confirmation-content-area');
    if(!container) return;

    container.innerHTML = `
        <div class="confirm-hex-wrapper">
            <svg class="confirm-hex-bg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="100,10 178,55 178,145 100,190 22,145 22,55" stroke="#EAE0D5" stroke-width="1.2" fill="none"/>
                <polygon points="100,25 165,62 165,138 100,175 35,138 35,62" stroke="#EAE0D5" stroke-width="0.8" fill="none"/>
                <line x1="100" y1="10" x2="100" y2="25" stroke="#EAE0D5" stroke-width="1"/>
                <line x1="178" y1="55" x2="165" y2="62" stroke="#EAE0D5" stroke-width="1"/>
                <line x1="178" y1="145" x2="165" y2="138" stroke="#EAE0D5" stroke-width="1"/>
                <line x1="100" y1="190" x2="100" y2="175" stroke="#EAE0D5" stroke-width="1"/>
                <line x1="22" y1="145" x2="35" y2="138" stroke="#EAE0D5" stroke-width="1"/>
                <line x1="22" y1="55" x2="35" y2="62" stroke="#EAE0D5" stroke-width="1"/>
            </svg>
            <div class="confirm-hex-content">
                <div class="confirm-check-circle">
                    <svg viewBox="0 0 24 24" class="icon"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div class="confirm-brand-sub">HELLO HIJABI</div>
            </div>
        </div>
        <h2 class="confirm-title">Order placed</h2>
        <p class="confirm-desc">
            Your order is saved. Send it on WhatsApp so we can confirm dispatch from Bhiwandi.
        </p>
        <p class="confirm-meta-line">${orderId} · ₹${totalAmount}</p>

        <div class="confirm-actions">
            <a href="${waUrl}" target="_blank" class="btn-confirm-wa">Send on WhatsApp</a>
            <button class="btn-confirm-continue" onclick="showView('shop');">Continue shopping</button>
        </div>

        <p class="confirm-footer-policy">No COD · No refund · No return</p>
    `;
}
function navigateToShop() {
    // Navigate to shop view or page
    if (typeof showView === 'function') {
        showView('shop');
    } else {
        window.location.href = '/shop';
    }
}
// MOBILE MENU TOGGLE HANDLER
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navMenu.classList.toggle('nav-active');
        });

        // Close menu when clicking navigation links or cart
        navMenu.querySelectorAll('a, button').forEach(item => {
            item.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navMenu.classList.remove('nav-active');
            });
        });
    }
});
