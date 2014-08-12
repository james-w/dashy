/** @jsx React.DOM */
var App = React.createClass({displayName: 'App',
    getInitialState: function() {
        var state = History.getState();
        var page = state.data.page;
        if (page === undefined) {
            page = window.location.pathname;
            page = page.slice(1, page.length);
        }
        return {page: page};
    },
    bindToState: function() {
        var component = this;
        History.Adapter.bind(window,'statechange',function(){
            var state = History.getState();
            component.setState({page: state.data.page});
        });
    },
    changePage: function(page) {
        History.replaceState({page: page}, page + " - dashy", '/' + page);
        if (this.refs.page) {
            this.refs.page.refresh();
        }
    },
    changePageforEnv: function(env_name, page) {
        this.changePage(env_name + '/' + page);
    },
    render: function() {
        var page;
        var parts = this.state.page.split('/');
        var env;
        if (!parts[0]) {
            page = <div>
                    <h1>Home</h1>
                    <p>Select an environment or  service from the left to begin</p>
                    </div>;
        } else {
            env = this.props.environments.filter(function(environment) { return environment.name == parts[0]; })[0];
            page = <Summary services={env.services} changePage={this.changePageforEnv.bind(null, env.name)} ref="page" />;
        }
        return <div className="ues-page ues-g-r">
            <div className="sidebar ues-u-1-5">
                <Navigation environments={this.props.environments} changePage={this.changePage} />
            </div>
            <div className="ues-u-4-5 main">
                {page}
            </div>
        </div>;
    },
});
