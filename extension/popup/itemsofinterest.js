function handleSubmit() {
  let keyword = document.getElementById("keyword-input").value;
  let keywordsObject = JSON.parse(localStorage.getItem("keywordObjectString"));
  keywordsObject["keywords"][keyword] = {
    offers: [],
    isOnFrontPage: false,
    hasUserClicked: false,
    lastSeenDealIndex: -1
  };

  localStorage.setItem("keywordObjectString", JSON.stringify(keywordsObject));
}

function handleAllBargainClicks() {
  let keywordsJson = JSON.parse(localStorage.getItem("keywordObjectString"));
  let keywordArray = Object.keys(keywordsJson.keywords);
  keywordArray.forEach(keyword => {
    let keywordInfo = keywordsJson["keywords"][keyword];
    if (keywordInfo["isOnFrontPage"] && !keywordInfo["hasUserClicked"]) {
      handleBargainClick(keywordsJson, keyword);
    }
  });
}

function handleBargainClick(keywordsJson, keyword) {
  let keywordInfo = keywordsJson["keywords"][keyword];
  let seenDeals = JSON.parse(localStorage.getItem("seenDeals"));
  let listOfOffers = keywordInfo["offers"];
  for (
    let i = keywordInfo["lastSeenDealIndex"] + 1;
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
  if (keywordsJson["numberOfUnclickedKeywords"] > 0) {
    keywordsJson["numberOfUnclickedKeywords"] -= 1;
    if (keywordsJson["numberOfUnclickedKeywords"] === 0) {
      browser.runtime.sendMessage({
        action: "Change icon color"
      });
    }
  }

  //update state
  localStorage.setItem("keywordObjectString", JSON.stringify(keywordsJson));
}

let keywordsObject = JSON.parse(localStorage.getItem("keywordObjectString"));
if (Object.keys(keywordsObject).length > 0) {
  let keywordArray = Object.keys(keywordsObject.keywords);
  //for each keyword, make a clikable/non-clickable div with a discard button and insert into grid
  keywordArray.forEach(keyword => {
    let keywordInfo = keywordsObject["keywords"][keyword];
    let div = document.createElement("div");
    if (keywordInfo["isOnFrontPage"] && !keywordInfo["hasUserClicked"]) {
      div.className = "keyword-frontpage";
      div.addEventListener("click", () =>
        handleBargainClick(keywordsObject, keyword)
      );
    } else {
      div.className = "keyword";
    }
    let text = document.createTextNode(keyword);
    div.appendChild(text);
    let closeButton = document.createElement("button");
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
document.getElementById("keyword-input").focus();
document.addEventListener("submit", handleSubmit);
document.getElementById("open-all").onclick = handleAllBargainClicks;
