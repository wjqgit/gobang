angular
  .module('app')
    .controller('homeCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
      $scope.title = $stateParams.service || 'console';
    }]);
