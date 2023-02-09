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
       .attr("class", d => assignColor(data.baseTemperature, d.variance))
       .attr("data-month", d => d.month)
       .attr("data-year", d => d.year)
       .attr("data-temp", d => (data.baseTemperature + d.variance).toFixed(1));

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


    const legend = svg.append("g")
       .attr("id", "legend")
       .attr("transform", `translate(0,${height - margins.bottom/4.9})`)
       .call(colourAxis);

    generateColour(legend, 32.3, margins.left + 32.3, "navy-blue");
    generateColour(legend, 32.3, margins.left + 32.3*2, "light-navy-blue");
    generateColour(legend, 32.3, margins.left + 32.3*3, "blue");
    generateColour(legend, 32.3, margins.left + 32.3 * 4, "blue-yellow");
    generateColour(legend, 32.3, margins.left + 32.3 * 5, "yellow");
    generateColour(legend, 35.2, margins.left + 32.29 * 6, "yellow-orange");
    generateColour(legend, 32.3, margins.left + 32.7 * 7, "orange");
    generateColour(legend, 32.5, margins.left + 32.65 * 8, "orange-red");
    generateColour(legend, 32.5, margins.left + 32.6*9, "red");

    createTooltip();
}

function createTooltip(){
  const rects = document.getElementsByClassName("cell");
  for(let rect of rects){
    rect.addEventListener("mouseover", () => {
      const location = rect.getBoundingClientRect();
      console.log(location.top);
      document.getElementById("date").innerText = rect.attributes.getNamedItem("data-year").value + " - " + translateTick(parseInt(rect.attributes.getNamedItem("data-month").value));
      document.getElementById("temperature").textContent = rect.attributes.getNamedItem("data-temp").value + "℃";
      document.getElementById("variance").textContent = (rect.attributes.getNamedItem("data-temp").value - 8.66).toFixed(1);
      document.getElementById("tooltip").style.top = location.top -70 + "px";
      document.getElementById("tooltip").style.left = location.left - 35 + "px";
      document.getElementById("tooltip").classList.add("visible");
      document.getElementById("tooltip").classList.remove("invisible");

    });
    rect.addEventListener("mouseleave", () => {
      document.getElementById("tooltip").classList.add("invisible");
      document.getElementById("tooltip").classList.remove("visible");
    });
  }
}

function generateColour(legend, width, x, colour){
  legend.append("rect")
        .attr("height", 20)
        .attr("width", width)
        .attr("class",`colour ${colour}`)
        .attr("y", -20)
        .attr("x", x);
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
    cell += "light-navy-blue";
  }
  else if(baseTemperature + variance < 3.9){
    cell += "navy-blue";
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
