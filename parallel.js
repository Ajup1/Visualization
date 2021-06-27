// shim layer with setTimeout fallback
window.requestAnimFrame = window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function( callback ){
    window.setTimeout(callback, 1000 / 60);
};
d3.select("#hide-ticks").on("click", hideTicks);
d3.select("#show-ticks").on("click", showTicks);
d3.select("#hide-brush").on("click", hideBrush);
d3.select("#show-brush").on("click", showBrush);

function hideTicks() {
    d3.selectAll(".axis g").style("display", "none");
    d3.selectAll(".axis path").style("display", "none");
};

function showTicks() {
    d3.selectAll(".axis g").style("display", null);
    d3.selectAll(".axis path").style("display", null);
};

function hideBrush() {
    d3.selectAll(".background").style("visibility", "hidden");
};

function showBrush() {
    d3.selectAll(".background").style("visibility", null);
};

d3.select("#dark-theme")
    .on("click", function() {
    d3.select("body").attr("class", "dark");
});

d3.select("#light-theme")
    .on("click", function() {
    d3.select("body").attr("class", null);
});

var render_speed = 50;

var width = document.body.clientWidth,
    height = d3.max([document.body.clientHeight-500, 240]);

var m = [40, 0, 10, 0],
    w = width - m[1] - m[3],
    h = height - m[0] - m[2];

var xscale = d3.scale.ordinal().rangePoints([0, w], 1),
    yscale = {},
    dragging = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left").ticks(1+height/50),
    foreground,
    dimensions,
    n_dimensions,
    brush_count = 0;

var colors = {
    "Dairy and Egg Products": [28,100,52],
    "Spices and Herbs": [214,55,79],
    "Baby Foods": [185,56,73],
    "Fats and Oils": [30,100,73],
    "Poultry Products": [359,69,49],
    "Soups, Sauces, and Gravies": [110,57,70],
    "Vegetables and Vegetable Products": [120,56,40],
    "Sausages and Luncheon Meats": [1,100,79],
    "Breakfast Cereals": [271,39,57],
    "Fruits and Fruit Juices": [274,30,76],
    "Nut and Seed Products": [10,30,42],
    "Beverages": [10,28,67],
    "Finfish and Shellfish Products": [318,65,67],
    "Legumes and Legume Products": [334,80,84],
    "Baked Products": [37,50,75],
    "Sweets": [339,60,75],
    "Cereal Grains and Pasta": [56,58,73],
    "Pork Products": [339,60,49],
    "Beef Products": [325,50,39],
    "Lamb, Veal, and Game Products": [20,49,49],
    "Fast Foods": [60,86,61],
    "Meals, Entrees, and Sidedishes": [185,80,45],
    "Snacks": [189,57,75],
    "Ethnic Foods": [41,75,61],
    "Restaurant Foods": [204,70,41]
};

var legend = d3.select("#legend")
    .selectAll(".row")
    .data(d3.keys(colors).sort())
    .enter().append("div")
    .attr("class", "row");

legend
    .append("span")
    .text(function(d,i) { return d});

legend
    .append("span")
    .style("background", function(d,i) { return color(d,0.85)})
.attr("class", "color-block");

d3.select("#chart")
    .style("height", (h + m[0] + m[2]) + "px")

d3.selectAll("canvas")
    .attr("width", w)
    .attr("height", h)
    .style("padding", m.join("px ") + "px");

foreground = document.getElementById('foreground').getContext('2d');

foreground.strokeStyle = "rgba(0,100,160,0.1)";
foreground.lineWidth = 1.5;    // avoid weird subpixel effects

foreground.fillText("Loading...",w/2,h/2);

