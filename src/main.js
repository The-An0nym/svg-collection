const container = document.getElementById("container");

/**
 * Loads all SVGs from data.json
 */
loadSVGs = async function () {
  const data = await fetch("data.json");
  const json = await data.json();

  console.log(json); // testing purposes

  for (let i = 0; i < json.length; i++) {
    console.log(json[i]);
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

  svg.innerHTML = obj.path;

  svgContainer.appendChild(svg);
  item.appendChild(svgContainer);

  const copyPNGButton = document.createElement("button");
  copyPNGButton.textContent = "copy png";
  copyPNGButton.addEventListener("mousedown", copyPNG);
  copyPNGButton.className = "copy-button copy-png";
  item.appendChild(copyPNGButton);

  const copyHTMLButton = document.createElement("button");
  copyHTMLButton.textContent = "copy html";
  copyHTMLButton.addEventListener("mousedown", copyHTML);
  copyHTMLButton.className = "copy-button copy-html";
  item.appendChild(copyHTMLButton);

  return item;
}

async function copyPNG(e) {
  const svg = e.target.parentNode.getElementsByTagName("svg")[0];

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

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);
  };

  img.src = "data:image/svg+xml;base64," + btoa(svgString);
}

function copyHTML(e) {
  const svg = e.target.parentNode.getElementsByTagName("svg")[0];
  const clipboard = navigator.clipboard;
  if (clipboard == undefined) {
    // TODO pop-up
    copyFail();
  } else {
    clipboard.writeText(svg.outerHTML).then(copyPass, copyFail);
  }
}

function copyFail() {
  console.warn("copy paste failed");
}

function copyPass() {
  console.log("Copy worked!!");
}

loadSVGs();
