/** @jsx React.DOM */
var Line = React.createClass({displayName: 'Line',
    render: function() {
        var xScale = this.props.xScale;
        var yScale = this.props.yScale;
        var margin = this.props.margin;
        var line = d3.svg.line()
                .x(function(d,i) {
                    return xScale(new Date(d[1] * 1000)); 
                })
                .y(function(d) {
                    return yScale(d[0]);
                });
        var path = line(this.props.data || []);
        var classes = "line line"+this.props.index;
        if (this.props.highlighted) {
            classes += " hover";
        }
        return <path className={classes} d={path} transform={"translate("+margin+","+margin+")"} />;
    },
});

