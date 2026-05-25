// js/product-data.js - COMPLETE PRODUCT DATABASE + FUNCTIONS

// ========== PRODUCT DATABASE ==========
const products = [
    {
        id: 1,
        name: "Premium Cotton T-Shirt",
        category: "mens",
        price: 29.99,
        stock: 50,
        sku: "TSH-001",
        image: "tshirt.jpeg",
        description: "100% cotton essential t-shirt",
        rating: 4.5
    },
    {
        id: 2,
        name: "Slim Fit Denim Jeans",
        category: "mens",
        price: 79.99,
        stock: 25,
        sku: "JNS-001",
        image: "jeans.jpeg",
        description: "Modern slim fit jeans",
        rating: 4.3
    },
    {
        id: 3,
        name: "Summer Floral Dress",
        category: "womens",
        price: 59.99,
        stock: 35,
        sku: "DRS-001",
        image: "dress.jpeg",
        description: "Lightweight floral dress",
        rating: 4.7
    },
    {
        id: 4,
        name: "Yoga Leggings",
        category: "womens",
        price: 49.99,
        stock: 40,
        sku: "LGG-001",
        image: "thight.jpeg",
        description: "Comfortable yoga leggings",
        rating: 4.6
    },
    {
        id: 5,
        name: "Leather Belt",
        category: "accessories",
        price: 39.99,
        stock: 60,
        sku: "BLT-001",
        image: "belt.jpeg",
        description: "Genuine leather belt",
        rating: 4.4
    },
    {
        id: 6,
        name: "Baseball Cap",
        category: "accessories",
        price: 24.99,
        stock: 45,
        sku: "CAP-001",
        image: "cap.jpeg",
        description: "Adjustable cotton cap",
        rating: 4.2
    }
];

// ========== CART DATA ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ========== HELPER FUNCTIONS ==========

// Get all products
function getAllProducts() {
    return products;
}

// Get product by ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

// Filter by category
function filterByCategory(category) {
    if (category === 'all') return products;
    return products.filter(p => p.category === category);
}

// Add to cart
function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    updateCartStorage();
    showNotification(`${name} added to cart!`);
}

// Update cart quantity
function updateCartQuantity(id, quantity) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity) || 1);
        updateCartStorage();
    }
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartStorage();
}

// Get cart total
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Save cart to localStorage
function updateCartStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
    }
}

// Display products in grid
function displayProducts(containerId, category = 'all') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const productsToShow = filterByCategory(category);
    
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card ${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400'">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">RM${product.price.toFixed(2)}</div>
                <div class="product-rating">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}</div>
                <button class="btn add-to-cart-btn"
                    onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Display cart items
function displayCartItems(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">RM${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <input type="number" class="quantity-input"
                    value="${item.quantity}"
                    min="1"
                    onchange="updateCartQuantity(${item.id}, this.value)">
                <button class="remove-btn"
                    onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        </div>
    `).join('');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 15px 20px;
        border-radius: 0;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        border-left: 4px solid var(--uniqlo-red);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    
    // Auto-display products if container exists
    if (document.getElementById('productsGrid')) {
        displayProducts('productsGrid', 'all');
    }
    
    // Auto-display cart if container exists
    if (document.getElementById('cartItems')) {
        displayCartItems('cartItems');
    }
});

// ========== ADMIN PRODUCT MANAGEMENT ==========

// Get all products (for admin)
function getAllProductsForAdmin() {
    return products.map(p => ({
        ...p,
        status: p.stock > 0 ? 'In Stock' : 'Out of Stock'
    }));
}

// Add new product (from admin form)
function addNewProductFromAdmin(formData) {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
        id: newId,
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sku: formData.sku || `SKU-${newId.toString().padStart(3, '0')}`,
        image: formData.image || 'default-product.jpg',
        description: formData.description || '',
        rating: 4.0 // Default rating
    };
    
    products.push(newProduct);
    return newProduct;
}

// Update existing product
function updateProductInAdmin(id, formData) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    products[index] = {
        ...products[index],
        name: formData.name || products[index].name,
        category: formData.category || products[index].category,
        price: formData.price ? parseFloat(formData.price) : products[index].price,
        stock: formData.stock ? parseInt(formData.stock) : products[index].stock,
        sku: formData.sku || products[index].sku,
        image: formData.image || products[index].image,
        description: formData.description || products[index].description
    };
    
    return products[index];
}

// Delete product
function deleteProductFromAdmin(id) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    return products.splice(index, 1)[0];
}

// Get categories for dropdown
function getProductCategories() {
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
}

// Display products in admin table
function displayAdminProductsTable(tableId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (!tableBody) return;
    
    const adminProducts = getAllProductsForAdmin();
    
    tableBody.innerHTML = adminProducts.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>
                <img src="${product.image}" alt="${product.name}" 
                     style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                ${product.name}
            </td>
            <td>${product.category}</td>
            <td>${product.sku}</td>
            <td>RM${product.price.toFixed(2)}</td>
            <td>
                <span class="stock-badge ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-stock'}">
                    ${product.stock}
                </span>
            </td>
            <td>
                <button class="btn btn-sm" onclick="editAdminProduct(${product.id})">
                    ✏️ Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteAdminProduct(${product.id})">
                    🗑️ Delete
                </button>
            </td>
        </tr>
    `).join('');
}