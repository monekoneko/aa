
//パスワードの目
function pushHideButton() {
    var txtPass = document.getElementById("textPassword");
    var btnEye = document.getElementById("buttonEye");
    if (txtPass.type === "text") {
      txtPass.type = "password";
      btnEye.className = "fa fa-eye";
    } else {
      txtPass.type = "text";
      btnEye.className = "fa fa-eye-slash";
    }
  }


function logout() {
  firebase.auth().onAuthStateChanged( (user) => {
    firebase.auth().signOut().then(()=>{
      console.log("ログアウトしました");
      location.href = 'https://sample-c2b36.web.app/index.html';  //ログイン画面に戻る
    })
    .catch( (error)=>{
      console.log(`ログアウト時にエラーが発生しました (${error})`);
    });
  });
}

//モーダルウィンドウ処理
const buttonOpen = document.getElementById('modalOpen');
const passbuttonOpen = document.getElementById('passmodalOpen');
const modal = document.getElementById('easyModal');
const pmodal = document.getElementById('PassModal');
const buttonClose = document.getElementsByClassName('modalClose')[0];
const pbuttonClose = document.getElementsByClassName('passmodalClose')[0];

//ボタンがクリックされた時
buttonOpen.addEventListener('click', modalOpen);
function modalOpen() {
  modal.style.display = 'block';
};

//バツ印がクリックされた時
buttonClose.addEventListener('click', modalClose);
function modalClose() {
  modal.style.display = 'none';
};

//検索ボタンがクリックされた時
passbuttonOpen.addEventListener('click', pmodalOpen);
function pmodalOpen() {
  pmodal.style.display = 'block';
};

//バツ印がクリックされた時(パスワード)
pbuttonClose.addEventListener('click', pmodalClose);
function pmodalClose() {
  pmodal.style.display = 'none';
};

//モーダルコンテンツ以外がクリックされた時
addEventListener('click', outsideClose);
function outsideClose(e) {
  if (e.target == modal) {
  modal.style.display = 'none';
  };
};

//新しいパスワード確認
function NewCheckPassword(newconfirm){
  // 入力値取得
  var input1 = newpassword.value;
  var input2 = newconfirm.value;
  // パスワード比較
  if(input1 != input2){
    newconfirm.setCustomValidity("入力値が一致しません。");
  }else{
    newconfirm.setCustomValidity('');
  }
}

//パスワード確認
function CheckPassword(confirm){
  // 入力値取得
  var input1 = password.value;
  var input2 = confirm.value;
  // パスワード比較
  if(input1 != input2){
    confirm.setCustomValidity("入力値が一致しません。");
  }else{
    confirm.setCustomValidity('');
  }
}
