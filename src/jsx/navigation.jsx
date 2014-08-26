/** @jsx React.DOM */
var Navigation = React.createClass({displayName: 'Navigation',
    getInitialState: function() {
        return {hidden: {}};
    },
    isHidden: function(env, type) {
        return this.state.hidden[env + '-' + type] || false;
    },
    toggleHidden: function(env, type, e) {
        var hidden = this.state.hidden;
        hidden[env + '-' + type] = !this.isHidden(env, type);
        this.setState({hidden: hidden});
        e.stopPropagation();
    },
    changePage: function(page, e) {
        this.props.changePage.call(null, page);
        e.stopPropagation();
    },
    render: function() {
        var description = this.props.environments || [];
        var environments = [];
        var component = this;
        $.each(description, function(i, environment) {
            var env_name = environment.name;
            var haproxies = [];
            if (environment.services) {
                $.each(environment.services.haproxies || [], function(i, haproxy) {
                    haproxies.push(
                        <li key={haproxy.name}
                            onClick={component.changePage.bind(null, env_name + '/haproxy/' + haproxy.name)}>
                            {haproxy.name}
                        </li>
                    );
                });
            } else {
                haproxies.push(<Loading key="loading" />);
            }
            environments.push(
                <li key={environment.name}
                    onClick={component.toggleHidden.bind(null, env_name, '')} 
                    className={component.isHidden(env_name, '') ? 'hidden' : ''}>
                    {environment.name}
                    <ul>
                        <li
                             onClick={component.changePage.bind(null, env_name + '/summary')}>Summary</li>
                        <li 
                            onClick={component.toggleHidden.bind(null, env_name, 'haproxy')} 
                            className={component.isHidden(env_name, 'haproxy') ? 'hidden' : ''}>HAProxy
                            <ul>
                                {haproxies}
                            </ul>
                        </li>
                    </ul>
                </li>
            );
        });
        return <ul id="nav">
                {environments}
               </ul>;
    },
});
