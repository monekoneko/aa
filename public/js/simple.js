    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
    import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved }    //ここで宣言した関数しか下のscriptで使えない
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

    //GET
    function getUrlParam(param){
        var pageUrl = window.location.search.substring(1);
        var urlVar = pageUrl.split('&');
        for (var i = 0; i < urlVar.length; i++){
            var paramName = urlVar[i].split('=');
            if (paramName[0] == param) {
                return decodeURI(paramName[1]);
            }
        }
    }

    var para = getUrlParam('newchatroom');

    // Initialize Firebase
    const app = initializeApp(firebaseConfig); //Firebaseに接続
    const db = getDatabase(app);    //リアルタイムDBに接続
    const dbRef = ref(db,para+'/chat');  //階層を指定してデータを格納
    //set(ref(db,para+'/pass'),123456);
        

    $("#send").on("click",function(){
        const msg = {
            uname : $("#uname").val(),
            text : $("#text").val()
        }
        const newPostRef = push(dbRef); //ユニークキーを生成
        set(newPostRef,msg);
        
    });

    onChildAdded(dbRef,function(data){
        const msg = data.val();     //送られてきたメッセージを取得し変数に格納
        const key = data.key;   //ユニークキー
        let h = '<p>';
            h += msg.uname;
            h += '<br>';
            h += msg.text;
            h += '</p>';
            $("#output").prepend(h);
    })