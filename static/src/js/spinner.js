(function ($) {
    $.fn.spinner = function() {
        this.append($('<div class="spinner"><div class="spinner_holder"><div class="mask"><div class="maskedCircle"></div></div></div></div>'));
        return this;
    };
}(jQuery));
