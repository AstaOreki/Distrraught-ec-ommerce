// admin-dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    initializeCharts();
});

function loadDashboardData() {
    // Load from localStorage or use default data
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    // Update stats
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalRevenue').textContent = orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2);
    document.getElementById('totalCustomers').textContent = customers.length;
    document.getElementById('totalProducts').textContent = products.length;
    
    // Load recent orders
    loadRecentOrders(orders);
    
    // Load low stock products
    loadLowStockProducts(products);
}

function loadRecentOrders(orders) {
    const container = document.getElementById('recentOrders');
    const recentOrders = orders.slice(0, 5);
    
    container.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>RM${order.amount.toFixed(2)}</td>
            <td><span class="badge ${getStatusBadge(order.status)}">${order.status}</span></td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="viewOrder(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function loadLowStockProducts(products) {
    const lowStock = products.filter(p => p.stock < 20).slice(0, 5);
    const container = document.getElementById('lowStockProducts');
    
    container.innerHTML = lowStock.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td><span class="${product.stock < 10 ? 'badge-danger' : 'badge-warning'} badge">${product.stock}</span></td>
            <td><span class="badge ${product.status === 'active' ? 'badge-success' : 'badge-danger'}">${product.status}</span></td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="restockProduct(${product.id})">
                    <i class="fas fa-box"></i> Restock
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusBadge(status) {
    const badges = {
        'pending': 'badge-warning',
        'processing': 'badge-info',
        'shipped': 'badge-primary',
        'delivered': 'badge-success',
        'cancelled': 'badge-danger'
    };
    return badges[status] || 'badge-secondary';
}

function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales (RM)',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: '#e50010',
                backgroundColor: 'rgba(229, 0, 16, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Categories Chart
    const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
    const categoriesChart = new Chart(categoriesCtx, {
        type: 'doughnut',
        data: {
            labels: ["Men's", "Women's", "Accessories"],
            datasets: [{
                data: [45, 35, 20],
                backgroundColor: [
                    '#3498db',
                    '#e50010',
                    '#2ecc71'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function viewOrder(orderId) {
    window.location.href = `manage-orders.html?order=${orderId}`;
}

function restockProduct(productId) {
    window.location.href = `manage-products.html?edit=${productId}`;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '../index.html';
    }
}