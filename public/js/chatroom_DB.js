// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getDatabase, ref, set, get, child, push, remove, onChildAdded, onChildRemoved, update, onChildChanged }   //ここで宣言した関数しか下のscriptで使えない
from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
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

var room = document.getElementById('newroomname').value;  // 新ルーム名
var pass;                                                 // 新パスワード
var ckpass;                                               // 確認用パスワード
var rname = document.getElementById('rname').value;       // ルーム名
var rpass = document.getElementById('password').value;     // パスワード
const app = initializeApp(firebaseConfig);          // Firebaseに接続
const db = getDatabase(app);                        // リアルタイムDBに接続
const auth = getAuth(app);                          // ログイン状況
const storage = getStorage(app);                    // storageインスタンス
const dbref = ref(getDatabase());                   // DBのパス（参照）を取得
let roomDatas = [];                                 // 存在する部屋名
let creators = [];                                  // 作成者
let implementator;                                  //ログインしている人
let iconUrl;

const uid = window.sessionStorage.getItem(['uid']);

//ログインしていないユーザは入れないように
onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = 'https://sample-c2b36.web.app/index.html';
  }
});

await get(child(dbref, `user/${uid}`))
      .then((data) => {
        if(data.exists()){
          implementator = data.val().dispName;
          if(implementator == null){
            location.href = 'https://sample-c2b36.web.app/index.html';
          }
          iconUrl = data.val().imgurl;
          document.getElementById('helloUser').innerHTML = `<li id="chatlist"><img src="${iconUrl}" id="preview"><p class="implementator">${implementator}さん ようこそ!!</p></li>`;
        }
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });

function async_digestMessage(message) {
  return new Promise(function(resolve){
  var msgUint8 = new TextEncoder("utf-8").encode(message);
  crypto.subtle.digest('SHA-256', msgUint8).then(
      function(hashBuffer){
          var hashArray = Array.from(new Uint8Array(hashBuffer));
          var hashHex = hashArray.map(function(b){return b.toString(16).padStart(2, '0')}).join('');
          return resolve(hashHex);
      });
  })
}

