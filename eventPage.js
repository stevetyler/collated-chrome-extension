// https://developer.chrome.com/extensions/event_pages

//http://stackoverflow.com/questions/11431337/sending-message-to-chrome-extension-from-a-web-page

//http://stackoverflow.com/questions/36609128/with-a-chrome-extension-how-do-i-pass-a-message-from-background-script-to-conte

//http://stackoverflow.com/questions/3829150/google-chrome-extension-console-log-from-background-page

console.log('script running 2');

chrome.runtime.onMessage.addListener(function(msg) {
  console.log('msg', msg);
  sendToServer(msg.urlArr, msg.titleArr, msg.isProduction);
});

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
