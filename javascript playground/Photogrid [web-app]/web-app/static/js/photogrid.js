/**
 * PhotoGrid Web App (2014)
 *
 * @author Bruno Magalhães <bfmags@gmail.com>
 * @dependency html2canvas JS library for downloading images
 */

/**
 * @global
 * @desc Mapping of DOM Elements into global variables
 */
var DOM_GRID = document.getElementById('grid');
var GRID_IMAGES = DOM_GRID.getElementsByTagName('img');
var BOTTOM_GRID = document.getElementById('bottom-nav');
var BOTTOM_GRID_IMAGES = document.getElementById('bottom-grid').getElementsByTagName('img');
var SCROLL_RIGHT_BUTTON = document.getElementById('scroll-right');
var SCROLL_LEFT_BUTTON = document.getElementById('scroll-left');
var REROLL_BUTTON = document.getElementById('reroll');
var DOWNLOAD_BUTTON = document.getElementById('download');
var ZOOM_IN_BUTTON = document.getElementById('zoom-in');
var ZOOM_OUT_BUTTON = document.getElementById('zoom-out');
var SUCCESS_LABEL = document.getElementById('success-label');
var CLICK_TO_CHANGE_BUTTONS = document.getElementsByClassName('click-to-change');

/**
 * @global
 * @desc Number of images to be loaded
 */
NUMBER_OF_IMAGES = 21;

/**
 * Load Images from user folder
 * @namespace loadImages
 */
var loadImages = {
	    /**
		 * An object for storing image references
         * @memberof loadImages
         * @property {{image[].src: string}}
         */
		images : {},
	    /**
         * A method for loading images from folder
         * @memberof loadImages
         * @method loadImage
		 * @arg {!number} n number of images
         */
        loadImage : function (n) {
                        "use strict";
                        var url_to_image = '/img/user-images/' + n + '.jpg';
                        this.images[n] = new Image();
                        //images[n].onload = function() {};
                        this.images[n].src = url_to_image;
                    },
		/**
         * A method for initializing image loading
         * @memberof loadImages
         * @method initialize
		 * @arg {!number} number_of_images
         */
        initialize : function (number_of_images) {
                        "use strict";
                        for (var i = 1; i <= number_of_images; i++) {
                            this.loadImage("" + i);
                        }
                    }    
};

/**
 * Picks random images and places them in grid
 * @namespace imageRandom
 */
var imageRandom = {
	    /**
		 * An object for storing image references
         * @memberof loadImages
         * @property {{image[].src: string}}
         */
		images : {},
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
		 * A method for picking random images and place them in the grid
         * @memberof imageRandom
		 * @method sortImages
         */
        sortImages : function () {
                        var image_array = [];
                        var random_int = this.getRandomInt(1, NUMBER_OF_IMAGES);
                        
                        for (var i=0; i < GRID_IMAGES.length; i++){         
                            while (this.inArray(image_array, random_int)){  
                                random_int = this.getRandomInt(1, NUMBER_OF_IMAGES);
                            }        
                        image_array[i] = random_int;        
                        GRID_IMAGES[i].src = this.images[random_int].src;
                        }
        
            },
		/**
         * A method for initializing image randomization
		 * Assigns a callback to re-roll button
         * @memberof imageRandom
         * @method initialize
		 * @arg {{image[].src: string}} images Object with image references
         */
        initialize : function (images) {
						this.images = images;
                        this.sortImages();                
                        REROLL_BUTTON.setAttribute('onclick', 'imageRandom.sortImages()');                        
                }    
};


/**
 * Downloads the photo grid
 * @namespace downloadImage
 * @dependency html2canvas JS library
 */
var downloadImage = {
    	/**
		 * A method for downloading image using html2canvas library
		 * Writes images to local disk saveToDisk() and calls showSuccessLabel()
         * @memberof downloadImage
		 * @method download
         */
        download : function () {
                            html2canvas(DOM_GRID, {
                                onrendered: function (canvas) {
                                    var dataURL = canvas.toDataURL('image/jpeg');
                                    downloadImage.saveToDisk(dataURL, 'autogrid' +
															 imageRandom.getRandomInt(500,900) + '.jpg');
                                    downloadImage.showSuccessLabel();  
                                }
                            });
                        },
	    /**
		 * A method for writing images to local disk
         * @memberof downloadImage
		 * @method saveToDisk
		 * @arg {!string} fileURL file url
		 * @arg {!string} fileName filename to save
         */  
        saveToDisk : function (fileURL, fileName) { //IE not supported

								var save = document.createElement('a');
								save.href = fileURL;
								save.target = '_blank';
								save.download = fileName || 'unknown';
						
								var event = document.createEvent('MouseEvent');								
								event.initEvent('click', true, true);
								save.dispatchEvent(event);
								(window.URL || window.webkitURL).revokeObjectURL(save.href);

                    },
		/**
		* A method for showing a success label to the user
		* @memberof downloadImage
		* @method showSuccessLabel
		*/     
        showSuccessLabel : function () {
            
                                SUCCESS_LABEL.className = 'transition';
                                SUCCESS_LABEL.style.opacity = 1;
                                
                                setTimeout(
                                    function () {
                                        SUCCESS_LABEL.style.opacity = 0;
                                        console.log(this);
                                        this.clearTimeout();
                                    }, 2000);
                            },
	
		/**
         * A method for initializing image download
         * @memberof downloadImage
         * @method initialize
         */
        initialize : function () {
                        DOWNLOAD_BUTTON.setAttribute('onclick', 'downloadImage.download()');               
                    }
};


/**
 * Takes care of bottom photo grid functionality (animation, scrolling and selection)
 * @namespace bottomgrid
 */
