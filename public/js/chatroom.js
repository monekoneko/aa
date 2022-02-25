function logout() {
  firebase.auth().onAuthStateChanged( (user) => {
    firebase.auth().signOut().then(()=>{
      console.log("ログアウトしました",user);
      location.href = 'https://sample-c2b36.web.app/index.html';  //ログイン画面に戻る
    })
    .catch( (error)=>{
      console.log(`ログアウト時にエラーが発生しました (${error})`);
    });
  });
}

//モーダルウィンドウ処理
const buttonOpen = document.getElementById('modalOpen');
const iconOpen = document.getElementById('helloUser');
const modal = document.getElementById('easyModal');
const pmodal = document.getElementById('PassModal');
const imodal = document.getElementById('iconModal');
const buttonClose = document.getElementsByClassName('modalClose')[0];
const pbuttonClose = document.getElementsByClassName('passmodalClose')[0];
const cbuttonClose = document.getElementsByClassName('changemodalClose')[0];

//ボタンがクリックされた時
buttonOpen.addEventListener('click', modalOpen);
function modalOpen() {
  modal.style.display = 'block';
};

//ボタンがクリックされた時(アイコン変更)
iconOpen.addEventListener('click', cmodalOpen);
function cmodalOpen() {
  imodal.style.display = 'block';
};

//バツ印がクリックされた時
buttonClose.addEventListener('click', modalClose);
function modalClose() {
  modal.style.display = 'none';
};

//バツ印がクリックされた時(パスワード)
pbuttonClose.addEventListener('click', pmodalClose);
function pmodalClose() {
  pmodal.style.display = 'none';
};

//バツ印がクリックされた時(アイコン変更)
cbuttonClose.addEventListener('click', cmodalClose);
function cmodalClose() {
  imodal.style.display = 'none';
};

//モーダルコンテンツ以外がクリックされた時
addEventListener('click', outsideClose);
function outsideClose(e) {
  if (e.target == modal) {
  modal.style.display = 'none';
  };
  if (e.target == pmodal) {
    pmodal.style.display = 'none';
    };
  if (e.target == imodal) {
    imodal.style.display = 'none';
    };
};

// 画像再設定
function previewImage(obj) {

  // blob型の画像URLを取得
  const blobUrl = window.URL.createObjectURL(obj.files[0]);
  const img = document.getElementById("previewIcon"); // img要素を取得
  img.src = blobUrl; // URLをimg要素にセット
  console.log(img.src);
}