angular
    .module('app', [
        'ui.router'
    ]).config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/console');

        var states = [
          {
            name: 'console',
            url: '/console',
            component: 'console'
          },
          {
            name: 'console.home',
            url: '/home',
            views: {
              'navbar@console': {
                component: 'navbar'
              },
              'content@console': {
                component: 'home'
              }
            }
          },
          {
            name: 'service',
            url: '/:service',
            component: 'console'
          },
          {
            name: 'service.home',
            url: '/home',
            views: {
              'navbar@service': {
                component: 'navbar'
              },
              'content@service': {
                component: 'home'
              }
            }
          },
          {
            name: 'service.function',
            url: '/:function'
          }
       ];

        states.forEach(function(state) {
            $stateProvider.state(state);
        });
    }]);
