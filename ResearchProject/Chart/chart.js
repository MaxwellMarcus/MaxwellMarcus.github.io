const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
const ctx = canvas.getContext("2d");


const sliderDiv = document.getElementById("sliderDiv");

const height = canvas.height - 50;
const bottom = canvas.height - 25;

let column1Width = 50;
let column2Width = 50;

let value1 = 100;
let value2 = 95;

let max = 100;
let min = 50;

const map = (value, pMin, pMax, nMin, nMax) => (nMax - nMin) * ((value - pMin) / (pMax - pMin)) + nMin

class Column {
  constructor() {
    this.container = document.createElement("div");
    this.container.textContent = name
    sliderDiv.appendChild(this.container);

    const span0 = document.createElement("div");
    span0.textContent = "Name: ";
    this.container.appendChild(span0);

    this.nameInput = document.createElement("input");
    span0.appendChild(this.nameInput)

    const span1 = document.createElement("div");
    span1.textContent = "Value: ";
    this.container.appendChild(span1);

    this.valueInput = document.createElement("input");
    this.valueInput.type = "range";
    this.valueInput.value = Math.random() * 50 + 50;
    this.valueInput.min = 0;
    this.valueInput.max = 100;
    span1.appendChild(this.valueInput);

    const span2 = document.createElement("div");
    span2.textContent = "Width: ";
    this.container.appendChild(span2);
    this.widthInput = document.createElement("input");
    this.widthInput.type = "range";
    this.widthInput.value = 50;
    this.widthInput.min = 0;
    this.widthInput.max = 100;
    span2.appendChild(this.widthInput);
  }

  render(x) {
    const y = map(this.valueInput.value, min, max, 0, height);

    ctx.fillStyle = "blue";

    ctx.fillRect(x - this.widthInput.value / 2, bottom - y, this.widthInput.value, y);

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(this.nameInput.value, x, canvas.height - 15);
  }
}

const columns = [
  new Column(), new Column(),
];

const renderScale = () => {
  for (let i = 0; i <= 10; i++) {
    const n = map(i, 0, 10, min, max);
    const y = map(i, 0, 10, 0, height)
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText(Math.floor(n), 2, bottom - y + 3);
    ctx.beginPath();
    ctx.moveTo(25, bottom - y);
    ctx.lineTo(canvas.width, bottom - y);
    ctx.stroke();
  }
}

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  renderScale();

  const dx = (canvas.width - 10) / columns.length;


  for (let i = 0; i < columns.length; i++) {
    columns[i].render(i * dx + dx / 2 + 25);
  }

  requestAnimationFrame(render);
}

const minInput = document.getElementById("minSlider");
minInput.oninput = (e) => {
  min = parseInt(e.target.value);
};

const canvasWidthInput = document.getElementById("chartWidth");
canvasWidthInput.oninput = (e) => {
  canvas.width = window.innerWidth * (e.target.value / 100);
}

const addColumnButton = document.getElementById("addColumn");
addColumnButton.onclick = (e) => {
  columns.push(new Column());
}

const removeColumnButton = document.getElementById("removeColumn");
removeColumnButton.onclick = (e) => {
  const c = columns.pop();
  sliderDiv.removeChild(c.container);
}

// const maxInput = document.getElementById("maxSlider");
// maxInput.oninput = (e) => {
//   max = e.target.value;
//   render();
// };

// const value1Input = document.getElementById("value1Slider");
// value1Input.oninput = (e) => {
//   value1 = parseInt(e.target.value);
//   render();
// };
//
// const value2Input = document.getElementById("value2Slider");
// value2Input.oninput = (e) => {
//   value2 = parseInt(e.target.value);
//   render();
// };
//
// const column1WidthInput = document.getElementById("column1WidthSlider");
// column1WidthInput.oninput = (e) => {
//   column1Width = parseInt(e.target.value);
//   render();
// };
//
// const column2WidthInput = document.getElementById("column2WidthSlider");
// column2WidthInput.oninput = (e) => {
//   column2Width = parseInt(e.target.value);
//   render();
// };

render();
