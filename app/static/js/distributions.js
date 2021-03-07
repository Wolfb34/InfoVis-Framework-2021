function build(selected_char, selected_artists) {
//if array of artists is given(based on filter) data is filtered on these artists
if (selected_artists.length !== 0) {
  distplot_data = distplot_data.filter(function(element){ return selected_artists.includes( element.artists) ; })
}
//filter data on characteristic
data = distplot_data.filter(function(element){ return element.characteristic === selected_char; })
  console.log(data)
Promise.resolve(data).then(function(data) {

  // add the x Axis
  var x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width])

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "displot_x_axis")
      .call(d3.axisBottom(x));

  // Compute kernel density estimation
  var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(100))
  var density =  kde( data.map(function(d){  return d.value *100; }) )
console.log(density)
  //determine max height for graph
  var max_density = Math.max.apply(Math, density.map(function(o) { return o[1]; }))
// add y axis
  var y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, max_density]);
  svg.append("g")
      .call(d3.axisLeft(y))
      .attr("class", "displot_y_axis");
// add area to fill graph
  var area = d3.area()
    .x(function(d) { return x(d[0]); })
    .y0(height)
    .y1(function(d) { return y(d[1]); });

  // Plot the graph line
  svg.append("path")
      .datum(density)
      .attr("class", "displot_line")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );
      svg.append("path")
       .datum(density)
          .attr("class", "displot_area_fill")
       .attr("d", area);

});


// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}

}

