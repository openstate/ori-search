'use strict';

angular.module('oriApp.branding', ['ngRoute'])

.factory("BrandingService", ['$http', function ($http) {
  var svc = {};

  var hostname = window.location.hostname;
  var branding = {
      'zoek.openraadsinformatie.nl': {
        'api_base_url': 'http://api.openraadsinformatie.nl/v0',
        'name': 'Open Raadsinformatie',
        'byline': 'Zoeken in stukken van de gemeenteraad',
        'logo': 'logo.svg',
        'governing_body_types': ['Municipality'],
        'footer': 'footer.html',
        'links': {
          'about': 'http://www.openraadsinformatie.nl/'
        }
      },
      'zoek.openstateninformatie.nl': {
        'api_base_url': 'http://api.openraadsinformatie.nl/v0',
        'name': 'Open Stateninformatie',
        'byline': 'Zoeken in stukken van de provinciale staten',
        'logo': 'logo-provinces.svg',
        'governing_body_types': ['Province'],
        'footer': 'footer-provinces.html',
        'links': {
          'about': 'https://www.noord-holland.nl/Actueel/Archief/2018/Juli_2018/Zoekmachine_maakt_volgen_provinciaal_bestuur_eenvoudiger'
        }
      },
      'localhost': {
        'api_base_url': 'http://api.openraadsinformatie.nl/v0',
        //'api_base_url': 'http://localhost:5000/v0',
        'name': 'Open Blah Informatie',
        'byline': 'Zoeken in stukken van de blah',
        'logo': 'logo-provinces.svg',
        'governing_body_types': ['Municipality', 'Province'],
        'footer': 'footer-provinces.html',
        'links': {
          'about': 'http://www.openstate.eu/'
        }
      },
  };

  svc.get_branding = function() {
    return branding[hostname];
  }

  return svc;
}]);
