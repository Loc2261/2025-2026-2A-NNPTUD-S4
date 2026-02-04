let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let pageSize = 10;
let sortConfig = { key: null, direction: 'asc' };

const API_URL = "https://api.escuelajs.co/api/v1/products";

// 1. Fetch dữ liệu từ API mới
async function init() {
    try {
        const res = await fetch(API_URL);
        allProducts = await res.json();
        filteredProducts = [...allProducts];
        renderTable();
    } catch (e) { console.error("API Error:", e); }
}

// 2. Render Table
function renderTable() {
    const start = (currentPage - 1) * pageSize;
    const end = start + parseInt(pageSize);
    const pagedItems = filteredProducts.slice(start, end);

    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = pagedItems.map(item => {
        // Xử lý ảnh (lấy ảnh đầu tiên)
        const imgUrl = item.images && item.images.length > 0 ? item.images[0] : 'https://placehold.co/50';
        
        return `
        <tr>
            <td class="text-muted fw-bold">#${item.id}</td>
            <td>
                <div class="fw-bold text-dark text-truncate" style="max-width: 250px;">${item.title}</div>
                <!-- BOOTSTRAP POPOVER CHO DESCRIPTION -->
                <div class="desc-truncate" 
                     data-bs-toggle="popover" 
                     data-bs-title="Description" 
                     data-bs-content="${item.description.replace(/"/g, '&quot;')}"
                     tabindex="0" role="button">
                    ${item.description}
                </div>
            </td>
            <td><span class="text-primary fw-bold">$${item.price}</span></td>
            <td>${getCategoryBadge(item.category ? item.category.name : 'N/A')}</td>
            <td><img src="${imgUrl}" class="product-img shadow-sm" onerror="this.src='https://placehold.co/50'"></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary" onclick="viewDetail(${item.id})">
                    <i class="bi bi-pencil"></i> Edit
                </button>
            </td>
        </tr>
    `}).join('');

    initPopovers();
    renderPagination();
}

// 3. Khởi tạo Popover (Sửa lỗi click sau khi re-render)
function initPopovers() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    [...popoverTriggerList].map(el => new bootstrap.Popover(el, {
        trigger: 'focus',
        placement: 'top'
    }));
}

// 4. Định dạng Category Badge theo API Platzi
function getCategoryBadge(catName) {
    const colors = {
        "Electronics": "bg-primary-subtle text-primary border-primary",
        "Clothes": "bg-success-subtle text-success border-success",
        "Furniture": "bg-warning-subtle text-warning-emphasis border-warning",
        "Shoes": "bg-danger-subtle text-danger-emphasis border-danger",
        "Others": "bg-secondary-subtle text-secondary border-secondary"
    };
    const style = colors[catName] || "bg-light text-dark border-secondary";
    return `<span class="cat-badge border ${style}">${catName}</span>`;
}

// 5. Search Real-time
function handleSearch() {
    const val = document.getElementById('searchInput').value.toLowerCase();
    filteredProducts = allProducts.filter(p => p.title.toLowerCase().includes(val));
    currentPage = 1;
    renderTable();
}

// 6. Sort Title & Price
function handleSort(key) {
    sortConfig.direction = (sortConfig.key === key && sortConfig.direction === 'asc') ? 'desc' : 'asc';
    sortConfig.key = key;

    filteredProducts.sort((a, b) => {
        let vA = a[key], vB = b[key];
        if (typeof vA === 'string') return sortConfig.direction === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA);
        return sortConfig.direction === 'asc' ? vA - vB : vB - vA;
    });
    renderTable();
}

// 7. Pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    let html = '';
    
    // Giới hạn hiển thị số trang nếu quá nhiều
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link shadow-none" href="javascript:void(0)" onclick="currentPage=${i};renderTable()">${i}</a>
                 </li>`;
    }
    document.getElementById('pagination').innerHTML = html;
}

function changePageSize() {
    pageSize = document.getElementById('pageSize').value;
    currentPage = 1;
    renderTable();
}

// 8. Export CSV
function exportCSV() {
    let csv = "ID,Title,Price,Category\n";
    filteredProducts.forEach(p => {
        csv += `${p.id},"${p.title.replace(/"/g, '""')}",${p.price},"${p.category ? p.category.name : ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = 'platzi_products.csv';
    link.click();
}

// 9. Create Product (POST)
async function createProduct() {
    const form = document.getElementById('createForm');
    const rawData = Object.fromEntries(new FormData(form).entries());
    
    // API Platzi yêu cầu images là mảng và price là number
    const payload = {
        ...rawData,
        price: Number(rawData.price),
        categoryId: Number(rawData.categoryId),
        images: JSON.parse(rawData.images)
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        alert("Created Success! New ID: " + result.id);
        bootstrap.Modal.getInstance(document.getElementById('createModal')).hide();
    } catch (e) { alert("Create failed"); }
}

// 10. Edit Product (PUT)
function viewDetail(id) {
    const p = allProducts.find(x => x.id === id);
    document.getElementById('detailModalContent').innerHTML = `
        <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">Edit Product #${p.id}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="editForm">
                <div class="mb-3 text-center"><img src="${p.images[0]}" class="rounded shadow-sm" style="height: 120px"></div>
                <div class="mb-3"><label class="form-label fw-bold">Title</label><input type="text" class="form-control" name="title" value="${p.title}"></div>
                <div class="mb-3"><label class="form-label fw-bold">Price ($)</label><input type="number" class="form-control" name="price" value="${p.price}"></div>
                <div class="mb-3"><label class="form-label fw-bold">Description</label><textarea class="form-control" name="description" rows="3">${p.description}</textarea></div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary w-100 fw-bold" onclick="updateProduct(${p.id})">Save Changes (PUT API)</button>
        </div>
    `;
    new bootstrap.Modal(document.getElementById('detailModal')).show();
}

async function updateProduct(id) {
    const rawData = Object.fromEntries(new FormData(document.getElementById('editForm')).entries());
    const payload = { ...rawData, price: Number(rawData.price) };

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if(res.ok) {
        alert("Update Success (Simulated)!");
        bootstrap.Modal.getInstance(document.getElementById('detailModal')).hide();
    }
}

init();