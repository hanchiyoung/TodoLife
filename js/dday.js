const $inputBox = document.querySelector('.dday>.inputBox');
const $DdayList = $inputBox.nextElementSibling;//ul.list

//추가,수정폼
const $frmDdayAdd = document.querySelector('.dday form[name=frmAdd]');
const $frmDdayEdit = document.querySelector('.dday form[name=frmEdit]');

const $editTit = document.querySelector('.dday input[name=editTit]');
const $editDate = document.querySelector('.dday input[name=editDate]');

const $btnDdayAdd = document.querySelector('.dday>.tit>.add');//디데이 추가버튼
const $addTit = document.querySelector('.dday input[name=addTit]');
const $addDate = document.querySelector('.dday input[name=addDate]');

const $btnClearDday = document.querySelector('.dday > .tit span'); //전체삭제


let editDdayId = null;//수정할 항목의 id


//로컬스토리에 저장된 데이터를 화면에 출력하는 함수
const reRenderDdayFn = ()=>{

  //$DdayList 요소안의 모든 자식(기존li)을 삭제
  while($DdayList.childElementCount>0){
    $DdayList.removeChild($DdayList.firstElementChild);
  }


  //for문을 이용해서 Dday 배열데이터를 화면에 출력
  for(let i=0; i<state.Dday.length; i++){
    
    //{id:0, tit:'취업준비', date: new Date('2024-09-30').valueOf()}
    const Dday = state.Dday[i];

    //동적으로 ul.list에 추가할 태그를 생성
    const $li = document.createElement('li');
    $li.id = Dday.id;

    //삭제아이콘
    //<i class="fas fa-times-circle"></i>
    const $del_i = document.createElement('i');
    $del_i.classList.add('fas','fa-times-circle');

    //D-3, 내용
    const $h3 = document.createElement('h3');
    const $p = document.createElement('p');

    //수정아이콘 <i class="fas fa-edit"></i>
    const $edit_i = document.createElement('i');
    $edit_i.classList.add('fas','fa-edit');

    //디데이 계산
    const savedDday = parseInt(Dday.date);//2024-9-30   1719815908862
    const today = new Date().valueOf();//               1719815908861
    const millPerDay = 24*60*60*1000;
    const remainDay = Math.floor((savedDday-today)/millPerDay)+1;//오늘을 기준으로 남아있는 날수

    $h3.textContent = `D-${remainDay}`;
    
    //남은 날수에 따른 제목색상
    if(remainDay<3){
      $h3.style.color = 'red';    
    }else if(remainDay<7){
      $h3.style.color = 'orange';
    }
 
    $p.textContent = Dday.tit;

    //완성된 태그 i, h3, p, i를 $li에 추가하여 조립
    $li.append($del_i, $h3, $p, $edit_i);//append()는 여러개의 자식요소 추가 가능

    //완성된 태그 li를 ul.list에 추가하여 조립
    $DdayList.appendChild($li);//appendChild()는 한개의 자식요소만 추가 가능

  }//end of for


  //수정버튼에 대한 클릭이벤트 구문
  const $editIcons = document.querySelectorAll('.dday>.list i:last-child');
  $editIcons.forEach(($editIcon,idx)=>{
    $editIcon.addEventListener('click', (evt)=>{
      //수정폼 노출
      $inputBox.classList.toggle('show', true);
      $frmDdayAdd.classList.remove('on');
      $frmDdayEdit.classList.add('on');

      //화살표함수에서 this 대신 evt.currentTarget 사용
      editDdayId = parseInt(evt.currentTarget.parentElement.id);
      //alert(`editDdayId = ${editDdayId}`);

      /*
        state.Dday 배열의 원소중 id 속성값이
        editDdayId와 일치하는 원소의 tit, date 값을 가져온다.
      */

      const idx = state.Dday.findIndex(dday=>dday.id===editDdayId);
      //console.log(state.Dday[idx]);

      //날짜추출후 input[type=date] 형식에 맞게 변환 -> 2024-06-25
      let savedDate = new Date(state.Dday[idx].date);

      let year = savedDate.getFullYear();
      let month = savedDate.getMonth()+1;
      let date = savedDate.getDate();

      month = month<10 ? `0${month}` : month;//2자리 표기
      date = date<10 ? `0${date}` : date;

      savedDate = `${year}-${month}-${date}`;//2024-06-25

      $editTit.value = state.Dday[idx].tit;
      $editDate.value = savedDate;

      $editTit.focus();
    });
  });

  //삭제버튼에 대한 클릭이벤트 구문
  const $delIcons = document.querySelectorAll('.dday>.list i:first-child');
  $delIcons.forEach(($delIcon)=>{
    $delIcon.addEventListener('click', (evt)=>{
      const $li = evt.currentTarget.parentElement;

      $li.classList.add('complete');
      
      // console.log($li);
      // console.log(state.Dday);
      
      //0.5초후 삭제예약
      setTimeout(()=>{
        $li.remove(); //현재 DOMtree 에서만 삭제됨
      }, 500);
      
      //로컬스토리지에서도 삭제
      state.Dday = state.Dday.filter((dday)=>{
        return parseInt($li.id) !== dday.id;
      });
      saveStateFn();
      
    });
  });
};

