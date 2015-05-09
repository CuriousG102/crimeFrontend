var Graph1 = {
  INCREMENT_NUM_HOURS: 24,

  RATIO: 5/6,
  graph1: null,
  MARGIN: {top: 20, right: 30, bottom: 120, left: 60},

  getWidthsAndHeights: function() {
    var width = parseInt(d3.select("#graph1Container").style("width"));
    var height = this.RATIO * width;
    var inner_width = width - this.MARGIN.left - this.MARGIN.right;
    var inner_height = height - this.MARGIN.top - this.MARGIN.bottom;
    return {width: width,
            height: height,
            inner_height: inner_height,
            inner_width: inner_width};
  },

  setupGraph: function() {
    var wAndH = this.getWidthsAndHeights();    

    this.graph1 = d3.select("#graph1")
                    .attr("width", wAndH.width)
                    .attr("height", wAndH.height)
                  .append("g")
                    .attr("transform", 
                          "translate(" + this.MARGIN.left 
                            + "," + this.MARGIN.top + ")");

  },

  drawGraph: function(start, end, increment, data) {
    var wAndH = this.getWidthsAndHeights();
    var inner_width = wAndH.inner_width;
    var inner_height = wAndH.inner_height;

    var width = parseInt(d3.select("#graph2Container").style("width"), 10);

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

    // make y-axis
    var yScaler = d3.scale.linear()
            .range([inner_height, 0])
            .domain([0, d3.max(data, function(d) { return d.number; })]);

    var yAxis = d3.svg.axis()
    .scale(yScaler)
    .ticks(11)
    .orient("left");

    // if the max value is 8, set ticks so there are no decimals
    if (d3.max(currentData, function(d) { return d.count; }) <= 9) {
     yScaler = d3.scale.linear()
              .range([inner_height, 0])
              .domain([0, 9]);

      var yAxis = d3.svg.axis()
      .scale(yScaler)
      .tickValues([0,1,2,3,4,5,6,7,8,9])
      .orient("left");
    };

    // get rid of pre-existing y-axis
    this.graph1.select(".yAxis").remove();

    this.graph1.append("g")
         .attr("class", "yAxis")
         .call(yAxis)
      .append("text")
         .attr("transform", "rotate(-90)")
         .attr("x", -180)
         .attr("y", -100)
         .attr("dy", "4em")
         .style("text-anchor", "end")
         .text("Count");

    // make x-axis
    var xScaler = d3.scale.ordinal() 
        .rangeRoundBands([0, inner_width], .1)
        .domain(currentData.map(function(d) { return d.date; }));

    var xAxis = d3.svg.axis()
    .scale(xScaler) 
    .tickFormat(function (d) {
      var months = ["Jan", "Feb", "March", "April", "May", "June", "July",
                    "Aug", "Sep", "Oct", "Nov", "Dec"];
      var date = new Date(d); 
      return [months[date.getMonth()],
                     date.getDate() + ",",
                     date.getFullYear()].join(" ");})
    .orient("bottom");

    // add bars
    var selection = this.graph1.selectAll(".bar")
                    .data(currentData);

    var selectionEnter = selection
                          .enter();

    // get rid of pre-existing x-axis
    this.graph1.select(".xAxis").remove();

    selectionEnter.append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return this.xScaler(d.date); }.bind({xScaler:xScaler}))
            .attr("y", function(d) { return this.yScaler(d.count); }.bind({yScaler:yScaler}))
            .attr("height", function(d) { return this.inner_height - this.yScaler(d.count); }.bind({inner_height:inner_height,
                                                                                                  yScaler:yScaler}))
            .attr("width", xScaler.rangeBand());
    this.graph1.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + inner_height + ")")
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
          .attr("x", function(d) { return this.xScaler(d.date); }.bind({xScaler:xScaler}))
          .attr("y", function(d) { return this.yScaler(d.count); }.bind({yScaler:yScaler}))
          .attr("height", function(d) { return this.inner_height - this.yScaler(d.count); }.bind({inner_height:inner_height,
                                                                                                  yScaler:yScaler}))
          .attr("width", xScaler.rangeBand());

    // clear graph for next set of bars
    selection.exit().remove();

  },
  
  display: function(start, end, catID) {

    reqMaker.crime_count_increment(this.INCREMENT_NUM_HOURS, start, 
                                   end, null, catID, null, 
                                   this.drawGraph.bind(this, start, end, this.INCREMENT_NUM_HOURS));
  },

  resize: function() {
    var width = parseInt(d3.select("#graph1Container").style("width"));
    var height = this.RATIO * width;
    var inner_width = width - this.MARGIN.left - this.MARGIN.right;
    var inner_height = height - this.MARGIN.top - this.MARGIN.bottom;

    xScaler.range([0, width]);
    d3.select(this.graph1.node().parentNode)
        .style("height", (y.rangeExtent()[1] + this.MARGIN.top + this.MARGIN.bottom) + 'px')
        .style('width', (width + this.MARGIN.left + this.MARGIN.right) + 'px');

    graph1.selectAll('rect')
          .attr('width', width);

    graph1.select('.x.axis.bottom').call(xAxis.orient('bottom'));     
  }
}

$().ready(function () {
    var theGraphObjectTime = Object.create(Graph1);
    theGraphObjectTime.setupGraph();
    missionControl.addClient(theGraphObjectTime.display.bind(theGraphObjectTime));
    d3.select(window).on('resize', theGraphObjectTime.resize.bind(theGraphObjectTime));
});
