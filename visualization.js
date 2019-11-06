
let TIMES = ["6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm"]

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var plot_1 = d3.select("#vis-holder")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var plot_2 = d3.select("#vis-holder")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/Northeastern-DS-4200-F19/project-team-12-parking/gh-pages/data/2_survey_data.csv").then(function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);
  plot_1.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 15])
    .range([ height, 0]);
  plot_1.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  plot_1.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => x(+d.percent_of_time_occupied))
      .attr("cy", d => y(+d.number_of_unique_cars))
      .attr("r", 1.5)
      .style("fill", "#69b3a2")

  
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 15])
    .range([0, width]);
  plot_2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 383])
    .range([ height, 0]);
  plot_2.append("g")
    .call(d3.axisLeft(y));


plot_2.append("g")
  .selectAll("g")
  .data(data)
  .enter()
  .append("g")
  .selectAll("rect")
  .data(d => {
    let spot_number = d.spot_number
    return TIMES.map((time, index) => {
      return {parked: d[time],
              x: index,
              y: d.spot_number}
      })
    })
  .enter()
  .filter(d => d.parked == 'true')
  .append("rect")
  .attr("x", d => x(d.x))
  .attr("y", d => y(d.y))
  .attr("width", d => x(d.x + 1) - x(d.x))
  .attr("height", d => y(d.y - 1) - y(d.y))
  .attr("fill", "#69b3a2");

})
