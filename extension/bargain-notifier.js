function apiCall(payloadBody) {
  return fetch("https://notifier-backend.herokuapp.com/bargain", {
    body: payloadBody,
    credentials: "omit",
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    }
  });
}


function handleMessage(request) {
  console.log("Message from the content script: " + request.action);
  browser.browserAction.setIcon({
    path: {
      16: "icons/icons8-letter-o-16-grey.png",
      32: "icons/icons8-letter-o-32-grey.png"
    }
  });
}

function createNotification() {
  const keywordPromise = browser.storage.local.get()
  keywordPromise.then((keywordObject) => {
    if (Object.keys(keywordObject["keywords"]).length > 0) {
      let payload = { "keywords": keywordObject["keywords"], "numberOfUnclickedKeywords": keywordObject["numberOfUnclickedKeywords"] };

      apiCall(JSON.stringify(payload))
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse.areThereNewDeals) {
            //update the state
            delete jsonResponse.areThereNewDeals;
            browser.storage.local.set(jsonResponse).then(onSet, onError);
            browser.browserAction.setIcon({
              path: {
                16: "icons/icons8-letter-o-16-green.png",
                32: "icons/icons8-letter-o-32-green.png"
              }
            });

            browser.notifications.create({
              type: "basic",
              iconUrl: browser.extension.getURL("icons/icons8-letter-o-48-green.png"),
              title: "Bargain alert!",
              message: "New bargain/s on the front page!"
            });
          }
        });
    }
  })
}

function onError(error) {
  console.log(error);
}
function onGet(item) {
  console.log(`Sucessfully get: ${item}`);
}
function onSet() {
  console.log("Succesfull set");
}


browser.storage.local.set({ keywords: {}, numberOfUnclickedKeywords: 0, seenDeals: {} }).then(onSet, onError);
browser.runtime.onMessage.addListener(handleMessage);
setInterval(createNotification, 60000);
