let DeafultMenu = [
    {name:"데리버거",price:3500,img:"img/데리버거.png"},
    {name:"불고기버거",price:4800,img:"img/불고기버거.png"},
    {name:"새우버거",price:4800,img:"img/새우버거.png"},
    {name:"전주비빔라이스버거",price:6900,img:"img/전주비빔라이스버거.png"},
    {name:"치즈버거",price:5300,img:"img/치즈버거.png"},
    {name:"치킨버거",price:4100,img:"img/치킨버거.png"},
    {name:"핫크리스피치킨버거",price:6000,img:"img/핫크리스피치킨버거.png"}
];

let salesHistory = [];

// 메뉴를 동적으로 생성하는 함수
function generateMenu() {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = ''; // 기존 메뉴 초기화
    DeafultMenu.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.draggable = true;
        menuItem.dataset.name = item.name;
        menuItem.dataset.price = item.price;
        
        const img = document.createElement('img');
        img.src = item.img;
        img.alt = item.name;
        
        const name = document.createElement('p');
        name.textContent = item.name;
        
        const price = document.createElement('p');
        price.textContent = `${item.price}원`;
        
        menuItem.appendChild(img);
        menuItem.appendChild(name);
        menuItem.appendChild(price);
        
        menuContainer.appendChild(menuItem);
    });
}

// 드래그 앤 드롭 이벤트 핸들러 추가
function addDragAndDropHandlers() {
    const menuItems = document.querySelectorAll('.menu-item');
    const cartContainer = document.getElementById('cart-container');
    const menuContainer = document.getElementById('menu-container');

    // 기존 핸들러 제거
    menuItems.forEach(item => {
        item.removeEventListener('dragstart', handleDragStart);
    });
    cartContainer.removeEventListener('dragover', handleDragOver);
    cartContainer.removeEventListener('drop', handleDropInCart);
    menuContainer.removeEventListener('dragover', handleDragOver);
    menuContainer.removeEventListener('drop', handleDropInMenu);

    // 새로운 핸들러 추가
    menuItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
    });
    cartContainer.addEventListener('dragover', handleDragOver);
    cartContainer.addEventListener('drop', handleDropInCart);
    menuContainer.addEventListener('dragover', handleDragOver);
    menuContainer.addEventListener('drop', handleDropInMenu);
}

// 드래그 시작 핸들러
function handleDragStart(e) {
    const item = {
        name: e.target.dataset.name,
        price: e.target.dataset.price
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
}

// 드래그 오버 핸들러
function handleDragOver(e) {
    e.preventDefault();
}

// 장바구니에 드롭 핸들러
function handleDropInCart(e) {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    addToCart(data);
}

// 메뉴에 드롭 핸들러
function handleDropInMenu(e) {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    removeFromCart(data);
}

// 장바구니에 항목을 추가하는 함수
function addToCart(item) {
    if (!item.price) {
        console.error('Item price is undefined:', item);
        return;
    }

    const cartContainer = document.getElementById('cart-container');
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.draggable = true;
    cartItem.dataset.name = item.name;
    cartItem.dataset.price = item.price;
    
    const name = document.createElement('p');
    name.textContent = item.name;
    
    const price = document.createElement('p');
    price.textContent = `${item.price}원`;
    
    const quantity = document.createElement('input');
    quantity.type = 'number';
    quantity.value = 1;
    quantity.min = 1;
    quantity.addEventListener('input', updateTotal);
    
    const subtotal = document.createElement('p');
    subtotal.className = 'subtotal';
    subtotal.textContent = `${item.price}원`;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', () => {
        cartContainer.removeChild(cartItem);
        updateTotal();
    });
    
    cartItem.appendChild(name);
    cartItem.appendChild(price);
    cartItem.appendChild(quantity);
    cartItem.appendChild(subtotal);
    cartItem.appendChild(removeButton);
    
    cartContainer.appendChild(cartItem);
    updateTotal();
}

// 장바구니에서 항목을 제거하는 함수
function removeFromCart(item) {
    const cartContainer = document.getElementById('cart-container');
    const cartItems = cartContainer.querySelectorAll('.cart-item');
    cartItems.forEach(cartItem => {
        if (cartItem.dataset.name === item.name) {
            cartContainer.removeChild(cartItem);
        }
    });
    updateTotal();
}

// 총액을 업데이트하는 함수
function updateTotal() {
    const cartContainer = document.getElementById('cart-container');
    const cartItems = cartContainer.querySelectorAll('.cart-item');
    let total = 0;
    cartItems.forEach(cartItem => {
        const price = parseInt(cartItem.dataset.price);
        const quantity = parseInt(cartItem.querySelector('input').value);
        const subtotal = price * quantity;
        cartItem.querySelector('.subtotal').textContent = `${subtotal}원`;
        total += subtotal;
    });
    document.getElementById('total').textContent = `total : ${total}원`;
}

