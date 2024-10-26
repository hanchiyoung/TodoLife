const $todoList = document.querySelector('.todo > .list');
const $frmTodoAdd = document.querySelector('.todo form[name=frmTodoAdd]');
const $frmTodoEdit = document.querySelector('.todo form[name=frmTodoEdit]');

const $addTaskInput = $frmTodoAdd.lastElementChild;
const $editTaskInput = $frmTodoEdit.lastElementChild;

let editTodoId = null;

const reRenderTodoFn = ()=>{

    //먼저 ul의 모든 직계자식 li를 삭제
    while($todoList.childElementCount > 0){
        $todoList.removeChild($todoList.firstElementChild);
    }

    //for문을 이용해서 todos 배열에 저장된 목록을 화면에 출력
    for(let i=0; i<state.todos.length;i++){
        const todo = state.todos[i];

        // todos:[{ id: 0,tit: '투두라이프 복습',complete: false}]
        //동적으로 ul.list에 추가할 태그를 생성
        const $li = document.createElement('li');
        $li.id = todo.id;

        const $h3 = document.createElement('h3');
        $h3.textContent = todo.tit;

        const $chk_i = document.createElement('i');
        if(todo.complete){
            $h3.classList.add('complete');
            $chk_i.classList.add('insert', 'fas', 'fa-check-square');
        }
        else{
            $h3.classList.remove('complete');
            $chk_i.classList.add('insert', 'far', 'fa-square');
        }

        const $edit_i = document.createElement('i');
        $edit_i.classList.add('fas', 'fa-edit');

        const $del_i = document.createElement('i');
        $del_i.classList.add('del', 'fas', 'fa-times-circle');

        //동적으로 생성한 요소를 ul.li에 조립
        $li.append($chk_i, $h3, $edit_i, $del_i);
        $todoList.appendChild($li);



    }//end of for

    //완료체크버튼에 대한 클릭이벤트
    const $chkIcons = document.querySelectorAll('.todo > .list .insert');
    $chkIcons.forEach(($chkIcon)=>{
        $chkIcon.addEventListener('click', (evt)=>{
            editTodoId = parseInt(evt.currentTarget.parentElement.id);
            console.log(`editTodoId = ${editTodoId}`);
            // state.Dday = state.Dday.map(dday=>(dday.id === editDdayId) ? {...dday, tit, date: inputDate.valueOf()} : dday);
            // 삭제 > filter / 수정 > map
            state.todos = state.todos.map(todo=>(editTodoId === todo.id) ? ({...todo, complete:!todo.complete}) : todo);

            saveStateFn();
            reRenderTodoFn();
        });
    });

    //수정아이콘에 대한 클릭이벤트
    const $editIcons = document.querySelectorAll('.todo > .list .fa-edit');
    $editIcons.forEach(($editIcon)=>{
        $editIcon.addEventListener('click', (evt)=>{
            $frmTodoAdd.classList.remove('on');
            $frmTodoEdit.classList.add('on');

            editTodoId = parseInt(evt.currentTarget.parentElement.id);

            //state.todos 배열의 원소중 id 속성값이 editTodoId와 일치하는 원소의 tit를 가져온다. 그러기 위해서는 .findIndex()를 이용하여 해당 인덱스를 추출한다.
            const idx = state.todos.findIndex(todo=>todo.id === editTodoId);
            console.log(`idx = ${idx}`);

            $editTaskInput.value = state.todos[idx].tit;
            $editTaskInput.focus();
        });
    });

    
    //todo 삭제처리 클릭이벤트 | 삭제버튼 변수명 : $delIcons
    const $delIcons = document.querySelectorAll('.todo>.list .del');
    $delIcons.forEach(($delIcon)=>{
        $delIcon.addEventListener('click', (evt)=>{
            const $li = evt.currentTarget.parentElement;
            console.log($li.id);
            $li.remove();
            //로컬스토리지에서 삭제
            state.todos = state.todos.filter(todo=>todo.id !== parseInt($li.id));
            
            saveStateFn();//로컬스토리지에 현재 state 저장
            reRenderTodoFn();
        });
    });
};

reRenderTodoFn();

//todo 수정폼에 대한 submit 이벤트
$frmTodoEdit.addEventListener('submit', (evt)=>{
    evt.preventDefault();
    const tit = $editTaskInput.value.trim();
    if(tit === '' || tit === null){
        alert('Todo 제목을 입력해 주세요.');
        $editTaskInput.focus();
        return;
    }
    state.todos = state.todos.map((todo)=>{
        return todo.id === editTodoId ? {...todo, tit:tit} : todo});
    console.log(state.todos);
    
    saveStateFn();

    $frmTodoEdit.classList.remove('on');
    $frmTodoAdd.classList.add('on');
    $addTaskInput.focus();

    reRenderTodoFn();
});



//todo 입력폼에 대한 submit 이벤트
$frmTodoAdd.addEventListener('submit', (evt)=>{
    evt.preventDefault();

    const tit = $addTaskInput.value.trim();

    if(tit === '' || tit === null){
        $addTaskInput.focus();
        return;
    }
    
    const newTodo = {
        id: state.nextTodoId,
        tit,
        complete: false
    };

    state.todos.push(newTodo);

    //다음번에 사용할 id값 증가
    state = {...state, nextTodoId: state.nextTodoId+1};

    saveStateFn();

    reRenderTodoFn();

    $addTaskInput.value = '';
})