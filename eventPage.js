var isProduction = false;

chrome.extension.sendMessage({
  "isProduction": isProduction
});

chrome.runtime.onMessage.addListener(function(msg) {
  sendToServer(msg.urlArr, msg.titleArr, msg.isProduction);
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

  sendToServer([url], [title], false);
  return;
});

function sendToServer(urlArr, titleArr) {
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
      chrome.runtime.sendMessage({
        "response": "success"
      });
	  }
    else {
      //console.log('post error');
      chrome.runtime.sendMessage({
        "response": "error"
      });
      alert('Error saving link, please contact support@collated.net');
	  }
  };
  http.send(jsonString);
}
