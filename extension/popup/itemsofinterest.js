document.addEventListener("submit", e => {
  var itemOfInterest = document.getElementById("item").value;
  if (!localStorage.getItem("itemList")) {
    localStorage.setItem("itemList", itemOfInterest);
  } else {
    var itemList = localStorage.getItem("itemList").split(",");
    itemList.push(itemOfInterest);
    localStorage.setItem("itemList", itemList.toString());
  }
});

document.getElementById("item").focus();
var itemListString = localStorage.getItem("itemList");
document.getElementById("insert").innerHTML = itemListString;
