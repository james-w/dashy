/** @jsx React.DOM */
var Summary = React.createClass({displayName: 'Summary',
    handleClick: function(name) {
        location.hash = '/haproxy/' + name;
    },
    render: function() {
        var services = this.props.services;
        var summaries = [];
        var component = this;
        $.each(services.haproxies, function(i, haproxy) {
            var model = new HaproxySummaryModel();
            model.set({spec: haproxy});
            summaries.push(
                <span key={"haproxy_"+haproxy.name} onClick={component.handleClick.bind(null, haproxy.name)}>
                    <HaproxySummary model={model} />
                </span>
            );
        });
        return <div>
                    <h1 id="title">Summary</h1>
                    <div id="graphs">
                        {summaries}
                    </div>
               </div>;
    },
});