var bottomGrid = { 	
		/**
		 * A number defining the offset in the interval of images shown
         * @memberof bottomGrid
         * @property {number}
         */	
		gridOffset : BOTTOM_GRID_IMAGES.length,
		/**
		 * An object for storing image references
         * @memberof bottomGrid
         * @property {{image[].src: string}}
         */
		images : {},
		/**
		 * A method for hiding the photo grid
         * @memberof bottomGrid
		 * @method hide
         */ 
    	hide : function () { BOTTOM_GRID.style.bottom = '-92px'; },
		/**
		 * A method for showing the photo grid
         * @memberof bottomGrid
		 * @method show
         */
		show : function () { BOTTOM_GRID.style.bottom = '13px'; },
		/**
		 * A method for assigning images to the photo grid
         * @memberof bottomGrid
		 * @method assignImages
         */
        assignImages: function () {
                        for (var i = 1; i < BOTTOM_GRID_IMAGES.length+1; i++){ 
                        	BOTTOM_GRID_IMAGES[i-1].src = this.images[this.gridOffset + i].src;
							console.log(this.gridOffset);
						}
					 }, 
		/**
		 * A method for scrolling the photo grid
         * @memberof bottomGrid
		 * @method scroll
		 * @arg {!string: right || left} option scrolling direction
         */
        scroll: function (option) {    
                        if (option === "right") { 
                            (this.gridOffset < 12) ? this.gridOffset += 1 : this.gridOffset = 12; 
                        }
                        if (option === "left") { (
                            this.gridOffset > 1) ? this.gridOffset -= 1 : this.gridOffset = 0; 
                        }
                        this.assignImages();
                },
		/**
         * A method for initializing the bottom photo grid
		 * Assigns callbacks to scrolling left and right buttons
         * @memberof bottomGrid
         * @method initialize
		 * @arg {{image[].src: string}} images Object with image references
         */
        initialize: function (images) {
						this.images = images;
                        this.assignImages();
                        SCROLL_LEFT_BUTTON.setAttribute('onclick', 'bottomGrid.scroll("left")');
                        SCROLL_RIGHT_BUTTON.setAttribute('onclick', 'bottomGrid.scroll("right")');
                   }
};


/**
 * Logic for swapping images between photo grid and bottom photo roll
 * @namespace swapImage
 */
var swapImage = {
		/**
		 * A number defining the image to be replaced
		 * If negative, no image selected
		 * @memberof swapImage
		 * @property {number} selected_image
		 */	
		selected_image: -1,
		/**
		 * A method for selecting images in the photo grid
		 * Only allows one image at a time
		 * @memberof swapImage
		 * @method selectImage
		 * @arg {!number} n GridPhoto index number
		 */ 
		selectImage : function (n) {
						for (var i=0; i < GRID_IMAGES.length; i++){
							GRID_IMAGES[i].style.opacity = 1;
						}         
						if (this.selected_image !== n){
							GRID_IMAGES[n].style.opacity = .2;
							bottomGrid.show();	
							this.selected_image = n;
						} else { 
							this.selected_image = -1;
							bottomGrid.hide(); 
						}
					},
		/**
		 * A method for swaping the image in the photo grid with image in bottom roll
		 * @memberof swapImage
		 * @method swap
		 * @arg {!number} n Index of photo in bottom roll
		 */ 
		swap : function(n){
					if (this.selected_image >= 0){        
						GRID_IMAGES[this.selected_image].src = BOTTOM_GRID_IMAGES[n].src;
						GRID_IMAGES[this.selected_image].style.opacity = 1;
						this.selected_image = -1;
						bottomGrid.hide();
					}		
				},
		/**
		 * Assigns callback functions to photos bottom photo grid for click'n'swap
		 * @memberof swapImage
		 * @method initialize
		 */ 
		initialize : function() {
						for (var i=0; i < CLICK_TO_CHANGE_BUTTONS.length; i++){
							CLICK_TO_CHANGE_BUTTONS[i].setAttribute('onclick',
																	'swapImage.selectImage(' + i +')');
						}	
						for (var i=0; i < BOTTOM_GRID_IMAGES.length; i++){
							BOTTOM_GRID_IMAGES[i].setAttribute('onclick', 'swapImage.swap(' + i +')');
						}		
					},
		
};


/**
 * Logic for image zoom feature
 * @namespace zoomImage
 */
var zoomImage = {    
	images_zoom : 110,
    zoomIn : function () { if ( this.images_zoom < 350 ) { this.images_zoom += 2; this.applyZoom();} },
    zoomOut: function () { if ( this.images_zoom > 110 ) { this.images_zoom -= 5; this.applyZoom();} },    
    applyZoom: function () {
                    for (var i=0; i < GRID_IMAGES.length; i++){
                        if ( this.images_zoom < 110) { this.images_zoom = 110; }
                        GRID_IMAGES[i].style.width = '' + this.images_zoom + '%';
                    }
                },
    initialize: function () {
                    ZOOM_IN_BUTTON.setAttribute('onclick', 'zoomImage.zoomIn();');
                    ZOOM_OUT_BUTTON.setAttribute('onclick', 'zoomImage.zoomOut();');        
                }
};

/**
 * @desc Starts loading images
 */
loadImages.initialize(NUMBER_OF_IMAGES);
/**
 * @desc Places random images in the image grid
 * @desc and assigns callback function to re-roll button 
 */
imageRandom.initialize(loadImages.images);
/**
 * @desc Assigns callback function to download button
 */
downloadImage.initialize();
/**
 * @desc bottom photo grid functionality (animation, scrolling and selection)
 */
bottomGrid.initialize(loadImages.images);
/**
 * @desc Logic for click'n'swap photos
 */    
 swapImage.initialize();
/**
 * @desc Logic for image zoom feature
 */ 
zoomImage.initialize();


