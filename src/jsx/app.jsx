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
        History.pushState({page: page}, page + " - dashy", '/' + page);
        if (this.refs.page) {
            this.refs.page.refresh();
        }
    },
    changePageforEnv: function(env_name, page) {
        this.changePage(env_name + '/' + page);
    },
    refresh: function() {
        if (this.refs.page) {
            this.refs.page.refresh();
        }
    },
    componentDidMount: function() {
        setInterval(this.refresh, 60*1000);
    },
    render: function() {
        var page;
        var parts = this.state.page.split('/');
        var env;
        if (!this.props.loaded) {
            return <div>
                    <Loading />
                    </div>;
        }
        if (!this.props.logged_in) {
            return <div>
                    <h1>Not logged in</h1>
                    <p><a href={this.props.graphite_host} target="_blank">Open a tab</a> in firefox and log in to graphite instance, keep that tab open, and click <a href={"/login?return_to="+window.location.pathname}>here</a></p>;
                    </div>;
        } 
        if (!parts[0]) {
            page = <div>
                    <h1>Home</h1>
                    <p>Select an environment or  service from the left to begin</p>
                    </div>;
        } else {
            env = this.props.environments.filter(function(environment) { return environment.name == parts[0]; })[0];
            if (parts[1] == 'summary') {
                page = <Summary services={env.services} changePage={this.changePageforEnv.bind(null, env.name)} ref="page" />;
            } else if (parts[1] == 'haproxy') {
                var haproxy = env.services.haproxies.filter(function(haproxy) { return haproxy.name == parts[2]; })[0];
                page = <Haproxy haproxy={haproxy} ref="page" environment_name={env.name} />;
            } else {
                page = <div>Not implemented yet</div>;
            }
        }
        return <div className="ues-page ues-g-r">
            <div className="sidebar ues-u-1-5">
                <h3 className="ues-u-4-5">dashy</h3>
                <img src="/static/lib/open-iconic/svg/reload.svg" alt="refresh" title="refresh" className="reload ues-u-1-5" onClick={this.refresh} />
                <Navigation environments={this.props.environments} changePage={this.changePage} />
            </div>
            <div className="ues-u-4-5 main">
                {page}
            </div>
        </div>;
    },
});
