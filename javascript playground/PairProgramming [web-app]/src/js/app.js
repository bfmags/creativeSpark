/**
* Pair Programming (2016)
* @author Bruno Magalhaes <bfmags@gmail.com>
* @description Pair Programming Matrix Generator App
* @description Matrix is generated as the developer names are entered into the app.
* @description It uses localStorage to store developer names, which can be edited and deleted, even 
* @description after the browser window is closed, as long as the local cache isn't cleared.
* @description Dependencies are managed through NPM package manager (package.json).
* @dependency BackboneJS
* @dependency Underscore
* @dependency jQuery
*/
(function(){

	/**
	* @global
	* @desc Mapping of Enter and Esc keycodes into global variables
	*/
	window.ENTER_KEY = 13;
	window.ESC_KEY = 27;

	/**
	* @global
	* @desc Creating APP namespace
	*/
	window.PairGenerator = {
		Models: {},
		Collections: {},
		Views: {}
	};

	/**
	* @global
	* @desc Helper function to convert string to Title case
	* @desc first character of each word in capital case with lowercase for the remaining
	* @desc If all characters of the word are capital case, it won't change it
	*/
	window.toTitleCase = function(name) {
		return name.replace(/\w\S*/g, function(txt){
			if (txt === txt.toUpperCase()) {
				return txt;
			} else {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			}
		});
	}

})();

/**
* @global
* @desc Callback for when the document is fully loaded (scripts are included in the body)
* @desc After document is rendered and scripts loaded, it render main view
* @desc and start entry animation (uses JjQuery for better compatibility with IE)
*/
$(document).ready(function(){
	new PairGenerator.Views.AppView();
	$(".appcontainer").animate({ opacity: 1 }, 500);
	$("#app").delay(500).animate({ opacity: 1 }, 700)
			 .delay(700).animate({ marginTop: "-150px" }, 700);
});