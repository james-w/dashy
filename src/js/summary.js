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
            var graph_nodes = this.element.find("#graphs");
            var summary = this;
            $.each(this.options.services.haproxies, function(i, haproxy) {
                var holder = $("<span  />", {id: "haproxy_"+haproxy.name, data: haproxy}).appendTo(graph_nodes);
                var model = new HaproxySummaryModel();
                model.set({spec: haproxy});
                holder.each(function() {
                    React.renderComponent(new HaproxySummary({model: model}), this);
                });
                holder.on('click', function(e) {
                    location.hash = '/haproxy/' + haproxy.name;
                });
            });
        },
    });
}(jQuery));
