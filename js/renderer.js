/*jslint browser: true, white: true */
/*global CanvasRenderingContext2D, requestAnimationFrame, console, MyGame */

// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
//
// ------------------------------------------------------------------
MyGame.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d');

	
	//------------------------------------------------------------------
	//
	// Place a 'clear' function on the Canvas prototype, this makes it a part
	// of the canvas, rather than making a function that calls and does it.
	//
	//------------------------------------------------------------------
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};
	
	//------------------------------------------------------------------
	//
	// Public function that allows the client code to clear the canvas.
	//
	//------------------------------------------------------------------
	function clear() {
		context.clear();
	}
    
    //------------------------------------------------------------------
    // This is used to create the ball 
    //
    //------------------------------------------------------------------


	function Ball(spec) {
		var that = {},
			ready = false,
			image = new Image();
		
        var game_begin = false;

		image.onload = function() { 
			ready = true;
		};
		image.src = spec.image;

        that.getGameStatus = function(){
            return game_begin;
        }

        that.current_x = 0
        that.current_y = 0

        that.newGame = function(){
            game_begin = true
        }

        that.stopGame = function(){
            game_begin = false;
        }

        that.changeStatus = function(){
            game_begin = !game_begin
        }
		
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime / 1000);
		};
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
		};
			
		that.moveLeft = function(elapsedTime) {
            var new_center = spec.center.x - spec.moveRate * (elapsedTime/1000);
            if(new_center > 0 && that.current_x == 0){
			    spec.center.x = new_center;            
            }
            else{
                var alt_center = spec.center.x + spec.moveRate * (elapsedTime/1000);
                spec.center.x = alt_center
                that.current_x = 1
            }
		};
		
		that.moveRight = function(elapsedTime) {
            var new_center = spec.center.x + spec.moveRate * (elapsedTime/1000);
            if(new_center < canvas.width && that.current_x == 1){
			    spec.center.x = new_center;            
            }
            else{
                var alt_center = spec.center.x - spec.moveRate * (elapsedTime/1000);
			    spec.center.x = alt_center;            
                that.current_x = 0
            }
            
		};
		
		that.moveUp = function(elapsedTime) {
            var new_center = spec.center.y - spec.moveRate * (elapsedTime/1000);
            if(new_center > 0 && that.current_y == 0){
			    spec.center.y = new_center;            
            }
            else{
                var alt_center = spec.center.y + spec.moveRate * (elapsedTime/1000);
                spec.center.y = alt_center
                that.current_y = 1
            }
		};
		
		that.moveDown = function(elapsedTime) {
            var new_center = spec.center.y + spec.moveRate * (elapsedTime/1000);
            if(new_center < canvas.height && that.current_y == 1){
			    spec.center.y = new_center;            
            }
            else{
                var alt_center = spec.center.y - spec.moveRate * (elapsedTime/1000);
			    spec.center.y = alt_center;            
                that.current_y = 0
            }
		};


        that.validMove = function(elapsedTime){
            if(that.current_x == 1){
                that.moveRight(elapsedTime)
            }
            else{
                that.moveLeft(elapsedTime)
            }
            if(that.current_y == 1){
                that.moveDown(elapsedTime)
            }
            else{
                that.moveUp(elapsedTime)
            }
        }

        that.keepGoing = function(elapsedTime){

        }

        that.changeCourse = function(elapsedTime){

        }
        
        that.move = function(elapsedTime){
            that.validMove(elapsedTime)
            //Was working here, pop the next two elements off the course array, then move accordingly.
        }

        that.stickToPaddle = function(pos, elapsedTime){
            if(game_begin == false){
                if(pos > spec.center.x){
                    that.moveRight(elapsedTime)
                }
                if(pos < spec.center.x){
                    that.moveLeft(elapsedTime)
                }
            }
        }

		that.draw = function() {
			if (ready) {
				context.save();
				
				context.translate(spec.center.x, spec.center.y);
				context.rotate(spec.rotation);
				context.translate(-spec.center.x, -spec.center.y);
				
				context.drawImage(
					image, 
					spec.center.x - spec.width/2, 
					spec.center.y - spec.height/2,
					spec.width, spec.height);
				
				context.restore();
			}
		};
		
		return that;
	}


	
	//------------------------------------------------------------------
	//
	// This is used to create a texture function that can be used by client
	// code for rendering.
	//
	//------------------------------------------------------------------
	function Texture(spec) {
		var that = {},
			ready = false,
			image = new Image();
		
		//
		// Load the image, set the ready flag once it is loaded so that
		// rendering can begin.
		image.onload = function() { 
			ready = true;
		};
		image.src = spec.image;
		
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime / 1000);
		};

        that.getPosition = function(){
            return spec.center.x
        }
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
		};
		
		that.moveLeft = function(elapsedTime) {
            var new_center = spec.center.x - spec.moveRate * (elapsedTime/1000);
            if(new_center > 0){
			    spec.center.x = new_center;            
            }
		};
		
		that.moveRight = function(elapsedTime) {
            var new_center = spec.center.x + spec.moveRate * (elapsedTime/1000);
            if(new_center < canvas.width){
			    spec.center.x = new_center;            
            }
            
		};
		
		that.moveUp = function(elapsedTime) {
			spec.center.y -= spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveDown = function(elapsedTime) {
			spec.center.y += spec.moveRate * (elapsedTime / 1000);
		};
        
		
		that.draw = function() {
			if (ready) {
				context.save();
				
				context.translate(spec.center.x, spec.center.y);
				context.rotate(spec.rotation);
				context.translate(-spec.center.x, -spec.center.y);
				
				context.drawImage(
					image, 
					spec.center.x - spec.width/2, 
					spec.center.y - spec.height/2,
					spec.width, spec.height);
				
				context.restore();
			}
		};
		
		return that;
	}

	return {
		clear : clear,
		Texture : Texture,
        Ball : Ball,
	};
}());

