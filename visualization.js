
// set the dimensions and margins of the graph
let margin_1 = {top: 10, right: 30, bottom: 50, left: 60},
    width_1 = 460 - margin_1.left - margin_1.right,
    height_1 = 400 - margin_1.top - margin_1.bottom;

// append the svg object to the body of the page
let width = width_1 + margin_1.left + margin_1.right
let height = height_1 + margin_1.top + margin_1.bottom
let plot_1 = d3.select("#plot-1-holder")
  .append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("width", "100%")
  .append("g")
    .attr("transform",
          "translate(" + margin_1.left + "," + margin_1.top + ")");

// div for a tooltip
let div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

d3.csv("https://raw.githubusercontent.com/Northeastern-DS-4200-F19/project-team-12-parking/gh-pages/data/heatmap.csv").then(function(data) {
  let myGroups = d3.map(data, function(d){return d.number_of_times_occupied;}).keys()
  let myVars = d3.map(data, function(d){return d.number_of_unique_cars;}).keys()

  // Build X scales and axis:
  let x = d3.scaleBand()
    .range([ 0, width_1 ])
    .domain(myGroups)
    .padding(0.05)
  plot_1.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height_1 + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  plot_1.append("text")  
    .style("font-size", 15)           
    .attr("transform",
          "translate(" + (width_1/2) + " ," + 
                         (height_1 + margin_1.top + 30) + ")")
    .style("text-anchor", "middle")
    .text("number of hours occupied");

  // Build Y scales and axis:
  let y = d3.scaleBand()
    .range([ height_1, 0 ])
    .domain(myVars)
    .padding(0.05);
  plot_1.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  plot_1.append("text")
    .style("font-size", 15)
    .attr("transform", "rotate(-90)")
    .attr("y", 10 - margin_1.left)
    .attr("x", 0 - (height_1 / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("number of unique cars"); 

  // Build color scale
  let myColor = d3.scaleSequential()
    .interpolator(d3.interpolateBuGn)
    .domain([0,15])

    // Three function that change the tooltip when user hover / move / leave a cell
  let mouseover = function(d) {
    d3.selectAll(".time")
      .style("opacity", 0.4)
    d3.selectAll(".nt" + d.number_of_times_occupied + ".uq" + d.number_of_unique_cars)
      .style("opacity", 1)
    d3.select(this)
      .style("opacity", 1)
      .style("stroke", "black")

    window.update_timeslices(d.number_of_times_occupied, d.number_of_unique_cars)
  }
  let mousemove = function(d) {
    div.transition()		
      .duration(100)		
      .style("opacity", .9)
    spot = d.total == 1 ? " spot" : " spots"
    car = d.number_of_unique_cars == 1 ? "car" : "cars"
    hour = d.number_of_times_occupied == 1 ? "hour" : "hours"
    div.html(d.total + "" + spot + " where " + d.number_of_unique_cars + "\n" + car + " parked over " + d.number_of_times_occupied + " " + hour + ".")	
      .style("left", (d3.event.pageX) + "px")		
      .style("top", (d3.event.pageY - 28) + "px")
  }
  let mouseleave = function(d) {
    div.transition()		
      .duration(500)		
      .style("opacity", 0);	
    d3.selectAll(".time")
      .style("opacity", 1)
    d3.select(this)
      .style("opacity", 1)
      .style("stroke", "none")
  }

  function filtered_data(spot_types) {
    return spot_types == null ? data : data.filter(d => {
      spot_types.forEach(e => {
        if (d[e] != 0) { return true; }
      })
      return false;
    })
  }

  // add the squares
  function enter_data(_data) {
    plot_1.selectAll()
    .data(_data, function(d) {return d.number_of_times_occupied+':'+d.number_of_unique_cars;})
    .enter()
    // .filter(d => {
    //   return !((d.number_of_times_occupied == 0 && d.number_of_unique_cars != 0) ||
    //            (d.number_of_times_occupied != 0 && d.number_of_unique_cars == 0))
    // })
    .append("rect")
      .attr("x", function(d) { return x(d.number_of_times_occupied) })
      .attr("y", function(d) { return y(d.number_of_unique_cars) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .attr("class", function(d) { return "nt" + d.number_of_times_occupied + " uq" + d.number_of_unique_cars })
      .attr("fill", function(d) { return myColor(d.total)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mousemove", mousemove)
    .filter(d => d.number_of_times_occupied != 0 && d.number_of_unique_cars != 0)
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave)
  }

  function exit_data(_data) {
    plot_1.selectAll(".rect")
      .remove()
  }

  window.update_heatmap = function(spot_types) {
    let heatmap_data = filtered_data(spot_types);
    
    exit_data(heatmap_data);
    enter_data(heatmap_data);
  };

  window.update_heatmap(null);
})

// set the dimensions and margins of the graph
let margin_2 = {top: 10, right: 30, bottom: 30, left: 60},
    width_2 = 320 - margin_2.left - margin_2.right,
    height_2 = 400 - margin_2.top - margin_2.bottom;

let plot_2 = d3.select("#plot-2-holder")
.append("svg")
  .attr("width", width_2 + margin_2.left + margin_2.right)
  .attr("height", height_2 + margin_2.top + margin_2.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin_2.left + "," + margin_2.top + ")");

d3.csv("https://raw.githubusercontent.com/Northeastern-DS-4200-F19/project-team-12-parking/gh-pages/data/2_survey_data.csv").then(function(data) {
  let TIMES = ["6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm", "9pm"]

  // Add X axis
  plot_2.x_scale = d3.scaleLinear()
    .domain([0, 383])
    .rangeRound([0, width_2]);
  plot_2.x = d3.axisBottom().scale(plot_2.x_scale);
  plot_2.append("g")
    .attr("class", "x")
    .attr("transform", "translate(0," + height_2 + ")")
  .call(plot_2.x);

  // Add Y axis
  plot_2.y = d3.scaleLinear()
    .domain([0, 15])
    .range([height_2, 0]);
  plot_2.append("g")
    .call(d3.axisLeft(plot_2.y).scale(plot_2.y).ticks(TIMES.length)
    .tickFormat(function(i) {
      return TIMES[TIMES.length - i - 1];
    }));

  function filtered_data(_data, times_occupied, unique_cars) {
    return (_data.filter(d => {
      return ((times_occupied == null || times_occupied == d.number_of_times_occupied) &&
                 (unique_cars == null || unique_cars == d.number_of_unique_cars))
    }));
  }

  function enter_data(_data) {
    plot_2.selectAll(".data")
      .data(_data)
      .enter()
        .append("g")
        .attr("class", d => "nt" + d.number_of_times_occupied + " uq" + d.number_of_unique_cars + " data")
      .selectAll("rect")
      .data((d, i) => {
        return TIMES.map((time, index) => {
          return {parked: d[time],
                  x: i,
                  y: index}
          })
        })
      .enter()
        .filter(d => d.parked == 'true')
        .append("rect")
          .attr("x", d => plot_2.x_scale(d.x) + 3)
          .attr("y", d => plot_2.y(d.y) - (plot_2.y(d.y - 1) - plot_2.y(d.y)))
          .attr("width", d => plot_2.x_scale(d.x) - plot_2.x_scale(d.x - 1) - 3)
          .attr("height", d => plot_2.y(d.y - 1) - plot_2.y(d.y))
          .attr("fill", "#469963")
          .attr("opacity", 1)
  }

  function exit_data(_data) {
    plot_2.selectAll(".data")
      .remove()
  }

  function update_axis(_data) {
    plot_2.x_scale.domain([0, Math.max(_data.length, 5)]);
    plot_2.select(".x")
      .transition()
        .call(plot_2.x.tickValues([...Array(_data.length).keys()]));
  }

  window.update_timeslices = function(times_occupied, unique_cars) {
    let time_data = filtered_data(data, times_occupied, unique_cars);
    
    exit_data(time_data);
    update_axis(time_data);
    enter_data(time_data);
  };

  window.update_timeslices(filtered_data(data, null, null));
});


