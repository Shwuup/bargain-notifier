function apiCall(listOfItems) {
  return fetch("http://localhost:8000/bargain", {
    body: JSON.stringify({ "item list": listOfItems }),
    credentials: "omit",
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json());
}

function createNotification() {
  var keywordArray = localStorage.getItem("keywordArrayString").split(",");
  if (keywordArray.length > 0) {
    var request = apiCall(keywordArray);
    console.log(request);
    if (request) {
      browser.notifications.onClicked.addListener(() =>
        window.open("https://www.ozbargain.com.au/")
      );
      browser.notifications.create({
        type: "basic",
        iconUrl: browser.extension.getURL("icons/border-48.png"),
        title: "Bargain alert!",
        message: "New bargain/s on the front page!"
      });
    }
  }
}

// setInterval(createNotification, 60000);
