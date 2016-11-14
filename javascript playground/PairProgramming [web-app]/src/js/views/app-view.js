(function ($) {
	'use strict';

	// Application
	// -----------

	PairGenerator.Views.AppView = Backbone.View.extend({

		// Element in the dom to append our view
		el: '.appcontainer',

		// Events for this view
		events: {
			'keypress .new-developer': 'createOnEnter',
		},

		// Bind to the events on the developers list (add,remove)
		// Fetches from localStorage
		initialize: function () {
			//map containers
			this.$input = this.$('.new-developer');
			this.$main = this.$('.main');
			this.$bar = this.$('.developers-bar-list');
			this.$listRight = $('.developers-list.right');
			this.$listLeft = $('.developers-list.left');
			this.$clearButton = $('.clear-button');

			this.listenTo(PairGenerator.developersList, 'add', this.addOne);
			this.listenTo(PairGenerator.developersList, 'reset', this.addAll);
			this.listenTo(PairGenerator.developersList, 'remove', this.addAll);
			this.listenTo(PairGenerator.developersList, 'all', _.debounce(this.render, 0));

			this.$clearButton.click(this.reset);

			// {reset: true} prevents app re-render when model is added
			PairGenerator.developersList.fetch({reset: true});
		},

		render: function () {
			if (PairGenerator.developersList.length) {
			 	this.$main.show();
			} else {
				this.$main.hide();
			}

			if (PairGenerator.developersList.length > 2) {
				this.$clearButton.removeAttr('hidden');
			} else {
				this.$clearButton.attr('hidden', 'hidden');
			}
		},

		// Add a single developer to the list
		addOne: function (developer) {

			//add to the developer bar
			var devBarView = new PairGenerator.Views.DeveloperView({ model: developer});
			this.$bar.append(devBarView.render().el);

			//add to the matrix
			if (PairGenerator.developersList.length === 1){
				var view = new PairGenerator.Views.DeveloperView({ model: developer });
				this.$listLeft.append(view.render().el);
			} else if (PairGenerator.developersList.length === 2){
				this.$listRight.html('');
				this.$listLeft.html('');
			}

			var devPairs = PairGenerator.developersList.getPairsForModel(developer);
			for (var i=0; i < devPairs.length; i++){
					var viewRight = new PairGenerator.Views.DeveloperView({ model: devPairs[i][0] });
					var viewLeft = new PairGenerator.Views.DeveloperView({ model: devPairs[i][1] });
					this.$listRight.append(viewRight.render().el);
					this.$listLeft.append(viewLeft.render().el);
			}
		},

		// Add all developers in the collection
		addAll: function () {

			// clear lists
			this.$bar.html('');
			this.$listRight.html('');
			this.$listLeft.html('');

			//add to developers list
			PairGenerator.developersList.each( function(dev){ 
				this.$bar.append( 
					new PairGenerator.Views.DeveloperView({ model: dev }).render().el
				);
			}, this);

			//build matrix
			if (PairGenerator.developersList.length === 1){
				PairGenerator.developersList.each( function(dev){ 
					var view = new PairGenerator.Views.DeveloperView({ model: dev });
					this.$listLeft.append(view.render().el);
				}, this);
				return;
			}

		    var devPairs = PairGenerator.developersList.getPairs();
			for (var i=0; i < devPairs.length; i++){
					var viewRight = new PairGenerator.Views.DeveloperView({ model: devPairs[i][0] });
					var viewLeft = new PairGenerator.Views.DeveloperView({ model: devPairs[i][1] });
					this.$listRight.append(viewRight.render().el);
					this.$listLeft.append(viewLeft.render().el);
			}

		},

		// Returns attributes for the developer
		newAttributes: function () {
			return {
				name: toTitleCase(this.$input.val().trim()),
				paired: false
			};
		},

		// Empties Developers list and localStorage
		reset: function () {
			_.chain(PairGenerator.developersList.models).clone().each(function(developer){
				developer.destroy();
			});
		},

		// Creates new developer and persists it to localStorage
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				//Validates if name exists
				var developerExists = false;
				PairGenerator.developersList.each( function(dev){ 
					if ( dev.get('name').toLowerCase() === (this.$input.val().trim()).toLowerCase()) {
						developerExists = true;
					};
				}, this);

				if (developerExists) {
					this.$input.addClass(" shake").delay(400).queue(function(){
					    $(this).removeClass("shake").dequeue();
					});
				} else {
					PairGenerator.developersList.create(this.newAttributes());
					this.$input.val('');
				}
			}
		}

	});
})(jQuery);