(function ($) {
    $.widget('dashy.summary', {
        options: {
            services: null,
            render_url: null,
        },
        _init: function() {
            this.element.empty();
            this.element.append($("<h1 />", {id: 'title'}).html("Summary"));
            this.element.append($("<div />", {id: 'graphs'}));
            this.refresh();
        },
        services: function(value) {
            if (value === undefined) {
                return this.options.services;
            } else {
                this.options.services = value;
                this.refresh();
            }
        },
        refresh: function() {
            if (!this.options.services) {
                return;
            }
            var graph_nodes = $("<div  />");
            this.element.find("#graphs").html(graph_nodes);
            var summary = this;
            $.each(this.options.services.haproxies, function(i, haproxy) {
                var holder = $("<span  />", {id: "haproxy_"+haproxy.name, data: haproxy}).appendTo(graph_nodes);
                haproxy_summary(haproxy, holder);
                holder.on('click', function(e) {
                    location.hash = '/haproxy/' + haproxy.name;
                });
            });
        },
    });
}(jQuery));
