
chrome.runtime.onMessage.addListener(function(msg) {
  console.log('msg', msg);
  if (msg.action === 'createContextMenu') {
    chrome.contextMenus.create({
      "id": "saveTo",
      "type": "link",
      "title": "Save to Collated..",
      "contexts":["link"],
      "onclick": saveToCollated
    });
  }
  else {
    sendToServer(msg.urlArr, msg.titleArr, msg.isProduction);
  }
  return;
});

function saveToCollated(info, tab) {
  console.log('saveTo clicked');
  if (info.menuItemId == "saveTo"){
    alert("You have selected: " + info.selectionText);

    // chrome.runtime.sendMessage({action:'open_dialog_box'}, function(){});
    // alert("Req sent?");
  }
}


function sendToServer(urlArr, titleArr, isProduction) {
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
	  }
  };
  http.send(jsonString);
}

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log(sender.tab ?
//               "from a content script:" + sender.tab.url :
//               "from the extension");
//   if (request.greeting == "hello")
//     sendResponse({farewell: "goodbye"});
// });

// chrome.runtime.onMessage.addListener(function(msg) {
//   console.log('message received', msg);
//
//
// });
