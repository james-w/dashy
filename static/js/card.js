(function ($) {
    $.fn.card = function(description) {
        this.empty();
        var card = $("<div />", {class: 'card ues-g'}).appendTo(this);
        $("<div />", {class: 'ues-u-1 card-title'}).html(description.title).appendTo(card);
        var num_sections = description.sections.length;
        $.each(description.sections, function(i, section) {
            var grid_class = 'ues-u-1';
            if (num_sections > 1) {
                grid_class += '-' + num_sections;
            }
            var section_box = $("<div />", {class: grid_class}).appendTo(card);
            if (section.heading) {
                section_box.append($("<div />", {class: "card-sub-heading"}).html(section.heading));
            }
            $.each(section.nuggets || [], function(i, nugget) {
                if (nugget.ratio) {
                    make_nugget_for_ratio(nugget.a, nugget.b, nugget.object, nugget.stat).appendTo(section_box);
                } else {
                    make_nugget(nugget.text, nugget.object, nugget.stat, nugget.state).appendTo(section_box);
                }
            });
        });
        if (description.spinner) {
            card.spinner();
        }
    };
}(jQuery));
