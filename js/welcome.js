const $login = document.getElementById('login');
const $content = document.getElementById('content');

const $loginForm = $login.firstElementChild;
const $username = $loginForm.children[1];

const $user = document.querySelector('p>.user');

//로컬스토리지의 state.username에 따라 UI 선택
if(state.username !== ''){
    $content.style.display = 'block';
    $login.style.display = 'none';
}
else{
    $content.style.display = 'none';
    $login.style.display = 'flex';

}

//로그인폼에 대한 submit 이벤트 구문
$loginForm.addEventListener('submit', (evt)=>{
    evt.preventDefault();

    const username = $username.value.trim();

    $login.style.display = 'none'; //로그인폼 숨김
    $content.style.display = 'block'; //컨텐츠 노출

    //로컬스토리지에 username 값 저장
    state = {...state, username:username};

    saveStateFn();
    
    $user.textContent = state.username;
})