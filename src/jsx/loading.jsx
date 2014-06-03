/** @jsx React.DOM */
var Loading = React.createClass({displayName: 'Loading',
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
