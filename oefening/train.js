import { createChart, updateChart } from "./scatterplot.js";

//
// demo data
//
const data = [];

function loadData() {
  Papa.parse("./data/cars.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => checkData(results.data),
  });
}

function checkData(parsedData) {
  console.log(parsedData);
  console.table(parsedData);
  data.push(...parsedData); // Add parsed data to the data array
  const chartdata = data.map((car) => ({
    x: car.horsepower,
    y: car.mpg,
  }));
  // kijk hoe de data eruit ziet
  console.log(chartdata);

  // chartjs aanmaken
  createChart(chartdata, "Horsepower", "MPG");
}

loadData();
