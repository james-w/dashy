var HaproxySummaryModel = SummaryModel.extend({
    url: function() {
        var haproxy = this.get('spec');
        var targets = [];
        $.each(haproxy.frontends, function(i, frontend) {
            if (frontend.name.indexOf('-1000') > -1) {
                return;
            }
            targets.push({
                namespace: frontend.prefix,
                name: 'current sessions',
                stat: 'movingAverage('+frontend.prefix+'scur.'+haproxy.interval+'min.value,10)',
            });
            targets.push({
                namespace: frontend.prefix,
                name: 'session limit',
                stat: 'movingAverage('+frontend.prefix+'slim.'+haproxy.interval+'min.value,10)',
            });
        });
        $.each(haproxy.backends, function(i, backend) {
            if (backend.name == 'haproxy_monitoring') {
                return;
            }
            targets.push({
                stat: 'movingAverage('+backend.prefix+'rate.'+haproxy.interval+'min.value,10)',
                name: 'rate',
                namespace: backend.prefix,
            });
            targets.push({
                stat: 'movingAverage(sumSeries('+$.map(backend.servers, function(server) { return server.prefix+'scur.'+haproxy.interval+'min.value'; }).join(',')+'),10)',
                name: 'current sessions',
                namespace: backend.prefix,
            });
            targets.push({
                stat: 'sumSeries('+$.map(backend.servers, function(server) { return server.prefix+'slim.'+haproxy.interval+'min.value'; }).join(',')+')',
                name: 'session limit',
                namespace: backend.prefix,
            });
            targets.push({
                stat: 'movingAverage('+backend.prefix+'qcur.'+haproxy.interval+'min.value,10)',
                name: 'current queue',
                namespace: backend.prefix,
            });
            targets.push({
                stat: 'scale(movingAverage(nonNegativeDerivative('+backend.prefix+'downtime.'+haproxy.interval+'min.value),10),0.0166)',
                name: 'downtime',
                namespace: backend.prefix,
            });
            targets.push({
                stat: 'scale(movingAverage(nonNegativeDerivative(sumSeries('+backend.prefix+'{wretr,wredis}.'+haproxy.interval+'min.value)),10),0.0166)',
                name: 'retries',
                namespace: backend.prefix,
            });
        });
        return this.url_for_targets(targets);
    },
    parse: function(response, options) {
        var values = this.get_last_values(response);
        var parsed = {
            frontends: [],
            backends: []
        };
        var model = this;
        $.each(this.get('spec').frontends, function(i, frontend) {
            if (frontend.name.indexOf('-1000') > -1) {
                return;
            }
            var namespace = frontend.prefix;
            var current_sessions = values[model.get_alias(namespace, 'current sessions')].toFixed(0);
            var session_limit = values[model.get_alias(namespace, 'session limit')].toFixed(0);
            parsed.frontends.push({
                ratio: true,
                a: current_sessions,
                b: session_limit,
                object_name: frontend.name + ' frontend',
                label: 'sessions in use',
                prefix: frontend.prefix,
            });
        });
        $.each(this.get("spec").backends, function(i, backend) {
            if (backend.name == 'haproxy_monitoring') {
                return;
            }
            var namespace = backend.prefix;
            var rate = values[model.get_alias(namespace, 'rate')];
            parsed.backends.push({
                text: rate.toFixed(2) + '/s',
                object_name: backend.name + ' backend',
                label: 'rate',
                prefix: backend.prefix,
            });
            var current_sessions = values[model.get_alias(namespace, 'current sessions')];
            var session_limit = values[model.get_alias(namespace, 'session limit')];
            if (session_limit === undefined) {
                session_limit = null;
            }
            parsed.backends.push({
                ratio: true,
                a: current_sessions.toFixed(0),
                b: session_limit !== null ? session_limit.toFixed(0) : 'unlimited',
                object_name: backend.name + ' backend',
                label: 'sessions in use',
                prefix: backend.prefix,
            });
            var current_queue = values[model.get_alias(namespace, 'current queue')];
            var state = 'ok';
            if (current_queue > current_sessions) {
                state = 'bad';
            } else if (current_queue > 0) {
                state = 'warn';
            }
            parsed.backends.push({
                text: current_queue.toFixed(0),
                object_name: backend.name + ' backend',
                label: 'current queue',
                prefix: backend.prefix,
                state: state,
            });
            var downtime = values[model.get_alias(namespace, 'downtime')];
            state = 'ok';
            if (downtime > 0) {
                state = 'bad';
            }
            parsed.backends.push({
                text: downtime.toFixed(2) + '/s',
                object_name: backend.name + ' backend',
                label: 'downtime',
                prefix: backend.prefix,
            });
            var retries = values[model.get_alias(namespace, 'retries')];
            state = 'ok';
            if (downtime > 1) {
                state = 'bad';
            }
            parsed.backends.push({
                text: downtime.toFixed(2) + '/s',
                object_name: backend.name + ' backend',
                label: 'retries',
                prefix: backend.prefix,
            });
        });
        return {raw_values: values, parsed: parsed};
    },
});
