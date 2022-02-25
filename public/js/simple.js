    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
    import { getDatabase, ref, push, set, onChildAdded, onChildRemoved, remove, get, child}    //ここで宣言した関数しか下のscriptで使えない
    from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";
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
    
    // var para;
    var para = window.sessionStorage.getItem(['chatroom']);
    const dispname = window.sessionStorage.getItem(['dispname']);
    if(dispname == null){
        location.href = 'https://sample-c2b36.web.app/index.html';
      }
    const uid = window.sessionStorage.getItem(['uid']);

    document.getElementById('helloUser').innerHTML = 'ユーザ名：' + dispname;
    

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);          // Firebaseに接続
    const db = getDatabase(app);                        // リアルタイムDBに接続
    const dbChatRef = ref(db,`chatroom/${para}/chat`);   // 階層を指定してデータを格納(チャット)
    const dbMemberRef = ref(db,`chatroom/${para}/participant/`);    // 参加者データベースの階層
    const dbref = ref(getDatabase());                   // DBのパス（参照）を取得
    let participants = [];                              // 参加しているメンバー一覧
    getParticipant();


    // 送信
    $("#send").on("click",function(){
        const msg = {
            uname : dispname,
            text : $("#text").val()
        }
        const newPostRef = push(dbChatRef); // ユニークキーを生成
        set(newPostRef,msg);
        var textareaForm = document.getElementById("text");
        textareaForm.value="";
    });

    // 退室
    $("#out").on("click",function(){
        remove(ref(db,`chatroom/${para}/participant/${dispname}/`));   // 退室(参加者から削除)
        location.href = 'https://sample-c2b36.web.app/chatroom.html';
    });

    onChildAdded(dbChatRef,function(data){
        const msg = data.val();     // 送られてきたメッセージを取得し変数に格納
        
        const h = `<p>${msg.uname}<br>${msg.text}</p>`;
        $("#output").prepend(h);
        
    })

    onChildAdded(dbMemberRef,function(data){
        const member = data.key;      // 送られてきた参加者を取得し変数に格納
        const memberIcon = data.val();
        let m = `<p id=${member}1><img class="memberIcon" src="${memberIcon}">${member}</p>`;
        $("#participant").prepend(m);
    })

    onChildRemoved(dbMemberRef,function(data){
        const member = data.val()+"1";     // 送られてきた参加者を取得し変数に格納
        let deleteMember = document.getElementById(member);   // 削除するメンバーのpタグ取得
        const parent = document.getElementById("participant");
        parent.removeChild(deleteMember);      // 削除
    })

    
    
    // 参加しているメンバーを取得
    function getParticipant(){
        get(child(dbref, `chatroom/${para}/participant/`))
        .then((data) => {
            const sa = [data.key];
            sa.forEach(function(el){
                participants.push(JSON.stringify(el));
            });
        })
        .catch((error) => {
        alert("エラー");
        console.error(error);
        });
    }
    