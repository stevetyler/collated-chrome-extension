



chrome.extension.onMessage.addListener(function(msg) {
  sendToServer(msg.urlArr, msg.titleArr, 'popup', msg.isProduction);
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

  sendToServer([url], [title], 'contextMenu', false);
  return;
});

function sendToServer(urlArr, titleArr, origin, isProduction) {
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
      //console.log('post success');
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
        //console.log('post error');
      }
	  }
  };
  http.send(jsonString);
  return;
}
