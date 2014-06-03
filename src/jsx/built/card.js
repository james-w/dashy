/** @jsx React.DOM */
(function ($) {
    var Spinner = React.createClass({displayName: 'Spinner',
        render: function() {
            return React.DOM.div( {className:"spinner"}, 
                React.DOM.div( {className:"spinner_holder"}, 
                    React.DOM.div( {className:"mask"}, 
                        React.DOM.div( {className:"maskedCircle"}
                        )
                    )
                )
            );
        }
    });
    var Card = React.createClass({displayName: 'Card',
        render: function() {
            var num_sections = this.props.sections.length;
            var sections = [];
            $.each(this.props.sections, function(i, section) {
                var nuggets = [];
                $.each(section.nuggets || [], function(i, nugget) {
                    var title = nugget.stat + ' (' + nugget.object + ')';
                    if (nugget.ratio) {
                        var text = nugget.a + '/' + nugget.b;
                        var state = classify_percentage(nugget.a/nugget.b);
                        nuggets.push(
                            React.DOM.div( {title:title, className:state, key:title}, 
                                text
                            ) 
                        );
                    } else {
                        nuggets.push(
                            React.DOM.div( {title:title, className:nugget.state, key:title}, 
                                nugget.text
                            )
                        );
                    }
                });
                sections.push(
                    React.DOM.div( {className:num_sections > 1 ? 'ues-u-1-' + num_sections : 'ues-u-1', key:i}, 
                    section.heading ? React.DOM.div( {className:"card-sub-heading"}, section.heading) : '',
                    nuggets
                    )
                );
            });
            var spinner;
            if (this.props.spinner) {
                spinner = Spinner(null );
            }
            return React.DOM.div( {className:"card ues-g"}, 
                React.DOM.div( {className:"card-title ues-u-1"}, 
                this.props.title
                ),
                sections,
                spinner
                );
        },
    });
    $.fn.card = function(description) {
        this.empty();
        React.renderComponent(Card(description), this.get(0));
        return
    };
}(jQuery));
