import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 1603;
const height = 540;
const margins = {top: 40, right: 100, bottom: 80, left: 100};

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then(response => response.json())
    .then(data => createMap(data))


function createMap(data){
    console.log(data)
    const svg = d3.select(".panel")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const xScale = d3.scaleLinear()
                     .domain([d3.min(data.monthlyVariance, d => d.year), d3.max(data.monthlyVariance, d => d.year) + 1])
                     .range([margins.left, width - margins.right]);

    const yScale = d3.scaleLinear()
                     .domain([d3.min(data.monthlyVariance, d => d.month) - 0.5, d3.max(data.monthlyVariance, d => d.month) + 0.5])
                     .range([margins.top, height - margins.bottom]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    xAxis.ticks(20);

    const yAxis = d3.axisLeft(yScale);

    let domainArr = [];

    for(let i = yScale.domain()[0] + 0.5; i <= yScale.domain()[1]; ++i){
      domainArr[i-1] = i;
    }

    yAxis.ticks()
          .tickValues(domainArr)
          .tickFormat(d => translateTick(d));


    svg.append("g")
       .attr("id", "x-axis")
       .attr("transform", `translate(0, ${height-margins.bottom})`)
       .call(xAxis);

    svg.append("g")
       .attr("id", "y-axis")
       .attr("transform", `translate(${margins.left}, 0)`)
       .call(yAxis);

    svg.selectAll("rect")
       .data(data.monthlyVariance)
       .enter()
       .append("rect")
       .attr("width", 6)
       .attr("height", 35)
       .attr("x", d => xScale(d.year))
       .attr("y", d => yScale(d.month) - 17.5)
       .attr("class", d => assignColor(data.baseTemperature, d.variance));

    svg.append("text")
       .text("Months")
       .attr("x", margins.left/3)
       .attr("y", height/2)
       .style("transform-origin", margins.left/3 + "px " + height/2 + "px")
       .style("transform", "rotate(-90deg)");

    svg.append("text")
       .text("Years")
       .attr("x", width/2)
       .attr("y", height - margins.bottom/4);

    const colourScale = d3.scaleLinear()
                         .domain([1.7, 13.9])
                         .range([margins.left, width/3.5]);

    const colourAxis = d3.axisBottom(colourScale);
    colourAxis.tickValues([2.8, 3.9,5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8])
              .tickFormat(d3.format(".1f"));

    svg.append("g")
       .attr("transform", `translate(0,${height - margins.bottom/4.9})`)
       .call(colourAxis);

}

function assignColor(baseTemperature, variance){
  let cell = "cell ";
  if(baseTemperature + variance >= 11.7){
    cell += "red";
  }
  else if(baseTemperature + variance < 11.7 && baseTemperature + variance >= 10.6){
    cell += "orange-red";
  }
  else if(baseTemperature + variance < 10.6 && baseTemperature + variance >= 9.5){
    cell += "orange";
  }
  else if(baseTemperature + variance < 9.5 && baseTemperature + variance >= 8.3){
    cell += "yellow-orange";
  }
  else if(baseTemperature + variance < 8.3 && baseTemperature + variance >= 7.2){
    cell += "yellow";
  }
  else if(baseTemperature + variance < 7.2 && baseTemperature + variance >= 6.1){
    cell += "blue-yellow";
  }
  else if(baseTemperature + variance < 6.1 && baseTemperature + variance >= 5.0){
    cell += "blue";
  }
  else if(baseTemperature + variance < 5.0 && baseTemperature + variance >= 3.9){
    cell += "blue";
  }
  else if(baseTemperature + variance < 3.9){
    cell += "blue";
  }
  return cell;
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
