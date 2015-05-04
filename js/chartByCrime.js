var Graph1 = {
  INCREMENT_NUM_HOURS: 24,

  GRAPH_WIDTH: 600,
  GRAPH_HEIGHT: 500,
  inner_width: null,
  inner_height: null,
  graph1: null,
  yScaler: null,
  xScaler: null,

  setupGraph: function() {
    var margin = {top: 20, right: 30, bottom: 120, left: 55};
    this.inner_width = this.GRAPH_WIDTH - margin.left - margin.right;
    this.inner_height = this.GRAPH_HEIGHT - margin.top - margin.bottom;

    this.yScaler = d3.scale.linear()
            .range([this.inner_height, 0])
            .domain([0, 500]);

    var yAxis = d3.svg.axis()
    .scale(this.yScaler)
    .ticks(9)
    .orient("left");

    this.graph1 = d3.select(".graph1")
                    .attr("width", this.GRAPH_WIDTH)
                    .attr("height", this.GRAPH_HEIGHT)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    this.graph1.append("g")
             .attr("class", "yAxis")
             .call(yAxis)
          .append("text")
             .attr("transform", "rotate(-90)")
             .attr("x", -(this.GRAPH_HEIGHT / 2))
             .attr("y", -80)
             .attr("dy", "4em")
             .style("text-anchor", "end")
             .text("Count");

  },

  drawGraph: function(start, end, increment, data) {
    var currentData = [];
    var currentDay = start;

    // fill currentData with objects with date and count attributes
    // *** doesn't include the first day ***
    for (var i = 0; i < data.length; i++) {
      currentData.push({
                        count: data[i].number,
                        date: currentDay.setHours(currentDay.getHours() + increment)
                      });
    };

    // this.yScaler = this.yScaler
    //                     .domain(0, 500);

    this.xScaler = d3.scale.ordinal() 
        .rangeRoundBands([0, this.inner_width], .1)
        .domain(currentData.map(function(d) { return d.date; }));

    var xAxis = d3.svg.axis()
    .scale(this.xScaler) 
    .tickFormat(function (d) {
      var months = ["Jan", "Feb", "March", "April", "May", "June", "July",
                    "Aug", "Sep", "Oct", "Nov", "Dec"];
      var date = new Date(d); 
      return [months[date.getMonth()],
                     date.getDate() + ",",
                     date.getFullYear()].join(" ");})
    .orient("bottom");

    console.log(currentData);

    // add bars
    var selection = this.graph1.selectAll(".bar")
                    .data(currentData);

    var selectionEnter = selection
                          .enter();

    this.graph1.select(".xAxis").remove();

    selectionEnter.append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return this.xScaler(d.date); }.bind(this))
            .attr("y", function(d) { return this.yScaler(d.count); }.bind(this))
            .attr("height", function(d) { return this.inner_height - this.yScaler(d.count); }.bind(this))
            .attr("width", this.xScaler.rangeBand());
    this.graph1.append("g")
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
          .attr("x", function(d) { return this.xScaler(d.date); }.bind(this))
          .attr("y", function(d) { return this.yScaler(d.count); }.bind(this))
          .attr("height", function(d) { return this.inner_height - this.yScaler(d.count); }.bind(this))
          .attr("width", this.xScaler.rangeBand());

    // clear graph for next set of bars
    selection.exit().remove();

  },
  
  display: function(start, end, catID) {

    reqMaker.crime_count_increment(this.INCREMENT_NUM_HOURS, start, 
                                   end, null, catID, 
                                   null, 
                                   this.drawGraph.bind(this, start, end, this.INCREMENT_NUM_HOURS));
  } 
}

$().ready(function () {
    var theGraphObject = Object.create(Graph1);
    theGraphObject.setupGraph();
    missionControl.addClient(theGraphObject.display.bind(theGraphObject));
});

