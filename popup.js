
document.addEventListener('DOMContentLoaded', function() {
  var isTest = true;

  var afterloginblock = document.getElementById('afterloginblock'),
      authresponse = document.getElementById('authresponse'),
      collatedlink = document.getElementById('collatedlink'),
      loginblock = document.getElementById('loginblock'),
      postresponse = document.getElementById('postresponse'),
      submitbutton = document.getElementById('submitbutton'),
      submitcurrent = document.getElementById('submitcurrent'),
      submitall = document.getElementById('submitall'),
      token = localStorage.getItem('collatedToken'),
      urlbox = document.getElementById('url'),
      urlerror = document.getElementById('urlerror'),
      urltitlebox = document.getElementById('urltitle');

  chrome.runtime.onMessageExternal.addListener(function(msg) {
    console.log('token in localStorage', msg.token);
    if (!token) {
      localStorage.setItem('collatedToken', msg.token);
      console.log('token set', localStorage.getItem('collatedToken'));
    }
  });

  authenticatebutton.addEventListener('click', function() {
    authenticatebutton.innerHTML = 'Authenticating, please wait..';
    chrome.tabs.update({
      url: isTest ? 'http://www.collated-dev.net/' : 'https://app.collated.net/'
    });

    setTimeout(function() {
      if (!localStorage.getItem('collatedToken')) {
        authresponse.innerHTML = "<p class='error'>Please log in to Collated and try again</p>";
        authenticatebutton.innerHTML = 'Click to authenticate';
      }
      else {
        authresponse.innerHTML = "<p class='success'>Authentication successful</p>";
        setTimeout(function() {
          window.close();
        }, 2000);
      }
    }, 8000);
  });

  submitcurrent.addEventListener('click', function() {
    if (urlbox.value.length > 0) {
      sendToServer([urlbox.value], [urltitlebox.value]);
    }
    else {
      console.log('url should not be empty');
      postresponse.innerHTML = "<p class='error'>Blank URL, please try again</p>";
    }
  });

  submitall.addEventListener('click', function() {
    chrome.tabs.getAllInWindow(null, function(tabs) {
      var urlarr = [];
      var titlearr = [];

      for (var i = 0; i < tabs.length; i++) {
        urlarr.push(tabs[i].url);
        titlearr.push(tabs[i].title);
      }
      sendToServer(urlarr, titlearr);
    });
  });

  function checkauthenticated() {
    var token = localStorage.getItem('collatedToken');

    if (token) {
      loginblock.style.display = "none";
      afterloginblock.style.display = "block";

      return true;
    }
    else {
      loginblock.style.display = "block";
      afterloginblock.style.display = "none";

      return false;
    }
  }

  function sendToServer(urlarr, titlearr) {
    postresponse.innerHTML = "";
    var token = localStorage.getItem('collatedToken');
    var http = new XMLHttpRequest();

    var obj = {
      token: token,
      urlarr: urlarr,
      titlearr: titlearr,
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
      if (http.status == 200) {
        postresponse.innerHTML= "<p class='success'>Save successful<p/>";
        setTimeout(function() {
          postresponse.innerHTML="";
  			}, 2000);
		  }
      else {
			   postresponse.innerHTML= "<p class='error'>Failed to save. Please try again or contact support@collated.net<p/>";
		  }
	  };
    http.send(jsonString);
  }

  checkauthenticated();

  if (token) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tab) {
      urlbox.value = tab[0].url;
      urltitlebox.value = tab[0].title;
   });
  }
});
