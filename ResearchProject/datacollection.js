const jstat = this.jStat();

// const desireInp = document.getElementById("goal");
const meanInp = document.getElementById("mean")
const stdDevInp = document.getElementById("stdDev")
const populationInp = document.getElementById("population")
const trialsInp = document.getElementById("trials")

const table = document.getElementById("outputTable");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const goButton = document.getElementById("go");
goButton.onclick = (e) => {
  while (table.children.length > 1) {
    table.removeChild(table.children[1]);
  }

  const trialPopulation = parseInt(populationInp.value);
  const mean = parseInt(meanInp.value);
  const stdDev = parseInt(stdDevInp.value);
  const singleNorm = jstat.normal(mean, stdDev);
  const trialNorm = jstat.normal(mean, stdDev / Math.sqrt(trialPopulation));
  const trialStdDev = stdDev / Math.sqrt(trialPopulation);
  const trials = parseInt(trialsInp.value);

  const hover = (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const value = 150 + (300 / 8) * ((parseFloat(e.target.parentElement.children[1].textContent) - mean) / trialStdDev);

    render(singleNorm, mean, stdDev, trialStdDev);

    ctx.beginPath();
    ctx.moveTo(value, 0);
    ctx.lineTo(value, canvas.height);
    ctx.stroke();

  }

  for (let i = 0; i < trials; i++) {
    const dataset = []
    let avg = 0
    for (let i = 0; i < trialPopulation; i++){
      const prob = Math.random();
      const value = singleNorm.inv(prob);
      avg += value;
      dataset.push(value);
    }
    avg = avg / dataset.length;

    const val = avg < mean ? avg : mean - (avg - mean)
    const prob = trialNorm.cdf(val);

    const row = document.createElement("tr");
    row.onmouseover = hover;
    let cell = document.createElement("td");
    cell.textContent = i + 1;
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.textContent = avg.toPrecision(4);
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.textContent = prob.toPrecision(1);

    if (prob <= 0.05) {
      row.bgColor = "#9FA2AF";
    }

    row.appendChild(cell);


    table.appendChild(row);

  }

  render(singleNorm, mean, stdDev, trialStdDev);
}

const render = (singleNorm, mean, stdDev, trialStdDev) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "black"

  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 20);
  for (let i = 0; i < 30; i++) {
    const stdDevs = (i - 15) / 4
    if (stdDevs % 1 == 0) {
      ctx.textAlign = "center";
      ctx.fillText(stdDevs, i * 10, canvas.height - 12);
      ctx.fillText((mean + stdDevs * trialStdDev).toPrecision(3), i * 10, canvas.height - 4);

    }
    ctx.lineTo(i * 10, canvas.height - singleNorm.pdf(mean + stdDev * stdDevs) * 2000 - 20)
  }
  ctx.stroke();
}
