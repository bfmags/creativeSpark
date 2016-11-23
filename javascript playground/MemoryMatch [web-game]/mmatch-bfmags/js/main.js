/**
* Memory Match (2014)
*
* @author Bruno Magalhaes <bfmags@gmail.com>
* @dependency none
*/

/**
 * @global
 * @desc Mapping of DOM Elements into global variables
 */
var GAME_GRID = document.getElementById('grid');
var NEWGAME_BUTTON = document.getElementById('new-game');
var HELP_IMAGE = document.getElementById('start-arrow');
var CRON = document.getElementById('stopwatch');
var NUMBER_OF_PAIRS = document.getElementById('pairs');
var END_GAME = document.getElementById('endgame');
var TWEET_BUTTON = document.getElementById('tweet');

/**
 * @global
 * @desc Number of badges in game
 * @desc Has to be an even number (!)
 */
NUMBER_OF_BADGES = 18;

/**
 * Retrieves images urls from codebits API (badges) and stores them in getImages.urls array
 * Script to access Codebits Badges jsonP API is in index.html file
 * @namespace imageRandom
 */
var getImages = {
		/**
		 * An array for storing image urls
         * @memberof getImages
         * @property {urls[]}
         */
		urls : [],	
		/**
		 * Callback method for JSONP Request
         * @memberof getImages
		 * @method myCallback
         */
		myCallback : function (badges){		
						for( var i = 0 ; i < badges.length ; i++ ){
							this.urls[i] = badges[i].img;							
					 }		
		},
		/**
		 * Method to load images from disk
         * @memberof getImages
		 * @method loadImages
         */
		loadImages : function (){
						for( var i = 0 ; i < 17 ; i++ ){
							this.urls[i] = 'img/cards/' + i + '.png';							
					 }		
		},	
};


/**
 * Picks random images and stores them in imageRandom.sortedImages object
 * @namespace imageRandom
 */
var imageRandom = {
	    /**
		 * An object for storing image references
         * @memberof imageRandom
         * @property {{image[].src: string}}
         */
		sortedImages : {},
		/**
		 * A method for getting a random int between min and max values
         * @memberof imageRandom
		 * @method getRandomInt
		 * @arg {!number} min value
		 * @arg {!number} max value
         */    
        getRandomInt : function (min,max) { return Math.floor(Math.random() * (max - min + 1) + min); },    
    	/**
		 * A method for testing if value exists in an array
         * @memberof imageRandom
		 * @method inArray
		 * @arg {!array} array
		 * @arg {!value} value
		 * @returns {boolean} Returns true if value found, false if not
         */
        inArray : function (array, value) {
                    for (var i = 0; i < array.length; i++) {
                    if (array[i] === value) { return true; } }
                    return false;
        },
		/**
		 * A method for shuffling elements in a array using Fisher-Yates Shuffle Algorithm
         * @memberof imageRandom
		 * @method shuffleArray
		 * @arg {!array} array
		 * @returns {array} Returns shuffled array
         */
		shuffleArray : function(array) {  			
							var currentIndex = array.length
							var temporaryValue, randomIndex;
			
							// While there remain elements to shuffle...
							while (0 !== currentIndex) {
								
							// Pick a remaining element...
							randomIndex = Math.floor(Math.random() * currentIndex);
							currentIndex -= 1;

							// And swap it with the current element.
							temporaryValue = array[currentIndex];
							array[currentIndex] = array[randomIndex];
							array[randomIndex] = temporaryValue;
							}

							return array;
		},
    	/**
		 * A method for picking random images and stores them in sortedImages object
         * @memberof imageRandom
		 * @method sortImages
		 * @arg {!array} array with images urls
         */
        sortImages : function (images_links) {
			
                        var index_array = [];			
                        var random_int = this.getRandomInt(0, images_links.length - 1);  
						
						//randomly assigns badges to half of the grid
						for (var i = 0; i < Math.floor(NUMBER_OF_BADGES/2) ; i++){ 							
							// Tests for repetion to ensure unique badges							
                            while ( this.inArray(index_array, random_int )){  
                                random_int = this.getRandomInt(0, images_links.length - 1);
                        	}  
							
                        	this.sortedImages[i] = new Image();
							this.sortedImages[i].src = images_links[random_int];
							index_array[i] = random_int;
                        }
						//shuffles array to distribute badges to remaining half of grid
						index_array = this.shuffleArray(index_array);
						
						for (var i = Math.floor(NUMBER_OF_BADGES/2); i < NUMBER_OF_BADGES; i++){							
                        	this.sortedImages[i] = new Image();
							this.sortedImages[i].src = images_links[ index_array.pop() ];
                        }
			
        
        },
		/**
         * A method for initializing image randomization
         * @memberof imageRandom
         * @method initialize
		 * @arg {{image[].src: string}} images Object with image references
         */
        initialize : function (images_links) {
                        this.sortImages(images_links);
        }    
};


