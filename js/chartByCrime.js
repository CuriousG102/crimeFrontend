

var Graph1 = { 
  /*graph_element: null,
  graph_start: null,
  graph_end: null,
  graph_catID: null, */
  INCREMENT_NUM_HOURS: 24,

  drawGraph: function(data) {
    var GRAPH_WIDTH = 600;
    var currentData = []
    // var currentDay = this.start;
    // console.log(currentDay);

    // iterate through each value
    for (var i = 0; i < data.length; i++) {
      currentData.push(data[i].number);

      // update the date so as to line up with it's value
      // currentDay.setHours(currentDay.getHours() + this.increment);
      // console.log(currentDay);
    };

    var x = d3.scale.linear()
        .domain([0, d3.max(currentData)])
        .range([0, GRAPH_WIDTH]);

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    var selection = d3.select(".graph1")
                      .selectAll("div")
                      .data(currentData);

    selection
      .enter().append("div")
        .style("width", function(d) { return x(d) + "px"; })
        .text(function(d) { return d; });

    selection.style("width", function(d) { return x(d) + "px"; })
      .text(function(d) { return d; });

    selection
      .exit().remove();
    

  },
  /*
  display: function(start, end, catID) {
    this.graph_start = start;
    this.graph_end = end;
    this.graph_catID = catID;
    this.createGraph();
  },
  */
  
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

