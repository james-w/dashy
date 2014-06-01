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
                var holder = $("<div  />", {id: "haproxy_"+haproxy.name, data: haproxy}).appendTo(graph_nodes);
                holder.summary_haproxy({description: haproxy});
                $.ajax({url: summary.options.render_url + holder.summary_haproxy('qs'), dataType: 'json', success: function(data, textStatus, jqxhr){
                    holder.summary_haproxy('data', data);
                }, failure: function(jqxhr, textStatus, errorThrown) {
                    holder.html("Error loading data: " + textStatus);
                }});
            });
        },
    });
}(jQuery));
