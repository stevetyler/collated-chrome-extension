// https://developer.chrome.com/extensions/event_pages

//http://stackoverflow.com/questions/11431337/sending-message-to-chrome-extension-from-a-web-page

//http://stackoverflow.com/questions/14245334/chrome-extension-sendmessage-from-background-to-content-script-doesnt-work

//http://stackoverflow.com/questions/36609128/with-a-chrome-extension-how-do-i-pass-a-message-from-background-script-to-conte



function sendToServer(urlArr, titleArr) {
  postResponse.innerHTML = "";
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
      postResponse.innerHTML= "<p class='success'>Save successful<p/>";
      setTimeout(function() {
        postResponse.innerHTML="";
			}, 2000);
	  }
    else {
		   postResponse.innerHTML= "<p class='error'>Failed to save. Please try again or contact support@collated.net<p/>";
	  }
  };
  http.send(jsonString);
}
