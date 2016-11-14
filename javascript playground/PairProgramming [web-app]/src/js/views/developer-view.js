(function ($) {
	'use strict';

	// Deveoper Item View
	// --------------
	PairGenerator.Views.DeveloperView = Backbone.View.extend({
		tagName:  'li',

		// Grab the template for developer view
		template: _.template($('#developer-template').html()),

		// Events for this view
		events: {
			'dblclick label': 'edit',
			'click .destroy': 'clear',
			'keypress .edit': 'updateOnEnter',
			'keydown .edit': 'revertOnEscape',
			'blur .edit': 'close'
		},

		// Setting up listeners on initialisation
		initialize: function (config) {

			// Defaults to displayMode:'normal'
			var defaults = {
				mode : 'normal'
			}
			this.config = config || defaults;

			// Change template if in 'small' displayMode
			if(this.config.mode === 'no-edits') {
				//disable edit events
				console.log("here");
			}

			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		// Render names
		render: function () {
			// Prevent Backbone bug rendering twice when LocalStorage adds new id to view
			if (this.model.changed.id !== undefined) {
				return;
			}

			this.$el.html(this.template(this.model.toJSON()));
			this.$input = this.$('.edit');
			return this;
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function () {
			this.$el.addClass('editing');
			this.$input.focus();
		},

		// Save changes and quit editing mode
		close: function () {
			var value = this.$input.val();
			var trimmedValue = value.trim();
			// Check if it's in editing mode
			if (!this.$el.hasClass('editing')) {
				return;
			}

			if (trimmedValue) {
				this.model.save({ name: toTitleCase(trimmedValue) });
			} else {
				//this.clear(); TODO: Shouldn't be destructive : update tests
			}

			this.$el.removeClass('editing');
		},

		// 'Enter' key to quit editing mode
		updateOnEnter: function (e) {
			if (e.which === ENTER_KEY) {
				this.close();
			}
		},

		// 'Escape' key to quit without making changes
		revertOnEscape: function (e) {
			if (e.which === ESC_KEY) {
				this.$el.removeClass('editing');
				// Reset the input to it's original value
				this.$input.val(this.model.get('name'));
			}
		},

		// destroys model, model-view and removes from localStorage
		clear: function () {
			this.model.destroy();
		}
	});
})(jQuery);