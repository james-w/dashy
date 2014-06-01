(function ($) {
    "use strict";
    $.widget('dashy.summary_haproxy', {
        options: {
            description: null,
            qs: null,
        },
        _get_skeleton: function() {
            var haproxy = this.options.description;
            return {
                title: "HAProxy: " + haproxy.name,
                sections: [
                    {
                        'heading': "Frontends",
                        'nuggets': [],
                    },
                    {
                        'heading': "Backends",
                        'nuggets': [],
                    },
                ],
            };
        },
        _alias_for: function(object, stat) {
            return object.prefix + ' ' + stat;
        },
        _get_frontend_formatters: function(haproxy, summary) {
            var formatters = [];
            $.each(haproxy.frontends, function(i, frontend) {
                if (frontend.name.indexOf('-1000') > -1) {
                    return;
                }
                var make_alias = function(stat) {
                    return summary._alias_for(frontend, stat);
                };
                formatters.push(summary._frontend_sessions_formatter(frontend, make_alias));
            });
            return formatters;
        },
        _get_backend_formatters: function(haproxy, summary) {
            var formatters = [];
            $.each(haproxy.backends, function(i, frontend) {
                if (frontend.name == 'haproxy_monitoring') {
                    return;
                }
                var make_alias = function(stat) {
                    return summary._alias_for(backend, stat);
                };
                formatters.push(summary._backend_rate_formatter(frontend, make_alias));
                formatters.push(summary._backend_sessions_formatter(frontend, make_alias));
                formatters.push(summary._backend_queue_formatter(frontend, make_alias));
            });
            return formatters;
        },
        _create: function() {
            var card_description = this._get_skeleton();
            card_description.spinner = true;
            this.element.card(card_description);
            var targets = [];
            var haproxy = this.options.description;
            var formatters = this._get_frontend_formatters(haproxy, this);
            $.each(formatters, function(i, formatter) {
                $.each(formatter.get_targets(), function(i, target) {
                    targets.push(target);
                });
            });
            formatters = this._get_backend_formatters(haproxy, this);
            $.each(formatters, function(i, formatter) {
                $.each(formatter.get_targets(), function(i, target) {
                    targets.push(target);
                });
            });
            var make_target = function(target) {
                return 'target=alias(' + target.stat + ',"'+target.alias+'")';
            };
            this.options.qs = 'from=-30min&' + $.map(targets, make_target).join('&');
            this.element.on("click", function(e) {
                $(this).trigger('changePage', ['haproxy', haproxy.name]);
            });
        },
        qs: function() {
            return this.options.qs;
        },
        data: function(data) {
            var values = get_last_values(data);
            var card_description = this._get_skeleton();
            var frontend_card = card_description.sections[0];
            var formatters = this._get_frontend_formatters(this.options.description, this);
            $.each(formatters, function(i, formatter) {
                frontend_card.nuggets.push(formatter.format_result(values));
            });
            var backend_card = card_description.sections[1];
            formatters = this._get_backend_formatters(this.options.description, this);
            $.each(formatters, function(i, formatter) {
                backend_card.nuggets.push(formatter.format_result(values));
            });
            this.element.card(card_description);
        },

        // Formatters
        _frontend_sessions_formatter: function(frontend, make_alias) {
            return {
                get_targets: function() {
                    return [
                        {
                            stat: 'movingAverage('+frontend.prefix+'scur.1min.value,10)',
                            alias: make_alias('current sessions'),
                        },
                        {
                            stat: 'movingAverage('+frontend.prefix+'slim.1min.value,10)',
                            alias: make_alias('session limit'),
                        },
                    ];
                },
                format_result: function(data) {
                    return {
                        ratio: true,
                        a: data[make_alias('current sessions')].toFixed(0),
                        b: data[make_alias('session limit')].toFixed(0),
                        object: frontend.name + ' frontend',
                        stat: 'sessions in use',
                    };
                },
            };
        },
        _backend_sessions_formatter: function(backend, make_alias) {
            return {
                get_targets: function() {
                    return [
                        {
                            stat: 'movingAverage(sumSeries('+$.map(backend.servers, function(server) { return server.prefix+'scur.1min.value'; }).join(',')+'),10)',
                            alias: make_alias('current sessions'),
                        },
                        {
                            stat: 'movingAverage(sumSeries('+$.map(backend.servers, function(server) { return server.prefix+'slim.1min.value'; }).join(',')+'),10)',
                            alias: make_alias('session limit'),
                        },
                    ];
                },
                format_result: function(data) {
                    return {
                        ratio: true,
                        a: data[make_alias('current sessions')].toFixed(0),
                        b: data[make_alias('session limit')].toFixed(0),
                        object: backend.name + ' frontend',
                        stat: 'sessions in use',
                    };
                },
            };
        },
        _backend_rate_formatter: function(backend, make_alias) {
            return {
                get_targets: function() {
                    return [
                        {
                            stat: 'movingAverage('+backend.prefix+'rate.1min.value,10)',
                            alias: make_alias('rate'),
                        },
                    ];
                },
                format_result: function(data) {
                    return {
                        text: data[make_alias('rate')].toFixed(2) + '/s',
                        object: backend.name + ' backend',
                        stat: 'request rate',
                        state: 'neutral',
                    };
                },
            };
        },
        _backend_queue_formatter: function(backend, make_alias) {
            return {
                get_targets: function() {
                    return [
                        {
                            stat: 'movingAverage('+backend.prefix+'qcur.1min.value,10)',
                            alias: make_alias('current queue'),
                        },
                    ];
                },
                format_result: function(data) {
                    var queue_length = data[make_alias('current queue')];
                    var current_sessions = data[make_alias('current sessions')];
                    var state = 'ok';
                    if (queue_length > current_sessions) {
                        state = 'bad';
                    } else if (queue_length > 0) {
                        state = 'warn';
                    }
                    return {
                        text: queue_length.toFixed(0),
                        object: backend.name + ' backend',
                        stat: 'queued requests',
                        state: state,
                    };
                },
            };
        },
    });
}(jQuery));
