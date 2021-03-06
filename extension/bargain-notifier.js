let DEBUG = false;
function apiCall(payloadBody) {
  return fetch(
    "https://jqjhg6iepc.execute-api.ap-southeast-2.amazonaws.com/prod/bargain",
    {
      body: payloadBody,
      credentials: "omit",
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json", Accept: "*/*" }
    }
  );
}

function handleMessage(request) {
  DEBUG && console.log("Message from the content script: " + request.action);
  browser.browserAction.setIcon({
    path: {
      16: "icons/icons8-o-16.png",
      32: "icons/icons8-o-32.png"
    }
  });
}

function playAudio() {
  let audio = new Audio("kaching.mp3");
  browser.storage.local.get("sliderValue").then(vol => {
    audio.volume = vol.sliderValue;
    audio.play();
  });
}

function createNotification() {
  browser.notifications.create({
    type: "basic",
    iconUrl: browser.extension.getURL("icons/icons8-o-48-green.png"),
    title: "Bargain alert!",
    message: "New bargain/s on the front page!"
  });
}

function checkForNewDeals() {
  const keywordPromise = browser.storage.local.get();
  keywordPromise.then(keywordObject => {
    DEBUG && console.log(keywordObject);
    if (keywordObject["keywords"].length > 0) {
      DEBUG && console.log("making payload");
      let payload = {
        keywords: keywordObject["keywords"],
        numberOfUnclickedKeywords: keywordObject["numberOfUnclickedKeywords"],
        seenDeals: keywordObject["seenDeals"],
        isFrontPageOnly: keywordObject["isFrontPageOnly"]
      };
      apiCall(JSON.stringify(payload))
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse.areThereNewDeals) {
            // update the state
            delete jsonResponse.areThereNewDeals;
            browser.storage.local.set(jsonResponse).then(onSet, onError);
            browser.browserAction.setIcon({
              path: {
                16: "icons/icons8-o-16-green.png",
                32: "icons/icons8-o-32-green.png"
              }
            });
            playAudio();
            createNotification();
          }
        });
    }
  });
}

function onError(error) {
  DEBUG && console.log(error);
}
function onGet(item) {
  DEBUG && console.log(`Sucessfully get: ${item}`);
}
function onSet() {
  DEBUG && console.log("Succesfull set");
}
function setDefaultValues() {
  browser.storage.local.get().then(results => {
    if (Object.keys(results).length === 0) {
      browser.storage.local
        .set({
          keywords: [],
          numberOfUnclickedKeywords: 0,
          seenDeals: {},
          sliderValue: 0.5,
          isFrontPageOnly: false
        })
        .then(onSet, onError);
    }
  });
}

browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
  if (temporary) return; // skip during development
  switch (reason) {
    case "install":
      {
        const url = browser.runtime.getURL("onboarding/installed.html");
        await browser.tabs.create({ url });
      }
      break;
  }
});

setDefaultValues();
browser.runtime.onMessage.addListener(handleMessage);
setTimeout(checkForNewDeals, 60000);
setInterval(checkForNewDeals, 100000);