/**
 * game logic and inialization
 * @namespace game
 */
var game = {	
		/**
		 * A method for generating game grid markup
		 * @memberof game
		 * @method generateGrid
		 */	
		generateGrid : function() {
							for ( i = 0; i < NUMBER_OF_BADGES; i++){
								var a = document.createElement('a');
								var img = document.createElement('img');
								var newLI = document.createElement('li');
								newLI.style.display= 'none';
								
								a.appendChild(img)
								newLI.appendChild(a);								
								a.href = '#';																		
								img.src = 'img/avatar.png';
								img.onmouseover = function () { this.src='img/flip.png';}
								img.onmouseout = function () { this.src='img/avatar.png';}								
								img.setAttribute('onclick', 'game.flipBadge(' + i + ')');
								
								GAME_GRID.appendChild(newLI);
							}
		},	
        /**
         * An object for storing image references (badges)
         * @memberof game
         * @property {{badges[].src: string}}
         */
		badges : {},  
        /**
         * A method for initializing the game
         * 
         * @memberof game
         * @method newGame
         */
		newGame : function() {	
            
                    stopWatch.reset();
                    stopWatch.run();
            
					imageRandom.initialize(getImages.urls);
					this.badges = imageRandom.sortedImages;
			
					GAME_GRID.style.backgroundImage = 'none';
					NEWGAME_BUTTON.innerHTML = 'Reset';
			
					// hides help text
					HELP_IMAGE.style.display = 'none';
					// shows game grid
					var li_in_grid = GAME_GRID.getElementsByTagName('li');			
					for (var i = 0; i < li_in_grid.length; i++) { 
										li_in_grid[i].style.display = 'block'; 
					}
								
					// Resets game badges
					var imgs = GAME_GRID.getElementsByTagName('img');
					for (var i=1; i < imgs.length; i++){						
							imgs[i].setAttribute('src', 'img/avatar.png');
							imgs[i].setAttribute('onmouseover', 'this.src="img/flip.png";');
							imgs[i].setAttribute('onmouseout', 'this.src="img/avatar.png";');
							imgs[i].style.opacity = 1;
					}
                    // Resets game variables
					this.is_flipped = -1;
					this.pairs.length = 0;
            
					// Changes opacity of containers showing stopwatch, number of pairs
					NUMBER_OF_PAIRS.style.opacity = .8;
					CRON.style.opacity = .8;			
		},
        /**
         * An array for storing index of badges pairs
         * @memberof game
         * @property {{pairs[] : number}} int index
         */
		pairs : [], 
        /**
         * Variable for storing selected badge index, enabling second badge selection
         * @memberof game
         * @property {number} int index
         */
		is_flipped : -1,
        /**
         * A method with flipping badges game logic
         * @memberof game
         * @method flipBadge
         */
		flipBadge : function(n) {
			
					var imgs = GAME_GRID.getElementsByTagName('img');
                    // badges start at index 1, index 0 is arrow help image
					var badge1 = n+1;
					var badge2 = this.is_flipped+1;
			
					// tests if badges are flipped pairs
					if ( !imageRandom.inArray(this.pairs,badge1) || !imageRandom.inArray(this.pairs,badge2) ) {		

							// returns every badge to avatar position except pairs
							for (var i=1; i < imgs.length; i++){	
									if ( !imageRandom.inArray(this.pairs,i) ){
										imgs[i].setAttribute('src', 'img/avatar.png');
										imgs[i].setAttribute('onmouseover', 'this.src="img/flip.png";');
										imgs[i].setAttribute('onmouseout', 'this.src="img/avatar.png";');
									} else {
										imgs[i].setAttribute('src', this.badges[i-1].src);
										imgs[i].setAttribute('onmouseover', '');
										imgs[i].setAttribute('onmouseout', '');
										imgs[i].style.opacity = .2;
									}
							}
						
							// flips clicked badge
							imgs[badge1].setAttribute('src', this.badges[n].src);
							imgs[badge1].setAttribute('onmouseover', '');
							imgs[badge1].setAttribute('onmouseout', '');

							// tests if there are two badges selected
							if (n !== this.is_flipped && this.is_flipped > -1 ) {
									
									// Flips previous clicked badge
									imgs[badge2].setAttribute('src', this.badges[this.is_flipped].src);
									imgs[badge2].setAttribute('onmouseover', '');
									imgs[badge2].setAttribute('onmouseout', '');
								
									//test for pair
									if ( this.badges[this.is_flipped].src === this.badges[n].src ) {
										this.pairs.push(badge1);
										this.pairs.push(badge2);										
										imgs[badge1].style.opacity = .2;
										imgs[badge2].style.opacity = .2;
										this.is_flipped = -1;
										
										//Tests for Game Over
										if ( this.pairs.length === 18 ) { gameOver(); console.log(gameOver); }
										
									} else {											
										// If not pair hides badges
										setTimeout ( function() {
											imgs[badge1].setAttribute('src', 'img/avatar.png');
											imgs[badge1].setAttribute('onmouseover', 'this.src="img/flip.png";');
											imgs[badge1].setAttribute('onmouseout', 'this.src="img/avatar.png";');
											imgs[badge2].setAttribute('src', 'img/avatar.png');
											imgs[badge2].setAttribute('onmouseover', 'this.src="img/flip.png";');
											imgs[badge2].setAttribute('onmouseout', 'this.src="img/avatar.png";');
										}, 500 );										
										// resets saved badge to none
										this.is_flipped = -1;
									}
							} else {								
								// Saves clicked badge 
								this.is_flipped = n;
							}
					}

		},
		/**
         * A method for initializing the game, assigns callback to new_game button
         * @memberof game
         * @method initialize
         */
		initialize : function() {
				getImages.loadImages();		
				this.generateGrid();
				NEWGAME_BUTTON.setAttribute('onclick', 'game.newGame();');			
		}	
};

