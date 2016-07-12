var helper = (function () {
    function addClass(el, className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    }
    function removeClass(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
    return {
        addClass: addClass,
        removeClass: removeClass
    };
})();

var pokemonGOServer = (function () {

    function getResponseTime(callback) {
        var request = new XMLHttpRequest();
        var start_time = new Date().getTime();
        request.open('GET', 'https://pgorelease.nianticlabs.com/plfe', true);
        request.onreadystatechange = function () {
            var request_time = new Date().getTime() - start_time;
            callback(request_time);
        };
        request.send();
    }

    return {
        getResponseTime: getResponseTime
    };
})();
var pokemonGOStatus = (function (self) {
    self.init = function () {
        self.$status = document.getElementById('status');
        self.$loader = document.getElementById('loader');
        self.updateStatus();
    };

    self.updateStatus = function () {
        pokemonGOServer.getResponseTime(function (time) {
            helper.removeClass(self.$loader, 'active');
            if (time < 800) {
                helper.addClass(self.$status, 'status-ok');
                helper.addClass(self.$status, 'status-active');
            }

            if (time >= 800 && time < 3000) {
                helper.addClass(self.$status, 'status-slow');
            }

            if (time >= 3000) {
                helper.addClass(self.$status, 'status-down');
            }
        });
    };

    return self;
})(pokemonGOStatus || {});