var svg = d3.select("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

d3.csv("nutrients.csv", function(data) {
// Convert quantitative scales to floats
data = data.map(function(d) {
    for (var k in d) {
    if (k != "name" && k != "group" && k != "id")
d[k] = parseFloat(d[k]) || 0;
};
return d;
});

// Extract the list of dimensions and create a scale for each.
xscale.domain(dimensions = d3.keys(data[0]).filter(function(d) {
    return d != "name" && d != "group" && d != "id" &&(yscale[d] = d3.scale.linear()
        .domain(d3.extent(data, function(p) { return +p[d]; }))
.range([h, 0]));
}).sort());

n_dimensions = dimensions.length;

// Render full foreground
paths(data, foreground, brush_count);

// Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
    .data(dimensions)
    .enter().append("svg:g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return "translate(" + xscale(d) + ")"; })
.call(d3.behavior.drag()
    .on("dragstart", function(d) {
    dragging[d] = this.__origin__ = xscale(d);
    this.__dragged__ = false;
})
.on("drag", function(d) {
    dragging[d] = Math.min(w, Math.max(0, this.__origin__ += d3.event.dx));
    dimensions.sort(function(a, b) { return position(a) - position(b); });
xscale.domain(dimensions);
g.attr("transform", function(d) { return "translate(" + position(d) + ")"; });
brush_count++;
this.__dragged__ = true;
})
.on("dragend", function(d) {
    if (!this.__dragged__) {
// save extent before inverting
if (!yscale[d].brush.empty()) {
    var extent = yscale[d].brush.extent();
}

// no movement, invert axis
if (yscale[d].inverted == true) {
    yscale[d].range([h, 0]);
    d3.selectAll('.label')
        .filter(function() { return d3.select(this).text() == d; })
.style("text-decoration", null);
yscale[d].inverted = false;
} else {
    yscale[d].range([0, h]);
    d3.selectAll('.label')
        .filter(function() { return d3.select(this).text() == d; })
.style("text-decoration", "underline");
yscale[d].inverted = true;
}

updateTicks(d, extent);
} else {
// rorder axes
d3.select(this).transition().attr("transform", "translate(" + xscale(d) + ")");
}
brush();
delete this.__dragged__;
delete this.__origin__;
delete dragging[d];
}))

// Add and store a brush for each axis.
g.append("svg:g")
    .attr("class", "brush")
    .each(function(d) { d3.select(this).call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush)); })
.selectAll("rect")
    .style("visibility", null)
    .attr("x", -15)
    .attr("width", 30)
    .attr("rx", 0)
    .attr("ry", 0);

// Add an axis and title.
g.append("svg:g")
    .attr("class", "axis")
    .attr("transform", "translate(10,0)")
    .each(function(d) { d3.select(this).call(axis.scale(yscale[d])); })
.append("svg:text")
    .attr("text-anchor", "middle")
    .attr("y", -16)
    .attr("x", -12)
    .attr("class", "label")
    .text(String);

// Handles a brush event, toggling the display of foreground lines.
    function brush() {
    brush_count++;
    var actives = dimensions.filter(function(p) { return !yscale[p].brush.empty(); }),
extents = actives.map(function(p) { return yscale[p].brush.extent(); });

// hack to hide ticks beyond extent
var b = d3.selectAll('.dimension')[0]
    .forEach(function(element, i) {
    var dimension = d3.select(element).data()[0];
    if (_.include(actives, dimension)) {
    var extent = extents[actives.indexOf(dimension)];
    d3.select(element)
        .selectAll('text')
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .style('display', function() {
    var value = d3.select(this).text();
    return extent[0] <= value && value <= extent[1] ? null : "none"
});
} else {
    d3.select(element)
        .selectAll('text')
        .style('font-weight', null)
        .style('font-size', null)
        .style('display', null);
}
d3.select(element)
    .selectAll('.label')
    .style('display', null);
});
;

// bold dimensions with label
d3.selectAll('.label')
    .style("font-weight", function() {
    var dimension = d3.select(this).text();
    if (_.include(actives, dimension)) return "bold";
return null;
});

// Get lines within extents
var selected = [];
data.map(function(d) {
    return actives.every(function(p, dimension) {
    return extents[dimension][0] <= d[p] && d[p] <= extents[dimension][1];
}) ? selected.push(d) : null;
});

// Render selected lines
paths(selected, foreground, brush_count);
}

function actives() {
    var actives = dimensions.filter(function(p) { return !yscale[p].brush.empty(); }),
extents = actives.map(function(p) { return yscale[p].brush.extent(); });

// Get lines within extents
var selected = [];
data.map(function(d) {
    return actives.every(function(p, i) {
    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
}) ? selected.push(d) : null;
});

return selected;
};

window.onresize = function() {
    width = document.body.clientWidth,
    height = d3.max([document.body.clientHeight-500, 220]);

    w = width - m[1] - m[3],
    h = height - m[0] - m[2];

    d3.select("#chart")
        .style("height", (h + m[0] + m[2]) + "px")

    d3.selectAll("canvas")
        .attr("width", w)
        .attr("height", h)
        .style("padding", m.join("px ") + "px");

    d3.select("svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .select("g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    xscale = d3.scale.ordinal().rangePoints([0, w], 1).domain(dimensions);
    dimensions.forEach(function(d) {
    yscale[d].range([h, 0]);
});

d3.selectAll(".dimension")
    .attr("transform", function(d) { return "translate(" + xscale(d) + ")"; })
// update brush placement
d3.selectAll(".brush")
    .each(function(d) { d3.select(this).call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush)); })
brush_count++;

// update axis placement
axis = axis.ticks(1+height/50),
    d3.selectAll(".axis")
        .each(function(d) { d3.select(this).call(axis.scale(yscale[d])); });

// render data
brush();
};

// Remove all but selected from the dataset
d3.select("#keep-data")
    .on("click", function() {
    new_data = actives();
    if (new_data.length == 0) {
    alert("I don't mean to be rude, but I can't let you remove all the data.\n\nTry removing some brushes to get your data back. Then click 'Keep' when you've selected data you want to look closer at.");
return false;
}
data = new_data;
rescale();
});

// Exclude selected from the dataset
d3.select("#exclude-data")
    .on("click", function() {
    new_data = _.difference(data, actives());
    if (new_data.length == 0) {
    alert("I don't mean to be rude, but I can't let you remove all the data.\n\nTry selecting just a few data points then clicking 'Exclude'.");
return false;
}
data = new_data;
rescale();
});

// Rescale to new dataset domain
function rescale() {
// reset yscales, preserving inverted state
dimensions.forEach(function(d,i) {
    if (yscale[d].inverted) {
    yscale[d] = d3.scale.linear()
        .domain(d3.extent(data, function(p) { return +p[d]; }))
.range([0, h]);
yscale[d].inverted = true;
} else {
    yscale[d] = d3.scale.linear()
        .domain(d3.extent(data, function(p) { return +p[d]; }))
.range([h, 0]);
}
});

updateTicks();

// Render selected data
paths(data, foreground, brush_count);
};

function updateTicks(d, extent) {
// update brushes
if (d) {
    var brush_el = d3.selectAll(".brush")
        .filter(function(key) { return key == d; });
// single tick
if (extent) {
// restore previous extent
brush_el.call(yscale[d].brush = d3.svg.brush().y(yscale[d]).extent(extent).on("brush", brush));
} else {
    brush_el.call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush));
}
} else {
// all ticks
d3.selectAll(".brush")
    .each(function(d) { d3.select(this).call(yscale[d].brush = d3.svg.brush().y(yscale[d]).on("brush", brush)); })
}

