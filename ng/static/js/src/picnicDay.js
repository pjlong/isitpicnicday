(function () {
    angular.module('picnicDayApp', ['ui.router', 'timer'])
        .config(appConfig)
        .run(appSetup)
        .controller('PicnicDayCtrl', PicnicDayCtrl)
        .directive('pdAudio', pdAudio)
        .factory('pageTitle', pageTitleFactory);

    /* @ngInject */
    function appConfig ($stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $stateProvider
            .state('main', {
                url: '/',
                controller: 'PicnicDayCtrl',
                controllerAs: '$vm',
                templateUrl: '/ng/main.html'
            })
/*            .state('hype', {
                url: '/hype',
                controller: 'HypeCtrl',
                controllerAs: '$vm'
            });*/
    }

    /* @ngInject */
    function appSetup ($rootScope, pageTitle) {
        $rootScope.pageTitle = pageTitle;
    }

    /* @ngInject */
    function PicnicDayCtrl ($scope, $rootScope, $location, pageTitle) {
        /*
         * PD2015 Date
         */
        $scope.today = new Date();
        $scope.picnicDayDate = new Date (2016, 03, 16, 0, 0, 0);
        $scope.bgOpacity = bgOpacity;
        $scope.itsPicnicDay = false;
        $scope.itsAlmostPicnicDay = false;
        $scope.broadcastPicnicDay = broadcastPicnicDay;

        $scope.$on('itsPicnicDay', function () {
            $scope.itsPicnicDay = true;
        });

        init();

        //////////////////////////
        // Function Definitions //
        //////////////////////////

        function init() {
            //set up vars
            _routeQueryParams();

            if (bgOpacity() > 0) {
                $scope.itsAlmostPicnicDay = true;
            }
        }

        /**
         * Test url params to set current date to Picnic Day
         */
        function _routeQueryParams () {
            if ("__itsPicnicDay" in $location.search() &&
                    $location.search().__itsPicnicDay == "true") {
                $scope.picnicDayDate = $scope.today;
            }

            if ("__setDate" in $location.search()) {
                var date = new Date($location.search().__setDate);

                if (!isNaN(date.getTime())) {
                    var diff = moment(date).diff($scope.picnicDayDate);

                    $scope.picnicDayDate = moment($scope.today).subtract(diff, 'milliseconds').toDate();
                }
            } else {

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

        function broadcastPicnicDay () {
            $rootScope.$broadcast('itsPicnicDay');
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
