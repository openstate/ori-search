'use strict';

angular.module('oriApp.options', ['ngRoute'])

.factory("OptionsService", ['ConstantsService',  function (ConstantsService) {
  var svc = {};
  var options_obj;

  svc.get_options = function() {
    return options_obj;
  };

  svc.set_options = function (o) {
    options_obj = o;
  };

  svc.set_default_options = function() {
    console.log('sources in constants:');
    console.dir(ConstantsService.get_municipalities());
    options_obj = {
      filters: {
        collection: {"terms": ConstantsService.get_municipalities().organizations.map(function (o) { return o.meta.collection; })},
        types: {"terms": Object.keys(ConstantsService.get_doc_types()) }
      }
    };
  };

  svc.set_collection = function(municipalities) {
    options_obj.filters.collection.terms = municipalities;
  };

  svc.set_filter_terms = function(filter_name, terms) {
    options_obj.filters[filter_name] = {"terms": terms};
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
