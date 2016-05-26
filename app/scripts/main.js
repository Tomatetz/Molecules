/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        marionette: {
            deps: [
                'backbone'
            ],
            exports: 'Marionette'
        },
        chemDoodleUis: {
            deps: [
                'chemDoodle'
            ],
            exports: 'ChemDoodle'
        }
    },
    paths: {
        jquery: 'vendors/jquery/dist/jquery',
        backbone: 'vendors/backbone/backbone',
        underscore: 'vendors/underscore/underscore',
        marionette: 'vendors/marionette/lib/backbone.marionette',
        chemDoodle: 'vendors/ChemDoodleWeb-unpacked',
        chemDoodleUis: 'vendors/ChemDoodleWeb-uis-unpacked',
        cycle: 'vendors/cycle',
        app: './app'
    }
});

require([
    'backbone', 'marionette','chemDoodleUis', 'app'
], function (Backbone, Marionette) {});