document.getElementById("keyword-input").focus();
//capture user keyword input
document.addEventListener("submit", e => {
  var keyword = document.getElementById("keyword-input").value;
  var keywordsObject = JSON.parse(localStorage.getItem("keywordObjectString"));
  keywordsObject["keywords"][keyword] = {
    offers: [],
    isOnFrontPage: false,
    hasUserClicked: false,
    lastSeenDealIndex: -1
  };

  localStorage.setItem("keywordObjectString", JSON.stringify(keywordsObject));
});
document.getElementById("keyword-input").focus();

var keywordsObject = JSON.parse(localStorage.getItem("keywordObjectString"));
if (Object.keys(keywordsObject).length > 0) {
  var keywordArray = Object.keys(keywordsObject.keywords);
  //for each keyword, make a clikable/non-clickable div with a discard button and insert into grid
  keywordArray.forEach(keyword => {
    var keywordInfo = keywordsObject["keywords"][keyword];
    var div = document.createElement("div");
    if (keywordInfo["isOnFrontPage"] && !keywordInfo["hasUserClicked"]) {
      div.className = "keyword-frontpage";
      var listOfOffers = keywordInfo["offers"];
      var seenDeals = JSON.parse(localStorage.getItem("seenDeals"));
      div.addEventListener("click", () => {
        for (
          var i = keywordInfo["lastSeenDealIndex"] + 1;
          i < listOfOffers.length;
          ++i
        ) {
          browser.tabs.create({
            url: listOfOffers[i][0]
          });
          if (!seenDeals[keyword]) {
            seenDeals[keyword] = [listOfOffers[i]];
          } else {
            seenDeals[keyword].push(listOfOffers[i]);
          }
          localStorage.setItem("seenDeals", JSON.stringify(seenDeals));
        }

        keywordInfo["lastSeenDealIndex"] = listOfOffers.length - 1;
        keywordInfo["hasUserClicked"] = true;
        if (keywordsObject["numberOfUnclickedKeywords"] > 0) {
          keywordsObject["numberOfUnclickedKeywords"] -= 1;
          if (keywordsObject["numberOfUnclickedKeywords"] === 0) {
            browser.runtime.sendMessage({
              action: "Change icon color"
            });
          }
        }

        //update state
        localStorage.setItem(
          "keywordObjectString",
          JSON.stringify(keywordsObject)
        );
      });
    } else {
      div.className = "keyword";
    }
    var text = document.createTextNode(keyword);
    div.appendChild(text);
    var closeButton = document.createElement("button");
    closeButton.append(document.createTextNode("X"));
    closeButton.className = "close-button";
    closeButton.onclick = () => {
      delete keywordsObject["keywords"][keyword];
      localStorage.setItem(
        "keywordObjectString",
        JSON.stringify(keywordsObject)
      );
      div.style.visibility = "hidden";
    };
    div.appendChild(closeButton);
    document.getElementById("wrapper").appendChild(div);
  });
}
