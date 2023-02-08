import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 1603;
const height = 540;
const margins = {top: 20, right: 20, bottom: 20, left: 20};

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then(response => response.json())
    .then(data => createMap(data.monthlyVariance))


function createMap(data){
    console.log(data)
    const svg = d3.select(".panel")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const xScale = d3.scaleLinear()
                     .domain(d3.extent(data, d => d.year))
                     .range([margins.left, width - margins.right]);

    const yScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d.month) - 1, d3.max(data, d => d.month) + 1])
                     .range([margins.top, height - margins.bottom]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    xAxis.ticks(20);

    const yAxis = d3.axisLeft(yScale);

    let domainArr = [];

    for(let i = yScale.domain()[0]; i <= yScale.domain()[1]; ++i){
      domainArr[i-1] = i;
    }

    yAxis.ticks()
         .tickValues(domainArr)
         .tickFormat(d => translateTick(d));

    svg.append("g")
       .call(xAxis);

    svg.append("g")
       .attr("transform", `translate(${margins.left*3}, 0)`)
       .call(yAxis);

}

function translateTick(tick){
  if(tick === 1){
    return "January";
  }
  else if(tick === 2){
    return "February";
  }
  else if(tick === 3){
    return "March";
  }
  else if(tick === 4){
    return "April";
  }
  else if(tick === 5){
    return "May";
  }
  else if(tick === 6){
    return "June";
  }
  else if(tick === 7){
    return "July";
  }
  else if(tick === 8){
    return "August";
  }
  else if(tick === 9){
    return "September";
  }
  else if(tick === 10){
    return "October";
  }
  else if(tick === 11){
    return "November";
  }
  else if(tick === 12){
    return "December";
  }
}