// 결제 버튼 클릭 시 영수증을 표시하고 화면을 초기화하는 함수
function handlePayment() {
    const cartContainer = document.getElementById('cart-container');
    const cartItems = cartContainer.querySelectorAll('.cart-item');
    let receipt = '영수증\n\n';
    let total = 0;
    let sale = [];

    cartItems.forEach(cartItem => {
        const name = cartItem.dataset.name;
        const price = parseInt(cartItem.dataset.price);
        const quantity = parseInt(cartItem.querySelector('input').value);
        const subtotal = price * quantity;
        receipt += `${name} x ${quantity} = ${subtotal}원\n`;
        total += subtotal;
        sale.push({ name, price, quantity, subtotal });
    });

    if (total === 0) {
        alert('결제할 항목이 없습니다.');
        return;
    }

    receipt += `\n총액: ${total}원`;

    // 모달 창에 영수증 표시
    const receiptModal = document.getElementById('receipt-modal');
    const receiptContent = document.getElementById('receipt-content');
    receiptContent.textContent = receipt;
    receiptModal.style.display = 'block';

    // 판매 내역 저장
    salesHistory.push({ sale, total });

    // 화면 초기화
    cartContainer.innerHTML = '';
    document.getElementById('total').textContent = '총액: 0원';
}

// 장바구니 초기화 함수
function clearCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';
    updateTotal();
}

// 모달 창 닫기 함수
function closeModal() {
    document.getElementById('receipt-modal').style.display = 'none';
    document.getElementById('sales-history-modal').style.display = 'none';
}

// 메뉴 추가 함수
function addMenuItem(name, price, img) {
    if (!name || !price || !img) {
        alert('모든 필드를 입력해야 합니다.');
        return;
    }
    DeafultMenu.push({ name, price, img });
    generateMenu();
    addDragAndDropHandlers();
}

// 메뉴 삭제 함수
function removeMenuItem(name) {
    DeafultMenu = DeafultMenu.filter(item => item.name !== name);
    generateMenu();
    addDragAndDropHandlers();
}

// 판매 내역 표시 함수
function showSalesHistory() {
    let history = '판매 내역\n\n';
    let grandTotal = 0;

    salesHistory.forEach((record, index) => {
        history += `판매 ${index + 1}\n`;
        record.sale.forEach(item => {
            history += `${item.name} x ${item.quantity} = ${item.subtotal}원\n`;
        });
        history += `총액: ${record.total}원\n\n`;
        grandTotal += record.total;
    });

    history += `총 판매 금액: ${grandTotal}원`;

    // 모달 창에 판매 내역 표시
    const salesHistoryModal = document.getElementById('sales-history-modal');
    const salesHistoryContent = document.getElementById('sales-history-content');
    salesHistoryContent.textContent = history;
    salesHistoryModal.style.display = 'block';
}

// 판매 내역 초기화 함수
function clearSalesHistory() {
    salesHistory = [];
    alert('판매 내역이 초기화되었습니다.');
}

// 관리자 기능 버튼을 숨기고 보이게 하는 함수
function toggleAdminButtons() {
    const adminButtons = document.querySelectorAll('.admin-button');
    adminButtons.forEach(button => {
        button.style.display = button.style.display === 'none' ? 'block' : 'none';
    });
}

// DOM이 로드된 후 메뉴를 생성하고 드래그 앤 드롭 핸들러를 추가
document.addEventListener('DOMContentLoaded', () => {
    generateMenu();
    addDragAndDropHandlers();
    document.getElementById('payment-button').addEventListener('click', handlePayment);
    document.getElementById('cancel-button').addEventListener('click', clearCart);
    document.getElementById('show-sales-history-button').addEventListener('click', showSalesHistory);
    document.getElementById('clear-sales-history-button').addEventListener('click', clearSalesHistory);
    document.getElementById('add-menu-item-button').addEventListener('click', () => {
        const name = prompt('메뉴 이름:');
        const price = prompt('메뉴 가격:');
        const img = prompt('메뉴 이미지 URL:');
        addMenuItem(name, price, img);
    });
    document.getElementById('remove-menu-item-button').addEventListener('click', () => {
        const name = prompt('삭제할 메뉴 이름:');
        removeMenuItem(name);
    });
    document.getElementById('call-admin-button').addEventListener('dblclick', toggleAdminButtons);
    document.getElementById('close-modal-button').addEventListener('click', closeModal);
    document.getElementById('close-sales-history-modal-button').addEventListener('click', closeModal);

    // 관리자 버튼 초기 숨김 설정
    toggleAdminButtons();
});
