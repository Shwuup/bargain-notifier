//capture user keyword input
document.addEventListener("submit", e => {
  var keyword = document.getElementById("keyword-input").value;
  var keywordObject = JSON.parse(localStorage.getItem("keywordObjectString"));
  if (Object.keys(keywordObject).length === 0) {
    keywordObject.keywords = {};
  }
  keywordObject["keywords"][keyword] = {
    offers: [],
    isOnFrontPage: false,
    hasUserClicked: false
  };

  localStorage.setItem("keywordObjectString", JSON.stringify(keywordObject));
});
document.getElementById("keyword-input").focus();

var keywordObject = JSON.parse(localStorage.getItem("keywordObjectString"));
if (Object.keys(keywordObject).length > 0) {
  var keywordObjectArray = Object.keys(keywordObject.keywords);
  //for each keyword, make a div with a discard button and insert into grid
  keywordObjectArray.forEach(function(keyword) {
    var div = document.createElement("div");
    div.className = "keyword-div";
    var text = document.createTextNode(keyword);
    div.appendChild(text);
    var closeButton = document.createElement("button");
    closeButton.append(document.createTextNode("X"));
    closeButton.className = "close-button";
    closeButton.onclick = () => {
      delete keywordObject["keywords"][keyword];
      localStorage.setItem(
        "keywordObjectString",
        JSON.stringify(keywordObject)
      );
      div.style.visibility = "hidden";
    };
    div.appendChild(closeButton);
    document.getElementById("wrapper").appendChild(div);
  });
}

//#98FB98
