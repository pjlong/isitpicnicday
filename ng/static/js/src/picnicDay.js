(function () {
    angular.module('picnicDayApp', ['ngRoute'])
        .config(appConfig)
        .run(appSetup)
        .controller('PicnicDayCtrl', PicnicDayCtrl)
        .directive('flipClock', flipClock)
        .directive('pdAudio', pdAudio)
        .factory('pageTitle', pageTitleFactory);
    
    /* @ngInject */
    function appConfig ($locationProvider) {
        $locationProvider.html5Mode(true);
    }

    /* @ngInject */
    function appSetup ($rootScope, pageTitle) {
        $rootScope.pageTitle = pageTitle;
    }

    /* @ngInject */
    function PicnicDayCtrl ($scope, $location, pageTitle) {
        /*
         * PD2015 Date
         */
        $scope.picnicDayDate = new Date (2015, 03, 18, 0, 0, 0);
        $scope.today = new Date();
        $scope.itsPicnicDay = itsPicnicDay; 

        _routeQueryParams();

        //////////////////////////
        // Function Definitions //
        //////////////////////////

        /**
         * Test url params to set current date to Picnic Day
         */
        function _routeQueryParams () {
            if ("__itsPicnicDay" in $location.search() && 
                    $location.search().__itsPicnicDay == "true") {
                $scope.today = $scope.picnicDayDate;
            }            
        }

        /**
         * checks Date, Month and Year for the date of Picnic Day 2015
         */
        function itsPicnicDay () {
            return $scope.today.getFullYear() == $scope.picnicDayDate.getFullYear() &&
                $scope.today.getMonth() == $scope.picnicDayDate.getMonth() &&
                $scope.today.getDate() == $scope.picnicDayDate.getDate();
        }
    }

    function flipClock () {
        return {
            restrict: 'AEC',
            scope: {
                countdown: "="
            },
            link: function (scope, el, attrs) {
                var diff = scope.countdown - Date.now();

                var flipClock = $(el).FlipClock(diff/1000, {
                    clockFace: 'DailyCounter',
                    countdown: true
                });
            }
        };
    }

    /* @ngInject */
    function pdAudio ($interval, $timeout) {
        var template = '<audio loop><div ng-transclude></div></audio>' +
            '<div class="audio-control"><button ng-click="playPause();"></button></div>';

        return {
            restrict: 'E',
            template: template,
            transclude: 'true',
            link: function (scope, el, attrs, ctrl, transclude) {
                el.find('[ng-transclude]').replaceWith(transclude());

                var audioEl = el.find('audio'),
                    volume = 0,
                    volIncrease;

                audioEl.get(0).volume = 0;
                audioEl.get(0).oncanplaythrough = startMadness;

                function startMadness () {
                    var _this = this;

                    _this.play();
                    $timeout(function () {
                        volIncrease = $interval(function () {
                            if (volume >= 1) {
                                $interval.cancel(volIncrease);
                                return;
                            }

                            audioEl.get(0).volume = volume;
                            volume += 0.05;
                        }, 1000);
                    }, 5000);
                }
            }
        };
    }

    function pageTitleFactory () {
        var title = "Is it Picnic Day?";
    
        return {
            get: function () { return title; },
            set: function (newTitle) { title = newTitle; }
        };
    }
})();
