
let TIMES = ["6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm"]

// set the dimensions and margins of the graph
var margin_1 = {top: 10, right: 30, bottom: 30, left: 60},
    width_1 = 460 - margin_1.left - margin_1.right,
    height_1 = 400 - margin_1.top - margin_1.bottom;

// append the svg object to the body of the page
var plot_1 = d3.select("#plot-1-holder")
  .append("svg")
    .attr("width", width_1 + margin_1.left + margin_1.right)
    .attr("height", height_1 + margin_1.top + margin_1.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_1.left + "," + margin_1.top + ")");

d3.csv("https://raw.githubusercontent.com/Northeastern-DS-4200-F19/project-team-12-parking/gh-pages/data/heatmap.csv").then(function(data) {
  var myGroups = d3.map(data, function(d){return d.number_of_times_occupied;}).keys()
  var myVars = d3.map(data, function(d){return d.number_of_unique_cars;}).keys()

  // Build X scales and axis:
  var x = d3.scaleBand()
    .range([ 0, width_1 ])
    .domain(myGroups)
    .padding(0.05);
  plot_1.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height_1 + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  var y = d3.scaleBand()
    .range([ height_1, 0 ])
    .domain(myVars)
    .padding(0.05);
  plot_1.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  // Build color scale
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateBuGn)
    .domain([0,15])

  // create a tooltip
  var tooltip = d3.select("#plot-1-holder")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.selectAll(".nt" + d.number_of_times_occupied + ",.uq" + d.number_of_unique_cars)
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html("The exact value of<br>this cell is: " + d.amount)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.selectAll(".nt" + d.number_of_times_occupied + ",.uq" + d.number_of_unique_cars)
      .style("opacity", 0.8)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // add the squares
  plot_1.selectAll()
    .data(data, function(d) {return d.number_of_times_occupied+':'+d.number_of_unique_cars;})
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.number_of_times_occupied) })
    .attr("y", function(d) { return y(d.number_of_unique_cars) })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .attr("class", function(d) { return "nt" + d.number_of_times_occupied + " uq" + d.number_of_unique_cars })
    .attr("fill", function(d) { return myColor(d.amount)} )
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})

// set the dimensions and margins of the graph
var margin_2 = {top: 10, right: 30, bottom: 30, left: 60},
    width_2 = 800 - margin_2.left - margin_2.right,
    height_2 = 400 - margin_2.top - margin_2.bottom;

var plot_2 = d3.select("#plot-2-holder")
.append("svg")
  .attr("width", width_2 + margin_2.left + margin_2.right)
  .attr("height", height_2 + margin_2.top + margin_2.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin_2.left + "," + margin_2.top + ")");

d3.csv("https://raw.githubusercontent.com/Northeastern-DS-4200-F19/project-team-12-parking/gh-pages/data/2_survey_data.csv").then(function(data) {

  // Add X axis
  plot_2.x = d3.scaleLinear()
    .domain([0, 383])
    .range([0, width_2]);
  plot_2.append("g")
    .attr("transform", "translate(0," + height_2 + ")")
    .call(d3.axisBottom(plot_2.x));

  // Add Y axis
  plot_2.y = d3.scaleLinear()
    .domain([0, 15])
    .range([ height_2, 0]);
  plot_2.append("g")
    .call(d3.axisLeft(plot_2.y));


  plot_2.rects = plot_2.append("g")
    .attr("class", "data")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("class", d => "nt" + d.number_of_times_occupied + " uq" + d.number_of_unique_cars )
    .selectAll("rect")
    .data(d => {
      let spot_number = d.spot_number
      return TIMES.map((time, index) => {
        return {parked: d[time],
                x: d.spot_number,
                y: index}
        })
      })
    .enter()
    .filter(d => d.parked == 'true')
    .append("rect")
    .attr("x", d => plot_2.x(d.x))
    .attr("y", d => plot_2.y(d.y) - (plot_2.y(d.y - 1) - plot_2.y(d.y)))
    .attr("width", d => plot_2.x(d.x) - plot_2.x(d.x - 1))
    .attr("height", d => plot_2.y(d.y - 1) - plot_2.y(d.y))
    .attr("fill", "#69b3a2")
});


