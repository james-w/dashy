/** @jsx React.DOM */
var HaproxySummary = React.createBackboneClass({displayName: 'HaproxySummary',
    render: function() {
        var sections = [
            {
                'heading': "Frontends",
                'nuggets': [],
            },
            {
                'heading': "Backends",
                'nuggets': [],
            },
        ];
        var spinner = true;
        var parsed = this.props.model.get('parsed');
        if (parsed) {
            spinner = false;
            sections[0].nuggets = parsed.frontends;
            sections[1].nuggets = parsed.backends;
        }
        return <Card title={"HAProxy: " + this.props.model.get('spec').name} sections={sections} spinner={spinner} />;
    },
});
