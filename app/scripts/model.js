define(['app'],
    function (app) {
        app.module('Show.Model', function (Model, app, Backbone) {
            Model.exportGWS = Backbone.Model.extend({
                defaults: function () {
                    return {
                        atoms: {
                            atomic_number: [],
                            attach: [],
                            insert: {}
                        },
                        bonds: []
                    };
                }
            });

            Model.molecule = Backbone.Model.extend({
                urlRoot: app.url + '/api/molecule'
            });
            Model.molecules = Backbone.Model.extend({
                urlRoot: app.url + '/api/molecules'
            });
            Model.saveExperiment = Backbone.Model.extend({
                urlRoot: app.url + '/api/experiment'
            });
        });

        return app.Show.Model
    });