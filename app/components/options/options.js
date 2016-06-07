'use strict';

angular.module('oriApp.options', ['ngRoute'])

.factory("OptionsService", ['ConstantsService',  function (ConstantsService) {
  var svc = {};
  var options_obj;
  var internal_options = {
    single_mode: false,
    municipality: undefined,
    sidebar_visible: false
  };

  svc.get_internal_option = function(name) {
    return internal_options[name];
  };

  svc.set_internal_option = function(name, val) {
    internal_options[name] = val;
  };

  svc.get_options = function() {
    return options_obj;
  };

  svc.set_options = function (o) {
    options_obj = o;
  };

  svc.set_default_options = function() {
    // console.log('sources in constants:');
    // console.dir(ConstantsService.get_municipalities());
    var x = new Date();
    options_obj = {
      filters: {
        collection: {"terms": ConstantsService.get_municipalities().organizations.map(function (o) { return o.meta.collection; })},
        types: {"terms": ConstantsService.get_doc_types_as_keys() },
        classification: {"terms": ConstantsService.get_classifications() },
        start_date: {"from": "2006-01-01T00:00:00Z", "to": x.toISOString()}
      },
      facets: {
        start_date: {"interval": "year"},
      },
      sort: '_score',
      order: 'desc'
    };
  };

  svc.set_facet = function(facet_name, facet_obj) {
    options_obj.facets[facet_name] = facet_obj;
  };

  svc.set_facet_option = function(facet_name, facet_option, facet_val) {
    options_obj.facets[facet_name][facet_option] = facet_val;
  };

  svc.get_facet_option = function(facet_name, facet_option) {
    return options_obj.facets[facet_name][facet_option];
  };

  svc.set_collection = function(municipalities) {
    options_obj.filters.collection.terms = municipalities;
  };

  svc.set_filter_terms = function(filter_name, terms) {
    options_obj.filters[filter_name] = {"terms": terms};
  };

  svc.set_filter = function(filter_name, filter_obj) {
    options_obj.filters[filter_name] = filter_obj;
  };

  svc.set_filter_option = function(filter_name, filter_option, filter_val) {
    options_obj.filters[filter_name][filter_option] = filter_val;
  };

  svc.get_filter = function(filter_name) {
    return options_obj.filters[filter_name];
  };

  svc.set_option = function(option_name, val) {
    options_obj[option_name] = val;
  };

  svc.get_option = function(option_name) {
    return options_obj[option_name];
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
