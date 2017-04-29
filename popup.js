
document.addEventListener('DOMContentLoaded', function() {
  var isTest = true;

  var submitbutton = document.getElementById('submitbutton'),
      loginblock = document.getElementById('loginblock'),
      afterloginblock = document.getElementById('afterloginblock'),
      collatedlink = document.getElementById('collatedlink'),
      error = document.getElementById('error'),
      urlerror = document.getElementById('error'),
      username = document.getElementById('username'),
      submitcurrent = document.getElementById('submitcurrent'),
      submitall = document.getElementById('submitall'),
      token = localStorage.getItem('collatedToken'),
      urlbox = document.getElementById('url'),
      urltitlebox = document.getElementById('urltitle'),
      serverresponse = document.getElementById('serverresponse');

      document.getElementById('token').innerHTML = 'token found ' + token;
  // chrome.runtime in Chrome 26, use chrome.extension for Chrome 20-25
  //var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

  chrome.runtime.onMessageExternal.addListener(function(msg) {
    console.log('token in localStorage', msg.token);
    if (!token) {
      // check compatibility
      localStorage.setItem('collatedToken', msg.token);
      console.log('token set', localStorage.getItem('collatedToken'));
    }
  });

  serverresponse.innerHTML = "";

  if (checkcredentials()) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tab) {
      urlbox.value = tab[0].url;
      urltitlebox.value = tab[0].title;
   });
  }

  submitbutton.addEventListener('click', function() {
    if (username.value.length > 0) {
      error.innerHTML = "";
      loginblock.style.display = "none";
      afterloginblock.style.display = "block";
      //localStorage.setItem("collatedemail", email.value);
      localStorage.setItem("collatedusername", username.value);
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tab) {
        urlbox.value = tab[0].url;
        urltitlebox.value = tab[0].title;
      });
    }
    else {
      error.innerHTML = "Please enter your username.";
    }
  });

  submitcurrent.addEventListener('click', function() {
    if (urlbox.value.length > 0) {
      if (checkcredentials()) {
        sendTabToServer([urlbox.value], [urltitlebox.value]);
        urlerror.innerHTML = "";
      }
      else {
        error.innerHTML = "Please enter your credentials.";
      }
    }
    else {
      urlerror.innerHTML = "URL should not be empty.";
	  }
  });

  submitall.addEventListener('click', function() {
    if (checkcredentials()) {
      chrome.tabs.getAllInWindow(null, function(tabs) {
        var urlarr = [];
        var titlearr = [];

        for (var i = 0; i < tabs.length; i++) {
          urlarr.push(tabs[i].url);
          titlearr.push(tabs[i].title);
        }
        sendTabToServer(urlarr, titlearr);
      });
    }
    else {
      error.innerHTML = "Please enter your credentials.";
    }
  });

  function checkcredentials() {
    //var collatedemail = localStorage.getItem("collatedemail");
    var collatedusername = localStorage.getItem("collatedusername");
    if (collatedusername && collatedusername.length > 0) {
      loginblock.style.display = "none";
      afterloginblock.style.display = "block";
      collatedlink.href = 'https://app.collated.net/' + collatedusername;
      // chrome.tabs.update({
      //   url: 'https://app.collated.net/' + collatedusername
      // });
      return true;
    }
    else {
      loginblock.style.display = "block";
      afterloginblock.style.display = "none";
      return false;
    }
  }

  function sendTabToServer(urlarr, titlearr) {
    serverresponse.innerHTML = "";
    //var collatedemail = localStorage.getItem("collatedemail");
    var collatedusername = localStorage.getItem("collatedusername");
    var token = localStorage.getItem('collatedToken');
    var http = new XMLHttpRequest();

    var obj = {
      token: token,
      urlarr: urlarr,
      titlearr: titlearr,
      username: collatedusername
    };

    var jsonString = JSON.stringify(obj);

    if (isTest) {
      http.open('POST', 'http://localhost:3000/api/v1/items/chrome', true);
    }
    else {
      http.open('POST', 'https://app.collated.net/api/v1/items/chrome', true);
    }

  	http.setRequestHeader('Access-Control-Allow-Headers', '*');
  	http.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
  	http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        urlbox.value="";
        urltitlebox.value="";
        serverresponse.innerHTML= "<p class='serverresponsegreen'>Your URL(s) saved successfully.</>";
        setTimeout(function() {
          serverresponse.innerHTML="";
  			}, 3000);
		  }
      else {
			   serverresponse.innerHTML= "<p  class='serverresponsered'>Failed to save. Please try again or contact support@collated.net</>";
		  }
	  };
    http.send(jsonString);
  }
});
