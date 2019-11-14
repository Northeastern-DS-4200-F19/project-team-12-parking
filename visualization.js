
let TIMES = ["6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm"]

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var color = d3.scaleOrdinal()
  .domain(["1Right", "2Right", "3aRight", "3bRight", "4Right", 
           "5Right", "6Right", "7Right", "8Right", "9Right", 
           "10aRight", "10bRight", "11Right", "12Right", "13Right", 
           "14Right", "2Left", "9Left", "11Left", "12Left", "13Left", 
           "14Left" ])
  .range(["#fea3aa", "#f8b88b", "#faf884", "#baed91", "#b2cefe",
          "#f2a2e8" ])

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
    plot_1.x = d3.scaleLinear()
      .domain([0, 1])
      .range([0, width]);
    plot_1.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(plot_1.x));

    // Add Y axis
    plot_1.y = d3.scaleLinear()
      .domain([0, 15])
      .range([ height, 0]);
    plot_1.append("g")
      .call(d3.axisLeft(plot_1.y));

    // Add dots
    plot_1.circles = plot_1.append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", d => plot_1.x(+d.percent_of_time_occupied))
        .attr("cy", d => plot_1.y(+d.number_of_unique_cars))
        .attr("r", 1.5)
        .style("fill", "#69b3a2")
        .attr("id", function(d) { return "circle" + d.spot_number; });

    // Add brushing
    plot_1.call(d3.brush()               
      .extent([[0,0], [width,height]])
      .on("start brush", updateBrush)
    )

  function updateBrush() {
    extent = d3.event.selection
    plot_1.circles.classed("selected", d => brushed(extent, plot_1.x(+d.percent_of_time_occupied), plot_1.y(+d.number_of_unique_cars)))
    let selected = plot_1.selectAll(".selected")
      .nodes()
      .map(d => d.__data__["spot_number"]);
    
    d3.selectAll(".data g").classed("selected", d => selected.includes(d.spot_number))
  }

  // A function that return TRUE or FALSE according if a dot is in the selection or not
  function brushed(brush_coords, cx, cy) {
      var x0 = brush_coords[0][0],
          y0 = brush_coords[0][1],
          x1 = brush_coords[1][0],
          y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
  }


  // Add X axis
  plot_2.x = d3.scaleLinear()
    .domain([0, 15])
    .range([0, width]);
  plot_2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(plot_2.x));

  // Add Y axis
  plot_2.y = d3.scaleLinear()
    .domain([0, 383])
    .range([ height, 0]);
  plot_2.append("g")
    .call(d3.axisLeft(plot_2.y));


  plot_2.rects = plot_2.append("g")
    .attr("class", "data")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("class", d => "rect" + d.spot_number)
    .selectAll("rect")
    .data(d => {
      let spot_number = d.spot_number
      return TIMES.map((time, index) => {
        return {parked: d[time],
                x: index,
                y: d.spot_number,
                spot_number: d.spot_number}
        })
      })
    .enter()
    .filter(d => d.parked == 'true')
    .append("rect")
    .attr("x", d => plot_2.x(d.x))
    .attr("y", d => plot_2.y(d.y))
    .attr("width", d => plot_2.x(d.x + 1) - plot_2.x(d.x))
    .attr("height", d => plot_2.y(d.y - 1) - plot_2.y(d.y))
    .attr("fill", "#69b3a2")
})
