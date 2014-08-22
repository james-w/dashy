/** @jsx React.DOM */
var BasicGraph = React.createClass({displayName: 'BasicGraph',
    componentDidMount: function() {
        this.props.model.on('change', function(options) {
            this.forceUpdate();
        }.bind(this));
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
        $.each(data || [], function(i, d) {
            lines.push(<Line key={i} index={i} data={d.datapoints} xScale={xScale} yScale={yScale} margin={margin} />);
        });
        return <Chart width={width} height={height} margin={margin} title={model.get('title')} >
            <XAxis width={width} height={height} margin={margin} data={model.get('data')} scale={xScale} />
            <YAxis width={width} height={height} margin={margin} data={model.get('data')} scale={yScale} />
            {lines}
        </Chart>;
    },
});
