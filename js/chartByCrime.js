var Graph1 = {
  INCREMENT_NUM_HOURS: 24,

  GRAPH_WIDTH: 600,
  GRAPH_HEIGHT: 500,
  inner_width: null,
  inner_height: null,

  setupGraph: function() {
    var margin = {top: 20, right: 30, bottom: 30, left: 55},
        inner_width = this.GRAPH_WIDTH - margin.left - margin.right,
        inner_height = this.GRAPH_HEIGHT - margin.top - margin.bottom;

    var y = d3.scale.linear()
            .range([this.inner_height, 0])
            .domain([0, 400]); // change this

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    var graph = d3.select(".graph1")
                    .attr("width", this.GRAPH_WIDTH)
                    .attr("height", this.GRAPH_HEIGHT)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    return graph;

  },

  drawGraph: function(data) {
    var currentData = [];
    var currentDay = this.start;

    console.log(this.setupGraph);

    // fill currentData with objects with date and count attributes
    // *** doesn't include the first day ***
    for (var i = 0; i < data.length; i++) {
      currentData.push({
                        count: data[i].number,
                        date: currentDay.setHours(currentDay.getHours() + this.increment)
                      });
    };

    console.log(currentData);
 

 // start
 /*
    var margin = {top: 20, right: 30, bottom: 30, left: 55},
                  width = GRAPH_WIDTH - margin.left - margin.right,
                  height = GRAPH_HEIGHT - margin.top - margin.bottom;

    var x = d3.scale.ordinal() // don't include
            .rangeRoundBands([0, width], .1)
            .domain(currentData.map(function(d) { return d.date; }));

    var y = d3.scale.linear()
            .range([height, 0])
            .domain([0, d3.max(currentData, function(d) { return d.count; })]);

    var xAxis = d3.svg.axis()
    .scale(x) // don't include
    .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    var graph1 = d3.select(".graph1")

                    .attr("width", GRAPH_WIDTH)
                    .attr("height", GRAPH_HEIGHT)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    */
    // end



    var x = d3.scale.ordinal() 
            .rangeRoundBands([0, this.inner_width], .1)
            .domain(currentData.map(function(d) { return d.date; }));

    var xAxis = d3.svg.axis()
    .scale(x) 
    .orient("bottom");

    // add axes
    graph1.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + this.inner_height + ")")
             .call(xAxis);

    graph1.append("g")
             .attr("class", "y axis")
             .call(yAxis)
          .append("text")
             .attr("transform", "rotate(-90)")
             .attr("x", -(this.GRAPH_HEIGHT / 2))
             .attr("y", -80)
             .attr("dy", "4em")
             .style("text-anchor", "end")
             .text("Count");

    // add bars
    // update selection
    var selection = graph1.selectAll(".bar")
                    .data(currentData)

    selection
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.date); })
          .attr("y", function(d) { return y(d.count); })
          .attr("height", function(d) { return this.inner_height - y(d.count); })
          .attr("width", x.rangeBand());

    // update bars
    selection.selectAll(".bar")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.date); })
          .attr("y", function(d) { return y(d.count); })
          .attr("height", function(d) { return this.inner_height - y(d.count); })
          .attr("width", x.rangeBand());

    // clear graph for next set of bars
    selection.exit().remove();
    

  },
  
  display: function(start, end, catID) {

    reqMaker.crime_count_increment(24, start, 
                                   end, null, catID, 
                                   null, 
                                   this.drawGraph.bind({start: start, 
                                                        end: end, 
                                                        increment: this.INCREMENT_NUM_HOURS})); 
  } 
}

$().ready(function () {
    var theGraphObject = Object.create(Graph1);
    theGraphObject.setupGraph();
    missionControl.addClient(theGraphObject.display.bind(theGraphObject));
});

