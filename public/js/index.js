/**
 * cbpFWTabs.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * https://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
 ;
 (function(window) {
 
   'use strict';
 
   function extend(a, b) {
     for (var key in b) {
       if (b.hasOwnProperty(key)) {
         a[key] = b[key];
       }
     }
     return a;
   }
 
   function CBPFWTabs(el, options) {
     this.el = el;
     this.options = extend({}, this.options);
     extend(this.options, options);
     this._init();
   }
 
   CBPFWTabs.prototype.options = {
     start: 0
   };
 
   CBPFWTabs.prototype._init = function() {
     // tabs elems
     this.tabs = [].slice.call(this.el.querySelectorAll('nav > ul > li'));
     // content items
     this.items = [].slice.call(this.el.querySelectorAll('.content-wrap > section'));
     // current index
     this.current = -1;
     // show current content item
     this._show();
     // init events
     this._initEvents();
   };
 
   CBPFWTabs.prototype._initEvents = function() {
     var self = this;
     this.tabs.forEach(function(tab, idx) {
       tab.addEventListener('click', function(ev) {
         ev.preventDefault();
         self._show(idx);
       });
     });
   };
 
   CBPFWTabs.prototype._show = function(idx) {
     if (this.current >= 0) {
       this.tabs[this.current].className = this.items[this.current].className = '';
     }
     // change current
     this.current = idx != undefined ? idx : this.options.start >= 0 && this.options.start < this.items.length ? this.options.start : 0;
     this.tabs[this.current].className = 'tab-current';
     this.items[this.current].className = 'content-current';
   };
 
   // add to global namespace
   window.CBPFWTabs = CBPFWTabs;
 
 })(window);
 
 
 
 
 
 ////////////////////////////
 ////////////////////////////
 // CALL IT
 ////////////////////////////
 ////////////////////////////
 (function() {
 
   [].slice.call(document.querySelectorAll('.tabs')).forEach(function(el) {
     new CBPFWTabs(el);
   });
 
 })();

  /*function signup() {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('ユーザー作成完了')
        alert('ユーザー作成完了')
      })
      .catch((error) => {
        console.log('ユーザー作成失敗', error);
        alert('無効なメールアドレスです')
      });
  }*/
  function signup() {
    let email = document.getElementById('newemail').value
    let password = document.getElementById('newpassword').value
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('ユーザー作成完了')
        console.log(email);
        location.href = 'https://sample-c2b36.web.app/chatroom.html';  //ホームに画面遷移
      })
      .catch((error) => {
        console.log('ユーザー作成失敗', error);
        console.log(email);
        alert(email)
      });

  }

  function login() {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('ログイン完了')
        console.log(email);
        location.href = 'https://sample-c2b36.web.app/chatroom.html';  //ホームに画面遷移
      })
      .catch((error) => {
        console.log('ログイン失敗', error);
        console.log(email);
        alert(email)
      });

  }
  