let draggingMenu = null;
let dragOverBox = null;

function onDragStartMenu(event){
    draggingMenu = this;
    this.classList.add('draggingMenu');
    document.querySelector('p').innerHTML += `Started ${$(this).attr("menuname")} Dragging<br>`;
}
function onDragEndMenu(event){
    draggingMenu = null; //더이상 드래깅중인 객체가 없음으로 설정
    this.classList.remove('draggingMenu'); //드래깅 중인 객체임을 표시
    document.querySelector('p').innerHTML += `Ended ${$(this).attr("menuname")} Dragging<br>`;
}
function onDragOverBox(event){
    event.preventDefault(); //기본 이벤트 처리를 막음
    dragOverBox = this; //자신이 드래깅 할 수 있는 영역임을 공지함
    this.classList.add('overBox'); //드래깅 할 수 있는 영역임을 표시
    this.style.backgroundColor = "red";
    // document.querySelector('p').innerHTML += `Over ${$(this).attr("menuname")} Box<br>`;
}
function onDragLeaveBox(event){
    dragOverBox = null; //더이상 드래깅 할 수 있는 영역이 없음으로 설정
    this.classList.remove('overBox'); //드래깅 할 수 있는 영역임을 표시
    this.style.backgroundColor = "wheat";
    // document.querySelector('p').innerHTML += `Leave ${$(this).attr("menuname")} Box<br>`;
}
function onDropBox(event){
    if(dragOverBox){
        dragOverBox.appendChild(draggingMenu);
        dragOverBox.style.backgroundColor = "wheat";
    }
}


$(document).ready(function(){
    $(".menu").mouseenter(function(){
       $(this).fadeTo(500, 0.5);
    });
    $(".menu").mouseleave(function(){
        $(this).fadeTo(500, 1);
    });

    let menuArray = document.getElementsByClassName('menu');
    for(let menu of menuArray){
        menu.addEventListener('dragstart', onDragStartMenu);
        menu.addEventListener('dragend', onDragEndMenu);
    }
    let boxArray = document.getElementsByClassName('box');
    for(let box of boxArray){
        box.addEventListener('dragover', onDragOverBox);
        box.addEventListener('dragleave', onDragLeaveBox);
        box.addEventListener('drop', onDropBox);
    }
});

