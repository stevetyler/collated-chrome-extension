
document.addEventListener('DOMContentLoaded', function() {
  var submitbutton = document.getElementById('submitbutton'),
      loginblock = document.getElementById('loginblock'),
      afterloginblock = document.getElementById('afterloginblock'),
      error = document.getElementById('error'),
      urlerror = document.getElementById('error'),
      username = document.getElementById('username'),
      email = document.getElementById('email'),
      submiturl = document.getElementById('submiturl'),
      submitallurl = document.getElementById('submitallurl'),
      urlbox = document.getElementById('url'),
      serverresponse = document.getElementById('serverresponse'),
      isLocal = true;

  serverresponse.innerHTML = "";

  if (checkcredentials()) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tab) {
      urlbox.value = tab[0].url;
      console.log(tab[0].url);
   });
  }

  submitbutton.addEventListener('click', function() {
    if (username.value.length > 0 && email.value.length > 0) {
      error.innerHTML = "";
      loginblock.style.display = "none";
      afterloginblock.style.display = "block";
      localStorage.setItem("collatedemail", email.value);
      localStorage.setItem("collatedusername", username.value);
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tab) {
        urlbox.value = tab[0].url;
        console.log(tab[0].url);
      });
    }
    else {
      error.innerHTML = "Please enter your credentials.";
    }
  });

  submiturl.addEventListener('click', function() {
    if (urlbox.value.length > 0) {
      if (checkcredentials()) {
        sendTabToServer(urlbox.value);
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

  submitallurl.addEventListener('click', function() {
    if (checkcredentials()) {
      chrome.tabs.getAllInWindow(null, function(tabs) {
        var tabsarray = [];
        for (var i = 0; i < tabs.length; i++) {
          tabsarray.push(tabs[i].url);
        }
        urlstring = tabsarray.join(', ');
        sendTabToServer(urlstring);
      });
    }
    else {
      error.innerHTML = "Please enter your credentials.";
    }
  });

  function checkcredentials() {
    var collatedemail = localStorage.getItem("collatedemail");
    var collatedusername = localStorage.getItem("collatedusername");
    if (collatedemail && collatedusername && collatedemail.length > 0 && collatedusername.length > 0) {
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

  function sendTabToServer(urlvalue) {
    serverresponse.innerHTML = "";
    var collatedemail = localStorage.getItem("collatedemail");
    var collatedusername = localStorage.getItem("collatedusername");
    var http = new XMLHttpRequest();
    var obj = {};

    obj.email = collatedemail;
  	obj.url = urlvalue;
  	obj.username = collatedusername;

  	var jsonString = JSON.stringify(obj);

    if (isLocal) {
      http.open('POST', 'https://collated.net/api/v1/items/chrome', true);
    }
    else {
      http.open('POST', 'https://collated.net/api/v1/items/chrome', true);
    }

  	http.setRequestHeader('Access-Control-Allow-Headers', '*');
  	http.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
  	http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        urlbox.value="";
        serverresponse.innerHTML= "<p class='serverresponsegreen'>Your URL(s) saved successfully.</>";
        setTimeout(function() {
          serverresponse.innerHTML="";
  			}, 3000);
		  }
      else {
			   serverresponse.innerHTML= "<p  class='serverresponsered'>Failed to save. Try again.</>";
		  }
	  };
    http.send(jsonString);
  }
});

// function disableSelect(urlbox){
//   if (urlbox.addEventListener){
//     urlbox.addEventListener("mousedown", disabler, "false");
//   } else {
//     urlbox.attachEvent("onselectstart", disabler);
//   }
// }
//
// function enableSelect(urlbox){
//   if (urlbox.addEventListener){
//     urlbox.removeEventListener("mousedown", disabler, "false");
//   } else {
//     urlbox.detachEvent("onselectstart", disabler);
//   }
// }
//
// function disabler(e){
//   if(e.preventDefault){ e.preventDefault(); }
//   return false;
// }
