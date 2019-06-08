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
keywordArray.forEach(function(keywordString) {
  var button = document.createElement("button");
  var text = document.createTextNode(keywordString);
  button.appendChild(text);
  button.className = "keyword-button";
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
    button.style.display = "none";
  };
  document.getElementById("wrapper").appendChild(button);
});
