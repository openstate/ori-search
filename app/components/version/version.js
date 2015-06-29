'use strict';

angular.module('oriApp.version', [
  'oriApp.version.interpolate-filter',
  'oriApp.version.version-directive'
])

.value('version', '0.1');
