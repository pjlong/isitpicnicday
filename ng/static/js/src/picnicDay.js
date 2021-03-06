(function () {
    angular.module('picnicDayApp', ['ui.router', 'timer'])
        .config(appConfig)
        .run(appSetup)
        .controller('PicnicDayCtrl', PicnicDayCtrl)
        .controller('HypeCtrl', HypeCtrl)
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
            .state('hype', {
                url: '/hype',
                controller: 'HypeCtrl',
                controllerAs: '$vm',
                templateUrl: '/ng/hype.html'
            });
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
            pageTitle.set('Is it Picnic Day?');
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
                    $location.search().__itsPicnicDay === "true") {
                $scope.picnicDayDate = $scope.today;
            }

            if ("__setDate" in $location.search()) {
                var date = new Date($location.search().__setDate);

                if (!isNaN(date.getTime())) {
                    var diff = moment(date).diff($scope.picnicDayDate);

                    $scope.picnicDayDate = moment($scope.today).subtract(diff, 'milliseconds').toDate();
                }
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
    function HypeCtrl (pageTitle) {

        init();

        function init () {
            pageTitle.set('Picnic Day HYPE!');
        }
    }

    /* @ngInject */
    function pdAudio ($interval, $timeout) {
        return {
            restrict: 'A',
            scope: {
                buildUp: '@',
                delay: '@'
            },
            link: function (scope, el, attrs, ctrl, transclude) {
                var volume = 0,
                    volIncrease;

                init();

                function init () {
                    if (scope.buildUp === undefined) {
                        scope.buildUp = 1000;
                    }

                    if (scope.delay === undefined) {
                        scope.delay = 3000;
                    }

                    scope.buildUp = parseInt(scope.buildUp);
                    scope.delay = parseInt(scope.delay);

                    if (scope.delay === 0) {
                        scope.delay = 1;
                    }

                    if (scope.buildUp === 0) {
                        el[0].volume = 1;
                    } else {
                        el[0].volume = 0;
                    }

                    el[0].oncanplaythrough = startMadness;
                }

                function startMadness () {
                    var _this = this;

                    $timeout(function () {
                        _this.play();

                        if (scope.buildUp > 0) {
                            volIncrease = $interval(function () {
                                if (volume >= 1) {
                                    $interval.cancel(volIncrease);
                                    return;
                                }

                                el.get(0).volume = volume;
                                volume += 0.05;
                            }, scope.buildUp);
                        }
                    }, scope.delay);
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
