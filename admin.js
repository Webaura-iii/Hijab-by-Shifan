document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const loginForm = document.getElementById('login-form');
    const loginPage = document.getElementById('login-page');
    const dashboardPage = document.getElementById('dashboard-page');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    const addProductBtn = document.getElementById('add-product-btn');
    const productFormContainer = document.getElementById('product-form-container');
    const productList = document.getElementById('product-list');
    const cancelProductBtn = document.getElementById('cancel-product-btn');
    const productForm = document.getElementById('product-form');

    // Input Fields
    const prodName = document.getElementById('prod-name');
    const prodPrice = document.getElementById('prod-price');
    const prodCategory = document.getElementById('prod-category');
    const prodBadge = document.getElementById('prod-badge');
    const prodImage = document.getElementById('prod-image');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const prodDescription = document.getElementById('prod-description');
    const prodFeatured = document.getElementById('prod-featured');

    let editingProductId = null;
    let currentBase64Image = '';

    // --- INITIAL MOCK DATA SEEDING ---
    const initialProducts = [
        {
            id: '1',
            name: 'Noir Silk Premium Hijab',
            price: 799,
            category: 'Hijabs',
            badge: 'Bestseller',
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80',
            description: 'Premium silk hijab with lightweight finish.',
            featured: true
        },
        {
            id: '2',
            name: 'Blush Chiffon Hijab',
            price: 699,
            category: 'Hijabs',
            badge: '',
            image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=150&q=80',
            description: 'Soft chiffon feel perfect for summer.',
            featured: false
        },
        {
            id: '3',
            name: 'Ivory Modal Everyday Hijab',
            price: 649,
            category: 'Hijabs',
            badge: '',
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80',
            description: 'Comfortable everyday breathable hijab.',
            featured: false
        },
        {
            id: '4',
            name: 'Leopard Luxe Print Hijab',
            price: 899,
            category: 'Hijabs',
            badge: 'New',
            image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=150&q=80',
            description: 'Bold statement print hijab.',
            featured: true
        },
        {
            id: '5',
            name: 'Tulip Hijab Bouquet',
            price: 1499,
            category: 'Bouquets',
            badge: 'Gift Choice',
            image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=150&q=80',
            description: 'Custom hijab bouquet arrangement.',
            featured: true
        }
    ];

    const initialOrders = [
        {
            id: 'ord-mte13rxl-6fmlr',
            customerName: 'Mubashshera Khan',
            date: '29 Aug 2026, 12:28 pm',
            items: ['Noir Silk Premium Hijab x 1'],
            totalAmount: 799,
            status: 'pending'
        }
    ];

    function seedInitialData() {
        if (!localStorage.getItem('hbs_products')) {
            localStorage.setItem('hbs_products', JSON.stringify(initialProducts));
        }
        if (!localStorage.getItem('hbs_orders')) {
            localStorage.setItem('hbs_orders', JSON.stringify(initialOrders));
        }
    }

    // --- LOCALSTORAGE DATA HANDLERS ---
    function getProducts() {
        const stored = localStorage.getItem('hbs_products');
        return stored ? JSON.parse(stored) : [];
    }

    function saveProducts(products) {
        localStorage.setItem('hbs_products', JSON.stringify(products));
        renderProductsView();
        renderOverviewStats();
    }

    function getOrders() {
        const stored = localStorage.getItem('hbs_orders');
        return stored ? JSON.parse(stored) : [];
    }

    function saveOrders(orders) {
        localStorage.setItem('hbs_orders', JSON.stringify(orders));
        renderOrdersView();
        renderOverviewStats();
    }

    // --- AUTHENTICATION ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        if (user === 'Admin' && pass === 'shifan2026') {
            loginError.style.display = 'none';
            loginPage.style.display = 'none';
            dashboardPage.style.display = 'flex';
            seedInitialData();
            initDashboard();
        } else {
            loginError.style.display = 'block';
        }
    });

    logoutBtn.addEventListener('click', () => {
        dashboardPage.style.display = 'none';
        loginPage.style.display = 'flex';
        loginForm.reset();
    });

    // --- NAVIGATION ---
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const viewSections = document.querySelectorAll('.view-section');

    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarItems.forEach(i => i.classList.remove('active'));
            viewSections.forEach(section => section.classList.remove('active'));

            item.classList.add('active');
            const targetViewId = item.getAttribute('data-view');
            const targetSection = document.getElementById(targetViewId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    function initDashboard() {
        renderOverviewStats();
        renderProductsView();
        renderOrdersView();
    }

    // --- OVERVIEW STATS RENDERER ---
    function renderOverviewStats() {
        const products = getProducts();
        const orders = getOrders();
        
        const totalSales = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
        const pendingCount = orders.filter(o => o.status === 'pending').length;

        const overviewSec = document.getElementById('overview-view');
        if (!overviewSec) return;

        const statsGrid = overviewSec.querySelector('.stats-grid');
        if (statsGrid) {
            statsGrid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-label">PRODUCTS</div>
                    <div class="stat-value">${products.length}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">ORDERS</div>
                    <div class="stat-value">${orders.length}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">PENDING</div>
                    <div class="stat-value">${pendingCount}</div>
                </div>
            `;
        }

        const summaryText = overviewSec.querySelector('.stats-summary');
        if (summaryText) {
            summaryText.innerText = `Recorded total ₹${totalSales} across all local orders.`;
        }
    }

    // --- IMAGE FILE READER ---
    prodImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                currentBase64Image = evt.target.result;
                imagePreviewContainer.innerHTML = `<img src="${currentBase64Image}" class="preview-img" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // --- PRODUCTS RENDER & ACTIONS ---
    function renderProductsView() {
        const products = getProducts();
        
        if (products.length === 0) {
            productList.innerHTML = `<p style="color:var(--text-muted); padding:10px 0;">No products added yet.</p>`;
            return;
        }

        const defaultPlaceholder = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80';

        productList.innerHTML = products.map(p => `
            <div class="product-card">
                <div class="product-left">
                    <img src="${p.image || defaultPlaceholder}" alt="${p.name}" class="product-img">
                    <div class="product-details">
                        <h4>${p.name}</h4>
                        <p>${p.category} &middot; ₹${p.price}</p>
                    </div>
                </div>
                <div class="action-btns">
                    <button class="btn-edit-product" title="Edit" data-id="${p.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-delete-product" title="Delete" data-id="${p.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        `).join('');

        // Bind Edit buttons
        document.querySelectorAll('.btn-edit-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                openEditForm(id);
            });
        });

        // Bind Delete buttons
        document.querySelectorAll('.btn-delete-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                deleteProduct(id);
            });
        });
    }

    function openAddForm() {
        editingProductId = null;
        currentBase64Image = '';
        productForm.reset();
        prodBadge.value = "Bestseller";
        imagePreviewContainer.innerHTML = '';
        prodFeatured.checked = false;

        productList.style.display = 'none';
        productFormContainer.style.display = 'block';
    }

    function openEditForm(productId) {
        const products = getProducts();
        const product = products.find(p => String(p.id) === String(productId));
        if (product) {
            editingProductId = product.id;
            prodName.value = product.name || '';
            prodPrice.value = product.price || '';
            prodCategory.value = product.category || 'Hijabs';
            prodBadge.value = product.badge || '';
            currentBase64Image = product.image || '';
            prodDescription.value = product.description || '';
            prodFeatured.checked = !!product.featured;

            if (currentBase64Image) {
                imagePreviewContainer.innerHTML = `<img src="${currentBase64Image}" class="preview-img" alt="Preview">`;
            } else {
                imagePreviewContainer.innerHTML = '';
            }
        }

        productList.style.display = 'none';
        productFormContainer.style.display = 'block';
    }

    function hideForm() {
        productFormContainer.style.display = 'none';
        productList.style.display = 'flex';
    }

    function deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            let products = getProducts();
            products = products.filter(p => String(p.id) !== String(productId));
            saveProducts(products);
        }
    }

    // Product Form Submit Handler
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!prodName.value.trim() || !prodPrice.value) {
            alert('Please fill out the product name and price.');
            return;
        }

        let products = getProducts();
        const defaultImage = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80';

        const productData = {
            id: editingProductId ? editingProductId : String(Date.now()),
            name: prodName.value.trim(),
            price: Number(prodPrice.value),
            category: prodCategory.value,
            badge: prodBadge.value.trim(),
            image: currentBase64Image || defaultImage,
            description: prodDescription.value.trim(),
            featured: prodFeatured.checked,
            colors: ["Standard"],
            sizes: ["Standard 180×70"]
        };

        if (editingProductId) {
            products = products.map(p => String(p.id) === String(editingProductId) ? { ...p, ...productData } : p);
        } else {
            products.push(productData);
        }

        saveProducts(products);
        hideForm();
    });

    addProductBtn.addEventListener('click', openAddForm);
    cancelProductBtn.addEventListener('click', hideForm);

    // --- ORDERS RENDER & ACTIONS ---
    function renderOrdersView() {
        const orders = getOrders();
        const container = document.getElementById('orders-view');
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="page-header"><h2 class="page-title">Orders</h2></div>
                <p style="color:var(--text-muted);">No orders recorded yet.</p>
            `;
            return;
        }

        container.innerHTML = `
            <div class="page-header"><h2 class="page-title">Orders</h2></div>
            ${orders.map(o => `
                <div class="order-card" style="flex-direction: column; align-items: flex-start; gap: 16px;">
                    <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                        <div class="order-info">
                            <h4>${o.customerName || 'Customer'}</h4>
                            <p>${o.id} &middot; ${o.date || ''}</p>
                            <p style="font-size:12px; margin-top:4px;">${(o.items || []).join(', ')}</p>
                        </div>
                        <div class="order-meta">
                            <span class="order-price">₹${o.totalAmount}</span>
                            <span class="status-badge">${(o.status || 'PENDING').toUpperCase()}</span>
                        </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 12px;">
                        <select class="status-select" data-id="${o.id}">
                            <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>pending</option>
                            <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>confirmed</option>
                            <option value="dispatched" ${o.status === 'dispatched' ? 'selected' : ''}>dispatched</option>
                            <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>delivered</option>
                        </select>
                        <button class="icon-btn btn-delete-order" data-id="${o.id}" title="Delete Order">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            `).join('')}
        `;

        // Update status listener
        container.querySelectorAll('.status-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const newStatus = e.target.value;
                let orders = getOrders();
                orders = orders.map(o => String(o.id) === String(id) ? { ...o, status: newStatus } : o);
                saveOrders(orders);
            });
        });

        // Delete order listener
        container.querySelectorAll('.btn-delete-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (confirm('Delete this order?')) {
                    let orders = getOrders();
                    orders = orders.filter(o => String(o.id) !== String(id));
                    saveOrders(orders);
                }
            });
        });
    }
});