reRenderDdayFn();

//디데이 수정폼에 대한 submit 이벤트
$frmDdayEdit.addEventListener('submit', (evt)=>{
  evt.preventDefault();

  const tit = $editTit.value.trim();
  
  //유효성검사, 오늘이후의 날짜만 입력가능하도록 수정
  
  //지정날짜에 해당하는 이전자정 시간정보를 밀리세컨즈로 변환
  const inputDate = new Date($editDate.value).setHours(0,0,0,0);
  const today = new Date().setHours(0,0,0,0);

  console.log(`inputDate = ${inputDate}`);
  console.log(`today = ${today}`);

  const gapDay = (inputDate-today) / (24*60*60*1000);
  console.log(`gapDay = ${gapDay}`);

  if(tit === '' || tit === null){
    alert('디데이 목표을 입력해 주세요~!');
    $editTit.focus();
    return;

  }else if(gapDay<1){
    alert('오늘 이후의 날짜를 선택해야 합니다.');
    $editDate.focus();
    return;

  }else if(isNaN(gapDay)){
    alert('날짜를 선택해 주세요');
    $editDate.focus();
    return;

  }
  
  //수정된 값을 state 변수에 반영하여 localStoage에 저장
  //기존 state를 복사한 새로운 state에 수정사항을 반영(원본보존)
  state.Dday = state.Dday.map(dday=>(dday.id === editDdayId) ? {...dday, tit, date: inputDate.valueOf()} : dday);

  //  console.log('state.Dday =', state.Dday);

  // localStorage.setItem('state', JSON.stringify(state));//문자열로 변환하여 저장
  saveStateFn(); //initialState.js

  //수정폼 숨김
  $inputBox.classList.toggle('show', false);
  $frmDdayAdd.classList.add('on');
  $frmDdayEdit.classList.remove('on');

  //로컬스토리지에 저장된 데이터를 화면에 다시 출력
  reRenderDdayFn();
});


//디데이 추가버튼에 대한 click 이벤트
$btnDdayAdd.addEventListener('click', ()=>{

  //디데이 입력창 보이기/숨기기
  if(!$frmDdayEdit.classList.contains('on')){
    $inputBox.classList.toggle('show');
  }

  $frmDdayEdit.classList.remove('on');
  $frmDdayAdd.classList.add('on');

  $addTit.focus();
});

//디데이 추가폼에 대한 submit 이벤트
$frmDdayAdd.addEventListener('submit', (evt)=>{
  evt.preventDefault();

  const tit = $addTit.value.trim();
  const inputDate = new Date($addDate.value).setHours(0, 0, 0, 0); //밀리세컨즈
  const today = new Date().setHours(0, 0, 0, 0);

  const gapDay = (inputDate - today) / (24*60*60*1000); //정수
  // console.log(gapDay);

  //유효성검사
  if(tit === '' || tit === null){
    alert('디데이 목표를 입력해 주세요');
    $addTit.focus();
    return;
  }
  else if(gapDay<1){
    alert('오늘 이후의 날짜를 설정해야 합니다.');
    $addDate.focus();
    return;
  }
  else if(isNaN(gapDay)){
    alert('날짜를 선택해 주세요');
    $addDate.focus();
    return;
  }

  // {id:1, tit:"새로운 목표", date: 1235678}
  const newDday = {
    id: state.nextDdayId,
    tit,
    date: inputDate
  };

  state = {...state, nextDdayId:state.nextDdayId+1};
  state.Dday.push(newDday);
  saveStateFn();
  $inputBox.classList.toggle('show', false);
  $addTit.value = '';
  $addDate.value = '';
  reRenderDdayFn();
});;


//전체 데이터 삭제
$btnClearDday.addEventListener('click', ()=>{
  console.log(state.Dday);
  state.Dday = [];
  saveStateFn();
  reRenderDdayFn();
});
