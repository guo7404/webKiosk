//드래그 객체 관련 코드
let draggingMenu = null;
let dragOverZone = null;

function onDragStartMenu(event){
    draggingMenu = this; //자신이 드래깅 객체임을 공지함
    this.classList.add('draggingMenu'); //드래깅 중인 객체임을 표시
}

function onDragEndMenu(event){
    draggingMenu = null; //더이상 드래깅중인 객체가 없음으로 설정
    this.classList.remove('draggingMenu'); //드래깅 중인 객체임을 표시
    if(dragOverZone!==null){
        dragOverZone.classList.remove('overZone');
    }
}
function onDropMenu(event){
    event.stopPropagation();
    this.parentNode.insertBefore(draggingMenu, this);
}

function onDragOverBox(event){
    event.preventDefault(); //기본 이벤트 처리를 막음
    dragOverBox = this; //자신이 드래깅 할 수 있는 영역임을 공지함
    this.classList.add('overBox'); //드래깅 할 수 있는 영역임을 표시
}
function onDragLeaveBox(event){
    dragOverBox = null; //더이상 드래깅 할 수 있는 영역이 없음으로 설정
    this.classList.remove('overBox'); //드래깅 할 수 있는 영역임을 표시
}
function onDropBox(event){
    event.preventDefault();
    this.appendChild(draggingMenu);
}

$(document).ready(function() {
    $('#cart-zone').on('drop', function(event) {
        event.preventDefault();
        if (draggingMenu) {
            $(draggingMenu).css({
                'background-color': '#f8f9fa',
                'border': '2px solid #007bff',
                'padding': '10px',
                'margin': '5px'
            });
        }
    });
    if (draggingMenu) {
        let itemName = $(draggingMenu).find('p').first().text();
        let itemPrice = $(draggingMenu).find('p').last().text();
        let itemImg = $(draggingMenu).find('img').attr('src');
        
        $('#cart-zone').append(`
        <div class="cart-item">
            <img src="${itemImg}" alt="${itemName}" style="width: 100px; height: 100px;">
            <p style="font-weight: bold;">${itemName}</p>
            <p>${itemPrice}</p>
        </div>
        `);
    }

    $('#cart-zone').on('dragleave', function(event) {
        if (draggingMenu) {
            $(draggingMenu).css({
                'background-color': '',
                'border': '',
                'padding': '',
                'margin': ''
            });
        }
    });

    let cartZone = document.getElementById('cart-zone');
    cartZone.addEventListener('dragover', onDragOverBox);
    cartZone.addEventListener('dragleave', onDragLeaveBox);
    cartZone.addEventListener('drop', onDropBox);
    
    let menuZone = document.getElementById('menu-zone');
    menuZone.addEventListener('dragover', onDragOverBox);
    menuZone.addEventListener('dragleave', onDragLeaveBox);
    menuZone.addEventListener('drop', onDropBox);

});
//메뉴추가 관련 코드
let DeafultMenu = [
    {name:"데리버거",price:3500,img:"img/데리버거.png"},
    {name:"불고기버거",price:4800,img:"img/불고기버거.png"},
    {name:"새우버거",price:4800,img:"img/새우버거.png"},
    {name:"전주비빔라이스버거",price:6900,img:"img/전주비빔라이스버거.png"},
    {name:"치즈버거",price:5300,img:"img/치즈버거.png"},
    {name:"치킨버거",price:4100,img:"img/치킨버거.png"},
    {name:"핫크리스피치킨버거",price:6000,img:"img/핫크리스피치킨버거.png"}
];
window.onload = function(){
// Load menu
    DeafultMenu.forEach(item => {
        $('#menu-zone').append(`
            <div class="menu-item" draggable="true">
                <img src="${item.img}" alt="${item.name}" draggable="false" style="width: 150px; height: 150px;">
                <p style="font-weight: bold;">${item.name}</p>
                <p>${item.price}원</p>
            </div>
        `).children().last().each(function() {
            this.addEventListener('dragstart', onDragStartMenu);
            this.addEventListener('dragend', onDragEndMenu);
            this.addEventListener('drop', onDropMenu);
        });
    });
};