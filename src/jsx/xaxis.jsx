/** @jsx React.DOM */
var XAxis = React.createClass({displayName: 'XAxis',
    render: function() {
        return <g className="x axis" transform={"translate("+this.props.margin+","+this.props.height+")"} />;
    },
    update: function(props) {
        return d3.svg.axis().scale(props.scale).orient('bottom').ticks(5);
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

