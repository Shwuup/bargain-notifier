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
  var itemList = localStorage.getItem("itemList").split(",");
  var response = apiCall(itemList);
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

setInterval(createNotification, 900000);
