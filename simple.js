// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getDatabase, ref, push, set}    //ここで宣言した関数しか下のscriptで使えない
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

var http = require('http');
var html = require('fs').readFileSync('../simple.html');

// Initialize Firebase
const app = initializeApp(firebaseConfig); //Firebaseに接続
const db = getDatabase(app);    //リアルタイムDBに接続
http.createServer(function(req, res) {
    if(req.method === 'GET') {
        var para = getUrlParam('rname');
        document.write(para);
        const dbRef = ref(db,para+'/chat');  //階層を指定してデータを格納
    } else if(req.method === 'POST') {
        var para = postParam(req,res);
        document.write(para);
        const dbRef = ref(db,para[0]+'/chat');  //階層を指定してデータを格納
        set(push(ref(para[0]+'/pass')),para[1]);
    }
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.send(html);
}).listen(3000);




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

//POST
function postParam(req,res){
    var data = new Array(2);
    var param = '';
    //POSTデータを受けとる
    req.on('data', function(chunk) {param += chunk})
        .on('end', function() {
            var urlVar = param.split('&');
            for (var i = 0; i < urlVar.length; i++){
                var paramName = urlVar[i].split('=');
                data[i] = paramName[1];
            }
            return data;
        })
}