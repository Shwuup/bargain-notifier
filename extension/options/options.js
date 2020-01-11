var slider = document.getElementById("myRange");
slider.oninput = () => {
  var sliderValue = slider.value;
  browser.storage.local.set({ sliderValue });
};
