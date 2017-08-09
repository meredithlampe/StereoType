comparator    = require "../../array/comparator.coffee"
sort          = require "../../array/sort.coffee"
dataThreshold = require "../../core/data/threshold.js"
fetchText     = require "../../core/fetch/text.js"
fetchValue    = require "../../core/fetch/value.coffee"
fontSizes     = require "../../font/sizes.coffee"
offset        = require "../../geom/offset.coffee"
textwrap      = require "../../textwrap/textwrap.coffee"
buckets       = require "../../util/buckets.coffee"
uniques       = require "../../util/uniques.coffee"

radar = (vars) ->

  data = vars.data.viz

  nextDepth = vars.depth.value + 1
  nextLevel = vars.id.nesting[nextDepth]

  children = (d[nextLevel] for d in data)

  total = (uniques(data, nextLevel, fetchValue, vars, nextDepth) for d in data)
  total = uniques(d3.merge(total)).length
  angle = Math.PI * 2 / total
  maxRadius = d3.min([vars.width.viz, vars.height.viz])/2

  labelHeight = 0
  labelWidth = 0
  labels = (fetchText(vars, c, nextDepth)[0] for c in children)
  labels = uniques(d3.merge(labels))
  if vars.labels.value
    first = offset Math.PI/2, maxRadius
    second = offset angle + Math.PI/2, maxRadius
    labelHeight = (first.x - second.x) - vars.labels.padding * 2
    textStyle = {
      "fill": vars.x.ticks.font.color
      "font-family": vars.x.ticks.font.family.value
      "font-weight": vars.x.ticks.font.weight
      "font-size":   vars.x.ticks.font.size+"px"
    }
    sizes = fontSizes labels, textStyle,
      mod: (elem) ->
        textwrap().container d3.select(elem)
          .width(vars.height.viz/8)
          .height(labelHeight).draw()
    labelWidth = d3.max sizes, (d) -> d.width

    maxRadius -= labelWidth
    maxRadius -= vars.labels.padding * 2

  maxData = (fetchValue(vars, d, vars.size.value) for d in c for c in children)
  maxData = d3.max(d3.merge(maxData))

  radius = d3.scale.linear()
    .domain([0, maxData])
    .range([0, maxRadius])

  ids = (fetchValue(vars, c, nextLevel) for c in children)
  ids = uniques(d3.merge(ids))
  idIndex = d3.scale.ordinal()
    .domain(ids)
    .range(d3.range(0, ids.length))

  for d in data
    d.d3plus.x = vars.width.viz/2 + vars.margin.top
    d.d3plus.y = vars.height.viz/2 + vars.margin.left

    for a, i in d[nextLevel]
      a.d3plus = {} unless a.d3plus
      a.d3plus.r = radius fetchValue(vars, a, vars.size.value)
      a.d3plus.a = idIndex(fetchValue(vars, a, nextLevel)) * angle

  intervals = 1
  for i in [10, 5, 4, 2]
    if maxRadius/i >= 20
      intervals = i
      break

  ringData = buckets([maxRadius/intervals, maxRadius], intervals - 1).reverse()
  ringData.shift() if ringData.length is intervals

  rings = vars.group.selectAll ".d3plus_radar_rings"
    .data ringData, (d, i) -> i

  ringStyle = (ring) ->
    ring
      .attr "fill", (d, i) ->
        if i is 0 then vars.axes.background.color else "transparent"
      .attr "cx", vars.width.viz/2 + vars.margin.top
      .attr "cy", vars.height.viz/2 + vars.margin.left
      .attr "stroke",
        if vars.x.grid.value then vars.x.grid.color else "transparent"

  rings.enter().append "circle"
    .attr "class", "d3plus_radar_rings"
    .call ringStyle
    .attr "r", 0

  rings.transition().duration(vars.draw.timing)
    .call ringStyle
    .attr "r", (d) -> d

  rings.exit().transition().duration(vars.draw.timing)
    .attr "opacity", 0
    .remove()

  labelIndex = d3.scale.ordinal()
    .domain(labels)
    .range(d3.range(0, labels.length))

  labelData = []
  for l in labels
    a2 = (angle * labelIndex(l)) - Math.PI/2
    a = a2 * (180/Math.PI)

    if a < -90 or a > 90
      a = a-180
      buffer = -(maxRadius + vars.labels.padding * 2 + labelWidth)
      anchor = "end"
    else
      buffer = maxRadius + vars.labels.padding * 2
      anchor = "start"

    top = a2 < 0 or a2 > Math.PI
    righty = a2 < Math.PI/2
    ov = maxRadius
    ov += vars.labels.padding if vars.labels.value
    o = offset a2, ov
    x = o.x
    y = o.y
    x -= labelWidth unless righty
    y -= labelHeight if top
    center = [0, Math.PI].indexOf(angle * labelIndex(l)) >= 0
    x -= labelWidth/2 if center


    labelData.push {
      "text": l,
      "angle": a,
      "x": buffer,
      "anchor": anchor,
      "offset": o
    }


  labelGroup = vars.group.selectAll "g.d3plus_radar_label_group"
    .data [0]
  labelGroup.enter().append("g").attr "class", "d3plus_radar_label_group"
    .attr "transform", "translate(" + vars.width.viz/2 + "," + vars.height.viz/2 + ")"
  labelGroup.transition().duration(vars.draw.timing)
    .attr "transform", "translate(" + vars.width.viz/2 + "," + vars.height.viz/2 + ")"


  text = labelGroup.selectAll ".d3plus_radar_labels"
    .data (if vars.labels.value then labelData else []), (d, i) -> i

  labelStyle = (label) ->
    label
      .attr textStyle
      .each (l, i) ->
        textwrap()
          .container d3.select(this)
          .height labelHeight
          .width labelWidth
          .align l.anchor
          .text l.text
          .padding 0
          .valign "middle"
          .x l.x
          .y -labelHeight/2
          .draw()
      .attr "transform", (t) ->
        translate = d3.select(this).attr("transform") or ""
        if translate.length
          translate = translate.split(")").slice(-3).join(")")
        return "rotate(" + t.angle + ")" + translate

  text.call labelStyle

  text.enter().append "text"
    .attr "class", "d3plus_radar_labels"
    .attr "opacity", 0
    .call labelStyle
    .transition().duration(vars.draw.timing)
      .attr "opacity", 1

  text.exit().transition().duration(vars.draw.timing)
    .attr "opacity", 0
    .remove()

  grid = vars.group.selectAll ".d3plus_radar_lines"
    .data labelData, (d, i) -> i

  gridStyle = (grid) ->
    grid
      .attr "stroke", vars.x.grid.color
      .attr "x1", vars.width.viz/2 + vars.margin.left
      .attr "y1", vars.height.viz/2 + vars.margin.top

  grid.enter().append "line"
    .attr "class", "d3plus_radar_lines"
    .call gridStyle
    .attr "x2", vars.width.viz/2 + vars.margin.left
    .attr "y2", vars.height.viz/2 + vars.margin.top

  grid.transition().duration(vars.draw.timing)
    .call gridStyle
    .attr "x2", (d) -> vars.width.viz/2 + vars.margin.left + d.offset.x
    .attr "y2", (d) -> vars.height.viz/2 + vars.margin.top + d.offset.y

  grid.exit().transition().duration(vars.draw.timing)
    .attr "opacity", 0
    .remove()

  vars.mouse.viz =
    click: false

  data

# Visualization Settings and Helper Functions
radar.requirements = ["data", "size"]
radar.shapes       = ["radial"]

module.exports     = radar
