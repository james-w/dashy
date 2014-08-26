/** @jsx React.DOM */
var Grid = React.createClass({displayName: 'Grid',
    render: function() {
        return <g className="grid" transform={"translate("+this.props.margin+","+this.props.margin+")"}>
                    <g className="xGrid" />
                    <g className="yGrid" />
                </g>;
    },
    updateXGrid: function(props) {
        return d3.svg.axis().scale(props.xScale).orient('bottom').ticks(5).tickSize(props.height, 0, 0).tickFormat("");
    },
    updateYGrid: function(props) {
        return d3.svg.axis().scale(props.yScale).orient('left').ticks(5).tickSize(-props.width, 0, 0).tickFormat("");
    },
    componentDidMount: function () {
        d3.select(this.getDOMNode())
          .select('.xGrid')
          .call(this.updateXGrid(this.props));
        d3.select(this.getDOMNode())
          .select('.yGrid')
          .call(this.updateYGrid(this.props));
    },
    shouldComponentUpdate: function(props) {
        d3.select(this.getDOMNode())
            .select('.xGrid')
            .call(this.updateXGrid(props));
        d3.select(this.getDOMNode())
            .select('.yGrid')
          .call(this.updateYGrid(props));
        // always skip React's render step
        return false;
    },
});
