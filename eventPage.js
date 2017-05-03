var isProduction = false;

// check error running contextMenus.create: Cannot create item with duplicate id saveTo

chrome.extension.onMessage.addListener(function(msg) {
  if (msg.query === 'isProduction') {
    chrome.extension.sendMessage({
      isProduction: isProduction.toString()
    });
  }
  else {
    sendToServer(msg.urlArr, msg.titleArr, msg.origin);
  }
  return;
});

chrome.contextMenus.create({
  "id": "saveTo",
  "type": "normal",
  "title": "Save to Collated...",
  "contexts": ["link"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  var url = info.linkUrl;
  var title = info.selectionText;

  sendToServer([url], [title], 'contextMenu');
  return;
});

function sendToServer(urlArr, titleArr, origin) {
  var token = localStorage.getItem('collatedToken');
  var http = new XMLHttpRequest();

  var obj = {
    token: token,
    urlArr: urlArr,
    titleArr: titleArr,
  };

  var jsonString = JSON.stringify(obj);

  if (isProduction) {
    http.open('POST', 'https://app.collated.net/api/v1/items/chrome', true);
  }
  else {
    http.open('POST', 'http://localhost:3000/api/v1/items/chrome', true);
  }

	http.setRequestHeader('Access-Control-Allow-Headers', '*');
	http.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	http.onreadystatechange = function() {
    if (http.status == 200) {
      chrome.extension.sendMessage({
        "response": "success"
      });
	  }
    else {
      if (origin === "popup") {
        chrome.extension.sendMessage({
          "response": "error"
        });
      }
      else {
        chrome.tabs.create({
          url: chrome.extension.getURL('openDialog.html'),
          active: false
        }, function(tab) {
          chrome.windows.create({
            tabId: tab.id,
            type: 'popup',
            focused: true,
            top: 100,
            height: 150,
            width: 300
          });
        });
      }
	  }
  };
  http.send(jsonString);
  return;
}
