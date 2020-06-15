let DEBUG = false;
function onGet(item) {
  DEBUG && console.log(`Sucessfully get: ${JSON.stringify(item)}`);
  return item;
}
function onSet() {
  DEBUG && console.log("Successfull set");
}
function onError(error) {
  DEBUG && console.log(`Error: ${error}`);
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
      const newKeyword = {
        keyword: keyword,
        offers: [],
        isOnFrontPage: false,
        hasUserClicked: false
      };
      keywordObject["keywords"].push(newKeyword);
      return keywordObject;
    })
    .then(keywordObject => storeItem(keywordObject).then(onSet, onError));
}

function deleteAll() {
  const isConfirm = confirm("Are you sure you want to delete everything?");
  if (isConfirm) {
    const keywordDivs = document.getElementsByClassName("keyword");
    Array.prototype.forEach.call(keywordDivs, function(x) {
      x.style.visibility = "hidden";
    });

    const newKeywordInfo = {
      keywords: [],
      numberOfUnclickedKeywords: 0,
      seenDeals: {}
    };
    changeIconToDefault(newKeywordInfo);
    storeItem(newKeywordInfo).then(onSet, onError);
  } else return;
}
function handleAllBargainClicks() {
  getItem()
    .then(onGet, onError)
    .then(keywordsJson => {
      let keywordArray = keywordsJson.keywords;
      keywordArray.forEach(keywordInfo => {
        if (keywordInfo["isOnFrontPage"] && !keywordInfo["hasUserClicked"]) {
          handleBargainClick(keywordsJson, keywordInfo.keyword);
        }
      });
    });
}

function handleBargainClick(keywordsJson, keyword) {
  keywordDiv = document.getElementById(keyword);
  keywordDiv.className = "keyword";
  let keywordInfo = keywordsJson["keywords"].find(
    keywordInfo => keywordInfo.keyword === keyword
  );
  const seenDeals = keywordsJson["seenDeals"];

  const offers = keywordInfo["offers"];
  offers.forEach(offerObj => {
    browser.tabs.create({
      url: offerObj.url
    });
    seenDeals[offerObj.url] = offerObj.title;
  });
  keywordInfo["hasUserClicked"] = true;
  keywordInfo["offers"] = [];
  changeIconToDefault(keywordsJson);

  //update state
  storeItem(keywordsJson)
    .then(onSet, onError)
    .then(_ => window.close());
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

function createCloseButton(obj, keyword, div) {
  let closeButton = document.createElement("button");
  closeButton.append(document.createTextNode("X"));
  closeButton.className = "close-button";
  let keywordInfo = obj["keywords"].find(
    keywordInfo => keywordInfo.keyword === keyword
  );
  closeButton.addEventListener("click", event => {
    event.stopPropagation();
    if (keywordInfo["isOnFrontPage"] && !keywordInfo["hasUserClicked"]) {
      changeIconToDefault(obj);
    }
    const newKeywords = obj["keywords"].filter(
      keywordInfo => keywordInfo.keyword !== keyword
    );
    obj["keywords"] = newKeywords;
    storeItem(obj)
      .then(onSet, onError)
      .then((div.style.visibility = "hidden"));
  });
  return closeButton;
}

const keywords = getItem().then(onGet, onError);
keywords.then(obj => {
  let keywordArray = obj["keywords"];

  if (keywordArray.length > 0) {
    keywordArray.forEach(keywordInfo => {
      const keyword = keywordInfo["keyword"];
      let div = document.createElement("div");
      div.id = keyword;
      if (keywordInfo["isOnFrontPage"] && !keywordInfo["hasUserClicked"]) {
        div.className = "keyword frontpage";
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

document.addEventListener("submit", handleSubmit);
document.getElementById("open-all").onclick = handleAllBargainClicks;
document.getElementById("delete-all").onclick = deleteAll;
document.getElementById("keyword-input").focus();
