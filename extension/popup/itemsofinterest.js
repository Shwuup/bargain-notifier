function onGet(item) {
  console.log(`Sucessfully get: ${JSON.stringify(item)}`);
  return item;
}
function onSet() {
  console.log("Successfull set");
}
function onError(error) {
  console.log(`Error: ${error}`);
}
function storeItem(item) {
  return browser.storage.local.set(item);
}
function getItem(item) {
  return browser.storage.local.get(item);
}
function handleSubmit() {
  const keyword = document.getElementById("keyword-input").value;
  const keywords = getItem("keywords");
  keywords
    .then(keywordObject => {
      keywordObject["keywords"][keyword] = {
        offers: [],
        isOnFrontPage: false,
        hasUserClicked: false,
        lastSeenDealIndex: -1
      };
      return keywordObject;
    })
    .then(keywordObject => storeItem(keywordObject).then(onSet, onError));
}
function handleAllBargainClicks() {
  const frontpageDivs = document.getElementsByClassName("keyword frontpage");
  Array.prototype.forEach.call(frontpageDivs, function(x) {
    x.style.backgroundColor = "#7fdbff";
  });

  getItem()
    .then(onGet, onError)
    .then(keywordsJson => {
      keywordArray = Object.keys(keywordsJson.keywords);
      keywordArray.forEach(keyword => {
        let keywordInfo = keywordsJson["keywords"][keyword];
        if (keywordInfo["isOnFrontPage"] && !keywordInfo["hasUserClicked"]) {
          handleBargainClick(keywordsJson, keyword);
        }
      });
    });
  window.close();
}

function deleteAll() {
  const isConfirm = confirm("Are you sure you want to delete everything?");
  if (isConfirm) {
    const keywordDivs = document.getElementsByClassName("keyword");
    Array.prototype.forEach.call(keywordDivs, function(x) {
      x.style.visibility = "hidden";
    });

    const newKeywordInfo = {
      keywords: {},
      numberOfUnclickedKeywords: 0,
      seenDeals: {}
    };
    changeIconToDefault(newKeywordInfo);
    storeItem(newKeywordInfo).then(onSet, onError);
  } else return;
}

function handleBargainClick(keywordsJson, keyword) {
  let keywordInfo = keywordsJson["keywords"][keyword];
  const seenDeals = keywordsJson["seenDeals"];
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
  }

  keywordInfo["lastSeenDealIndex"] = listOfOffers.length - 1;
  keywordInfo["hasUserClicked"] = true;

  changeIconToDefault(keywordsJson);

  //update state
  storeItem(keywordsJson).then(onSet, onError);
  window.close();
}

function changeIconToDefault(keywords) {
  if (keywords["numberOfUnclickedKeywords"] > 0)
    keywords["numberOfUnclickedKeywords"] -= 1;
  if (keywords["numberOfUnclickedKeywords"] === 0) {
    browser.runtime.sendMessage({
      action: "Change icon color"
    });
  }
}

function createCloseButton(keywordInfo, keyword, div) {
  let closeButton = document.createElement("button");
  closeButton.append(document.createTextNode("X"));
  closeButton.className = "close-button";
  closeButton.addEventListener("click", event => {
    event.stopPropagation();
    if (keywordInfo["isOnFrontPage"] && !keywordInfo["hasUserClicked"]) {
      changeIconToDefault(obj);
    }
    delete keywordInfo["keywords"][keyword];
    storeItem(keywordInfo).then(onSet, onError);
    div.style.visibility = "hidden";
  });
  return closeButton;
}

const keywords = getItem().then(onGet, onError);
keywords.then(obj => {
  let keywordsObject = obj["keywords"];
  let keywordArray = Object.keys(keywordsObject);
  if (keywordArray.length > 0) {
    //for each keyword, make a clickable/non-clickable div with a discard button and insert into grid
    keywordArray.forEach(keyword => {
      let keywordInfo = keywordsObject[keyword];
      let div = document.createElement("div");
      if (keywordInfo["isOnFrontPage"] && !keywordInfo["hasUserClicked"]) {
        div.className = "keyword frontpage";
        div.addEventListener("click", () => (div.className = "keyword"));
        div.addEventListener("click", () => {
          handleBargainClick(obj, keyword);
        });
      } else {
        div.className = "keyword";
      }
      let text = document.createTextNode(keyword);
      div.appendChild(text);
      const closeButton = createCloseButton(obj, keyword, div);
      div.appendChild(closeButton);
      document.getElementById("wrapper").appendChild(div);
    });
  }
});

document.getElementById("keyword-input").focus();
document.addEventListener("submit", handleSubmit);
document.getElementById("open-all").onclick = handleAllBargainClicks;
document.getElementById("delete-all").onclick = deleteAll;
