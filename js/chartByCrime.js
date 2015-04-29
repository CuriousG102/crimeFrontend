var drawGraph = function(data) {

	var currentData = []
	var currentDay = this.start;
	console.log(currentDay);

	// iterate through each value
	for (var i = 0; i < data.length; i++) {
		currentData.push(data[i].number);

		// update the date so as to line up with it's value
		currentDay.setHours(currentDay.getHours() + 24)
		console.log(currentDay);
	};

	var x = d3.scale.linear()
	    .domain([0, d3.max(currentData)])
	    .range([0, 420]);

	var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

	d3.select(".graph1")
	  .selectAll("div")
	    .data(currentData)
	  .enter().append("div")
	    .style("width", function(d) { return d + "px"; })
	    .text(function(d) { return d; });

};

var Graph1 = { 
  graph_element: null,
  graph_start: null,
  graph_end: null,
  graph_catID: null,
  
  display: function(start, end, catID) {
    this.graph_start = start;
    this.graph_end = end;
    this.graph_catID = catID
    this.createGraph();
  },
  
  createGraph: function() {

	reqMaker.crime_count_increment(24, this.graph_start, this.graph_end, null, this.graph_catID, null, drawGraph.bind({start: this.graph_start, end: this.graph_end, increment: 24})); 

  } 
}

$().ready(function () {
    var theGraphObject = Object.create(Graph1);
    missionControl.addClient(theGraphObject.display.bind(theGraphObject));
});

$("#updateButton").click()