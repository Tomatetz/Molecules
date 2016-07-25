define(['app', 'model', 'tpl!templates/molecules.tpl', 'tpl!templates/molecule.tpl', 'tpl!templates/iterations.tpl', 'tpl!templates/action.tpl',
        'tpl!templates/modalSetName.tpl', 'tpl!templates/moleculeClosing.tpl', 'tpl!templates/errorHandler.tpl', 'cycle'],
    function (app, Model, moleculesTpl, moleculeTpl, iterationsTpl, actionTpl, modalSetNameTpl, moleculeClosingTpl, errorHandlerTpl) {
        app.module('Show.View', function (View, app, Backbone, Marionette) {
            View.MoleculeView = Marionette.ItemView.extend({
                template: moleculeTpl,
                tagName: 'li',
                className: 'molecule-view-wrapper',
                events: {
                    'click .molecule-image-wrapper': 'loadMolecule',
                    'click .core': 'switchCore',
                    'click .molecule-remove': 'removeMolecule',
                    'click .is-core': 'coreMolecule',
                    'keyup .molecule-action input': 'setActionValue',
                    'change .closing-item select': 'setClosingValue'
                },
                coreMolecule: function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('.action-wrapper').removeClass('hidden');
                    $('.closing-action-wrapper').addClass('hidden');
                    _.each(this.$el.find('.action-wrapper'), function ($option) {
                        if ($($option).hasClass('closing-action-wrapper')) {
                            $($option).removeClass('hidden');
                        } else {
                            $($option).addClass('hidden');
                        }
                    });
                    this.trigger('set:core', event);
                },
                setClosingValue: function (event) {
                    var closings = $(event.target).parent().parent().find('select');
                    var attachAtom1 = $(closings[0]).val() ? parseInt($(closings[0]).val()) : '',
                        attachAtom2 = $(closings[1]).val() ? parseInt($(closings[1]).val()) : '';
                    if ($(event.target).val() == '' || _.every(closings, function (closing) {
                            return $(closing).val() != '';
                        }) && (_.uniq([attachAtom1, attachAtom2]).length == [attachAtom1, attachAtom2].length)) {
                        var closingValues = {
                            coreAtom1: $(closings[0]).data('atom'),
                            coreAtom2: $(closings[1]).data('atom'),
                            attachAtom1: attachAtom1,
                            attachAtom2: attachAtom2
                        };
                        var toSend = {type: 'closing', data: closingValues};
                        this.trigger('change:actionValue', toSend);
                    }
                },
                setActionValue: function (event) {
                    if ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode == 8 || event.keyCode == 46) {
                        this.trigger('change:actionValue', {event: event, type: 'attach'});
                    }
                },
                switchCore: function (e) {
                    $('.fa-core').removeClass('fa-check-square-o').addClass('fa-square-o');
                    this.$el.find('.fa-core').removeClass('fa-square-o');
                    this.$el.find('.fa-core').addClass('fa-check-square-o');
                },
                removeMolecule: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.trigger('remove:molecule');
                    this.model.collection.remove(this.model);
                },
                loadMolecule: function () {
                    sketcher.square = [];
                    var dummy = JSON.parse(this.model.get('dummy'));
                    var doodleDummy = new ChemDoodle.io.JSONInterpreter().molFrom(dummy);
                    var atomsCount = 0;
                    sketcher.loadMolecule(doodleDummy);
                    $.each(sketcher.molecules, function (i, mol) {
                        atomsCount += mol.atomNumCache;
                    });
                    sketcher.atomsCount = atomsCount;
                    if (this.model.get('asquare')) {
                        sketcher.square = JSON.parse(this.model.get('asquare'));
                    }
                    sketcher.center();
                    sketcher.repaint();
                    this.trigger('loadMolecule');
                },
                onRender: function () {
                    var $that = this;
                    if (this.model.get('moleculeImage')) {
                        this.$el.find('.image').attr('src', this.model.get('moleculeImage'))
                    }
                    _.defer(function () {
                        if ($that.$el.find('.action-input')[0]) {
                            $that.$el.find('.action-input')[0].focus();
                        }
                    });
                    this.model.on('change:closingTo', function (model, closings) {
                        $that.$el.find('.closings-collection').remove();
                        if (!!closings.length) {
                            if (!model.get('core') && model.get('atomsWithAttach').length > 1) {
                                _.each(closings, function (closing) {
                                    closing.atomsWithAttach = model.get('atomsWithAttach');
                                    closing.molecule = model.get('name');
                                });
                                var closingsView = new View.ClosingsCollectionView({
                                    collection: new Backbone.Collection(closings)
                                });
                                $that.$el.find('.molecule-option').append(closingsView.render().el);
                            }
                        }
                    })
                }
            });
            View.MoleculesView = Marionette.CompositeView.extend({
                template: moleculesTpl,
                childView: View.MoleculeView,
                childViewContainer: '.molecules-wrapper',
                className: 'molecules-view-wrapper',
                regions: {
                    experiments: '#experiment-container',
                    result: '#experiment-results'
                },
                attachHtml: function (cv, iv) {
                    cv.$el.find('.molecules-wrapper').prepend(iv.el);
                },
                events: {
                    'click .molecules-arrow': 'slide',
                    'change #upload': 'submitForm',
                    'click .save-molecules': 'saveFormList',
                    'click .add-iteration': 'addIteration'
                },
                saveFormList: function () {
                    var $that = this;
                    if ($that.collection.length >= 2) {
                        var setListNameView = new View.SetListNameView({
                            type: 'molecules-list'
                        });
                        $('body').append(setListNameView.render().el);
                        setListNameView.on('apply:collectionName', function (name) {
                            var Molecules = new Model.molecules({
                                molecules: $that.collection.toJSON()
                            });
                            Molecules.save({}, {
                                success: function (model, response) {
                                    var fileName = 'molecules-' + name + '.bcd';
                                    var data = response;
                                    var saveData = (function () {
                                        var a = document.createElement("a");
                                        document.body.appendChild(a);
                                        a.style = "display: none";
                                        return function (data, fileName) {
                                            var json = JSON.stringify(data),
                                                blob = new Blob([json], {type: "octet/stream"}),
                                                url = window.URL.createObjectURL(blob);
                                            a.href = url;
                                            a.download = fileName;
                                            a.click();
                                            window.URL.revokeObjectURL(url);
                                        };
                                    }());
                                    saveData(data, fileName);
                                },
                                error: function (model, response) {
                                    console.log('error! ' + response);
                                }
                            });
                        });
                    }
                },
                onChildviewChangeActionValue: function (childView, event) {
                    if (event.type == 'attach') {
                        event = event.event;
                        var info = {
                            actionValue: $(event.target).val(),
                            actionType: $(event.target).data('type'),
                            actionAtoms: $(event.target).data('atoms'),
                            actionMolecule: $(event.target).data('molecule'),
                            actionOrder: $(event.target).data('name') ? $(event.target).data('name').substring(1) : false
                        }
                    } else if (event.type = 'closing') {
                        var info = {
                            actionType: event.type,
                            data: event.data,
                            actionMolecule: childView.model.get('name')
                        };
                    }
                    this.trigger('change:actionValue', info);
                },
                onChildviewRemoveMolecule: function (childView) {
                    this.trigger('remove:molecule', childView);
                },
                onChildviewSetCore: function (childView, event) {
                    this.trigger('set:core', childView, event);
                },
                addIteration: function () {
                    this.trigger('add:iteration');
                },
                submitForm: function (e, s, i) {
                    e.preventDefault();
                    var $that = this;
                    var form = $that.$el.find('.upload-molecule-form');
                    var url = "api/upload";
                    var oData = new FormData(document.forms.namedItem('fileinfo'));
                    var $uplVal = $that.$el.find('#upload').val();
                    if ($uplVal.substr($uplVal.length - 3, 3) == 'bcd') {
                        var oReq = new XMLHttpRequest();
                        oReq.open('POST', url, true);
                        oReq.onload = function (response) {
                            if (oReq.status == 200) {
                                try {
                                    if ($.parseJSON(response.currentTarget.response)) {
                                        throw(e);
                                    }
                                } catch (e) {
                                    var errorModel = new Backbone.Model({
                                        errorText: 'Wrong file'
                                    });
                                    var errorHandler = new View.ErrorHandlerView({
                                        model: errorModel
                                    });
                                    if (e.name) {
                                        $('body').append(errorHandler.render().el);
                                        $that.$el.find('#upload').val('');
                                    } else {
                                        var parseResponse = $.parseJSON(response.currentTarget.response);
                                        if (parseResponse.molecules && !parseResponse.experimentName) {
                                            $that.collection.add(parseResponse.molecules);
                                            _.each(parseResponse.molecules, function (molecule) {
                                                $that.trigger('add:molecule', molecule);
                                            });
                                        } else {
                                            if (parseResponse.moleculeImage) {
                                                $that.collection.add(parseResponse);
                                                $that.trigger('add:molecule', parseResponse);
                                            } else {
                                                $that.$el.find('#upload').val('');
                                                $('body').append(errorHandler.render().el);
                                            }
                                        }
                                    }
                                }
                            } else {
                                var errorModel = new Backbone.Model({
                                    errorText: 'Server error'
                                });
                                var errorHandler = new View.ErrorHandlerView({
                                    model: errorModel
                                });
                                $('body').append(errorHandler.render().el);
                            }
                        };
                        oReq.send(oData);
                    } else {
                        $that.$el.find('#upload').val('');
                        var errorModel = new Backbone.Model({
                            errorText: 'Wrong file'
                        });
                        var errorHandler = new View.ErrorHandlerView({
                            model: errorModel
                        });
                        $('body').append(errorHandler.render().el);
                    }
                },
                upload: function (e, s, i) {
                    console.log(this.$el.find('.upload')[0].files);
                    console.log(this.$el.find('.upload').val());
                },
                saveMolecule: function () {
                    return JSON.stringify(new ChemDoodle.io.JSONInterpreter().molTo(sketcher.getMolecule()));
                },
                onRender: function () {
                    var $that = this;
                    $('#sketcher_button_exportJSON').on('click', function () {
                        sketcher.center();
                        sketcher.repaint();
                        var x, y, lX, lY;
                        $.each(sketcher.molecules, function (i, molecule) {
                            $.each(molecule.atoms, function (j, atom) {
                                if (!x) {
                                    x = atom.x;
                                } else {
                                    if (x > atom.x) {
                                        x = atom.x;
                                    }
                                }
                                if (!y) {
                                    y = atom.y;
                                } else {
                                    if (y > atom.y) {
                                        y = atom.y;
                                    }
                                }
                                if (!lX) {
                                    lX = atom.x;
                                } else {
                                    if (lX < atom.x) {
                                        lX = atom.x;
                                    }
                                }
                                if (!lY) {
                                    lY = atom.y;
                                } else {
                                    if (lY < atom.y) {
                                        lY = atom.y;
                                    }
                                }
                            })
                        });
                        if (sketcher.square) {
                            $.each(sketcher.square, function (i, square) {
                                if (lX < square.lx) {
                                    lX = square.lx;
                                }
                                if (lY < square.ly) {
                                    lY = square.ly;
                                }
                            });
                        }
                        var canvas = document.getElementById("sketcher");
                        var context = canvas.getContext("2d");
                        var scale = sketcher.specs.scale;
                        var coefX = (canvas.width / sketcher.width);
                        var coefY = (canvas.height / sketcher.height);

                        var copy = document.createElement('canvas');
                        copy.width = (lX - x) * coefX + 100;
                        copy.height = (lY - y) * coefY + 100;
                        var cctx = copy.getContext('2d');
                        if (x && lX && x !== lX) {
                            cctx.putImageData(context.getImageData((x) * coefX - 50, (y) * coefY - 58, (lX - x) * coefX + 100, (lY - y) * coefY + 100), 0, 0);
                            var thumb = thumbnail(copy.toDataURL('image/png'), 200, 150);
                            $that.newMolecule(thumb);
                        }
                        function thumbnail(base64, maxWidth, maxHeight) {
                            if (typeof(maxWidth) === 'undefined') var maxWidth = 500;
                            if (typeof(maxHeight) === 'undefined') var maxHeight = 500;
                            var canvas = document.createElement("canvas");
                            var ctx = canvas.getContext("2d");
                            var canvasCopy = document.createElement("canvas");
                            var copyContext = canvasCopy.getContext("2d");
                            var img = new Image();
                            img.src = base64;
                            var ratio = 1;
                            if (img.width > maxWidth)
                                ratio = maxWidth / img.width;
                            else if (img.height > maxHeight)
                                ratio = maxHeight / img.height;
                            canvasCopy.width = img.width;
                            canvasCopy.height = img.height;
                            copyContext.drawImage(img, 0, 0);
                            canvas.width = img.width * ratio;
                            canvas.height = img.height * ratio;
                            ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);
                            return canvas.toDataURL();
                        }
                    });
                    var iterationsCollection = new Backbone.Collection([
                        {
                            number: 1,
                            active: true,
                            molecules: []
                        }
                    ]);
                    var iterationsView = new View.IterationsView({
                        collection: iterationsCollection
                    });
                    this.on('add:molecule', function (molecule) {
                        var name = molecule.name ? molecule.name : molecule.get('name');
                        iterationsCollection.models.forEach(function (model) {
                            var actionsClone = [];
                            var actions = molecule.actions ? molecule.actions : molecule.get('actions');
                            _.each(actions, function (action) {
                                actionsClone.push(
                                    $.extend(true, {}, action)
                                );
                            });
                            var molecules = model.get('molecules').slice();
                            molecules.push({
                                name: name,
                                actions: actionsClone,
                                core: false
                            });
                            model.set({molecules: molecules});
                        });
                    });
                    this.$el.find('.iterations-wrapper').append(iterationsView.render().el);
                    this.on('add:iteration', function () {
                        this.$el.find('.iteration').removeClass('paddingFirst');
                        var molsClone = [];
                        _.each(iterationsCollection.where({active: true})[0].get('molecules'), function (molecule) {
                            molsClone.push(
                                $.extend(true, {}, molecule)
                            );
                        });
                        _.each(molsClone, function (molecule) {
                            molecule.core = false;
                            molecule.actions = molecule.actions.filter(function (action) {
                                return action.event != 'closing'
                            });
                            molecule.actions.map(function (action, i) {
                                return action.value = '';
                            });
                        });
                        iterationsCollection.add({
                            number: iterationsCollection.length + 1,
                            molecules: molsClone
                        });
                    });
                    this.on('remove:molecule', function (moleculeView) {
                        _.each(iterationsCollection.models, function (iteration) {
                            var molecules = iteration.get('molecules').filter(function (molecule) {
                                return molecule.name != moleculeView.model.get('name')
                            });
                            iteration.set('molecules', molecules);
                        })
                    });
                    this.on('change:actionValue', function (info) {
                        var currentAction = iterationsCollection.where({active: true});
                        var changedMolecule = currentAction[0].get('molecules').filter(function (molecule) {
                            return molecule.name == info.actionMolecule;
                        });
                        if (info.actionType == 'attach') {
                            var currentAttach = changedMolecule[0].actions.filter(function (action) {
                                return (action.event == 'attach' && info.actionAtoms == action.atoms[0]);
                            });
                            if (!!currentAttach[0]) {
                                currentAttach[0].value = info.actionValue || '';
                            }
                        } else if (info.actionType == 'closing') {
                            var currentClosing = changedMolecule[0].actions.filter(function (action) {
                                return (action.event == 'closing' && (action.atoms.coreAtom1 == info.data.coreAtom1) && (action.atoms.coreAtom2 == info.data.coreAtom2));
                            });
                            if (!!currentClosing[0]) {
                                currentClosing[0].atoms.attachAtom1 = info.data.attachAtom1 || '';
                                currentClosing[0].atoms.attachAtom2 = info.data.attachAtom2 || '';
                            } else {
                                changedMolecule[0].actions.push({
                                    event: 'closing',
                                    atoms: {
                                        coreAtom1: info.data.coreAtom1,
                                        coreAtom2: info.data.coreAtom2,
                                        attachAtom1: info.data.attachAtom1,
                                        attachAtom2: info.data.attachAtom2
                                    }
                                })
                            }
                        }
                    });
                    this.on('set:core', function (view, event) {
                        var closings = [];
                        _.each(view.model.get('actions'), function (action) {
                            if (action.event == 'closing') {
                                closings.push({atoms: action.atoms});
                            }
                        });
                        _.each($that.collection.models, function (moleculeModel) {
                            moleculeModel.set('core', moleculeModel.get('name') == view.model.get('name'));
                            moleculeModel.set('closingTo', closings);
                        });
                    });
                    iterationsView.on('change:iteration', function (currentIteration) {
                        _.each(currentIteration.model.get('molecules'), function (molecule) {
                            var $moleculeArea = $that.$el.find('input[data-molecule="' + molecule.name + '"]');
                            var $closingArea = $that.$el.find('.closing-item[data-molecule="' + molecule.name + '"]');
                            _.each($($closingArea).find('select'), function ($select) {
                                $($select).val('');
                            });
                            _.each(molecule.actions, function (action) {
                                if (action.event == 'closing' && !_.isArray(action.atoms)) {
                                    _.each($closingArea, function (area) {
                                        if (($($(area).find('select')[0]).data('atom') == action.atoms.coreAtom1) && ($($(area).find('select')[1]).data('atom') == action.atoms.coreAtom2)) {
                                            $($(area).find('select')[0]).val(action.atoms.attachAtom1);
                                            $($(area).find('select')[1]).val(action.atoms.attachAtom2);
                                        }
                                    })
                                } else {
                                    $moleculeArea.filter('[data-type="' + action.event + '"]').filter('[data-atoms="' + action.atoms.join() + '"]:not(.closing-input)').val(action.value);
                                }
                            });
                        });
                    });

                    $('.settings .modal-button').on('click', function () {
                        var setListNameView = new View.SetListNameView({
                            type: 'json-file'
                        });
                        $('body').append(setListNameView.render().el);
                        setListNameView.on('apply:jsonFileName', function (name) {
                            var importArr = [];
                            var iterations = [];
                            _.each($that.collection.models, function (molecule) {
                                var atoms = [],
                                    bonds = [];
                                var dummy = JSON.parse(molecule.get('dummy'));
                                var doodleDummy = new ChemDoodle.io.JSONInterpreter().molFrom(dummy);
                                _.each(doodleDummy.atoms, function (atom) {
                                    atoms.push({
                                        number: atom.atomNumber,
                                        atomic_number: ChemDoodle.protons[atom.label]
                                    });
                                });
                                _.each(doodleDummy.bonds, function (bond) {
                                    bonds.push([bond.a1.atomNumber, bond.a2.atomNumber]);
                                });
                                importArr.push({
                                    name: molecule.get('name'),
                                    atoms: atoms,
                                    bonds: bonds,
                                    core: molecule.get('core') ? molecule.get('core') : false
                                });
                            });
                            _.each(iterationsCollection.models, function (iteration) {
                                var molecules = [];
                                _.each(iteration.get('molecules'), function (itMol, i) {
                                    var attaches = [],
                                        inserts = [],
                                        closings = [];
                                    _.each(itMol.actions, function (action) {
                                        if (action.event == 'attach' && action.value) {
                                            var insertTo = [];
                                            var attachTo = [];
                                            var coreMoleculeModel = _.filter($that.collection.models, function (molecule) {
                                                return molecule.get('core') == true;
                                            })[0];
                                            _.each(action.value.split(','), function (val) {
                                                if (val != ~~val) {
                                                    if (!!coreMoleculeModel) {
                                                        var insertInfo = _.filter(coreMoleculeModel.get('square'), function (insert) {
                                                            return insert.name == val;
                                                        })[0];
                                                        if (!!insertInfo) {
                                                            insertTo.push(insertInfo.atoms.slice(0));
                                                            inserts.push({
                                                                atom: action.atoms[0],
                                                                insertTo: insertTo
                                                            });
                                                        }
                                                    }
                                                } else {
                                                    attachTo.push([parseInt(val)]);
                                                }
                                            });
                                            if (!!attachTo.length) {
                                                var coreMoleculeModel = _.filter($that.collection.models, function (molecule) {
                                                    return molecule.get('core') == true;
                                                })[0];
                                                for (var i = attachTo.length - 1; i >= 0; i--) {
                                                    if (_.indexOf(coreMoleculeModel.get('atomsWithAttach'), attachTo[i][0]) == -1) {
                                                        attachTo.splice(i, 1);
                                                    }
                                                }
                                                if (!!attachTo.length) {
                                                    attaches.push({
                                                        atom: action.atoms[0],
                                                        attachTo: attachTo
                                                    });
                                                }
                                            }
                                        } else if (action.event == 'closing' && !_.isArray(action.atoms)) {
                                            if ($.inArray(iteration.get('number').toString()) && !!action.atoms.attachAtom1 && !!action.atoms.attachAtom2) {
                                                closings.push({
                                                    atoms: action.atoms
                                                })
                                            }
                                        }
                                    });
                                    if (!!attaches.length || !!closings.length) {
                                        molecules.push([{
                                            name: itMol.name,
                                            attaches: attaches,
                                            closings: closings,
                                            inserts: inserts
                                        }]);
                                    }
                                });
                                iterations.push({iteration: iteration.get('number'), molecules: molecules})
                            });
                            var json = {
                                experimentName: name,
                                molecules: importArr,
                                iterations: iterations
                            };
                            console.log(json);

                            var Experiment = new Model.saveExperiment({
                                experimentName: name,
                                molecules: importArr,
                                iterations: iterations
                            });

                            Experiment.save({}, {
                                success: function (model, response) {
                                    var fileName = 'experiment-' + response.experimentName + '.gws';
                                    var data = response;
                                    var saveData = (function () {
                                        var a = document.createElement("a");
                                        document.body.appendChild(a);
                                        a.style = "display: none";
                                        return function (data, fileName) {
                                            var json = JSON.stringify(data),
                                                blob = new Blob([json], {type: "octet/stream"}),
                                                url = window.URL.createObjectURL(blob);
                                            a.href = url;
                                            a.download = fileName;
                                            a.click();
                                            window.URL.revokeObjectURL(url);
                                        };
                                    }());
                                    saveData(data, fileName);
                                },
                                error: function (model, response) {
                                    console.log('error! ' + response);
                                }
                            });
                        });
                    });
                },
                initialize: function () {
                    var $that = this;
                    var actionsCollection = new Backbone.Collection([]);
                    actionsCollection.bind("all", function (i, d, e) {
                        $that.options.actions = actionsCollection.toJSON();
                    });
                    var actionsView = new View.ActionsView({
                        collection: actionsCollection
                    });
                    $("body").on("clearActions", function () {
                        actionsCollection.reset([]);
                    });
                    $('.log-wrapper').append(actionsView.render().el);
                    this.on('childview:loadMolecule', function (childView) {
                        actionsCollection.reset(childView.model.get('actions'));
                    });
                },
                newMolecule: function (molecule) {
                    var $that = this;
                    var molName = this.getNewMoleculeName();
                    if (molName != '') {
                        var atomsWithAttach = [];
                        $.each(sketcher.molecules, function (i, molecule) {
                            $.each(molecule.atoms, function (j, atom) {
                                if (atom.GWSAttachOption) {
                                    atomsWithAttach.push(atom.atomNumber)
                                }
                            });
                        });
                        var temp = [];
                        $.each(sketcher.square, function (i, val) {
                            temp.push(val);
                        });
                        var Molecule = new Model.molecule({
                            name: molName,
                            moleculeImage: molecule,
                            atomsWithAttach: atomsWithAttach,
                            dummy: this.saveMolecule(),
                            actions: this.options.actions || [],
                            square: sketcher.square ? $.merge([], sketcher.square) : [],
                            asquare: JSON.stringify(temp),
                            core: false,
                            closingTo: []
                        });
                        this.collection.add(Molecule);
                        this.trigger('add:molecule', Molecule);
                        Molecule.save({}, {
                            success: function (model, response) {
                                var fileName = 'molecule-' + response.name + '.bcd';
                                var data = response;
                                var saveData = (function () {
                                    var a = document.createElement("a");
                                    document.body.appendChild(a);
                                    a.style = "display: none";
                                    return function (data, fileName) {
                                        var json = JSON.stringify(data),
                                            blob = new Blob([json], {type: "octet/stream"}),
                                            url = window.URL.createObjectURL(blob);
                                        a.href = url;
                                        a.download = fileName;
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                    };
                                }());
                                saveData(data, fileName);
                            },
                            error: function (model, response) {
                                console.log('error! ' + response);
                            }
                        });
                        $.each($('.image'), function (i, img) {
                            if (!$(img).attr('src')) {
                                $(img).attr('src', molecule);
                                return false;
                            }
                        });
                    }
                },
                getNewMoleculeName: function () {
                    var molName = $('.pictureInput').val();
                    if (molName != '') {
                        $('.pictureInput').val('');
                        $('.img-wrapper').css('color', '#000');
                        $('.pictureInput').css('border-bottom-color', '#51CAFF');
                        return molName;
                    } else {
                        $('#sketcher_button_exportJSON').addClass('alert');
                        setTimeout(function () {
                            $('#sketcher_button_exportJSON').removeClass('alert');
                            $('#sketcher_button_exportJSON').blur();
                        }, 500);
                        $('.img-wrapper').css('color', '#AC1515');
                        $('.pictureInput').css('border-bottom-color', '#AC1515');
                        return false;
                    }
                }
            });
            View.ActionView = Marionette.ItemView.extend({
                template: actionTpl,
                tagName: 'li',
                className: 'log-li log-insert',
                events: {
                    'mouseover': 'highlightMolecule',
                    'mouseout': 'resetHighlight',
                    'click': 'removeAction'
                },
                removeAction: function () {
                    var $that = this;
                    if (this.model.get('event') == 'insert') {
                        sketcher.square = sketcher.square.filter(function (square) {
                            return square.atoms.toString() != $that.model.get('atoms').toString();
                        });
                        $.each(sketcher.molecules, function (i, molecule) {
                            $.each(molecule.atoms, function (j, atom) {
                                if (atom.GWSInsertOrder) {
                                    if ($.inArray($that.model.get('order'), atom.GWSInsertOrder) != -1) {
                                        atom.GWSInsertOrder.splice($.inArray($that.model.get('order'), atom.GWSInsertOrder), 1);
                                        if (atom.GWSInsertOrder.length < 2) {
                                            atom.GWSInsertOption = false;
                                            delete atom.GWSInsertOrder;
                                        }
                                    }
                                }
                            });
                        });
                    } else if (this.model.get('event') == 'attach') {
                        var atomNumber = this.model.get('atoms').toString();
                        $.each(sketcher.molecules, function (i, molecule) {
                            $.each(molecule.atoms, function (j, atom) {
                                if (atom.atomNumber == atomNumber) {
                                    atom.GWSAttachOption = false;
                                }
                            });
                        });
                    } else if (this.model.get('event') == 'closing') {
                        var atomNumber = this.model.get('atoms');
                        $.each(sketcher.molecules, function (i, molecule) {
                            $.each(molecule.bonds, function (j, bond) {
                                if ((bond.a1.atomNumber == atomNumber[0]) && (bond.a2.atomNumber == atomNumber[1])
                                    || (bond.a1.atomNumber == atomNumber[1]) && (bond.a2.atomNumber == atomNumber[0])) {
                                    molecule.bonds.splice(j, 1);
                                    return false;
                                }
                            });
                        });
                    }
                    sketcher.repaint();
                    this.resetHighlight();
                    this.trigger('deleteModel');
                },
                highlightMolecule: function () {
                    var atomsToHighlight = this.model.get('atoms');
                    _.each(sketcher.molecules, function (molecule) {
                        _.each(molecule.atoms, function (atom) {
                            if ($.inArray(atom.atomNumber, atomsToHighlight) != -1) {
                                atom.highlight = true;
                                sketcher.repaint();
                            }
                        });
                    });
                },
                resetHighlight: function () {
                    _.each(sketcher.molecules, function (molecule) {
                        _.each(molecule.atoms, function (atom) {
                            atom.highlight = false;
                            sketcher.repaint();
                        });
                    });
                }
            });
            View.ActionsView = Marionette.CompositeView.extend({
                template: _.template('<ul class="log-ul"></ul>'),
                childView: View.ActionView,
                events: {
                    'click .molecule-image-wrapper': 'loadMolecule'
                },
                onChildviewDeleteModel: function (childView) {
                    this.collection.remove(childView.model);
                },
                attachHtml: function (cv, iv) {
                    cv.$el.find('.log-ul').prepend(iv.el);
                },
                onRender: function () {
                    var $that = this;
                    $("body").on("event", function (event, data, atom) {
                        if (data.type == 'add') {
                            var newData = new Backbone.Model({
                                action: data.action,
                                atoms: data.atoms,
                                type: data.type,
                                event: data.event,
                                order: data.order ? data.order : null
                            });
                            $that.collection.add(newData)
                        } else if (data.type == 'delete') {
                            for (var i = 0; i < $that.collection.models.length; i++) {
                                if (_.isEqual($that.collection.models[i].get('atoms'), data.atoms)) {
                                    $that.collection.remove([$that.collection.models[i]]);
                                }
                            }
                        }
                    });
                }
            });
            View.IterationView = Marionette.ItemView.extend({
                template: _.template('<p><%= number %></p>'),
                tagName: 'li',
                className: function () {
                    return 'iteration ' + (this.model.get('active') ? 'active' : '')
                },
                events: {
                    'click': 'setActive'
                },
                setActive: function (e) {
                    if (!$(e.target).hasClass('active')) {
                        this.trigger('change:iteration');
                    }
                },
                onRender: function () {
                    if (this.model.collection.length == 1) {
                        this.$el.addClass('paddingFirst');
                    }
                }
            });
            View.IterationsView = Marionette.CompositeView.extend({
                template: iterationsTpl,
                childView: View.IterationView,
                childViewContainer: '.iterations-ul',
                events: {
                    'click .molecule-image-wrapper': 'loadMolecule'
                },
                onChildviewChangeIteration: function (childView) {
                    this.collection.forEach(function (model) {
                        model.set({active: false});
                    });
                    childView.model.set({active: true});
                    this.$el.find('.iteration').removeClass('active');
                    childView.$el.addClass('active');
                    this.trigger('change:iteration', childView);
                }
            });
            View.SetListNameView = Marionette.ItemView.extend({
                template: modalSetNameTpl,
                className: 'modal',
                events: {
                    'click .cancel-modal': 'removeModal',
                    'click .fade': 'removeModal',
                    'click .apply-modal': 'applyName'
                },
                removeModal: function () {
                    var $that = this;
                    this.$el.addClass('blur');
                    setTimeout(function () {
                        $that.remove()
                    }, 100);
                },
                applyName: function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var name = this.$el.find('.molecules-list-name').val();
                    if (name != '') {
                        if (this.options.type == 'molecules-list') {
                            this.trigger('apply:collectionName', name);
                        } else if (this.options.type == 'json-file') {
                            this.trigger('apply:jsonFileName', name);
                        }
                        this.removeModal();
                    }
                },
                onRender: function () {
                    var $that = this;
                    _.defer(function () {
                        $that.$el.find('.molecules-list-name').focus();
                    });
                }
            });
            View.ErrorHandlerView = Marionette.ItemView.extend({
                template: errorHandlerTpl,
                className: 'modal',
                events: {
                    'click .fade': 'removeModal'
                },
                removeModal: function () {
                    var $that = this;
                    this.$el.addClass('blur');
                    setTimeout(function () {
                        $that.remove()
                    }, 500);
                }
            });
            View.ClosingItemView = Marionette.ItemView.extend({
                template: moleculeClosingTpl,
                className: 'closing-item',
                attributes: function () {
                    return {
                        "data-molecule": this.model.get('molecule')
                    }
                }
            });
            View.ClosingsCollectionView = Marionette.CollectionView.extend({
                className: 'closings-collection',
                childView: View.ClosingItemView
            });
        });
        return app.Show.View;
    });