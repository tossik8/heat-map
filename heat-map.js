import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 1603;
const height = 540;
const margins = {top: 20, right: 20, bottom: 20, left: 20};

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then(response => response.json())
    .then(data => createMap(data.monthlyVariance))


function createMap(data){
    console.log(data[0])
    const svg = d3.select(".panel")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const xScale = d3.scaleLinear()
                     .domain(d3.extent(data, d => d.year))
                     .range([margins.left, width - margins.right]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    xAxis.ticks(20);


    svg.append("g")
       .call(xAxis);

}
