/** @jsx React.DOM */
var Haproxy = React.createClass({displayName: 'Haproxy',
    get_graph_models: function(haproxy) {
        var graphs = [];
        $.each(haproxy.backends, function(i, backend) {
            if (backend.name == 'haproxy_monitoring') {
                return;
            }
            $.each(backend.servers, function(i, server) {
                graphs.push(new GraphModel(
                  {
                      "target": [
                            "alias(" + server.prefix + "slim." + haproxy.interval + "min.value,\"limit\")",
                            "alias(" + server.prefix + "smax." + haproxy.interval + "min.value,\"max\")",
                            "alias(" + server.prefix + "scur." + haproxy.interval + "min.value,\"current\")"
                      ],
                      "title": haproxy.name + " " + server.name + " backend sessions",
                  }
                ));
                graphs.push(new GraphModel(
                  {
                      "target": [
                            "aliasByNode(" + server.prefix + "rate." + haproxy.interval + "min.value,-3)",
                      ],
                      "title": haproxy.name + " " + server.name + " backend rate",
                  }
                ));
                graphs.push(new GraphModel(
                  {
                      "target": [
                            "alias(scale(nonNegativeDerivative(" + server.prefix + "dresp." + haproxy.interval + "min.value),0.0166),\"denied\")",
                            "alias(scale(nonNegativeDerivative(" + server.prefix + "eresp." + haproxy.interval + "min.value),0.0166),\"error\")",
                            "alias(scale(nonNegativeDerivative(" + server.prefix + "econ." + haproxy.interval + "min.value),0.0166),\"connection error\")"
                      ],
                      "title": server.name + " backend bad responses",
                  }
                ));
                graphs.push(new GraphModel(
                    {
                      "target": [
                        "aliasByNode(scale(nonNegativeDerivative(" + server.prefix + "hrsp_1xx." + haproxy.interval + "min.value),0.0166),-3)",
                        "aliasByNode(scale(nonNegativeDerivative(" + server.prefix + "hrsp_2xx." + haproxy.interval + "min.value),0.0166),-3)",
                        "aliasByNode(scale(nonNegativeDerivative(" + server.prefix + "hrsp_3xx." + haproxy.interval + "min.value),0.0166),-3)",
                        "aliasByNode(scale(nonNegativeDerivative(" + server.prefix + "hrsp_4xx." + haproxy.interval + "min.value),0.0166),-3)",
                        "aliasByNode(scale(nonNegativeDerivative(" + server.prefix + "hrsp_5xx." + haproxy.interval + "min.value),0.0166),-3)",
                        "aliasByNode(scale(nonNegativeDerivative(" + server.prefix + "hrsp_other." + haproxy.interval + "min.value),0.0166),-3)"
                      ],
                      "title": server.name + " backend response codes",
                    }
                ));
                graphs.push(new GraphModel(
                    {
                      "target": [
                        "alias(nonNegativeDerivative(" + server.prefix + "wretr." + haproxy.interval + "min.value),\"retries\")",
                        "alias(nonNegativeDerivative(" + server.prefix + "wredis." + haproxy.interval + "min.value),\"redispatches\")"
                      ],
                      "title": server.name + " backend warnings"
                    }
                ));
            });
            graphs.push(new GraphModel(
              {
                  "target": [
                        "alias(" + backend.prefix + "qcur." + haproxy.interval + "min.value,\"current\")",
                        "alias(" + backend.prefix + "qmax." + haproxy.interval + "min.value,\"max\")",
                  ],
                  "title": backend.name + " backend queue",
              }
            ));
        });
        return graphs;
    },
    getNewState: function(haproxy) {
        var summary_model = new HaproxySummaryModel();
        summary_model.set({spec: haproxy});
        summary_model.fetch();
        var graph_models = this.get_graph_models(haproxy);
        $.each(graph_models, function(i, model) {
            model.fetch();
        });
        return {summary_model: summary_model, graph_models: graph_models};
    },
    getInitialState: function() {
        return this.getNewState(this.props.haproxy);
    },
    refresh: function() {
        this.state.summary_model.fetch();
        $.each(this.state.graph_models, function(i, model) {
            model.fetch();
        });
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.state.summary_model.get('spec').name != nextProps.haproxy.name) {
            this.setState(this.getNewState(nextProps.haproxy));
        }
    },
    render: function() {
        var height = 400;
        var width = 600;
        var margin = 20;
        var graphs = [];
        $.each(this.state.graph_models, function(i, model) {
            graphs.push(<BasicGraph key={i} model={model} height={height} width={width} margin={margin} />);
        });
        return <div>
                    <h1 id="title">{this.props.environment_name}: Haproxy: {this.props.haproxy.name}</h1>
                    <div id="graphs">
                        <HaproxySummary model={this.state.summary_model} />
                        {graphs}
                    </div>
               </div>;
    },
});

