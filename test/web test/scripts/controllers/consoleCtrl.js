angular
  .module('app')
    .controller('consoleCtrl', ['$stateParams', function($stateParams) {
      console.log($stateParams);
    }]);
