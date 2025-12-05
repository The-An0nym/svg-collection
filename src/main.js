const container = document.getElementById("container");

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

function createSVG(obj) {
  const svgContainer = document.createElement("div");
  svgContainer.class = "svg-container";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.viewBox = obj.viewbox;
  svg.style = obj.style;

  const path = obj.path;
  svg.appendChild(path);

  const copyButton = document.createElement("button");
  // TODO add functionality
  svgContainer.class = "copy-button";
  svgContainer.appendChild(copyButton);

  return svgContainer;
}

loadSVGs();
