// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getDatabase, ref, set, get,child}   //ここで宣言した関数しか下のscriptで使えない
from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBl8n-1_6gZxwvUCSypLTNu23gMzsrizD8",
  authDomain: "sample-c2b36.firebaseapp.com",
  projectId: "sample-c2b36",
  storageBucket: "sample-c2b36.appspot.com",
  messagingSenderId: "88710090874",
  appId: "1:88710090874:web:ecbc7bcd54ccb854a22bc3"
};

var room = document.getElementById('newroomname');  //ルーム名
var pass = document.getElementById('newpassword');  //パスワード
const app = initializeApp(firebaseConfig); //Firebaseに接続
const db = getDatabase(app);    //リアルタイムDBに接続


//新規部屋作成
$("#createbutton").on("click",function(){
  alert(room.value);
  
  get(child(ref(db), `chatroom/${room.value}`)).then((snapshot) => {
    alert("bbbb");
    if (snapshot.exists()) {
      alert("cccc");
    } else {
      alert("dddd");
    }
  }).catch((error) => {
    alert(error);
  });
  
  /*
  ref.child("chatroom").orderByChild('pass').equalTo(room.value).once("value",snapshot => {
    alert("bbbb");
    if (snapshot.exists()){
      alert("if");
    }else{
      set(ref(db,`chatroom/${room.value}/pass`),pass.value); //パスワードをセット
      alert("else");
    }
  });*/
  
  alert("eeee");
});