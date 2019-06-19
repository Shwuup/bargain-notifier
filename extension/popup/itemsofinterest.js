document.addEventListener("submit", e => {
  var keyword = document.getElementById("keyword-input").value;
  if (!localStorage.getItem("keywordArrayString")) {
    localStorage.setItem("keywordArrayString", keyword);
  } else {
    var keywordArray = localStorage.getItem("keywordArrayString").split(",");
    keywordArray.push(keyword);
    localStorage.setItem("keywordArrayString", keywordArray.toString());
  }
});

document.getElementById("keyword-input").focus();
var keywordArray = localStorage.getItem("keywordArrayString").split(",");
//for each keyword, make a div with a discard button and insert into grid
keywordArray.forEach(function(keywordString) {
  var div = document.createElement("div");
  div.className = "keyword-div";
  var text = document.createTextNode(keywordString);
  div.appendChild(text);

  var button = document.createElement("button");
  button.append(document.createTextNode("X"));
  button.className = "close-button";
  button.onclick = () => {
    var keywordArray = localStorage.getItem("keywordArrayString").split(",");
    var newKeywordArrayString = keywordArray
      .filter(currentKeywordString => currentKeywordString !== keywordString)
      .toString();

    if (newKeywordArrayString === "") {
      localStorage.removeItem("keywordArrayString");
    } else {
      localStorage.setItem("keywordArrayString", newKeywordArrayString);
    }
    div.style.visibility = "hidden";
  };
  div.appendChild(button);
  document.getElementById("wrapper").appendChild(div);
});
