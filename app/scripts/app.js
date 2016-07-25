define(['backbone', 'marionette', 'chemDoodleUis'],
    function (Backbone, Marionette, chemDoodleUis) {
        var app = new Backbone.Marionette.Application();
        app.url = '.';
        require(['model', 'view'], function (Model, View) {
            var Controller = Backbone.Router.extend({
                routes: {
                    'landing': 'main'
                },
                main: function(){
                    var moleculesCollection = new Backbone.Collection([]);
                    var moleculesView = new View.MoleculesView({
                        collection: moleculesCollection
                    });
                    $('.main').append(moleculesView.render().el);
                }
            });
            app.controller = new Controller();
            Backbone.history.stop();
            Backbone.history.start();
            if (Backbone.history) {
                var fragment = Backbone.history.getFragment().split('/')[0];
                var routes = ['new', 'landing'];
                if (!Backbone.history.getFragment() || _.indexOf(routes, fragment) == -1) {
                    app.controller.navigate('landing', true);
                }
            }
        });
    return app;
});