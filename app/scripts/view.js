define(['app', 'model', 'cycle'],
    function (app, Model) {
        app.module('Show.View', function (View, app, Backbone, Marionette) {

            View.MoleculeView = Marionette.ItemView.extend({
                template: _.template($('.molecule-view').html()),
                tagName: 'li',
                className: 'molecule-view-wrapper',
                events: {
                    'click .molecule-image-wrapper': 'loadMolecule',
                    'click .core input': 'switchCore',
                    'click .molecule-remove': 'removeMolecule',
                    'click .is-core': 'coreMolecule',
                    'keyup .molecule-action input': 'setActionValue'
                },
                coreMolecule:function(event){
                    this.trigger('set:core', event);
                },
                setActionValue:function(event){
                    if((event.keyCode >= 48 && event.keyCode <= 57)||event.keyCode == 8||event.keyCode == 46){
                        this.trigger('change:actionValue', {event:event});
                    }
                },
                switchCore: function(e){
                    this.model.set('core', $(e.target).is(":checked"));
                },
                removeMolecule: function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    this.model.collection.remove(this.model);
                },
                loadMolecule: function(){
                    sketcher.square = [];
                    var dummy = JSON.parse(this.model.get('dummy'));
                    var doodleDummy = new ChemDoodle.io.JSONInterpreter().molFrom(dummy);
                    var atomsCount = 0;
                    sketcher.loadMolecule(doodleDummy);
                    $.each(sketcher.molecules, function(i,mol){
                        atomsCount += mol.atomNumCache;
                    });
                    sketcher.atomsCount = atomsCount;
                    if(this.model.get('asquare')){
                        sketcher.square = JSON.parse(this.model.get('asquare'));
                    }
                    sketcher.center();
                    sketcher.repaint();
                    this.trigger('loadMolecule');
                },
                onRender:function(){
                    if(this.model.get('moleculeImage')){
                        this.$el.find('.image').attr('src', this.model.get('moleculeImage'))
                    }
                }
            });
            View.MoleculesView = Marionette.CompositeView.extend({
                template: _.template($('.molecules-view').html()),
                childView: View.MoleculeView,
                childViewContainer: '.molecules-wrapper',
                className: 'molecules-view-wrapper',
                regions: {
                    experiments: '#experiment-container',
                    result: '#experiment-results'
                },
                attachHtml: function(cv, iv){
                    cv.$el.find('.molecules-wrapper').prepend(iv.el);
                },
                events: {
                    'click .new-molecule': function(){sketcher.clear();},
                    'click .molecules-arrow': 'slide',
                    'change .upload': 'submitForm',
                    'click .add-iteration': 'addIteration'
                },
                onChildviewChangeActionValue: function(childView, event){
                    event = event.event;
                    var info ={
                        actionValue : $(event.target).val(),
                        actionType : $(event.target).data('type'),
                        actionAtoms : $(event.target).data('atoms'),
                        actionMolecule : $(event.target).data('molecule'),
                        actionOrder : $(event.target).data('name')?$(event.target).data('name').substring(1):false
                    };
                    this.trigger('change:actionValue', info);
                },
                onChildviewSetCore: function(childView, event){
                    this.trigger('set:core', childView, event);
                },
                addIteration: function(){
                    this.trigger('add:iteration');
                    //this.$el.find('.add-iteration').before('<li class="iteration">'+(this.$el.find('.iteration').length+1)+'</li>');
                },
                submitForm: function(e,s,i){
                    e.preventDefault();
                    var $that = this;
                    var form = $that.$el.find('.upload-molecule-form');
                    var url = "api/upload";
                    var oData = new FormData(document.forms.namedItem('fileinfo'));

                    //oData.append('Upload_ts', currentDate.getTime());
                    var oReq = new XMLHttpRequest();
                    oReq.open('POST', url, true);
                    oReq.onload = function (response) {
                        if (oReq.status == 200) {
                            var parseResponse = $.parseJSON(response.currentTarget.response);
                            $that.collection.add(parseResponse);
                            $that.trigger('add:molecule', parseResponse);
                            //console.log(parseResponse);
                        } else {

                        }
                    };
                    oReq.send(oData);
                },
                upload: function(e,s,i){
                    console.log(this.$el.find('.upload')[0].files);
                    console.log(this.$el.find('.upload').val());
                },
                saveMolecule: function(){
                    return JSON.stringify(new ChemDoodle.io.JSONInterpreter().molTo(sketcher.getMolecule()));
                },
                slide: function(ev){
                    ev.preventDefault();
                    ev.stopPropagation();
                    var destination = $(ev.currentTarget).data('destination');
                    var $target = this.$el.find('.molecule-view-wrapper')[0];
                    var marginTop = $($target).css('margin-top');
                    marginTop = parseInt(marginTop);
                    var module = Math.abs(marginTop);
                    if(destination=='down' && module<(this.collection.length-3)*155){
                        marginTop-=155;
                    } else if(destination=='up'&&marginTop<-1){
                        marginTop+=155;
                    }
                    $($target).css('margin-top', marginTop);
                },
                onRender: function(){
                    var $that = this;
                    $('#sketcher_button_exportJSON').on('click', function(){

                        sketcher.center();
                        sketcher.repaint();

                        var x, y,lX,lY;
                        $.each(sketcher.molecules, function(i,molecule){
                            $.each(molecule.atoms, function(j,atom){
                                //console.log('x: '+atom.x,', y: '+atom.y)
                                if(!x){
                                    x=atom.x;
                                } else {
                                    if(x>atom.x){
                                        x=atom.x;
                                    }
                                }
                                if(!y){
                                    y=atom.y;
                                } else {
                                    if (y > atom.y) {
                                        y = atom.y;
                                    }
                                }
                                if(!lX){
                                    lX = atom.x;
                                } else {
                                    if(lX < atom.x){
                                        lX = atom.x;
                                    }
                                }
                                if(!lY){
                                    lY = atom.y;
                                } else {
                                    if (lY < atom.y) {
                                        lY = atom.y;
                                    }
                                }
                            })
                        });
                        if(sketcher.square){
                            $.each(sketcher.square, function(i,square){
                                if(lX < square.lx){
                                    lX = square.lx;
                                }
                                if(lY < square.ly){
                                    lY = square.ly;
                                }
                            });
                        }
                        var canvas = document.getElementById("sketcher");
                        var context = canvas.getContext("2d");

                        var scale = sketcher.specs.scale;
                        var coefX = (canvas.width/sketcher.width);
                        var coefY = (canvas.height/sketcher.height);

                        var copy = document.createElement( 'canvas' );
                        copy.width=(lX-x)*coefX+100;
                        copy.height=(lY-y)*coefY+100;
                        var cctx = copy.getContext( '2d' );
                        if(x&&lX&&x!==lX){
                            cctx.putImageData( context.getImageData( (x)*coefX-50,(y)*coefY-58,(lX-x)*coefX+100,(lY-y)*coefY+100), 0, 0 );
                            $that.newMolecule(copy.toDataURL('image/png'));
                        }
                    });
                    var actionValues = {};
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
                    this.on('add:molecule', function(molecule){
                        var name = molecule.name?molecule.name:molecule.get('name');
                        iterationsCollection.models.forEach(function(model) {
                            var actionsClone = [];
                            var actions = molecule.actions?molecule.actions:molecule.get('actions');
                            _.each(actions, function(action){
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

                    this.on('add:iteration', function(){
                        this.$el.find('.iteration').removeClass('paddingFirst');
                        var molsClone = [];
                        _.each(iterationsCollection.where({active:true})[0].get('molecules'), function(molecule){
                            molsClone.push(
                                $.extend(true, {}, molecule)
                            );
                        });
                        _.each(molsClone, function(molecule){
                            molecule.core = false;
                            molecule.actions.map(function(action){
                                return action.value = '';
                            });
                        });
                        iterationsCollection.add({
                            number:iterationsCollection.length+1,
                            molecules:molsClone
                        });
                    });

                    this.on('change:actionValue', function(info){
                        var currentAction = iterationsCollection.where({active:true});
                        var changedMolecule = currentAction[0].get('molecules').filter(function(molecule) {
                            return molecule.name == info.actionMolecule;
                        });
                        if(info.actionType=='insert'){
                            var currentInsert = changedMolecule[0].actions.filter(function(action){
                                return action.order == info.actionOrder;
                            });
                            currentInsert[0].value = info.actionValue||'';
                        } else if(info.actionType=='attach'){
                            var currentAttach = changedMolecule[0].actions.filter(function(action){
                                return (action.event == 'attach' && info.actionAtoms == action.atoms[0]);
                            });
                            console.log(currentAction);
                            if(currentAttach[0]){
                                currentAttach[0].value = info.actionValue||'';
                            }
                        }
                    });
                    this.on('set:core', function(view, event){
                        var currentAction = iterationsCollection.where({active:true});
                        var changedMolecule = currentAction[0].get('molecules').filter(function(molecule) {
                            return molecule.name == view.model.get('name');
                        });
                        changedMolecule[0].core = $(event.target).is(":checked");
                    });
                    iterationsView.on('change:iteration', function(currentIteration){
                        _.each(currentIteration.model.get('molecules'), function(molecule){
                            $that.$el.find('.core input').filter('[data-name="'+molecule.name+'"]').prop('checked', molecule.core);
                            var $moleculeArea = $that.$el.find('input[data-molecule="'+molecule.name+'"]');
                            _.each(molecule.actions, function(action){
                                $moleculeArea.filter('[data-type="'+action.event+'"]').filter('[data-atoms="'+action.atoms.join()+'"]').val(action.value);
                            });
                        });
                        this.$el.find('.molecule-action input');
                    })
                },
                initialize:function(){
                    //console.log(this);
                    var $that = this;
                    var actionsCollection = new Backbone.Collection([]);
                    actionsCollection.bind("all", function(i,d,e){
                        $that.options.actions = actionsCollection.toJSON();
                    });
                    var actionsView = new View.ActionsView({
                        collection: actionsCollection
                    });
                    $( "body").on( "clearActions", function(){
                        actionsCollection.reset([]);
                    });
                    $('.log-wrapper').append(actionsView.render().el);
                    this.on('childview:loadMolecule', function(childView) {
                        actionsCollection.reset(childView.model.get('actions'));
                    });
                },
                newMolecule: function(molecule){
                    var molName = this.getNewMoleculeName();
                    if(molName!=''){
                        var atomsWithAttach = [];
                        $.each(sketcher.molecules, function(i, molecule){
                            $.each(molecule.atoms, function(j, atom){
                                if(atom.GWSAttachOption){
                                    atomsWithAttach.push (atom.atomNumber)
                                }
                            });
                        });
                        var temp =[];
                        $.each(sketcher.square, function(i, val){
                            temp.push(val);
                        });
                        var Molecule = new Model.molecule({
                            name: molName,
                            moleculeImage : molecule,
                            atomsWithAttach : atomsWithAttach,
                            dummy: this.saveMolecule(),
                            actions: this.options.actions,
                            square: sketcher.square? $.merge([], sketcher.square) : [],
                            asquare: JSON.stringify(temp)
                            //square: this.options.square.slice()
                        });
                        this.collection.add(Molecule);

                        this.trigger('add:molecule', Molecule);

                        Molecule.save({},{
                            success: function(model, response) {
                                var fileName = 'molecule-'+response.name+'.bcd';
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
                            error: function(model, response) {
                                console.log('error! ' + response);
                            }
                        });
                        $.each($('.image'), function(i, img){
                            if(!$(img).attr('src')){
                                $(img).attr('src', molecule);
                                return false;
                            }
                        });
                    }
                },
                getNewMoleculeName: function(){
                    var molName = $('.pictureInput').val();
                    if(molName!=''){
                        $('.pictureInput').val('');
                        $('.img-wrapper').css('color', '#000');
                        $('.pictureInput').css('border-bottom-color','#51CAFF');
                        return molName;
                    } else {
                        $('.img-wrapper').css('color', '#AC1515');
                        $('.pictureInput').css('border-bottom-color','#AC1515');
                        return false;
                    }
                }
            });
            View.ActionView = Marionette.ItemView.extend({
                template: _.template($('.action-view').html()),
                tagName: 'li',
                className: 'log-li log-insert',
                events: {
                    'mouseover': 'highlightMolecule',
                    'mouseout': 'resetHighlight',
                    'click': 'removeAction'
                },
                removeAction: function(){
                    var $that = this;
                    if(this.model.get('event')=='insert'){
                        sketcher.square = sketcher.square.filter(function(square){
                            return square.atoms.toString() != $that.model.get('atoms').toString();
                        });

                        $.each(sketcher.molecules, function(i,molecule){
                            $.each(molecule.atoms, function(j,atom){
                                if(atom.GWSInsertOrder){

                                    if($.inArray($that.model.get('order'), atom.GWSInsertOrder)!=-1){
                                        atom.GWSInsertOrder.splice($.inArray($that.model.get('order'), atom.GWSInsertOrder),1);
                                        if(atom.GWSInsertOrder.length<2){
                                            atom.GWSInsertOption = false;
                                            delete atom.GWSInsertOrder;
                                        }
                                    }
                                }
                            });
                        });
                    } else if (this.model.get('event')=='attach'){
                        var atomNumber = this.model.get('atoms').toString();
                        $.each(sketcher.molecules, function(i,molecule){
                            $.each(molecule.atoms, function(j,atom){
                                if(atom.atomNumber == atomNumber){
                                    atom.GWSAttachOption = false;
                                }
                            });
                        });
                        console.log(atomNumber, sketcher);
                    }
                    sketcher.repaint();
                    this.resetHighlight();
                    this.trigger('deleteModel');
                },
                highlightMolecule:function(){
                    var atomsToHighlight = this.model.get('atoms');
                    _.each(sketcher.molecules, function(molecule){
                        _.each(molecule.atoms, function(atom){
                            if($.inArray( atom.atomNumber, atomsToHighlight)!=-1){
                                atom.highlight = true;
                                sketcher.repaint();
                            }
                        });
                    });
                },
                resetHighlight:function(){
                    var atomsToHighlight = this.model.get('atoms');
                    _.each(sketcher.molecules, function(molecule){
                        _.each(molecule.atoms, function(atom){
                                atom.highlight = false;
                                sketcher.repaint();
                        });
                    });
                }
            });
            View.ActionsView = Marionette.CompositeView.extend({

                template: _.template($('.actions-view').html()),
                childView: View.ActionView,
                //childViewContainer: '.log-ul',
                events: {
                    'click .molecule-image-wrapper': 'loadMolecule'
                },
                initialize: function(){
                    //this.listenTo(this.collection, 'reset', this.render);
                },
                onChildviewDeleteModel: function(childView){
                    this.collection.remove(childView.model);
                },
                attachHtml: function(cv, iv){
                    cv.$el.find('.log-ul').prepend(iv.el);
                },
                onRender: function(){
                    var $that = this;
                    $( "body").on( "event", function(event, data, atom){
                        if(data.type=='add'){
                            var newData = new Backbone.Model({
                                action: data.action,
                                atoms: data.atoms,
                                type: data.type,
                                event: data.event,
                                order: data.order?data.order:null
                            });
                            //console.log(newData);
                            $that.collection.add(newData)
                        } else if(data.type=='delete'){
                            $.each($that.collection.models, function(i, model){
                                if(_.isEqual(model.get('atoms'), data.atoms)){
                                    $that.collection.remove([model])
                                }
                            });
                        }
                    } );
                }
            });



            View.IterationView = Marionette.ItemView.extend({
                template: _.template($('.iteration-view').html()),
                tagName: 'li',
                className: function(){
                    return 'iteration ' + (this.model.get('active')? 'active' :'')
                },
                events: {
                    'click': 'setActive'
                },
                setActive: function(e){
                    if(!$(e.target).hasClass('active')){
                        this.trigger('change:iteration');
                    }
                },
                onRender: function(){
                    if(this.model.collection.length==1){
                        this.$el.addClass('paddingFirst');
                    }
                }
            });
            View.IterationsView = Marionette.CompositeView.extend({
                template: _.template($('.iterations-view').html()),
                childView: View.IterationView,
                childViewContainer: '.iterations-ul',
                events: {
                    'click .molecule-image-wrapper': 'loadMolecule'
                },
                initialize: function(){
                    //console.log(this);
                    //this.listenTo(this.collection, 'all', this.render);
                },
                onChildviewChangeIteration: function(childView){
                    this.collection.forEach(function(model, index) {
                        model.set({active: false});
                    });
                    childView.model.set({active: true});
                    this.$el.find('.iteration').removeClass('active');
                    childView.$el.addClass('active');
                    this.trigger('change:iteration', childView);
                    //console.log(childView);
                },
                onRender: function(){
                }
            });
        });
        return app.Show.View;
    });