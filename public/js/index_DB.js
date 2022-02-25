// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getDatabase, ref, set, get, child }   //ここで宣言した関数しか下のscriptで使えない
from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
import { ref as stRef, uploadBytes, getStorage, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyBl8n-1_6gZxwvUCSypLTNu23gMzsrizD8",
  authDomain: "sample-c2b36.firebaseapp.com",
  projectId: "sample-c2b36",
  storageBucket: "sample-c2b36.appspot.com",
  messagingSenderId: "88710090874",
  appId: "1:88710090874:web:ecbc7bcd54ccb854a22bc3"
};

const app = initializeApp(firebaseConfig);          // Firebaseに接続
const db = getDatabase(app);                        // リアルタイムDBに接続
const auth = getAuth(app);                          // ログイン状況
const storage = getStorage(app);                    // storageインスタンス
const dbref = ref(getDatabase());                   // DBのパス（参照）を取得
const provider = new firebase.auth.GoogleAuthProvider();    // Google認証用

// ログイン
$("#login_btn").on("click",function(){
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  // ユーザログイン
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log('ログイン完了');
      const uid = userCredential.user.uid;            // uidの取得
      window.sessionStorage.setItem(['uid'],[uid]);   // セッションに登録
      location.href = 'https://sample-c2b36.web.app/chatroom.html';  //チャット検索画面遷移
      
    })
    .catch((error) => {
      console.log('ユーザー作成失敗', error);
      alert('メールアドレスかパスワードが間違っています');
    });
});


//　登録
$("#signup_btn").on("click",function(){
  let email = document.getElementById('newemail').value;
  let password = document.getElementById('newpassword').value;
  let name = document.getElementById('username').value;
  // 必須入力チェック
  if(name == "" || email == "" || password == ""){
    alert("未記入の項目があります");
    return;
  }
  
  // 正規表現で文字チェック(ユーザ名)
  let regex = new RegExp(/[!"#$%&'()*+\-.,/:;<=>?@[\]^_`{|}~]+/);
  if(regex.test(name)){
    alert("ユーザ名には記号は使用できません");
    return;
  }
  // パスワード文字数チェック
  if(password.length < 6){
    alert("パスワードは6文字以上です");
    return;
  }
  // ユーザ作成
  createUserWithEmailAndPassword(auth,email, password)
    .then(async (userCredential) => {
      console.log('ユーザー作成完了');
      const uid = userCredential.user.uid;            // uidの取得
      // セッション登録
      window.sessionStorage.setItem(['username'],[name]);
      window.sessionStorage.setItem(['uid'],[uid]);

      // storageに追加
      const img = document.getElementById("preview");  // img要素を取得
      const localUri = await fetch(img.src);           // ローカルに存在する画像を取得
      const localBlob = await localUri.blob();         // blob型に変換      /* blob型とは基本の型では表せない画像のデータ等を格納できる */
      const snapshot = await uploadBytes(stRef(storage, `${uid}/icon`), localBlob);     // 取ってきた結果
      const imgUrl = await getDownloadURL(stRef(storage, `${uid}/icon`));               // 画像を表示出来るようにするためのURLを取得、格納
      await set(ref(db,`user/${uid}`),{               // ニックネームの登録 メアドの登録
        dispName : name,
        email : email,
        imgurl : imgUrl,
      });
      location.href = 'https://sample-c2b36.web.app/chatroom.html';  //チャット検索画面遷移      
    })
    .catch((error) => {
      console.log('ユーザー作成失敗', error);
      alert('既に存在しているメールアドレスです');
    });
});

