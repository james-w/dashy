/** @jsx React.DOM */
var YAxis = React.createClass({displayName: 'YAxis',
    render: function() {
        return <g className="y axis" transform={"translate("+this.props.margin+","+this.props.margin+")"} />;
    },
    update: function(props) {
        return d3.svg.axis().scale(props.scale).orient('left').ticks(5);
    },
    componentDidMount: function () {
        d3.select(this.getDOMNode())
          .call(this.update(this.props));
    },
    shouldComponentUpdate: function(props) {
        d3.select(this.getDOMNode())
            .call(this.update(props));
        // always skip React's render step
        return false;
    },
});

