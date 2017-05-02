//http://stackoverflow.com/questions/14245334/chrome-extension-sendmessage-from-background-to-content-script-doesnt-work

function onClickHandler(info, tab) {
    if (info.menuItemId == "line1"){

      alert("You have selected: " + info.selectionText);

      chrome.extension.sendMessage({action:'open_dialog_box'}, function(){});

      alert("Req sent?");

    }
}

  chrome.contextMenus.onClicked.addListener(onClickHandler);

  chrome.runtime.onInstalled.addListener(function() {

  chrome.contextMenus.create({"id": "line1", "type": "normal", "title": "Save to Collated..", "contexts":["selection"]});

});
