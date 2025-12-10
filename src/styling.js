const defaultStyle = document.getElementById("default-style");
const strokeWidth = document.getElementById("stroke-width");
const strokeColor = document.getElementById("stroke-color");
const fill = document.getElementById("fill");
const fillColor = document.getElementById("fill-color");
const fillColorContainer = document.getElementById("fill-color-container");

defaultStyle.addEventListener("input", () => {
  const menuItems = document.getElementsByClassName("menu");
  set = "1";
  if (defaultStyle.checked) set = "0";
  for (let i = 0; i < menuItems.length; i++) menuItems[i].style.opacity = set;
  if (!fill.checked) fillColorContainer.style.opacity = "0";
  changeProperties();
});

fill.addEventListener("input", () => {
  if (fill.checked) fillColorContainer.style.opacity = "1";
  else fillColorContainer.style.opacity = "0";
  changeProperties();
});

strokeWidth.addEventListener("input", () => {
  let val = strokeWidth.value;
  const strokeWidthValue = document.getElementById("stroke-width-value");
  strokeWidthValue.innerHTML = val + "px";
  changeProperties();
});

/* COLORS */
fillColor.addEventListener("input", () => {
  const val = fillColor.value;
  const fillColorDiscplay = document.getElementById("fill-color-display");
  fillColorDiscplay.style.backgroundColor = val;
  changeProperties();
});

strokeColor.addEventListener("input", () => {
  const val = strokeColor.value;
  const strokeColorDiscplay = document.getElementById("stroke-color-display");
  strokeColorDiscplay.style.backgroundColor = val;
  changeProperties();
});

function changeProperties() {
  const svgElements = document.getElementsByTagName("svg");

  for (let i = 0; i < svgElements.length; i++) {
    if (defaultStyle.checked) {
      svgElements[i].style = svgElements[i].svgObj.style;
      continue;
    }
    let style = `stroke-linecap: round; stroke-width: ${strokeWidth.value}; stroke: ${strokeColor.value};`;

    if (fill.checked && svgElements[i].svgObj.fillable)
      style += `fill: ${fillColor.value};`;
    else style += `fill: none;`;

    svgElements[i].style = style;
  }
}
