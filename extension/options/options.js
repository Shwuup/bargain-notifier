let slider = document.getElementById("myRange");
browser.storage.local.get("sliderValue").then(item => {
  slider.value = item.sliderValue;
});
slider.oninput = () => {
  let sliderValue = slider.value;
  browser.storage.local.set({ sliderValue });
};
let checkbox = document.getElementById("frontPageOnly");
browser.storage.local.get("frontPageOnly").then(item => {
  checkbox.checked = item.frontPageOnly;
});
checkbox.addEventListener("change", event => {
  if (event.target.checked) {
    browser.storage.local.set({ isFrontPageOnly: true });
  } else {
    browser.storage.local.set({ isFrontPageOnly: false });
  }
});
