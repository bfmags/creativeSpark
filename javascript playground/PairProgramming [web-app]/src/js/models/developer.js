(function () {
	'use strict';

	// Developer Model
	// ---------------
	PairGenerator.Models.Developer = Backbone.Model.extend({
		// Attributes 'name'@string, 'paired'@bool default values 
		defaults: {
			name: '',
			paired: false
		},
	});
})();