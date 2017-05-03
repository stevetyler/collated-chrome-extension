
document.addEventListener('DOMContentLoaded', function() {
  var isProduction;

  var afterAuthBlock = document.getElementById('afterAuthBlock'),
      authResponse = document.getElementById('authResponse'),
      collatedLink = document.getElementById('collatedLink'),
      authBlock = document.getElementById('authBlock'),
      postResponse = document.getElementById('postResponse'),
      submitAll = document.getElementById('submitAll'),
      submitCurrent = document.getElementById('submitCurrent'),
      token = localStorage.getItem('collatedToken'),
      urlBox = document.getElementById('url'),
      urlError = document.getElementById('urlError'),
      urlTitleBox = document.getElementById('urlTitle');

  chrome.extension.onMessage.addListener(function(msg) {
    if (msg.response === "success") {
      postResponse.innerHTML= "<p class='success'>Save successful<p/>";

      setTimeout(function() {
        postResponse.innerHTML="";
			}, 2000);
    }
    else if (msg.response === "error") {
      postResponse.innerHTML= "<p class='error'>Failed to save. Please try again or contact support@collated.net<p/>";
    }
    else if (msg.isProduction) {
      isProduction = (msg.isProduction === 'true');
    }
  });

  // move to background?
  chrome.extension.onMessageExternal.addListener(function(msg) {
    if (!token) {
      localStorage.setItem('collatedToken', msg.token);
    }
  });

  authenticateButton.addEventListener('click', function() {
    authenticateButton.innerHTML = 'Authenticating, please wait..';
    chrome.tabs.update({
      url: isProduction ? 'https://app.collated.net/' : 'http://www.collated-dev.net/'
    });

    setTimeout(function() {
      if (!localStorage.getItem('collatedToken')) {
        authResponse.innerHTML = "<p class='error'>Please log in to Collated and try again.</p>";
        authenticateButton.innerHTML = 'Click to authenticate';
      }
      else {
        authenticateButton.innerHTML = 'Complete';
        authResponse.innerHTML = "<p class='success'>Authentication successful</p>";

        setTimeout(function() {
          window.close();
        }, 2000);
      }
    }, 8000);
  });

  collatedLink.addEventListener('click', function() {
    chrome.tabs.update({
      url: isProduction ? 'https://app.collated.net/' : 'http://www.collated-dev.net/'
    });
    window.close();
  });

  submitCurrent.addEventListener('click', function() {
    if (urlBox.value.length > 0) {
      sendToBackground([urlBox.value], [urlTitleBox.value]);
    }
    else {
      postResponse.innerHTML = "<p class='error'>Blank URL, please try again</p>";
    }
  });

  submitAll.addEventListener('click', function() {
    chrome.tabs.getAllInWindow(null, function(tabs) {
      var urlArr = [];
      var titleArr = [];

      for (var i = 0; i < tabs.length; i++) {
        urlArr.push(tabs[i].url);
        titleArr.push(tabs[i].title);
      }
      sendToBackground(urlArr, titleArr);
    });
  });

  function isAuthenticated() {
    var token = localStorage.getItem('collatedToken');

    if (token) {
      authBlock.style.display = "none";
      afterAuthBlock.style.display = "block";

      return true;
    }
    else {
      authBlock.style.display = "block";
      afterAuthBlock.style.display = "none";

      return false;
    }
  }

  function sendToBackground(urlArr, titleArr) {
    chrome.extension.sendMessage({
      urlArr: urlArr,
      titleArr: titleArr,
      origin: 'popup',
    });
  }

  function checkIsProduction() {
    chrome.extension.sendMessage({
      query: 'isProduction'
    });
  }

  isAuthenticated();
  checkIsProduction();

  if (token) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tab) {
      urlBox.value = tab[0].url;
      urlTitleBox.value = tab[0].title;
   });
  }
});
