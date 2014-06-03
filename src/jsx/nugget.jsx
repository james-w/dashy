/** @jsx React.DOM */
var RatioNugget = React.createClass({displayName: 'RatioNugget',
    render: function() {
        var text = this.props.a + '/' + this.props.b;
        var percent = this.props.a/this.props.b;
        var state = 'ok';
        if (percent > 0.98) {
            state = 'bad';
        } else if (percent > 0.9) {
            state = 'warn';
        }
        return <Nugget stat={this.props.stat}
                       object={this.props.object}
                       state={state}
                       text={text}
               />;
    },
});
var Nugget = React.createClass({displayName: 'Nugget',
    render: function() {
        var title = this.props.stat + ' (' + this.props.object + ')';
        var state = this.props.state;
        var text = this.props.text;
        return <div title={title} className={state}>
                {text}
               </div>;
    },
});
