var isProduction = false;

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
        alert('Error saving link, please contact support@collated.net');
      }
	  }
  };
  http.send(jsonString);
  return;
}
