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
  const svg = document.createElementNS(svg, "http://www.w3.org/2000/svg");
  svg.viewBox = obj.viewbox;
  svg.style = obj.style;

  const path = obj.path;
  svg.appendChild(path);

  return svg;
}

loadSVGs();
