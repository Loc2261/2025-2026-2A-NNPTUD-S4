// ============================================
// PRODUCT MANAGEMENT SYSTEM - Node.js Logic
// ============================================

const fs = require('fs');
const path = require('path');

// TASK 1: Create a Product constructor function
function Product(id, name, price, quantity, category, isAvailable) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.category = category;
    this.isAvailable = isAvailable;
}

// TASK 2: Initialize an array with at least 6 products, 2+ categories
const products = [
    new Product(1, "iPhone 15 Pro", 35000000, 5, "Electronics", true),
    new Product(2, "Samsung Galaxy S24", 32000000, 8, "Electronics", true),
    new Product(3, "MacBook Pro 16", 45000000, 2, "Electronics", true),
    new Product(4, "Wireless Earbuds", 5000000, 15, "Accessories", true),
    new Product(5, "USB-C Cable", 500000, 30, "Accessories", false),
    new Product(6, "Phone Stand", 200000, 0, "Accessories", true)
];

// Prepare results object
const results = {};

// TASK 3: Create array with only name and price
results.task3 = products.map(p => ({
    name: p.name,
    price: p.price
}));

// TASK 4: Filter products in stock (quantity > 0)
results.task4 = products.filter(p => p.quantity > 0);

// TASK 5: Check if there's a product with price > 30,000,000
results.task5 = {
    hasExpensive: products.some(p => p.price > 30000000),
    products: products.filter(p => p.price > 30000000)
};

// TASK 6: Check if all Accessories are available
const accessoriesProducts = products.filter(p => p.category === "Accessories");
results.task6 = {
    allAvailable: accessoriesProducts.every(p => p.isAvailable === true),
    accessories: accessoriesProducts
};

// TASK 7: Calculate total inventory value
results.task7 = {
    total: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
    byCategory: {}
};

// Calculate by category
products.forEach(p => {
    if (!results.task7.byCategory[p.category]) {
        results.task7.byCategory[p.category] = 0;
    }
    results.task7.byCategory[p.category] += p.price * p.quantity;
});

// TASK 8: Use for...of to iterate
results.task8 = [];
for (const product of products) {
    results.task8.push({
        name: product.name,
        category: product.category,
        isAvailable: product.isAvailable
    });
}

// TASK 9: Use for...in on a product object (Tìm kiếm sản phẩm động)
results.task9 = {};
const targetId = 3;
const sampleProduct = products.find(p => p.id === targetId);
if (sampleProduct) {
    for (const property in sampleProduct) {
        results.task9[property] = sampleProduct[property];
    }
}

// TASK 10: Get a list of product names that are available for sale and in stock.
results.task10 = products
    .filter(p => p.isAvailable && p.quantity > 0)
    .map(p => p.name);

