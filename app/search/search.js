'use strict';

angular.module('oriApp.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'search/search.html',
    controller: 'SearchCtrl'
  }).
  when('/search/:q', {
    redirectTo: '/search/:q/page/1'
  }).
  when('/query/:q/page/:page',  {
    templateUrl: 'search/search.html',
    controller: 'SearchCtrl'
  });
}])

.controller('SearchCtrl', ['$scope', function($scope) {
  $scope.query = "";

  $scope.search = function() {
    console.log('should search for ' + $scope.query + ' now!');
  };

  $scope.results = {
    "events": [
      {
        "classification": "Toezeggingen Raad",
        "description": "Toezegging 2013/M082: Zoek een ruimte, vind een plek!",
        "end_date": "2013-11-14T00:00:00",
        "id": "34bc33c1f8a2a66e9e12813ab81d8c7b316c9959",
        "identifiers": [
          {
            "identifier": "3f482b60-370f-4e74-8f85-9baefc9b30f5",
            "scheme": "iBabs"
          },
          {
            "identifier": "34bc33c1f8a2a66e9e12813ab81d8c7b316c9959",
            "scheme": "ORI"
          }
        ],
        "meta": {
          "_score": 2.6828327,
          "_type": "events",
          "collection": "Toezeggingen Raad",
          "ocd_url": "http://localhost:5000/v0/utrecht_reports/34bc33c1f8a2a66e9e12813ab81d8c7b316c9959",
          "original_object_id": "3f482b60-370f-4e74-8f85-9baefc9b30f5",
          "original_object_urls": {
            "html": "https://www.mijnbabs.nl/iBabsWCFService/Public.svc?singleWsdl"
          },
          "processing_finished": "2015-06-23T15:10:26.803536",
          "processing_started": "2015-06-23T15:10:00.007288",
          "rights": "undefined",
          "source_id": "utrecht_reports"
        },
        "name": "Toezegging 2013/M082: Zoek een ruimte, vind een plek!",
        "organisation_id": "gemeente-utrecht-utrecht-ut",
        "start_date": "2013-11-14T00:00:00",
        "status": "confirmed"
      },
      {
        "classification": "Toezeggingen Raad",
        "description": "Vasthouden in detentie van een zieke asielzoeker",
        "end_date": "2014-01-30T00:00:00",
        "id": "b3f3d4c5c194b1acb03ac98cd64cf3d1caf68ebe",
        "identifiers": [
          {
            "identifier": "a879d468-fe4c-4735-9228-07cb44301036",
            "scheme": "iBabs"
          },
          {
            "identifier": "b3f3d4c5c194b1acb03ac98cd64cf3d1caf68ebe",
            "scheme": "ORI"
          }
        ],
        "meta": {
          "_score": 2.2764592,
          "_type": "events",
          "collection": "Toezeggingen Raad",
          "ocd_url": "http://localhost:5000/v0/utrecht_reports/b3f3d4c5c194b1acb03ac98cd64cf3d1caf68ebe",
          "original_object_id": "a879d468-fe4c-4735-9228-07cb44301036",
          "original_object_urls": {
            "html": "https://www.mijnbabs.nl/iBabsWCFService/Public.svc?singleWsdl"
          },
          "processing_finished": "2015-06-23T15:10:26.232924",
          "processing_started": "2015-06-23T15:09:59.251892",
          "rights": "undefined",
          "source_id": "utrecht_reports"
        },
        "name": "Vasthouden in detentie van een zieke asielzoeker",
        "organisation_id": "gemeente-utrecht-utrecht-ut",
        "start_date": "2014-01-30T00:00:00",
        "status": "confirmed"
      },
      {
        "classification": "Toezeggingen Raad",
        "description": "Raad 14 november 2013: Toezegging 2013/M082: Zoek een ruimte, vind een plek!  \n",
        "end_date": "2014-01-13T00:00:00",
        "id": "43dcd6bf2be095d02bbf6e8b47410dc858d78cec",
        "identifiers": [
          {
            "identifier": "708ead27-be85-467c-a119-ed95da78d428",
            "scheme": "iBabs"
          },
          {
            "identifier": "43dcd6bf2be095d02bbf6e8b47410dc858d78cec",
            "scheme": "ORI"
          }
        ],
        "meta": {
          "_score": 2.1462662,
          "_type": "events",
          "collection": "Toezeggingen Raad",
          "ocd_url": "http://localhost:5000/v0/utrecht_reports/43dcd6bf2be095d02bbf6e8b47410dc858d78cec",
          "original_object_id": "708ead27-be85-467c-a119-ed95da78d428",
          "original_object_urls": {
            "html": "https://www.mijnbabs.nl/iBabsWCFService/Public.svc?singleWsdl"
          },
          "processing_finished": "2015-06-23T15:10:26.411493",
          "processing_started": "2015-06-23T15:09:59.518011",
          "rights": "undefined",
          "source_id": "utrecht_reports"
        },
        "name": "Raad 14 november 2013: Toezegging 2013/M082: Zoek een ruimte, vind een plek!  \n",
        "organisation_id": "gemeente-utrecht-utrecht-ut",
        "start_date": "2014-01-13T00:00:00",
        "status": "confirmed"
      },
      {
        "classification": "Meeting Item",
        "end_date": "2015-06-23T19:30:00",
        "id": "b4ba519065e7ad948146e3a128298c751951544c",
        "identifiers": [
          {
            "identifier": "5f456e45-7a9e-4777-9f74-735891f3cdac",
            "scheme": "iBabs"
          },
          {
            "identifier": "b4ba519065e7ad948146e3a128298c751951544c",
            "scheme": "ORI"
          }
        ],
        "location": "Stadhuis",
        "meta": {
          "_score": 2.1462662,
          "_type": "events",
          "collection": "Raadsinformatieavond",
          "ocd_url": "http://localhost:5000/v0/utrecht_meetings/b4ba519065e7ad948146e3a128298c751951544c",
          "original_object_id": "5f456e45-7a9e-4777-9f74-735891f3cdac",
          "original_object_urls": {
            "html": "https://www.mijnbabs.nl/iBabsWCFService/Public.svc?singleWsdl"
          },
          "processing_finished": "2015-06-23T17:54:19.989759",
          "processing_started": "2015-06-23T17:54:15.906627",
          "rights": "undefined",
          "source_id": "utrecht_meetings"
        },
        "name": "1: Volksgezondheidsbeleid Utrecht 2015-2018, \nBouwen aan een gezonde toekomst, \neen uitnodiging aan de stad",
        "organisation_id": "gemeente-utrecht-utrecht-ut",
        "parent_id": "f65027ed0ff73536f61cc8d0c4b602823c78463a",
        "sources": [
          {
            "note": "Voorstel_2990",
            "url": "https://www.mijnbabs.nl/babsapi/publicdownload.aspx?site=Utrecht&id=bb30dd5f-c0c2-4110-b6ea-d1110dd55c1d"
          },
          {
            "note": "Bouwen aan een gezonde toekomst vs DEF",
            "url": "https://www.mijnbabs.nl/babsapi/publicdownload.aspx?site=Utrecht&id=44ae36ae-db9a-4222-b132-2ce3ddeca9ad"
          },
          {
            "note": "Bijlage 2: Illustratie gemeentelijke inzet voor Volksgezondheid (op basis van PB 2015)",
            "url": "https://www.mijnbabs.nl/babsapi/publicdownload.aspx?site=Utrecht&id=bb5199ba-a4be-42b5-aeea-fec460700b40"
          },
          {
            "note": "Clientenraad Wmo zaaknummer 2627456",
            "url": "https://www.mijnbabs.nl/babsapi/publicdownload.aspx?site=Utrecht&id=426ba393-2522-4136-9c1e-f6ac11d90492"
          },
          {
            "note": "Info en Bijdragen meepraters Nota Volksgezondheid",
            "url": "https://www.mijnbabs.nl/babsapi/publicdownload.aspx?site=Utrecht&id=7e0417ed-d893-49f9-ae38-2de4cd423ac5"
          },
          {
            "note": "Presentatie Nota Gezondheid GU v1.1",
            "url": "https://www.mijnbabs.nl/babsapi/publicdownload.aspx?site=Utrecht&id=c1c64512-b9c0-4962-a52b-2ecbb4c77a57"
          }
        ],
        "start_date": "2015-06-23T19:30:00",
        "status": "confirmed"
      },
      {
        "classification": "Meeting Item",
        "description": "Besluit: <p>Door de fracties van de VVD, D66, BBA, GroenLinks en de PvdA wordt de motie &ldquo;Help ondernemers met een BIZ&rdquo; ingediend. Hierin wordt het college verzocht om:<br /><br />1. Informatie-avonden en ondernemersevents te organiseren voor ALLE ondernemers (eigenaren en huurders) van bedrijventerreinen en winkelstrips in Amstelveen. Doel is voor de gemeente om ondernemers te informeren en te enthousiasmeren voor het concept BIZ.<br /><br />2. Deze informatieavond door middel van een brief en via inzet van de lokale media en de gemeentelijke communicatiekanalen aan alle ondernemers kenbaar te maken. Daarnaast tevens de hulp in te zetten van de belangenverenigingen OA, VAD en KHN.</p><p>3. Ge&iuml;nteresseerden worden via deze ondernemersevents gemotiveerd om hun buren op het bedrijventerrein/winkelstrip mee te krijgen in de vorming van een BIZ, nadat het voor hen duidelijk is geworden welke investeringen voor hun betreffende gebied van toepassing zouden kunnen zijn. Dan kan men toewerken naar een succesvolle informele draagvlakmeting. De gemeente houdt bij de voortgang vinger aan de pols en denkt constructief mee.</p><p>4. In het vierde kwartaal van 2015 aan de raad te rapporten wat de uitkomsten zijn van de gemeentelijke inspanningen en hoeveel initiatieven kansrijk zijn.</p><p>De gemeenteraad spreekt als haar mening uit:<br /><br />5. Dat ze zich committeert aan het opzetten van BedrijfsInvesteringsZones en zij zal verzoeken om een financi&euml;le bijdrage aan de initi&euml;le kosten (indicatief &euro; 5.000,- per BIZ) met een positieve grondhouding tegemoet treden.</p><p>Met de stemmen van de fracties van VVD, D66, GroenLinks, BBA, PvdA, CDA en</p><p>ChristenUnie voor wordt de motie door de raad aangenomen.</p>",
        "end_date": "2015-06-03T20:00:00",
        "id": "0d3e994e29a0799bb31a3956931f0bde193a3cff",
        "identifiers": [
          {
            "identifier": "97f8fcbf-1e85-4723-9b3e-22c1d259892c",
            "scheme": "iBabs"
          },
          {
            "identifier": "0d3e994e29a0799bb31a3956931f0bde193a3cff",
            "scheme": "ORI"
          }
        ],
        "location": "Raadzaal",
        "meta": {
          "_score": 1.8970492,
          "_type": "events",
          "collection": "Gemeenteraad",
          "ocd_url": "http://localhost:5000/v0/amstelveen_meetings/0d3e994e29a0799bb31a3956931f0bde193a3cff",
          "original_object_id": "97f8fcbf-1e85-4723-9b3e-22c1d259892c",
          "original_object_urls": {
            "html": "https://www.mijnbabs.nl/iBabsWCFService/Public.svc?singleWsdl"
          },
          "processing_finished": "2015-06-23T18:06:38.317846",
          "processing_started": "2015-06-23T18:06:36.075393",
          "rights": "undefined",
          "source_id": "amstelveen_meetings"
        },
        "name": "22: Actuele motie Help ondernemers met een BedrijfsInvesteringsZone (BIZ)",
        "organisation_id": "gemeente-amstelveen-amstelveen-nh",
        "parent_id": "995f07645074c00b29fc1553411a0dc0b771bca6",
        "sources": [
          {
            "note": "Actuele motie Help ondernemers met een BedrijfsInvesteringsZone (BIZ)",
            "url": "https://www.mijnbabs.nl/babsapi/publicdownload.aspx?site=amstelveen&id=78746432-4bf2-47df-b427-2b036cf17234"
          }
        ],
        "start_date": "2015-06-03T20:00:00",
        "status": "confirmed"
      },
      {
        "classification": "Toezeggingen Raad",
        "description": "Wethouder Jongerius zegt toe dat in de Voorjaarsnota 2015 een plan zal worden gepresenteerd voor een structurele oplossing voor problemen rond de digitale vaardigheden van burgers.",
        "end_date": "2014-07-03T00:00:00",
        "id": "69a0d73457e49ebc9fbee87b3083187829b8971e",
        "identifiers": [
          {
            "identifier": "74f07f15-a0c3-4806-9975-3ecf7952c431",
            "scheme": "iBabs"
          },
          {
            "identifier": "69a0d73457e49ebc9fbee87b3083187829b8971e",
            "scheme": "ORI"
          }
        ],
        "meta": {
          "_score": 1.6096997,
          "_type": "events",
          "collection": "Toezeggingen Raad",
          "ocd_url": "http://localhost:5000/v0/utrecht_reports/69a0d73457e49ebc9fbee87b3083187829b8971e",
          "original_object_id": "74f07f15-a0c3-4806-9975-3ecf7952c431",
          "original_object_urls": {
            "html": "https://www.mijnbabs.nl/iBabsWCFService/Public.svc?singleWsdl"
          },
          "processing_finished": "2015-06-23T15:10:26.025487",
          "processing_started": "2015-06-23T15:09:58.966188",
          "rights": "undefined",
          "source_id": "utrecht_reports"
        },
        "name": "Wethouder Jongerius zegt toe dat in de Voorjaarsnota 2015 een plan zal worden gepresenteerd voor een structurele oplossing voor problemen rond de digitale vaardigheden van burgers.",
        "organisation_id": "gemeente-utrecht-utrecht-ut",
        "start_date": "2014-07-03T00:00:00",
        "status": "confirmed"
      },
      {
        "classification": "Toezeggingen Raad",
        "description": "Vragen van de PvdA-fractie inzake het vasthouden in detentie van een zieke asielzoeker.",
        "end_date": "2014-01-30T00:00:00",
        "id": "4a86e8513f16bda907dc0fadaa6e79071ff27009",
        "identifiers": [
          {
            "identifier": "6c334394-a8ea-4e7b-8215-f71c616ed998",
            "scheme": "iBabs"
          },
          {
            "identifier": "4a86e8513f16bda907dc0fadaa6e79071ff27009",
            "scheme": "ORI"
          }
        ],
        "meta": {
          "_score": 1.5176394,
          "_type": "events",
          "collection": "Toezeggingen Raad",
          "ocd_url": "http://localhost:5000/v0/utrecht_reports/4a86e8513f16bda907dc0fadaa6e79071ff27009",
          "original_object_id": "6c334394-a8ea-4e7b-8215-f71c616ed998",
          "original_object_urls": {
            "html": "https://www.mijnbabs.nl/iBabsWCFService/Public.svc?singleWsdl"
          },
          "processing_finished": "2015-06-23T15:10:26.269288",
          "processing_started": "2015-06-23T15:09:59.284543",
          "rights": "undefined",
          "source_id": "utrecht_reports"
        },
        "name": "Vragen van de PvdA-fractie inzake het vasthouden in detentie van een zieke asielzoeker.",
        "organisation_id": "gemeente-utrecht-utrecht-ut",
        "start_date": "2014-01-30T00:00:00",
        "status": "confirmed"
      },
      {
        "classification": "Toezeggingen Raad",
        "description": "Raad 30 mei 2013: Toezegging 2013/M027: Een ambitieus \"Forum West\" als High Line van Utrecht ",
        "end_date": "2014-01-13T00:00:00",
        "id": "bd3ed5e7ca9a576ce17dbc8c7af4568d2c5ea0df",
        "identifiers": [
          {
            "identifier": "e7494821-870a-483d-81c5-36e2c0c82f99",
            "scheme": "iBabs"
          },
          {
            "identifier": "bd3ed5e7ca9a576ce17dbc8c7af4568d2c5ea0df",
            "scheme": "ORI"
          }
        ],
        "meta": {
          "_score": 1.5176394,
          "_type": "events",
          "collection": "Toezeggingen Raad",
          "ocd_url": "http://localhost:5000/v0/utrecht_reports/bd3ed5e7ca9a576ce17dbc8c7af4568d2c5ea0df",
          "original_object_id": "e7494821-870a-483d-81c5-36e2c0c82f99",
          "original_object_urls": {
            "html": "https://www.mijnbabs.nl/iBabsWCFService/Public.svc?singleWsdl"
          },
          "processing_finished": "2015-06-23T15:10:26.719298",
          "processing_started": "2015-06-23T15:09:59.875215",
          "rights": "undefined",
          "source_id": "utrecht_reports"
        },
        "name": "Raad 30 mei 2013: Toezegging 2013/M027: Een ambitieus \"Forum West\" als High Line van Utrecht ",
        "organisation_id": "gemeente-utrecht-utrecht-ut",
        "start_date": "2014-01-13T00:00:00",
        "status": "confirmed"
      },
      {
        "classification": "Toezeggingen Raad",
        "description": "Raad 25 oktober 2012: Toezegging 2012/M089: Een levendig en leefbaar ledig Erf  \n",
        "end_date": "2014-01-13T00:00:00",
        "id": "13cfa3442327b8e2537bff1f157fd42dc0104bd3",
        "identifiers": [
          {
            "identifier": "5285c07f-4aac-4c33-96a4-4286b6c2aa4a",
            "scheme": "iBabs"
          },
          {
            "identifier": "13cfa3442327b8e2537bff1f157fd42dc0104bd3",
            "scheme": "ORI"
          }
        ],
        "meta": {
          "_score": 1.5176394,
          "_type": "events",
          "collection": "Toezeggingen Raad",
          "ocd_url": "http://localhost:5000/v0/utrecht_reports/13cfa3442327b8e2537bff1f157fd42dc0104bd3",
          "original_object_id": "5285c07f-4aac-4c33-96a4-4286b6c2aa4a",
          "original_object_urls": {
            "html": "https://www.mijnbabs.nl/iBabsWCFService/Public.svc?singleWsdl"
          },
          "processing_finished": "2015-06-23T15:10:26.748901",
          "processing_started": "2015-06-23T15:09:59.932572",
          "rights": "undefined",
          "source_id": "utrecht_reports"
        },
        "name": "Raad 25 oktober 2012: Toezegging 2012/M089: Een levendig en leefbaar ledig Erf  \n",
        "organisation_id": "gemeente-utrecht-utrecht-ut",
        "start_date": "2014-01-13T00:00:00",
        "status": "confirmed"
      },
      {
        "classification": "Toezeggingen Raad",
        "description": "Voorstel tot het beschikbaar stellen van een krediet voor de Jaarbeursgarage ",
        "end_date": "2015-01-29T00:00:00",
        "id": "096c4ea7016bbac34e6b51aafd04c6f2cee85d96",
        "identifiers": [
          {
            "identifier": "01dc1a69-db3f-4064-ba8a-5368987a4dd6",
            "scheme": "iBabs"
          },
          {
            "identifier": "096c4ea7016bbac34e6b51aafd04c6f2cee85d96",
            "scheme": "ORI"
          }
        ],
        "meta": {
          "_score": 1.5176394,
          "_type": "events",
          "collection": "Toezeggingen Raad",
          "ocd_url": "http://localhost:5000/v0/utrecht_reports/096c4ea7016bbac34e6b51aafd04c6f2cee85d96",
          "original_object_id": "01dc1a69-db3f-4064-ba8a-5368987a4dd6",
          "original_object_urls": {
            "html": "https://www.mijnbabs.nl/iBabsWCFService/Public.svc?singleWsdl"
          },
          "processing_finished": "2015-06-23T15:10:25.808027",
          "processing_started": "2015-06-23T15:09:58.702270",
          "rights": "undefined",
          "source_id": "utrecht_reports"
        },
        "name": "Voorstel tot het beschikbaar stellen van een krediet voor de Jaarbeursgarage ",
        "organisation_id": "gemeente-utrecht-utrecht-ut",
        "start_date": "2015-01-29T00:00:00",
        "status": "confirmed"
      }
    ],
    "meta": {
      "took": 10,
      "total": 16
    }
  };
}]);
