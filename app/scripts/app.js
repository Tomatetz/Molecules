define(['backbone', 'marionette', 'chemDoodleUis'],
    function (Backbone, Marionette, chemDoodleUis) {
        var app = new Backbone.Marionette.Application();
        app.url = '.';
        //app.url = 'http://192.168.40.107:5000';
        require(['model', 'view'], function (Model, View) {
            //console.log(ChemDoodle);
            var Controller = Backbone.Router.extend({

                routes: {
                    'landing': 'main'
                },
                main: function(){
                    var temp = [/*{a:2}, {a:3}, {a:4}*/];
                    var moleculesCollection = new Backbone.Collection(temp);
                    var moleculesView = new View.MoleculesView({
                        collection: moleculesCollection
                    });
                    $('.main').append(moleculesView.render().el);

                    //console.log(moleculesView);
                }
                //newExp: function () {
                //    this.setCollection(null, 'newExperiment');
                //},
                //clone: function (data) {
                //    this.setCollection(data, 'showConfig');
                //},
                //result: function (data) {
                //    this.setCollection(data, 'showResult');
                //},
                //setCollection: function (expId, effect) {
                //    $('.experiment-container').parent().remove();
                //    $('.main_container-wrapper').parent().remove();
                //    var configs = new Model.configs();
                //    var experimentResultsModel;
                //    var parcurLayoutView = new View.ParcurLayout();
                //    $('body').append(parcurLayoutView.render().el);
                //    $.when(configs.fetch({
                //        success: function (resp) {
                //            var unfiltered = _.sortBy(resp.get('configs'), '__upload__');
                //            resp.configs = unfiltered.reverse();
                //            var experimentsCollection = new Backbone.Collection(resp.configs,
                //                {model: Model.defaultExperiment}
                //            );
                //            configs.set('experimentsCollection', experimentsCollection);
                //            var experimentsCollectionView = new View.ExperimentsView({
                //                collection: experimentsCollection
                //            });
                //            parcurLayoutView.experiments.show(experimentsCollectionView);
                //            experimentsCollectionView.on('new:experiment', function (data) {
                //                parcurLayoutView.experiments.$el.parent().parent().hide();
                //                var newModel = new Model.defaultExperiment;
                //                if (data) {
                //                    var id = expId ? expId : data.model.get('_id');
                //                    _.each(experimentsCollection.models, function (experiment) {
                //                        if (experiment.attributes._id == id) {
                //                            newModel = experiment;
                //                        }
                //                    });
                //                }
                //                if (newModel.get('platesWithSamples').length == 0) {
                //                    newModel.setPlatesWithSamplesAttribute();
                //                }
                //                var configView = new View.MainConfig({
                //                    model: newModel
                //                });
                //                $('body').append(configView.render().el);
                //                var platesCollection = new Backbone.Collection(newModel.get('platesWithSamples'));
                //                var platesCollectionView = new View.MainPlatesCollection({
                //                    collection: platesCollection
                //                });
                //                configView.$el.find('.plates').append(platesCollectionView.render().el);
                //
                //                var overallSamplesCollection = new Backbone.Collection(newModel.get('allSamples'));
                //                var overallSamplesCollectionView = new View.SamplesCollection({
                //                    collection: overallSamplesCollection
                //                });
                //                configView.$el.find('.samples-list').append(overallSamplesCollectionView.render().el);
                //
                //                overallSamplesCollectionView.on('new:sample', function (clickedChild) {
                //                    newModel.setAllSamples(overallSamplesCollection);
                //                    configView.hideSamples();
                //                    newModel.setPlatesWithSamples(clickedChild);
                //                    platesCollection.reset(newModel.get('platesWithSamples'));
                //                });
                //                newModel.on('show:selectResultsModal', function () {
                //                    $.when(configs.fetch({
                //                        error: function(model, xhr, options){
                //                            app.showErrorMessage(model, xhr, options);
                //                        }
                //                    })).then(
                //                        function (resp) {
                //                            resp.configs = _.sortBy(resp.configs, '__upload__').reverse();
                //                            experimentsCollection.reset(resp.configs);
                //                            var experimentsAdvanced = new Backbone.Collection(_.filter(resp.configs, function(config){
                //                                return config.type != 'negative control'
                //                            }));
                //                            var experimentsAdvancedCollectionView = new View.PlatesOverallAdvanced({
                //                                collection: experimentsAdvanced
                //                            });
                //                            $('body').append(experimentsAdvancedCollectionView.render().el);
                //                            experimentsAdvanced.on('set:plateset', function (data) {
                //                                console.log(data);
                //                                var response = {
                //                                    a: 12,
                //                                    b:28,
                //                                    d:13
                //                                };
                //                                $.ajax({
                //                                    type: 'POST',
                //                                    url: './api/eq_limits',
                //                                    contentType: 'application/json',
                //                                    dataType: 'json',
                //                                    data: JSON.stringify(data)
                //                                }).then(function (params) {
                //                                    console.log(params);
                //                                    configView.$el.find('#EqTest-A').val(response.a);
                //                                    configView.$el.find('#EqTest-B').val(response.b);
                //                                    configView.$el.find('#EqTest-D').val(response.d);
                //
                //                                });
                //                            });
                //                        }
                //                    );
                //                });
                //
                //                platesCollectionView.on('move:sample', function (clickedChild) {
                //                    newModel.setPlatesWithSamples(clickedChild);
                //                });
                //                newModel.on('show:result', function (id) {
                //                    configView.remove();
                //                    experimentsCollectionView.trigger('refresh:collection');
                //
                //                    experimentsCollection.on('updated', function () {
                //                        var filtered = _.sortBy(experimentsCollectionView.collection.models, function (expModel) {
                //                            expModel._id;
                //                        });
                //                        id = id ? id : filtered[0].get('_id');
                //
                //                        experimentsCollectionView.trigger('show:experiment', id);
                //                        parcurLayoutView.experiments.$el.parent().parent().show();
                //                        Backbone.history.navigate('experiment/' + id);
                //                    });
                //                });
                //                newModel.on('clicked:back', function () {
                //                    configView.remove();
                //                    parcurLayoutView.experiments.$el.parent().parent().show();
                //                });
                //                newModel.on('change:platesWithSamples', function () {
                //                    platesCollection.reset(newModel.get('platesWithSamples'));
                //                });
                //                newModel.on('change:allSamples', function () {
                //                    overallSamplesCollection.reset(newModel.get('allSamples'));
                //                });
                //                configView.on('show:upload', function () {
                //                    var uploadModal = new View.UploadFiles();
                //                    uploadModal.on('uploaded:plates', function (data) {
                //                        var platesArray = newModel.get('allPlates') ? newModel.get('allPlates').slice('') : [];
                //                        _.each(data.plates, function (plate) {
                //                            var id = plate._id?plate._id:plate.id;
                //                            _.uniq(platesArray.push(id));
                //                        });
                //                        var uploaded = _.difference(platesArray, newModel.get('allPlates'));
                //                        if (!!_.difference(platesArray, newModel.get('allPlates')).length) {
                //                            newModel.fetchPlates(uploaded);
                //                            newModel.set('allPlates', platesArray);
                //                        }
                //                    });
                //                    $('body').append(uploadModal.render().el);
                //                });
                //            });
                //
                //            if (effect == 'newExperiment') {
                //                experimentsCollectionView.trigger('new:experiment');
                //            }
                //            experimentsCollectionView.on('clone:experiment', function (clickedChild) {
                //
                //                app.controller.setCollection(clickedChild.model.get('_id'), 'showConfig');
                //            });
                //            experimentsCollectionView.on('refresh:collection', function () {
                //                $.when(configs.fetch({
                //                    success: function (resp) {
                //                        resp.configs = _.sortBy(resp.get('configs'), '__upload__').reverse();
                //                        experimentsCollection.reset(resp.configs);
                //                        experimentsCollection.trigger('updated');
                //                    },
                //                    error: function(model, xhr, options){
                //                        app.showErrorMessage(model, xhr, options);
                //                    }
                //                }));
                //            });
                //
                //            experimentsCollectionView.on('experiment:delete', function () {
                //                experimentsCollectionView.trigger('refresh:collection');
                //            });
                //            experimentsCollectionView.on('show:experiment', function (data) {
                //                var experiment = new Model.experiment({id: data});
                //                $.when(experiment.fetch({
                //                    error: function(model, xhr, options){
                //                        app.showErrorMessage(model, xhr, options);
                //                    }
                //                })).then(
                //                    function (experimentData) {
                //                        if (!experimentData.error_message) {
                //                            if (!$('.experiment-name-header').length) {
                //                                experimentResultsModel = new Backbone.Model(experimentData);
                //                                var experimentResultsView = new View.ExperimentResults({
                //                                    model: experimentResultsModel
                //                                });
                //                                parcurLayoutView.result.show(experimentResultsView);
                //                                //todo: move to view
                //                                $('[data-id="' + data + '"]').addClass('exp-active');
                //                            } else {
                //                                experimentResultsModel.set('result', experimentData.result);
                //                            }
                //                        } else {
                //                            parcurLayoutView.$el.find('#experiment-results').html(experimentData.error_message);
                //                        }
                //                        $(window).resize();
                //                    }
                //                );
                //            });
                //            if (expId) {
                //                if (effect == 'showResult') {
                //                    experimentsCollectionView.trigger('show:experiment', expId);
                //                }
                //                else if (effect == 'showConfig') {
                //                    var id = expId;
                //                    _.each(experimentsCollection.models, function (experiment) {
                //                        if (experiment.attributes._id == id) {
                //                            experimentsCollectionView.trigger('new:experiment', experiment);
                //                        }
                //                    });
                //                }
                //            }
                //        },
                //        error: function(model, xhr, options){
                //            app.showErrorMessage(model, xhr, options);
                //        }
                //    }));
                //}
            });

            //app.showErrorMessage= function(model, xhr, options){
            //    var errorMessage = new View.ErrorMessage({
            //        model: new Backbone.Model({
            //            status: xhr.status,
            //            statusText: xhr.statusText
            //        })
            //    });
            //    $('body').append(errorMessage.render().el);
            //}

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