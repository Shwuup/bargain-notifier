function apiCall() {
  return fetch("http://localhost:8000/bargain", {
    body: localStorage.getItem("keywordObjectString"),
    credentials: "omit",
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    }
  });
}

function handleMessage(request, sender, sendResponse) {
  console.log("Message from the content script: " + request.action);
  browser.browserAction.setIcon({
    path: {
      16: "icons/icons8-letter-o-16-grey.png",
      32: "icons/icons8-letter-o-32-grey.png"
    }
  });
}

function createNotification() {
  var keywordObject = JSON.parse(localStorage.getItem("keywordObjectString"));
  if (Object.keys(keywordObject["keywords"]).length > 0) {
    var request = apiCall()
      .then(response => response.json())
      .then(jsonResponse => {
        if (jsonResponse.areThereNewDeals) {
          //update the state

          var newKeywords = jsonResponse.keywords;
          console.log(jsonResponse);
          delete jsonResponse.areThereNewDeals;
          localStorage.setItem(
            "keywordObjectString",
            JSON.stringify(jsonResponse)
          );

          browser.browserAction.setIcon({
            path: {
              16: "icons/icons8-letter-o-16-green.png",
              32: "icons/icons8-letter-o-32-green.png"
            }
          });

          browser.notifications.create({
            type: "basic",
            iconUrl: browser.extension.getURL("icons/border-48.png"),
            title: "Bargain alert!",
            message: "New bargain/s on the front page!"
          });
        }
      });
  }
}

localStorage.setItem("seenDeals", "{}");
localStorage.setItem(
  "keywordObjectString",
  '{"keywords":{}, "numberOfUnclickedKeywords": 0}'
);

browser.runtime.onMessage.addListener(handleMessage);
setInterval(createNotification, 120000);
