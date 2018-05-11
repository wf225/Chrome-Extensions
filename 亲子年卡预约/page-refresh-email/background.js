/* A function creator for callbacks */
function doStuffWithDOM(element) {
  alert("Start page monitor.\n" + element);

  // chrome.alarms.create("my_alarm", { periodInMinutes: 1 });
}

/* When the browser-action button is clicked... */
chrome.browserAction.onClicked.addListener(function (tab) {
  if (tab.url.indexOf("http:") != 0 || tab.url.indexOf("https:") != 0) {
    chrome.tabs.sendMessage(tab.id, { text: "report_back" }, doStuffWithDOM);
  }
});

// chrome.alarms.onAlarm.addListener(function () {
//   alert("Time's up!");
// });
