(function ($) {
    'use strict';
    $.widget('dashy.page_stack', {
        _create: function() {
        },
        switch_to: function(page) {
            if (!page) {
                page = '/summary';
            }
            var details = page.split('/');
            if (details[1] == 'summary') {
                React.renderComponent(new Summary({services: services}), this.element.get(0));
            } else if (details[1] == 'haproxy') {
                var haproxy = services.haproxies.filter(function(haproxy) { return haproxy.name == details[2]; })[0];
                graph_haproxy(haproxy, this.element);
            } else {
                console.error("Unknown page: " + name);
            }
        },
        bind: function() {
            $(window).bind('hashchange', $.proxy(function(e) {
                var page = location.hash;
                this.switch_to(page);
            }, this));
        },
    });
}(jQuery));
