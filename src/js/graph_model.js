var GraphModel = Backbone.Model.extend({
    url: function() {
        var render_url = '/render?format=json&';
        var qs = '';
        qs += 'from=-3hour';
        qs += '&title=' + this.get('title');
        qs += '&' + $.map(this.get('target'), function(target) { return 'target=' + target; }).join("&");
        return render_url + qs;
    },
    parse: function(response, options) {
        return {data: response};
    },
});
