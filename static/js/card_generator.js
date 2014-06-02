'use strict';
var _basic_card = function(description) {
    var card = {
        title: description.title,
        sections: [],
        spinner: true,
    };
    $.each(description.sections, function(i, section) {
        var card_section = {nuggets: []};
        if (section.heading) {
            card_section.heading = section.heading;
        }
        card.sections.push(card_section);
    });
    return card;
};

var _fetch_data = function(description, target) {
    var section_callbacks = [];
    var targets = [];
    $.each(description.sections, function(i, section) {
        var callbacks = [];
        section_callbacks.push(callbacks);
        $.each(section.nuggets, function(i, nugget) {
            var get_alias = function(name) {
                return nugget.prefix + ' ' + name;
            };
            $.each(nugget.targets, function(i, target) {
                var qs_part = 'target=alias(' + target.stat + ',"'+get_alias(target.name)+'")';
                targets.push(qs_part);
            });
            var callback = function(data) {
                if (nugget.ratio) {
                    return {
                        ratio: true,
                        a: data[get_alias(nugget.a)].toFixed(nugget.a_precision || 0),
                        b: data[get_alias(nugget.b)].toFixed(nugget.b_precision || 0),
                        object: nugget.object_name,
                        stat: nugget.label,
                    };
                } else {
                    var state = nugget.state;
                    if ($.isFunction(state)) {
                        state = state.call(this, data, get_alias);
                    }
                    return {
                        text: data[get_alias(nugget.value)] + (nugget.suffix || ''),
                        object: nugget.object_name,
                        stat: nugget.label,
                        state: state,
                    };
                }
            };
            callbacks.push(callback);
        });
    });

    var fill_card = function(data) {
        var values = get_last_values(data);
        var card = _basic_card(description);
        card.spinner = false;
        $.each(section_callbacks, function(i, callbacks) {
            var section = card.sections[i];
            $.each(callbacks, function(i, callback) {
                section.nuggets.push(callback(values));
            });
        });
        target.card(card);
    };

    var qs = 'from=-30min&' + targets.join('&');
    render(qs, fill_card);
};

function generate_and_fetch_card(description, target) {
    var card = _basic_card(description);
    target.card(card);
    _fetch_data(description, target);
}
