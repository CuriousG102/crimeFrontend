$().ready(function () {
	var data = 30;

	var x = d3.scale.linear()
	    .domain([0, data])
	    .range([0, 420]);

	d3.select(".graph1")
	  .selectAll("div")
	    .data(data)
	  .enter().append("div")
	    .style("width", function(d) { return x(d) + "px"; })
	    .text(function(d) { return d; });
});