(function() {
var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  console.log("made it after __indexOf ");
	jQuery(function() {
    var arc, color, cr, cs, donut, h, hash, pb, pl, pr, pt, r, w, year, _ref;
    year = 2011;
    _ref = [35, 20, 20, 20], pt = _ref[0], pl = _ref[1], pb = _ref[2], pr = _ref[3];
    w = (900 - (pl + pr)) / 2;
    h = w;
    r = (w - (pt * 2)) / 2;
    cs = 0.65;
    cr = r * cs;
    color = d3.scale.ordinal().range(['#ff5200', '#ff8f00', '#ffc200', '#fff500', '#beea00', '#1dd100', '#00ccca', '#0062cc', '#0b00cc', '#7400cc', '#d40097', '#f50010', '#ff5200']);
    arc = d3.svg.arc().innerRadius(r * .8).outerRadius(r);
    donut = d3.layout.pie().sort(d3.descending).value(function(d) {
      return d.count;
    });
  	console.log("after initial definitions ");
    return d3.json("/static/testdata/top-neighborhoods-2011.json", function(json) {
      var arcs, bars, containers, data, lbls, line, vis, x, x2, yscale, yscalefor, _ref2;
      data = json;
      
	containers = d3.select('#vis').selectAll('.offense').data(data).enter().append('div').attr('class', 'offense');
      	vis = containers.append('svg:svg').attr('width', w).attr('height', h).append('svg:g').attr('transform', "translate(" + pt + "," + pt + ")");
  	console.log(" vis defined ");
      
	vis.append('svg:text').attr('class', 'ttl').text(function(d) {
        return d[0];
      }).attr('dy', '-20px').attr('transform', "translate(" + ((w - (pl + pr)) / 2) + ")").attr('text-anchor', 'middle').attr('class', 'lbl');
      arcs = vis.selectAll('.type').data(function(d) {
        return donut(d[1].nhoods.filter(function(v) {
          return v.count > 0;
        }));
      }).enter().append('svg:g').attr('class', 'type').attr('transform', "translate(" + r + "," + r + ")").on('mouseover', function(d) {
        var e;
  	console.log(" in mousover function ");
        d3.select(this).attr('class', 'type on');
        e = d3.select(this.ownerSVGElement);
        e.select('.clbl').text(d.data.name);
        return e.select('.num').text(d.data.count);
      }).on('mouseout', function(d) {
        var e;
        d3.select(this).attr('class', 'type');
        e = d3.select(this.ownerSVGElement);
        e.select('.clbl').text('total');
        return e.select('.num').text(function(d) {
          return d3.sum(d[1].nhoods, function(nh) {
            return nh.count;
          });
        });
      });
      arcs.append('svg:path').attr('d', function(d) {
        return arc(d);
      }).style('fill', function(d, i) {
        return d3.rgb(color(i)).darker(1);
      });
      arcs.append('svg:text').attr('transform', function(d) {
        return "translate(" + (arc.centroid(d)) + ")";
      }).attr('text-anchor', 'middle').attr('dy', '.35em').attr('fill', '#fff').text(function(d) {
        return d.value;
      });
      lbls = vis.append('svg:g').attr('transform', "translate(" + ((w - (pt * 2)) / 2) + ", " + ((h - (pt * 2)) / 2) + ")");
      lbls.append('svg:text').attr('dy', -5).attr('text-anchor', 'middle').attr('class', 'num').text(function(d) {
        return d3.sum(d[1].nhoods, function(nh) {
          return nh.count;
        });
      });
      lbls.append('svg:text').attr('dy', 10).attr('text-anchor', 'middle').attr('class', 'clbl').text('total');
      vis.append('svg:circle').attr('cx', (w - (pt * 2)) / 2).attr('cy', (h - (pt * 2)) / 2).attr('r', r * 0.65).attr('class', 'ic');
      arcs.append('svg:text').attr('transform', function(d, i) {
        var ang;
        ang = ((d.startAngle + d.endAngle) / 2) * 180 / Math.PI;
        return "translate(" + (arc.centroid(d)) + ") rotate(" + ang + ")";
      }).attr('dy', 35).attr('fill', '#333').attr('text-anchor', 'middle').attr('class', 'nhlbl').text(function(d) {
        return d.data.name.slice(0, 2).toLowerCase();
      });
      _ref2 = [30, 20, 20, 60], pt = _ref2[0], pl = _ref2[1], pr = _ref2[2], pb = _ref2[3];
      w = w - (pl + pr);
      h = 150 - (pt + pb);
      yscale = function(data) {
        return d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);
      };
      yscalefor = function(e) {
        var hours;
        hours = e.parentNode.parentNode.__data__[1].hours.map(function(h) {
          return h.count;
        });
        return yscale(hours);
      };
      x = d3.scale.ordinal().domain(d3.range(24)).rangeRoundBands([0, w], .2);
      x2 = d3.scale.linear().domain([0, 23]).range([0, w]);
      line = d3.svg.line().x(function(d, i) {
        return x2(i);
      }).y(function(d) {
        return yscalefor(this)(d);
      }).interpolate('monotone');
      vis = containers.append('svg:svg').attr('width', w + pr + pl).attr('height', h + pt + pb).append('svg:g').attr('transform', "translate(" + pl + "," + pt + ")");
      vis.append('svg:text').text('Time of Day').attr('transform', "translate(" + (w / 2) + "," + (h + 30) + ")").attr('text-anchor', 'middle');
      vis.append('svg:line').attr('y1', h).attr('y2', h).attr('x1', 0).attr('x2', w).attr('class', 'ytick');
      bars = vis.selectAll('g.bar').data(function(d) {
        return d[1].hours.map(function(h) {
          return h.count;
        });
      }).enter().append('svg:g').attr('transform', function(d, i) {
        return "translate(" + (x(i)) + ",0)";
      });
      bars.append('svg:rect').attr('width', x.rangeBand()).attr('height', function(d) {
        return h - yscalefor(this)(d);
      }).attr('y', function(d) {
        return yscalefor(this)(d);
      }).attr('class', function(d, i) {
        if (__indexOf.call([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], i) >= 0) {
          return 'day bar';
        } else {
          return 'bar';
        }
      }).append('svg:title').text(function(d) {
        return d;
      });
      bars.append('svg:text').attr('x', x.rangeBand() / 2).attr('text-anchor', 'middle').attr('y', h + 10).attr('class', 'xlbl').text(function(d, i) {
        h = i % 12;
        if (h === 0) {
          return 12;
        } else {
          return h;
        }
      }).style('visibility', function(d, i) {
        if (i % 3 === 0 && i !== 0) {
          return 'visible';
        } else {
          return 'hidden';
        }
      });
      return bars.append('svg:text').attr('dx', 15).attr('dy', 9).attr('text-anchor', 'middle').attr('class', 'max').text(function(d, i) {
        return d;
      }).attr('transform', "rotate(-90)").style('visibility', function(d, i) {
        var hours;
        hours = this.parentNode.parentNode.__data__[1].hours.map(function(h) {
          return h.count;
        });
        if (d3.max(hours) === d) {
          return 'visible';
        } else {
          return 'hidden';
        }
      });
    });
  });
}).call(this);
