/** @jsx React.DOM */
var Chart = React.createClass({displayName: 'Chart',
    render: function() {
        var margin = this.props.margin || 0;
        return <div className="chart">
                    <svg width={this.props.width + 2*margin} height={this.props.height + 2*margin}>
                        <g transform={"translate("+margin+","+margin+")"}>
                            <text x={this.props.width/2} y={0} textAnchor="middle" font-size="16px">{this.props.title}</text>
                            {this.props.children}
                        </g>
                    </svg>
                </div>;
    },
});