//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
MyGame.main = (function(graphics, input) {
	'use strict';

	var lastTimeStamp = performance.now(),
		myKeyboard = input.Keyboard(),
		myTexture = graphics.Texture( {
			image : 'images/paddle.png',
			center : { x : 100, y : 400 },
			width : 100, height : 20,
			moveRate : 500,			// pixels per second
			rotateRate : 3.14159	// Radians per second
		});

	var	myBall = graphics.Ball( {
			image : 'images/Ball.png',
			center : { x : 100, y : 375 },
			width : 25, height : 25,
			moveRate : 500,			// pixels per second
			rotateRate : 3.14159	// Radians per second
		});
    myBall.newGame()

	//------------------------------------------------------------------
	//
	// Process the registered input handlers here.
	//
	//------------------------------------------------------------------
	function processInput(elapsedTime) {
		myKeyboard.update(elapsedTime);
	}
	
	//------------------------------------------------------------------
	//
	// Update the state of the "model" based upon time.
	//
	//------------------------------------------------------------------
	function update(elapsedTime) {
		// Only we don't have anything to do here, kind of a boring game
        if(myBall.getGameStatus() == false){
            myBall.stickToPaddle(myTexture.getPosition(), elapsedTime)
        }
        else{
            //console.log('move called')
            myBall.validMove(elapsedTime)
            myBall.move(elapsedTime)    
        }
	}

	//------------------------------------------------------------------
	//
	// Render the state of the "model", which is just our texture in this case.
	//
	//------------------------------------------------------------------
	function render() {
		graphics.clear();
		myTexture.draw();
        myBall.draw();
	}

	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {

		var elapsedTime = time - lastTimeStamp;
		lastTimeStamp = time;

		processInput(elapsedTime);
		update(elapsedTime);
		render();

		requestAnimationFrame(gameLoop);
	};

	console.log('game initializing...');
	
	//
	// Create the keyboard input handler and register the keyboard commands
	myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myTexture.moveLeft);
	myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myTexture.moveRight);
	//myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myTexture.moveUp);
	//myKeyboard.registerCommand(KeyEvent.DOM_VK_S, myTexture.moveDown);
	//myKeyboard.registerCommand(KeyEvent.DOM_VK_Q, myTexture.rotateLeft);
	//myKeyboard.registerCommand(KeyEvent.DOM_VK_E, myTexture.rotateRight);

	//
	// Get the game loop started
	requestAnimationFrame(gameLoop);
 
}(MyGame.graphics, MyGame.input));
