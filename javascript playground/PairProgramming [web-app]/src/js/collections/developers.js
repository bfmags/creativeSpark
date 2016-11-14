(function () {
	'use strict';

	// Developers Collection
	// ---------------
	var DevelopersList = Backbone.Collection.extend({
		// Reference to this collection's model
		model: PairGenerator.Models.Developer,

		// Saves the collection of developers locally
		localStorage: new Backbone.LocalStorage('pairGenerator-developers'),

		// List of developers paired
		paired: function () {
			return this.where({paired: true});
		},

		// List of remaining developers not paired
		remaining: function () {
			return this.where({paired: false});
		},

	    //Sorting developers by name
	    comparator: function (developer) {
	        return developer.get('name');
	    },

	    getPairs: function() {
	    	var devList = [], devPairs = [];
			PairGenerator.developersList.each( function(dev){ devList.push(dev); }, this);
			for(var i = 0; i < devList.length; i++){
			    for(var j = i + 1; j < devList.length; j++){
			        devPairs.push([devList[i],devList[j]]);
			    }
			}
		    return devPairs;
	    },

	   	getPairsForModel: function(model) {
	    	var devList = [], devPairs = [];
			PairGenerator.developersList.each( function(dev){
				 if(dev !== model) {
				 	devList.push(dev);
				 }
			}, this);

			for(var i = 0; i < devList.length; i++){
			    devPairs.push([model,devList[i]]);
			}
		    return devPairs;
	    }

	});

	// Create our collection of developers in the app namespace
	PairGenerator.developersList  = new DevelopersList();
})();