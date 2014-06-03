var SummaryModel = Backbone.Model.extend({
    get_alias: function(namespace, label) {
        return namespace + ' ' + label;
    },
    url_for_targets: function(targets) {
        var qs_parts = [];
        var model = this;
        $.each(targets, function(i, target) {
            var qs_part = 'target=alias(' + target.stat + ',"'+model.get_alias(target.namespace, target.name)+'")';
            qs_parts.push(qs_part);
        });
        return 'render?format=json&from=-30min&' + qs_parts.join('&');
    },
    get_last_value: function(datapoints) {
        return datapoints[datapoints.length-1][0];
    },
    get_last_values: function(data) {
        var values = {};
        var model = this;
        $.each(data, function(i, target) {
            values[target.target] = model.get_last_value(target.datapoints);
        });
        return values;
    },
});
