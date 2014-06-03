/** @jsx React.DOM */
(function ($) {
    var Spinner = React.createClass({displayName: 'Spinner',
        render: function() {
            return <div className="spinner">
                <div className="spinner_holder">
                    <div className="mask">
                        <div className="maskedCircle">
                        </div>
                    </div>
                </div>
            </div>;
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
                            <div title={title} className={state} key={title}>
                                {text}
                            </div> 
                        );
                    } else {
                        nuggets.push(
                            <div title={title} className={nugget.state} key={title}>
                                {nugget.text}
                            </div>
                        );
                    }
                });
                sections.push(
                    <div className={num_sections > 1 ? 'ues-u-1-' + num_sections : 'ues-u-1'} key={i}>
                    {section.heading ? <div className="card-sub-heading">{section.heading}</div> : ''}
                    {nuggets}
                    </div>
                );
            });
            var spinner;
            if (this.props.spinner) {
                spinner = <Spinner />;
            }
            return <div className="card ues-g">
                <div className="card-title ues-u-1">
                {this.props.title}
                </div>
                {sections}
                {spinner}
                </div>;
        },
    });
    $.fn.card = function(description) {
        this.empty();
        React.renderComponent(Card(description), this.get(0));
        return
    };
}(jQuery));
