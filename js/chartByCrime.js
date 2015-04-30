var Graph1 = {
  INCREMENT_NUM_HOURS: 24,

  drawGraph: function(data) {
    var GRAPH_WIDTH = 600;
    var GRAPH_HEIGHT = 500;
    var currentData = []
    var currentDay = this.start;

    // fill currentData with objects with date and count attributes
    for (var i = 0; i < data.length; i++) {
      currentDay.setHours(currentDay.getHours() + this.increment);
      currentData.push({
                        count: data[i].number,
                        date: currentDay
                      });
    };

    console.log(currentData);

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
                  width = GRAPH_WIDTH - margin.left - margin.right,
                  height = GRAPH_HEIGHT - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1)
            .domain(currentData.map(function(d) { return d.date; }));

    var y = d3.scale.linear()
            .range([height, 0])
            .domain([0, d3.max(currentData, function(d) { return d.count; })]);

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    var selection = d3.select(".graph1")
                    .attr("width", GRAPH_WIDTH)
                    .attr("height", GRAPH_HEIGHT)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add and turn axes
    selection.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + height + ")")
             .call(xAxis);

    selection.append("g")
             .attr("class", "y axis")
             .call(yAxis);

   /* selection = d3.select(".graph1")
                      .selectAll("div")
                      .data(currentData); */

    // uhh cant remember
    var bar = selection.selectAll("g")
              .data(currentData)
            .enter().append("g")
              .attr("transform", function(d) { return "translate(" + x(d.date) + ",0)"; });

    // add bars
    selection.selectAll(".bar")
             .data(currentData)
          .enter().append("rect")
             .attr("class", "bar")
             .attr("x", function(d) { return x(d.date); })
             .attr("y", function(d) { return y(d.count); })
             .attr("height", function (d) { return height - y(d.count); })
             .attr("width", x.rangeBand());

    selection
             .data(currentData)
             .attr("class", "bar")
             .attr("x", function(d) { return x(d.date); })
             .attr("y", function(d) { return y(d.count); })
             .attr("height", function (d) { return height - y(d.count); })
             .attr("width", x.rangeBand());

    // clear graph for next set of bars
    selection
      .exit().remove();
    

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
    missionControl.addClient(theGraphObject.display.bind(theGraphObject));
});

