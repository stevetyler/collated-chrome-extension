//http://stackoverflow.com/questions/9418495/chrome-extension-why-i-have-this-error-in-console-of-the-background-page

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
