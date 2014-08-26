/** @jsx React.DOM */
var BasicGraph = React.createBackboneClass({displayName: 'BasicGraph',
    getInitialState: function() {
        return {highlighted:{}};
    },
    doHighlight: function(i, highlight) {
        var h = this.state.highlighted;
        h[i] = highlight;
        this.setState({highlighted: h});
    },
    render: function() {
        var width = this.props.width;
        var height = this.props.height;
        var margin = this.props.margin;
        var model = this.props.model;
        var xScale = d3.time.scale.utc().range([0, width]);
        var yScale = d3.scale.linear().range([height-margin, 0]);
        var data = model.get('data');
        if (data) {
            xScale.domain(d3.extent(data[0].datapoints, function(d) {return new Date(d[1] * 1000);}));
            var extents = [];
            $.each(data, function(i, dataset) {
                extents.push(d3.extent(dataset.datapoints, function(d) {return d[0];}));
            });
            extents.push([0, 0.1]);
            yScale.domain([d3.min(extents, function(d) {return d[0];}), d3.max(extents, function(d) {return d[1];})]);
        } else {
            var now = new Date();
            xScale.domain([new Date().setHours(now.getHours() - 3) , now]);
            yScale.domain([0, 100]);
        }
        var lines = [];
        var highlighted = this.state.highlighted;
        $.each(data || [], function(i, d) {
            var h = false;
            if (highlighted.hasOwnProperty(i)) {
                h = highlighted[i];
            }
            lines.push(<Line key={i} index={i} ref={"line"+i} data={d.datapoints} xScale={xScale} yScale={yScale} margin={margin} highlighted={h} />);
        });
        return <Chart width={width+150} height={height} margin={margin} title={model.get('title')} >
            <XAxis width={width} height={height} margin={margin} scale={xScale} />
            <YAxis width={width} height={height} margin={margin} scale={yScale} />
            <Grid width={width} height={height} margin={margin} xScale={xScale} yScale={yScale} />
            <Legend width={width+150} height={height} data={data} doHighlight={this.doHighlight} />
            {lines}
        </Chart>;
    },
});