brush_count++;

showTicks();

// update axes
d3.selectAll(".axis")
    .each(function(d,i) {
    d3.select(this)
        .transition()
        .duration(720)
        .call(axis.scale(yscale[d]));

// clear active extent state
d3.select(this)
    .selectAll('text')
    .style('font-weight', null)
    .style('font-size', null)
    .style('display', null);
});
};

function paths(selected, ctx, count) {
    var n = selected.length,
    i = 0,
    opacity = d3.min([2/Math.pow(n,0.33),1]),
    timer = (new Date()).getTime();           // use for optimization

d3.select("#data-count").text(data.length);
d3.select("#selected-count").text(n);
d3.select("#selected-bar").style("width", (100*n/data.length) + "%");
d3.select("#opacity").text((""+(opacity*100)).slice(0,4) + "%");

shuffled_data = _.shuffle(selected);

// data table, sorted by first column
var foodText = "";
shuffled_data.slice(0,25).sort(function(a,b) {
    var col = d3.keys(a)[0];
    return a[col] < b[col] ? -1 : 1;
})
.forEach(function(d) {
    foodText += "<span class='color-block' style='background:" + color(d.group,0.85) + "'></span>" + d.name + "<br/>";
});
d3.select("#food-list").html(foodText);

ctx.clearRect(0,0,w+1,h+1);
function render() {
    var max = d3.min([i+render_speed, n]);
    shuffled_data.slice(i,max).forEach(function(d) {
    path(d, foreground, color(d.group,opacity));
});
i = max;
d3.select("#rendered-count").text(i);
d3.select("#rendered-bar").style("width", (100*i/n) + "%");
d3.select("#render-speed").text(render_speed);

// rendering speed optimization
var delta = (new Date()).getTime() - timer;
render_speed = Math.max(Math.ceil(render_speed * 33 / delta), 8);
render_speed = Math.min(render_speed, 200);

timer = (new Date()).getTime();
};

// render all lines until finished or a new brush event
(function animloop(){
    if (i >= n || count < brush_count) return;
requestAnimFrame(animloop);
render();
})();
};
});


function path(d, ctx, color) {
    if (color) ctx.strokeStyle = color;
    var x = xscale(0)-15;
    y = yscale[dimensions[0]](d[dimensions[0]]);   // left edge
ctx.beginPath();
ctx.moveTo(x,y);
dimensions.map(function(p,i) {
    x = xscale(p),
    y = yscale[p](d[p]);
    ctx.lineTo(x, y);
});
ctx.lineTo(x+15, y);                               // right edge
ctx.stroke();
};

function color(d,a) {
    var c = colors[d];
    return ["hsla(",c[0],",",c[1],"%,",c[2],"%,",a,")"].join("");
};

function position(d) {
    var v = dragging[d];
    return v == null ? xscale(d) : v;
}