'use strict';

angular.module('oriApp.options', ['ngRoute'])

.factory("OptionsService", ['ORIAPIService',  function (ORIAPIService) {
  var svc = {};
  var options_obj;

  svc.get_options = function() {
    return options_obj;
  };

  svc.set_options = function (o) {
    options_obj = o;
  };

  var options_to_b64 = function(o) {
    return window.LZString.compressToBase64(JSON.stringify(o)).split('/').join('-');
  }

  var b64_to_options = function(b) {
    return JSON.parse(window.LZString.decompressFromBase64(b.split('-').join('/')));
  };

  svc.get_options_b64 = function() {
    return options_to_b64(options_obj);
  }

  svc.set_options_b64 = function (b) {
    options_obj = b64_to_options(b);
  }

  svc.get_options_with_args_b64 = function (a) {
    var new_options_obj = $.extend({}, options_obj, a);
    return options_to_b64(new_options_obj);
  }

  return svc;
}]);
