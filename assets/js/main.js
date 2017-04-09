var Main = (function() {
    var init = function() {
		svg4everybody();
    };

    return {
        init: init
    };
})();

document.addEventListener("DOMContentLoaded", function(event) {
    Main.init();
});