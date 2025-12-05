const data = await fetch("/data.json");
const json = await data.json();

console.log(json); // testing purposes
