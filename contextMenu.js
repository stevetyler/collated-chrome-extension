//http://stackoverflow.com/questions/14245334/chrome-extension-sendmessage-from-background-to-content-script-doesnt-work

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    "id": "saveTo",
    "type": "link",
    "title": "Save to Collated..",
    "contexts":["link"],
    "onclick": saveToCollated
  });
});

//chrome.contextMenus.onClicked.addListener(saveToCollated);

function saveToCollated(info, tab) {
  if (info.menuItemId == "saveTo"){
    alert("You have selected: " + info.selectionText);

    // chrome.runtime.sendMessage({action:'open_dialog_box'}, function(){});
    // alert("Req sent?");
  }
}
