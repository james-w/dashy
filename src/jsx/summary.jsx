/** @jsx React.DOM */
var Summary = React.createClass({displayName: 'Summary',
    getInitialState: function() {
        var models = this.getModels(this.props);
        return {models: models};
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({models: this.getModels(nextProps)});
    },
    getModels: function(props) {
        var models = {};
        var services = props.services;
        if (services) {
            $.each(services.haproxies, function(i, haproxy) {
                if (!models[name]) {
                    var name = "haproxy/" + haproxy.name;
                    var model = new HaproxySummaryModel();
                    model.set({spec: haproxy});
                    model.fetch();
                    models[name] = model;
                }
            });
        }
        return models;
    },
    refresh: function() {
        $.each(this.state.models, function(name, model) {
            model.fetch();
        });
    },
    render: function() {
        var services = this.props.services;
        var summaries = [];
        var component = this;
        if (services) {
            $.each(services.haproxies, function(i, haproxy) {
                var name = "haproxy/" + haproxy.name;
                var model = component.state.models[name];
                summaries.push(
                    <span key={name} onClick={component.props.changePage.bind(null, name)}>
                        <HaproxySummary model={model} />
                    </span>
                );
            });
        }
        return <div>
                    <h1 id="title">Summary</h1>
                    <div id="graphs">
                        {summaries}
                    </div>
               </div>;
    },
});
