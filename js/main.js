/**
 * Various helper functions
 */
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
/**
 * Service for Pokemon GO Server actions
 */
var pokemonGOServer = (function () {
    /**
     * Returns the respond time in milliseconds
     */
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
/**
 * Module for the 'Pokemon Go Status Website'
 */
var pokemonGOStatus = (function (self) {
    /**
     * Initializes this module
     */
    self.init = function () {
        self.$status = document.getElementById('status');
        self.$loader = document.getElementById('loader');
        self.$intervalStatus = document.getElementById('intervalStatus');
        self.updateStatus();
        self.intervalSeconds = 5;
        self.updateIntervalStatus();        
        // Set up update interval
        window.setInterval(self.updateIntervalStatus, 1000);
    };

    /**
     * Updates the status of the interval in the ui
     * and updates the Status every 5th call
     */
    self.updateIntervalStatus = function () {
        self.$intervalStatus.innerText = "Refreshing in " + self.intervalSeconds + " seconds";
        self.intervalSeconds--;
        if (self.intervalSeconds == -1) {
            self.updateStatus();
            self.intervalSeconds = 5;
        }
    }
    /**
     * Updates the status in the UI by the corresponding
     * response time
     */
    self.updateStatus = function () {
        pokemonGOServer.getResponseTime(function (time) {
            helper.removeClass(self.$loader, 'active');
            helper.addClass(self.$status, 'status-active');
            helper.removeClass(self.$status, 'status-ok');
            helper.removeClass(self.$status, 'status-slow');
            helper.removeClass(self.$status, 'status-down');
            if (time < 800) {
                helper.addClass(self.$status, 'status-ok');
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