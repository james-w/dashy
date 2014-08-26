/** @jsx React.DOM */
var Legend = React.createClass({displayName: 'Legend',
    render: function() {
        var boxes = [];
        var props = this.props;
        $.each(props.data || [], function(i, d) {
            boxes.push(
                <g key={i} onMouseOver={props.doHighlight.bind(null, i, true)} onMouseOut={props.doHighlight.bind(null, i, false)}>
                    <rect x={props.width-115} y={i*25} width="10" height="10" className={"line"+i} />
                    <text x={props.width-100} y={i*25+8} height="30" width="100">{d.target}</text>
                </g>
            );
        });
        return <g className="legend" height="100" width="100" x={this.props.width-65} y="25">
                    {boxes}
               </g>;
    },
});


