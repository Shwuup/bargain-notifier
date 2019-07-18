function apiCall() {
  return fetch("http://localhost:8000/test_bargain", {
    body: localStorage.getItem("keywordObjectString"),
    credentials: "omit",
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
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
          console.log(newKeywords);
          var newKeywordObject = {};
          newKeywordObject["keywords"] = newKeywords;
          localStorage.setItem(
            "keywordObjectString",
            JSON.stringify(newKeywordObject)
          );

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
localStorage.setItem("keywordObjectString", "{}");
setInterval(createNotification, 120000);