//***新規ルーム***
// 存在しているルーム名の検索
document.getElementById("createbutton").addEventListener("click",function(e){
  room = document.getElementById('newroomname').value;  // 新ルーム名
  pass = document.getElementById('newpassword').value;
  ckpass = document.getElementById('newconfirm').value; // 新パスワード(チェック用)
  // 必須入力チェック
  if(room == "" || ckpass == "" || pass == ""){
    alert("未記入の項目があります");
    return;
  }

  // 正規表現で文字チェック(部屋名)
  let regex = new RegExp(/[!"#$%&'()*+\-.,/:;<=>?@[\]^_`{|}~]+/);
  if(regex.test(room)){
    alert("ルーム名には記号は使用できません");
    return;
  }

  // 正規表現で文字チェック(パスワード)
  regex = new RegExp(/[a-zA-Z0-9]/);
  if(!regex.test(pass) || !regex.test(ckpass)){
    alert("パスワードには英数字のみ使用可能です");
    return;
  }
  // 検索欄のテキストが存在しているルームにある場合
  if(roomDatas.includes(room)){
    console.log("存在しているルーム名です");
    alert("存在しているルーム名です");
    e.stopPropagation();                    // 強制終了
    e.preventDefault();                     // 強制終了
  // ない場合
  }  else {
    // パスワード比較
    if(pass != ckpass){
      alert("パスワードが一致しません");
      return;
    }
    let newpass = pass;
    if(window.Promise && window.crypto){              // ハッシュに対応しているか
      async_digestMessage(newpass).then(              // ハッシュ作成
          function(shatxt){
              newpass = shatxt;                       // パスワードのハッシュ値を代入
              update(ref(db,`chatroom/`),{            // firebaseのRealtimedatabaseに追加
                [room] : {
                  pass : newpass,
                  implementator : implementator,
                  participant : {
                    [implementator] : iconUrl,
                  },
                }
              });
              window.sessionStorage.setItem(['dispname'],implementator);       // ユーザ名を送る
              window.sessionStorage.setItem(['chatroom'],room);                // ルーム名を送る
              push(ref(db,`user/${uid}/myChat/${room}`),room);                 // 作ったチャットをセット
              location.href = 'https://sample-c2b36.web.app/simple.html';
          }
      ).catch(function(e){
          console.log('エラー：', e.message);
          alert(e.message);
      })
    }else{
      alert('Promiseかcryptoに非対応');
        console.log('Promiseかcryptoに非対応');
    }
    
    
  }
},{passive: false});
//***新規ルーム***

//***ルーム検索***
document.getElementById("passmodalOpen").addEventListener("click",function(e){
  rname = document.getElementById('rname').value;       // ルーム名
  if(roomDatas.includes(rname)){                        // 検索テキストが存在している部屋にあったら
    pmodal.style.display = 'block';                     // モーダル表示
  }  else {
    alert("存在していないルームです");
    console.log("存在していないルーム名です");
    e.stopPropagation();                          // 強制停止
    e.preventDefault();                           // 強制停止
  }
},{passive: false});

//入室ボタンが押されたら
function inRoom(roomName){
    $(document).on("click",`.in_${roomName}`,function(){
      pmodal.style.display = 'block';                 // モーダル表示
      rname = roomName;                               // 部屋名代入
  });
}


// パスワードチェック
document.getElementById("pass_inspection").addEventListener("click",function(e){
  var ckrpass = document.getElementById('confirm1').value;      // パスワード(チェック用)
  rpass = document.getElementById('password').value;            // パスワード

  // 必須入力チェック
  if(ckrpass == "" || rpass == ""){
    alert("未記入の項目があります");
    return;
  }
  // 正規表現で文字チェック(パスワード)
  let regex = new RegExp(/[a-zA-Z0-9]/);
  if(!regex.test(ckrpass) || !regex.test(rpass)){
    alert("パスワードには英数字のみ使用可能です");
    return;
  }
  // パスワード比較（テキスト内）
  if(rpass != ckrpass){
    alert("パスワードが一致しません");
    return;
  }
  get(child(dbref, `chatroom/${rname}/pass`))
    .then((data) => {
      const checkpass = JSON.stringify(data.val());     // ハッシュ化されているパスワードの取得
      if(window.Promise && window.crypto){              // PromiseかCryptoに対応しているか
        async_digestMessage(rpass).then(
            function(shatxt){                           // ハッシュ生成
              if(checkpass == `"${shatxt}"`){
                window.sessionStorage.setItem(['dispname'],implementator);            // 入室者名
                window.sessionStorage.setItem(['chatroom'],rname);                    // ルーム名を送る
                set(ref(db,`chatroom/${rname}/participant/${implementator}`),iconUrl);    // 参加者名とアイコンを追加
                location.href = 'https://sample-c2b36.web.app/simple.html';           // チャット画面へ
              }
              else{ 
                alert("パスワードが間違っています");
              }
            }
        ).catch(function(e){
            console.log('エラー：', e.message);
            alert(e.message);
        })
      // ハッシュ化未対応
      }else{
        alert('Promiseかcryptoに非対応');
        console.log('Promiseかcryptoに非対応');
      }
      
    })
    .catch((error) => {
      alert("エラー");
      console.error(error);
    });
});
//***ルーム検索***

// ルーム削除
function deleteRooms(roomName){
  $(document).on("click",`.delete${roomName}`,function(e){
    let res = confirm(`${roomName}を削除してもよろしいですか？`);
      if(res == true){
        remove(ref(db, `chatroom/${roomName}/`));              // ルームの削除
        remove(ref(db, `user/${uid}/myChat/${roomName}`));     // マイルームの削除
      }
      else{
        alert("削除がキャンセルされました。");
      }
  });
}

const dbRoomRef = ref(db,`chatroom/`);    

onChildAdded(dbRoomRef,function(data){
  roomDatas.push(data.key);                       // ルーム名格納
  creators.push(data.val().implementator);        // 作成者格納
  let m;
  // 今ログインしている人が部屋の作成者かどうか
  if(data.val().implementator == implementator){
    m = `<tr id="${data.key}1"><td id="chat">${data.key}</td> 
     <td class="creator">${data.val().implementator}</td><td><button class="in_${data.key}" onclick="${inRoom(data.key)}">入室</button></td></tr>
     <tr id="${data.key}2"><td class="underline"></td><td class="underline"></td><td class="underline"><button class="delete${data.key}" onclick="${deleteRooms(data.key)}">削除</button></td></tr>`;
  }
  else{
    m = `<tr id="${data.key}1"><td>${data.key}</td> <td class="creator">${data.val().implementator}</td>
     <td><button class="in_${data.key}"  onclick="${inRoom(data.key)}">入室</button></td></tr>
     <tr><td class="underline">　</td><td class="underline">　</td><td class="underline">　</td></tr>`;
  }
  $("#allchatroom").prepend(m);
})

// 削除された時画面上に表示が残るので削除
onChildRemoved(dbRoomRef,function(data){
  let index = roomDatas.indexOf(data.key);                   // 削除値のインデックスを取得
  roomDatas.splice(index,1);                                 // 配列内のデータ削除
  const r = data.key+"1";                                    // 送られてきたID1を格納                                 
  const r2 = data.key+"2";                                   // 送られてきたID2を格納
  let deleteMember = document.getElementById(r);             // 削除するメンバーのtrタグ取得
  let deleteMember2 = document.getElementById(r2);           // 削除するメンバーのtrタグ取得
  const parent = document.getElementById("allchatroom");
  parent.removeChild(deleteMember);                          // 削除
  parent.removeChild(deleteMember2);                         // 削除
})

// アイコン変更
document.getElementById("changebutton").addEventListener("click",async function(e){
  // storageに追加
  const img = document.getElementById("previewIcon");  // img要素を取得
  const localUrl = await fetch(img.src);
  console.log(localUrl);
  const localBlob = await localUrl.blob();         // blob型に変換      /* blob型とは基本の型では表せない画像のデータ等を格納できる */
  const snapshot = await uploadBytes(stRef(storage, `${uid}/icon`), localBlob);     // 取ってきた結果
  const imgUrl = await getDownloadURL(stRef(storage, `${uid}/icon`));               // 画像を表示出来るようにするためのURLを取得、格納
  set(ref(db,`user/${uid}/imgurl`),imgUrl);                                   // アイコン再設定
});

// 変更したアイコンを表示
onChildChanged(ref(db,`user/${uid}/`),function(data){
  alert(data.val());
  const img = document.getElementById("preview"); // img要素を取得
  img.src = data.val(); // URLをimg要素にセット
});
