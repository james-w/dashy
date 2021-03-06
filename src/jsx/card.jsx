/** @jsx React.DOM */
var Card = React.createClass({displayName: 'Card',
    render: function() {
        var num_sections = this.props.sections.length;
        var sections = [];
        $.each(this.props.sections, function(i, section) {
            var nuggets = [];
            $.each(section.nuggets || [], function(i, nugget) {
                var key = nugget.object_name + '-' + nugget.label;
                if (nugget.ratio) {
                    nuggets.push(<RatioNugget 
                                    a={nugget.a}
                                    b={nugget.b}
                                    stat={nugget.label}
                                    object={nugget.object_name}
                                    key={key}
                                 />);
                } else {
                    nuggets.push(<Nugget
                                    text={nugget.text}
                                    state={nugget.state}
                                    stat={nugget.label}
                                    object={nugget.object_name}
                                    key={key}
                                 />);
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
            spinner = <Loading />;
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
