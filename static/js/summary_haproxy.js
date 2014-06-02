function haproxy_summary(haproxy, target) {
    var card_description = {
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
    $.each(haproxy.frontends, function(i, frontend) {
        if (frontend.name.indexOf('-1000') > -1) {
            return;
        }
        card_description.sections[0].nuggets.push(
            {
                targets: [
                    {
                        name: 'current sessions',
                        stat: 'movingAverage('+frontend.prefix+'scur.1min.value,10)',
                    },
                    {
                        name: 'session limit',
                        stat: 'movingAverage('+frontend.prefix+'slim.1min.value,10)',
                    },
                ],
                ratio: true,
                a: 'current sessions',
                a_precision: 0,
                b: 'session limit',
                b_precision: 0,
                object_name: frontend.name + ' frontend',
                label: 'sessions in use',
                prefix: frontend.prefix,
            }
        );
    });
    $.each(haproxy.backends, function(i, backend) {
        if (backend.name == 'haproxy_monitoring') {
            return;
        }
        card_description.sections[1].nuggets.push(
            {
                targets: [
                    {
                        stat: 'movingAverage('+backend.prefix+'rate.1min.value,10)',
                        name: 'rate',
                    },
                ],
                value: 'rate',
                suffix: "/s",
                object_name: backend.name + ' backend',
                label: 'rate',
                state: 'neutral',
                prefix: backend.prefix,
            }
        );
        card_description.sections[1].nuggets.push(
            {
                targets: [
                    {
                        stat: 'movingAverage(sumSeries('+$.map(backend.servers, function(server) { return server.prefix+'scur.1min.value'; }).join(',')+'),10)',
                        name: 'current sessions',
                    },
                    {
                        stat: 'movingAverage(sumSeries('+$.map(backend.servers, function(server) { return server.prefix+'slim.1min.value'; }).join(',')+'),10)',
                        name: 'session limit',
                    },
                ],
                ratio: true,
                a: 'current sessions',
                a_precision: 0,
                b: 'session limit',
                b_precision: 0,
                object_name: backend.name + ' backend',
                label: 'sessions in use',
                prefix: backend.prefix,
            }
        );
        card_description.sections[1].nuggets.push(
            {
                targets: [
                    {
                        stat: 'movingAverage('+backend.prefix+'qcur.1min.value,10)',
                        name: 'current queue',
                    },
                ],
                value: 'current queue',
                object_name: backend.name + ' backend',
                label: 'current queue',
                state: function(data, get_alias) {
                    var queue_length = data[get_alias('current queue')];
                    var current_sessions = data[get_alias('current sessions')];
                    var state = 'ok';
                    if (queue_length > current_sessions) {
                        state = 'bad';
                    } else if (queue_length > 0) {
                        state = 'warn';
                    }
                    return state;
                },
                prefix: backend.prefix,
            }
        );
        card_description.sections[1].nuggets.push(
            {
                targets: [
                    {
                        stat: 'scale(movingAverage(nonNegativeDerivative('+backend.prefix+'downtime.1min.value),10),0.0166)',
                        name: 'downtime',
                    },
                ],
                value: 'downtime',
                precision: 2,
                suffix: '/s',
                object_name: backend.name + ' backend',
                label: 'downtime',
                threshold: 0,
                prefix: backend.prefix,
            }
        );
        card_description.sections[1].nuggets.push(
            {
                targets: [
                    {
                        stat: 'scale(movingAverage(nonNegativeDerivative(sumSeries('+backend.prefix+'{wretr,wredis}.1min.value)),10),0.0166)',
                        name: 'retries',
                    },
                ],
                value: 'retries',
                precision: 2,
                suffix: '/s',
                object_name: backend.name + ' backend',
                label: 'retries',
                threshold: 0,
                prefix: backend.prefix,
            }
        );
    });
    generate_and_fetch_card(card_description, target);
}