/**
 * Stop watch logic and DOM Update
 * @namespace stopWatch
 */
var stopWatch = {
    
    /**
     * Variables for storing timer minutes, seconds
     * @memberof stopWatch
     * @property {number} int ( min : sec )
     */
    sec : 0,
    min : 0,
    
    /**
     * Method for reseting timer minutes, seconds 
     * @memberof stopWatch
     */            
    reset : function () { 
        this.sec = 0;
        this.min = 0; 
    }, 
    
    /**
     * Method for starting stop watch and updates timer and num-of-pairs in the DOM
     * @memberof stopWatch
     */
    run : function () {  
                  this.id = setTimeout( stopWatch.run, 1000 );    
                  if (stopWatch.sec == 60) { stopWatch.sec = 0; stopWatch.min = stopWatch.min + 1; }
                  else { stopWatch.min = stopWatch.min; }
                  if (stopWatch.min == 60) { stopWatch.min = 0; stopWatch.hour += 1; }   
                  //updates dom
                  cron.innerHTML = stopWatch.getTime(); 
                  document.getElementById('number-of-pairs').innerHTML = Math.round(game.pairs.length/2) + '/9';
                  //increments sec
                  stopWatch.sec++; 
    },      
    /**
     * Method that returns a formatted string with elapsed time
     * @memberof stopWatch
     * @returns {string}
     */
    getTime : function () {         
        return (( this.min<=9) ? '0' + this.min : this.min) + ':' + ((this.sec<=9) ? '0' + this.sec : this.sec);
    }, 
	
	 /**
     * Variables for saving setTimeout() reference
     * @memberof stopWatch
     * @property {number}
     */	
	id : 0,	
	/**
     * Method to stop the timer
     * @memberof stopWatch
     * @returns {string}
     */
    stop : function () { clearTimeout( this.id ); }            
}


/**
 * Game Over : Greyed-out page with tweet button to share score
 */
var gameOver = function () {	
						stopWatch.stop;	
						var tweet_text = 'Memory JavaScript FTW in ' + stopWatch.getTime() + ' !';							
						END_GAME.innerHTML = '<div class="table"><div class="vert-text"><div>' +
							'<a id="tweet" href="https://twitter.com/intent/tweet?button_hashtag=memorymatch&text=' 
							+ tweet_text + '"><img src="img/tweet.png"></a></div></div></div>';	
						END_GAME.style.display = 'block';
						END_GAME.style.opacity = 1;							
					}

/**
 * @desc waits for all document elements to load and calls
 * @desc the callback function that will initialize the game
 */
function document_loaded() { game.initialize(); }
document.addEventListener('DOMContentLoaded', document_loaded, false);

