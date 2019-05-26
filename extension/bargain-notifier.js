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

function createNotification(listOfItems) {
  var response = apiCall(listOfItems);
  if (
    !(Object.keys(response).length === 0 && response.constructor === Object)
  ) {
    browser.notifications.create({
      type: "basic",
      iconUrl: browser.extension.getURL("icons/border-48.png"),
      title: "Bargain alert!",
      message: "New bargain/s on the front page!"
    });
  }
}

// setInterval(apiCall, 1.8 * 1000000);
setInterval(createNotification, 30000, listOfItems);