// Generate HTML from results
function generateHTML() {
    let html = '<!DOCTYPE html>\n<html lang="vi">\n<head>\n';
    html += '    <meta charset="UTF-8">\n';
    html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '    <title>Product Management System - 10 Tasks</title>\n';
    html += '    <link rel="stylesheet" href="styles.css">\n';
    html += '</head>\n<body>\n    <div class="container">\n';

    // Header
    html += '<header>\n<h1>📦 Product Management System</h1>\n';
    html += '<p class="subtitle">10 JavaScript Tasks - Results</p>\n</header>\n';

    // Main
    html += '<main>\n';

    // Overview
    html += '<section class="overview"><h2>📊 Tổng Quan</h2>\n';
    html += '<div class="stats">\n';
    html += '<div class="stat"><strong>' + products.length + '</strong><p>Tổng sản phẩm</p></div>\n';
    html += '<div class="stat"><strong>' + results.task4.length + '</strong><p>Còn hàng</p></div>\n';
    html += '<div class="stat"><strong>' + results.task5.products.length + '</strong><p>Giá > 30M</p></div>\n';
    html += '<div class="stat"><strong>' + results.task10.length + '</strong><p>Sẵn & Còn hàng</p></div>\n';
    html += '</div></section>\n';

    // Task 1
    html += '<section class="task"><h2>✓ Task 1: Product Constructor Function</h2>\n';
    html += '<div class="content"><p><strong>Mục đích:</strong> Tạo constructor khởi tạo objects sản phẩm</p>\n';
    html += '<pre><code>function Product(id, name, price, quantity, category, isAvailable) {\n    this.id = id;\n    this.name = name;\n    this.price = price;\n    this.quantity = quantity;\n    this.category = category;\n    this.isAvailable = isAvailable;\n}</code></pre>\n';
    html += '<p><strong>✓ Kết quả:</strong> Constructor được tạo thành công</p>\n</div></section>\n';

    // Task 2
    html += '<section class="task"><h2>✓ Task 2: Khởi Tạo Array Products (' + products.length + ' sản phẩm)</h2>\n';
    html += '<div class="content"><table class="table"><thead><tr>\n';
    html += '<th>ID</th><th>Tên</th><th>Giá</th><th>Số Lượng</th><th>Danh Mục</th><th>Sẵn Có</th>\n';
    html += '</tr></thead><tbody>\n';
    products.forEach(p => {
        html += '<tr><td>' + p.id + '</td><td>' + p.name + '</td><td>' + p.price.toLocaleString('vi-VN') + ' VND</td>\n';
        html += '<td>' + p.quantity + '</td><td>' + p.category + '</td><td>' + (p.isAvailable ? '✓' : '✗') + '</td></tr>\n';
    });
    html += '</tbody></table>\n';
    html += '<p><strong>✓ Kết quả:</strong> ' + products.length + ' sản phẩm từ 2 danh mục</p>\n</div></section>\n';

    // Task 3
    html += '<section class="task"><h2>✓ Task 3: Array Name & Price</h2>\n';
    html += '<div class="content"><p><strong>Lệnh:</strong> <code>products.map(p => ({name: p.name, price: p.price}))</code></p>\n';
    html += '<pre><code>' + JSON.stringify(results.task3, null, 2) + '</code></pre>\n';
    html += '<p><strong>✓ Kết quả:</strong> ' + results.task3.length + ' sản phẩm với name & price</p>\n</div></section>\n';

    // Task 4
    html += '<section class="task"><h2>✓ Task 4: Sản Phẩm Còn Hàng (quantity > 0)</h2>\n';
    html += '<div class="content"><p><strong>Lệnh:</strong> <code>products.filter(p => p.quantity > 0)</code></p>\n';
    html += '<ul class="list">\n';
    results.task4.forEach(p => {
        html += '<li>' + p.name + ' - ' + p.quantity + ' units</li>\n';
    });
    html += '</ul>\n<p><strong>✓ Kết quả:</strong> ' + results.task4.length + '/' + products.length + ' sản phẩm còn hàng</p>\n</div></section>\n';

    // Task 5
    html += '<section class="task"><h2>✓ Task 5: Kiểm Tra Giá > 30,000,000</h2>\n';
    html += '<div class="content"><p><strong>Lệnh:</strong> <code>products.some(p => p.price > 30000000)</code></p>\n';
    html += '<div class="result-box ' + (results.task5.hasExpensive ? 'success' : 'danger') + '">\n';
    html += '<p>Có sản phẩm giá > 30M: <strong>' + (results.task5.hasExpensive ? '✓ CÓ' : '✗ KHÔNG') + '</strong></p>\n</div>\n';
    html += '<ul class="list">\n';
    results.task5.products.forEach(p => {
        html += '<li>' + p.name + ' - ' + p.price.toLocaleString('vi-VN') + ' VND</li>\n';
    });
    html += '</ul>\n<p><strong>✓ Kết quả:</strong> ' + results.task5.products.length + ' sản phẩm</p>\n</div></section>\n';

    // Task 6
    html += '<section class="task"><h2>✓ Task 6: Accessories - Tính Sẵn Có</h2>\n';
    html += '<div class="content"><p><strong>Lệnh:</strong> <code>accessoriesProducts.every(p => p.isAvailable === true)</code></p>\n';
    html += '<div class="result-box ' + (results.task6.allAvailable ? 'success' : 'danger') + '">\n';
    html += '<p>Tất cả Accessories sẵn có: <strong>' + (results.task6.allAvailable ? '✓ CÓ' : '✗ KHÔNG') + '</strong></p>\n</div>\n';
    html += '<ul class="list">\n';
    results.task6.accessories.forEach(p => {
        html += '<li>' + p.name + ' - ' + (p.isAvailable ? '✓ Sẵn' : '✗ Không') + '</li>\n';
    });
    html += '</ul></div></section>\n';

    // Task 7
    html += '<section class="task"><h2>✓ Task 7: Tổng Giá Trị Hàng Tồn Kho</h2>\n';
    html += '<div class="content"><p><strong>Lệnh:</strong> <code>products.reduce((sum, p) => sum + (p.price * p.quantity), 0)</code></p>\n';
    html += '<div class="result-box highlight">\n';
    html += '<h3>' + results.task7.total.toLocaleString('vi-VN') + ' VND</h3>\n</div>\n';
    html += '<p><strong>Giá trị theo danh mục:</strong></p>\n<ul class="list">\n';
    Object.entries(results.task7.byCategory).forEach(([cat, val]) => {
        html += '<li><strong>' + cat + ':</strong> ' + val.toLocaleString('vi-VN') + ' VND</li>\n';
    });
    html += '</ul></div></section>\n';

    // Task 8
    html += '<section class="task"><h2>✓ Task 8: for...of Loop</h2>\n';
    html += '<div class="content"><p><strong>Lệnh:</strong> <code>for (const product of products) { ... }</code></p>\n';
    html += '<pre><code>';
    results.task8.forEach((p, idx) => {
        html += p.name + ' | ' + p.category + ' | ' + (p.isAvailable ? '✓' : '✗');
        if (idx < results.task8.length - 1) html += '\n';
    });
    html += '</code></pre>\n<p><strong>✓ Kết quả:</strong> Iterate ' + results.task8.length + ' sản phẩm thành công</p>\n</div></section>\n';

    // Script for interactive data and Task 9 search
    html += '<script>\n';
    html += 'const productsData = ' + JSON.stringify(products) + ';\n';
    html += 'function searchProduct() {\n';
    html += '    const input = document.getElementById("search-id");\n';
    html += '    const resultDisplay = document.getElementById("search-result");\n';
    html += '    const id = parseInt(input.value);\n';
    html += '    const product = productsData.find(p => p.id === id);\n';
    html += '    if (product) {\n';
    html += '        let output = "<strong>Tìm thấy: " + product.name + "</strong>\\n";\n';
    html += '        output += "--------------------------\\n";\n';
    html += '        for (let key in product) {\n';
    html += '            output += key + ": " + product[key] + "\\n";\n';
    html += '        }\n';
    html += '        resultDisplay.innerHTML = output;\n';
    html += '    } else {\n';
    html += '        resultDisplay.innerHTML = "❌ Không tìm thấy sản phẩm có ID này!";\n';
    html += '    }\n';
    html += '}\n';
    html += '</script>\n';

    // Task 9
    html += '<section class="task" id="interactive-task-9"><h2>✓ Task 9: Interactive for...in Search</h2>\n';
    html += '<div class="content"><p><strong>Nhập ID sản phẩm để tìm kiếm (1-6):</strong></p>\n';
    html += '<div class="search-box">\n';
    html += '  <input type="number" id="search-id" placeholder="ID sản phẩm (ví dụ: 3)" min="1" max="6">\n';
    html += '  <button onclick="searchProduct()" class="btn-primary">Tìm kiếm</button>\n';
    html += '</div>\n';
    html += '<pre id="search-result" class="result-display">Nhấn nút tìm kiếm để xem kết quả vòng lặp for...in</pre>\n';
    html += '<p><strong>✓ Kỹ thuật:</strong> Sử dụng <code>.find()</code> để lấy object và <code>for...in</code> để duyệt thuộc tính.</p>\n';
    html += '</div></section>\n';

    // Task 10
    html += '<section class="task"><h2>✓ Task 10: Sản Phẩm Sẵn Có & Còn Hàng (Chỉ lấy Tên)</h2>\n';
    html += '<div class="content"><p><strong>Điều kiện:</strong> <code>Sẵn có (isAvailable === true)</code> VÀ <code>Còn hàng (quantity > 0)</code></p>\n';
    html += '<div class="logic-explanation">\n';
    html += '  <p>💡 <strong>Tại sao lại là ' + results.task10.length + '/6 sản phẩm?</strong></p>\n';
    html += '  <ul class="list-small">\n';
    products.forEach(p => {
        if (!p.isAvailable || p.quantity <= 0) {
            let reason = !p.isAvailable ? 'Không sẵn có' : 'Hết hàng';
            html += '    <li><del>' + p.name + '</del> (' + reason + ')</li>\n';
        }
    });
    html += '  </ul>\n</div>\n';
    html += '<p><strong>Danh sách tên sản phẩm thỏa mãn:</strong></p>\n';
    html += '<ul class="list">\n';
    results.task10.forEach(name => {
        html += '<li>' + name + '</li>\n';
    });
    html += '</ul>\n<p><strong>✓ Kết quả:</strong> ' + results.task10.length + ' sản phẩm thỏa mãn</p>\n</div></section>\n';

    html += '</main>\n';

    // Footer
    html += '<footer>\n<p>🎓 Product Management System - 10 Tasks JavaScript</p>\n';
    html += '<p>© 2026 - All rights reserved</p>\n</footer>\n';

    html += '</div>\n</body>\n</html>';

    return html;
}

// Write HTML file
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = generateHTML();
fs.writeFileSync(htmlPath, htmlContent, 'utf8');

console.log('✓ index.html generated successfully');
console.log('✓ Open index.html in browser to view all 10 tasks results');

module.exports = { Product, products, results };
