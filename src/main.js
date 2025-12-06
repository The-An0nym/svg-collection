const container = document.getElementById("container");
const popUpContainer = document.getElementById("pop-up-container");

/**
 * Loads all SVGs from data.json
 */
loadSVGs = async function () {
  const data = await fetch("data.json");
  const json = await data.json();

  for (let i = 0; i < json.length; i++) {
    const svg = createSVG(json[i]);
    container.appendChild(svg);
  }
};

/**
 * Creates SVG item object
 * @param {JSON} obj svg json object
 * @returns {Element} item
 */
function createSVG(obj) {
  const item = document.createElement("div");
  item.className = "item";

  const svgContainer = document.createElement("div");
  svgContainer.className = "svg-container";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", obj.viewbox);
  svg.style = obj.style;
  svg.name = obj.name;

  svg.innerHTML = obj.path;

  svgContainer.appendChild(svg);
  item.appendChild(svgContainer);

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";

  const downloadSVGButton = document.createElement("button");
  downloadSVGButton.textContent = "save svg";
  downloadSVGButton.addEventListener("mousedown", downloadSVG);
  downloadSVGButton.className = "button download-svg";
  buttonContainer.appendChild(downloadSVGButton);

  const copyPNGButton = document.createElement("button");
  copyPNGButton.textContent = "copy png";
  copyPNGButton.addEventListener("mousedown", copyPNG);
  copyPNGButton.className = "button copy-png";
  buttonContainer.appendChild(copyPNGButton);

  const copyHTMLButton = document.createElement("button");
  copyHTMLButton.textContent = "copy html";
  copyHTMLButton.addEventListener("mousedown", copyHTML);
  copyHTMLButton.className = "button copy-html";
  buttonContainer.appendChild(copyHTMLButton);

  item.appendChild(buttonContainer);

  return item;
}

/**
 * Gets the respective SVG element of event source (given a button click)
 * @param {Event} e event
 * @returns {Element} SVG element
 */
function getSVGElement(e) {
  return e.target.parentNode.parentNode.getElementsByTagName("svg")[0];
}

/**
 * Downloads SVG as a .svg file
 * @param {Event} e
 */
async function downloadSVG(e) {
  const svg = getSVGElement(e);

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  if (!source.startsWith("<?xml")) {
    source = '<?xml version="1.0" standalone="no"?>\n' + source;
  }

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = svg.name;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Converts SVG to .png and writes it to the user's clipboard
 * @param {Event} e
 */
async function copyPNG(e) {
  const svg = getSVGElement(e);

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);

  let canvas = document.createElement("canvas");
  // TODO more standardized way of settings size?
  canvas.width = 200;
  canvas.height = 200;

  let img = new Image();

  img.onload = async function () {
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));

    await navigator.clipboard
      .write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ])
      .then(copyPass, copyFail);
  };

  img.src = "data:image/svg+xml;base64," + btoa(svgString);
}

/**
 * Takes the SVG HTML and writes it to the user's clipboard
 * @param {Event} e
 */
function copyHTML(e) {
  const svg = getSVGElement(e);
  const clipboard = navigator.clipboard;
  if (clipboard == undefined) {
    copyFail();
  } else {
    clipboard.writeText(svg.outerHTML).then(copyPass, copyFail);
  }
}

function copyFail() {
  createPopUp("Failed to copy", false);
}

function copyPass() {
  createPopUp("Copied");
}

function createPopUp(text, pass = true) {
  if (!text) return;
  const popUp = document.createElement("div");
  popUp.textContent = text;
  popUp.className = "pop-up " + (pass ? "pass" : "fail");
  popUpContainer.appendChild(popUp);

  // Remove in 5 seconds
  setTimeout(() => {
    popUp.remove();
  }, 5000);
}

loadSVGs();
