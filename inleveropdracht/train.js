import { createChart, updateChart } from "./scatterplot.js";

//
// demo data
//

const nn = ml5.neuralNetwork({ task: "regression", debug: true });

function loadData() {
  Papa.parse("./data/cars.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => checkData(results.data),
  });
}

function checkData(data) {
  console.log(data);
  console.table(data);
  data.push(...data); // Add parsed data to the data array
  const chartdata = data.map((car) => ({
    x: car.horsepower,
    y: car.mpg,
  }));
  // kijk hoe de data eruit ziet
  console.log(chartdata);

  // chartjs aanmaken
  createChart(chartdata, "Horsepower", "MPG");
  // shuffle
  data.sort(() => Math.random() - 0.5);

  // een voor een de data toevoegen aan het neural network
  for (let car of data) {
    nn.addData({ horsepower: car.horsepower }, { mpg: car.mpg });
  }

  // normalize
  nn.normalizeData();
  startTraining();
}

function startTraining() {
  nn.train({ epochs: 10 }, () => finishedTraining());
}

async function finishedTraining() {
  console.log("Finished training!");
  let predictions = [];
  for (let hp = 40; hp < 250; hp += 2) {
    const pred = await nn.predict({ horsepower: hp });
    predictions.push({ x: hp, y: pred[0].mpg });
  }
  updateChart("Predictions", predictions);
}

async function makePrediction() {
  const input = document.getElementById("field");
  const horsepower = parseFloat(input.value);

  if (isNaN(horsepower)) {
    document.getElementById("result").innerText = "Voer een geldig getal in!";
    return;
  }

  const results = await nn.predict({ horsepower });
  const mpg = results[0].mpg.toFixed(2);
  document.getElementById("result").innerText = `Geschat verbruik: ${mpg} mpg.`;
}

// Add event listener to button
const button = document.getElementById("btn");
button.addEventListener("click", makePrediction);

loadData();
