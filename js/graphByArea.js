var Graph3 = {
  GRAPH_WIDTH: 600,
  GRAPH_HEIGHT: 500,
  inner_width: null,
  inner_height: null,
  graph3: null,
  yScaler: null,
  xScaler: null,

  setupGraph: function() {
    var margin = {top: 20, right: 30, bottom: 120, left: 60};
    this.inner_width = this.GRAPH_WIDTH - margin.left - margin.right;
    this.inner_height = this.GRAPH_HEIGHT - margin.top - margin.bottom;

    this.graph3 = d3.select(".graph3")
                    .attr("width", this.GRAPH_WIDTH)
                    .attr("height", this.GRAPH_HEIGHT)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  },

  drawGraph: function(start, end, district, data) {

    var currentData = [];
    for (var key in data) {
      if (data.hasOwnProperty(key) && key != "") {
        var districtDelayObject = {
          name: key,
          delay: data[key] / 3600
        };
        currentData.push(districtDelayObject);
      }
    };

    // make y-axis
    this.yScaler = d3.scale.linear()
            .range([this.inner_height, 0])
            .domain([0, d3.max(currentData, function(d) { return d.delay; })]);

    var yAxis = d3.svg.axis()
    .scale(this.yScaler)
    .ticks(9)
    .orient("left");

    // get rid of pre-existing y-axis
    this.graph3.select(".yAxis").remove();

    this.graph3.append("g")
         .attr("class", "yAxis")
         .call(yAxis)
      .append("text")
         .attr("transform", "rotate(-90)")
         .attr("x", -140)
         .attr("y", -100)
         .attr("dy", "4em")
         .style("text-anchor", "end")
         .text("Delay (in hours)");


    // make x-axis
    this.xScaler = d3.scale.ordinal() 
        .rangeRoundBands([0, this.inner_width], .1)
        .domain(currentData.map(function(d) { return d.name; }));

    var xAxis = d3.svg.axis()
    .scale(this.xScaler) 
    .orient("bottom");

    // add bars
    var selection = this.graph3.selectAll(".bar")
                    .data(currentData);

    var selectionEnter = selection
                          .enter();

    // get rid of pre-existing x-axis
    this.graph3.select(".xAxis").remove();

    selectionEnter.append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return this.xScaler(d.name); }.bind(this))
            .attr("y", function(d) { return this.yScaler(d.delay); }.bind(this))
            .attr("height", function(d) { return this.inner_height - this.yScaler(d.delay); }.bind(this))
            .attr("width", this.xScaler.rangeBand());
    this.graph3.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + this.inner_height + ")")
            .call(xAxis)
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });;

    // update bars
    selection
          .attr("class", "bar")
          .attr("x", function(d) { return this.xScaler(d.name); }.bind(this))
          .attr("y", function(d) { return this.yScaler(d.delay); }.bind(this))
          .attr("height", function(d) { return this.inner_height - this.yScaler(d.delay); }.bind(this))
          .attr("width", this.xScaler.rangeBand());

    // clear graph for next set of bars
    selection.exit().remove();

  },
  
  display: function(start, end, catID, district) {

    reqMaker.crime_report_delay(start, end, null, catID, district, 
                                this.drawGraph.bind(this, start, end, district));
  } 
}

$().ready(function () {
    var theGraphObjectArea = Object.create(graph3);
    theGraphObjectArea.setupGraph();
    missionControl.addClient(theGraphObjectArea.display.bind(theGraphObjectArea));
});

