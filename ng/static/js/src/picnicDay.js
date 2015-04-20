(function () {
    angular.module('picnicDayApp', ['ngRoute', 'timer'])
        .config(appConfig)
        .run(appSetup)
        .controller('PicnicDayCtrl', PicnicDayCtrl)
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
        $scope.picnicDayDate = new Date (2016, 03, 16, 0, 0, 0);
        $scope.today = new Date();
        $scope.bgOpacity = bgOpacity;
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

        function _daysUntilPicnicDay () {
            return moment($scope.picnicDayDate).diff(moment(), 'days');
        }

        function bgOpacity () {
            var daysUntil = _daysUntilPicnicDay(),
                pdSeasonCutoff = 21; //3 weeks

            if (daysUntil === 0) {
                return 1;
            } else if (daysUntil < pdSeasonCutoff && daysUntil !== 0) {
                return 0.5 * ((pdSeasonCutoff - daysUntil + 1) / pdSeasonCutoff);
            } else {
                return 0;
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

    /* @ngInject */
    function pdAudio ($interval, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, el, attrs, ctrl, transclude) {
                console.log('audio');
                var volume = 0,
                    volIncrease;

                el[0].volume = 0;
                el[0].oncanplaythrough = startMadness;

                function startMadness () {
                    var _this = this;

                    $timeout(function () {
                        _this.play();

                        volIncrease = $interval(function () {
                            if (volume >= 1) {
                                $interval.cancel(volIncrease);
                                return;
                            }

                            el.get(0).volume = volume;
                            volume += 0.05;
                        }, 1000);
                    }, 3000);
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
