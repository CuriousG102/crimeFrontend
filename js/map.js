var CrimeMap = {
    WIDTH: 700,
    HEIGHT: 600,
    DEFAULT_COLOR: "#B0B0B0",
    BORDER_COLORS: "#4262C2",
    draw: function() {
        var svg = d3.select("#map").append("svg")
                .attr("width", this.WIDTH)
                .attr("height", this.HEIGHT);

        /*var projection = d3.geo.mercator()
            .center([97.73, 30.27])
            .scale(10000)
            .translate([self.WIDTH/2, self.HEIGHT/2]);*/

        /*var path = d3.geo.path()
            .projection(projection);*/

        /*
        d3.json("js/apd_census_tracts_pared.topojson", function(error, tracts_map) {
            if (error) return console.error(error);

            var tracts = tracts_map.objects.apd_census_tracts_pared;
            var geojson = topojson.feature(tracts_map, tracts);
            var center = d3.geo.centroid(geojson);
            var scale = 150;
            var offset = [this.WIDTH/2, this.HEIGHT/2];
            var projection = d3.geo.mercator().scale(scale).center(center)
                .translate(offset);

            var path = d3.geo.path().projection(projection);


            var bounds  = path.bounds(geojson);
            var hscale  = scale*this.WIDTH  / (bounds[1][0] - bounds[0][0]);
            var vscale  = scale*this.HEIGHT / (bounds[1][1] - bounds[0][1]);
            var scale   = (hscale < vscale) ? hscale : vscale;
            var offset  = [this.WIDTH - (bounds[0][0] + bounds[1][0])/2,
                           this.HEIGHT - (bounds[0][1] + bounds[1][1])/2];

            projection = d3.geo.mercator().center(center)
                .scale(scale).translate(offset);
            path = path.projection(projection);

            svg.append("rect").attr('width', this.WIDTH).attr('height', this.HEIGHT)
                .style('stroke', 'black').style('fill', 'none');

            svg.selectAll(".area")
                .data(geojson.features)
              .enter().append("path")
                .attr("id", function(d){ return "tract " + d.id; })
                .attr("d", path)
                .style("fill", this.DEFAULT_COLOR)
                .style("stroke-width", "1")
                .style("stroke", this.BORDER_COLORS);


        }.bind(this));
*/

        d3.json("js/apd_areas_sample.topojson", function(error, areas_map) {
            if (error) return console.error(error);

            var areas = areas_map.objects.apd_areas_sample;
            var geojson = topojson.feature(areas_map, areas);
            var center = d3.geo.centroid(geojson);
            var scale = 150;
            var offset = [this.WIDTH/2, this.HEIGHT/2];
            var projection = d3.geo.mercator().scale(scale).center(center)
                .translate(offset);

            var path = d3.geo.path().projection(projection);


            var bounds  = path.bounds(geojson);
            var hscale  = scale*this.WIDTH  / (bounds[1][0] - bounds[0][0]);
            var vscale  = scale*this.HEIGHT / (bounds[1][1] - bounds[0][1]);
            var scale   = (hscale < vscale) ? hscale : vscale;
            var offset  = [this.WIDTH - (bounds[0][0] + bounds[1][0])/2,
                           this.HEIGHT - (bounds[0][1] + bounds[1][1])/2];

            projection = d3.geo.mercator().center(center)
                .scale(scale).translate(offset);
            path = path.projection(projection);

            svg.append("rect").attr('width', this.WIDTH).attr('height', this.HEIGHT)
                .style('stroke', 'black').style('fill', 'none');

            svg.selectAll(".area")
                .data(geojson.features)
              .enter().append("path")
                .attr("id", function(d){ return "area " + d.id; })
                .attr("d", path)
                .style("fill", this.DEFAULT_COLOR)
                .style("stroke-width", "1")
                .style("stroke", this.BORDER_COLORS);


        }.bind(this));
    }
}

$().ready(function () {
    var crimeMap = Object.create(CrimeMap);
    crimeMap.draw(); 
});