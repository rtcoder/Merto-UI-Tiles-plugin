/**
 * Metro UI Tiles plugin
 *
 * Copyright 2016, Dawid Jeż
 * Dual licensed under the MIT license.
 *
 * If you found bug, please contact me via email <dawidjez@gmail.com>
 *
 * @author Dawid Jeż aka rtCoder
 * @version 0.6
 * @url https://github.com/rtcoder/Metro-UI-Tiles-plugin/
 *
 * CHANGELOG:
 *
 *
 * v0.1
 * - add transform to tiles
 * v0.2
 * - add hover events
 * v0.3
 * - add carousel
 * v0.3.1
 * - stop carousel when is hovered
 * v0.4
 * - add slider
 * v0.4.1
 * - change animations on slider from js to css
 * - change animations on carouse from js to css
 * v0.4.2
 * - fix bugs
 * v0.5
 * - add getters and setters
 * v0.5.1
 * - fix slider
 *   - position absolute for image and description
 *   - elements erder and slide direction are independent of themselve
 * v0.6
 * - add zoom effects
 * 
 */

var dotIsHovered = false;
var directions = ['left', 'right', 'top', 'bottom'];
var sizes = ['small', 'medium', 'wide', 'large'];
var effectTypes = ['slide', 'zoomIn', 'zoomOut'];
var typesList = ['normal', 'carousel', 'slider', 'effect'];

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function addClassToTile( e, element ){
	var divPos = {};
	var offset = $( element ).offset();
	var className = [];
	
	divPos = {
		left : e.pageX - offset.left,
		top  : e.pageY - offset.top
	};

	if( divPos.top < $( element ).height() / 3 ){
		className.push('up');
	}else if( divPos.top > $( element ).height() / 3 * 2 ){
		className.push( 'down' );
	}else{
		className.push( 'all' );
	}

	if( divPos.left < $( element ).width() / 3 ){
		className.push( 'left' );
	}else if( divPos.left > $( element ).width() / 3 * 2 ){
		className.push( 'right' );
	}else{
		className.push( 'all' );
	}

	removeClassFromTile( e, $( element ) );
	
	$( element ).addClass( 'transform transform-' + className.join( '-' ) );
}

function removeClassFromTile( e, element ){
	$( element ).removeClass(function ( index, css ) {
		return ( css.match (/(^|\s)transform-\S+/g) || [] ).join(' ');
	}).removeClass( 'transform' );
}

function carousel(element, images, time){
	if(images.constructor !== Array){
		throw new Error( 'Error: carousel() expects parameter 2 to be array. ' + typeof images + ' given.' );
	}

	element.find('.tile-content').append( '<div class="carousel-dots-container"></div>' );
	for(var i=0; i<images.length; i++){
		element.find('.tile-content').find('.images-container').append( '<img src="' + images[ i ] + '" class="carousel-image-' + i + '" alt="">' );
		
		active = i === 0 ? 'active' : '';
		
		element.find('.tile-content').find('.carousel-dots-container').append( '<div class="dot '+active+'" data-nr="' + i + '"></div>' );
	}

	element.find('.dot').first().click();

	$('.dot').click(function(){
		var active = $(this).parent('.carousel-dots-container').find('.dot.active').data('nr');
		var nr = $(this).data('nr');
		var margin;

		if(nr === active){
			return false;
		}
		
		if(nr > active){
			margin = $(this).parent('.carousel-dots-container').width();
		}else{
			margin = -$(this).parent('.carousel-dots-container').width();
		}
		

		$(this).parent().parent().find('.images-container').find('img').hide().removeClass('animate').css({'margin':'0px'});
		$(this).parent().parent().find('.images-container').find('img.carousel-image-'+nr).show().css({'margin-left':margin+'px'});
		$(this).parent().parent().find('.images-container').find('img.carousel-image-'+active).show().addClass('animate').css({'margin-left':-margin+'px'});
		$(this).parent().parent().find('.images-container').find('img.carousel-image-'+nr).addClass('animate').css({'margin-left':'0px'});

		$(this).parent('.carousel-dots-container').find('.dot').removeClass('active');
		$(this).addClass('active')
	}).hover(function(){
		dotIsHovered = true;
	},function(){
		dotIsHovered = false;
	});
	
	setInterval(function(){
		var nr = element.find('.dot.active').data('nr');

		if(!element.is(':hover')){
			if(typeof nr === 'undefined'){
				element.find('.dot').first().click();
			}
			if(nr === element.find('.dot').last().data('nr')){
				element.find('.dot').first().click();
			}
			
			element.find('.dot[data-nr=' + ( nr + 1 ) + ']').click();
		}
	}, time)
	
}

function slider(element, images, time, direction){
	if(images.constructor !== Array){
		throw new Error( 'Error: slider() expects parameter 2 to be array. ' + typeof images + ' given.' );
	}


	for(var i=0; i<images.length; i++){
		active = i === 0 ? 'active' : '';
		element.find('.tile-content').find('.images-container').append( '<img src="' + images[ i ] + '" class="'+active+' slider-image-' + i + '" data-nr="' + i + '" alt="">' );
	}
	
	setInterval(function(){
		var active = element.find('img.active').data('nr');
		var nr = active + 1;
		var margin;

		if(nr > element.find('img').last().data('nr')){
			nr = 0;
		}
		
		if(direction == 'random'){
			directionVal =  directions[Math.floor(Math.random() * directions.length)];
		}else{
			directionVal = direction;
		}

		if(!element.is(':hover')){
			
			element.find('img').hide().removeClass('animate').css({'margin':'0px'});
			
			switch(directionVal){
				case 'bottom':
				case 'top':
					margin = element.height();

					if(directionVal === 'bottom'){
						margin = -margin
					}
					
					element.find('img.slider-image-'+nr).show().css({'margin-top':margin+'px'});
					element.find('img.slider-image-'+active).show().addClass('animate').css({'margin-top':-margin+'px'});
					element.find('img.slider-image-'+nr).addClass('animate').css({'margin-top':'0px'});
				break;
				case 'right':
				case 'left':
					margin = element.width();

					if(directionVal === 'left'){
						margin = -margin
					}

					element.find('img.slider-image-'+nr).show().css({'margin-left':margin+'px'});
					element.find('img.slider-image-'+active).show().addClass('animate').css({'margin-left':-margin+'px'});
					element.find('img.slider-image-'+nr).addClass('animate').css({'margin-left':'0px'});
				break;
			}
			
			element.find('img').removeClass('active');
			element.find('img.slider-image-'+nr).addClass('active')
			
		}
	}, time)
	
}

function addEffectClass(element, effect){

	if( effect.indexOf( '-' ) >= 0 ){
		var arr = effect.split( '-' );
		var type = arr[0];
		var direction = arr[1];

		if( effectTypes.indexOf( type ) >= 0 && directions.indexOf( direction ) >= 0 ) {
			var effectClass = type + direction.capitalizeFirstLetter();
			var typeEffectClass = type == 'slide' ? 'slideEffect' : 'zoomEffect '+type;

			element.addClass( typeEffectClass + ' ' + effectClass );
		}else{
			throw new Error( 'Error: effect ' + effect + ' is incorrect' );
		}
	}else{
		throw new Error( 'Error: effect ' + effect + ' is incorrect' );
	}

}

function prepareTile (element, settings) {
	element.append( '<div class="tile-content"></div>' );

	if(settings.type === 'normal'){

	}else if(['carousel', 'slider'].indexOf( settings.type ) >= 0){
		element.find('.tile-content').append( '<div class="images-container"></div>' );
	}

	if( settings.icon ){
		element.tileSet({icon:settings.icon});
	}
	if( settings.image ){
		element.tileSet({image:settings.image});
	}

	//checking title
	if( settings.title ){
		element.tileSet({title:settings.title});
	}

	//checking notification
	if( settings.notification ){
		element.tileSet({notification:settings.notification});
	}
	//checking describe
	if( settings.describe ){
		element.tileSet({describe:settings.describe});
	}

	//adding classes
	element.parent().addClass( 'tiles-container' );
	element.removeClass(function ( index, css ) {
		return ( css.match (/(^|\s)tile\S+/g) || [] ).join(' ');
	});

	element.addClass( 'tile tile-' + settings.size );

	//events
	element.mousedown(function( e ){
		if(!dotIsHovered){
			addClassToTile( e, $( this ) );
		}
	}).mouseup(function( e ){
		removeClassFromTile( e, $( this ) );
	}).mouseleave(function( e ){
		removeClassFromTile( e, $( this ) );
	});
}

(function ( $ ) {
	

	$.fn.createTile = function( options ) {
		
		var settings = $.extend({
			size : '', //required
			type : 'normal',
			icon : null,
			image : null,
			title : null,
			desctibe : null,
			notification : null,
			effect : null,
			carousel : {
				images : new Array(),
				time : 0
			},
			slider : {
				images : new Array(),
				time : 0,
				direction : null,
			},
		}, options);

		// checking type
		if( settings.type === '' || typesList.indexOf( settings.type ) < 0) {
			throw new Error( 'Error: unknown type "' + settings.type + '"' );
		}
		//checking size
		if( settings.size === '') {
			throw new Error( 'Error: size is empty' );
		}

		if( sizes.indexOf( settings.size ) < 0 ) {
			throw new Error( 'Error: size ' + size + ' is incorrect' );
		}

		prepareTile(this, settings);

		// checking effect
		if( settings.effect ){
			addEffectClass(this, settings.effect);
		}

		
		if( settings.carousel.time > 0 && settings.carousel.images.length > 0 ){
			carousel(this, settings.carousel.images, settings.carousel.time);
		}
		
		if( settings.slider.time > 0 && settings.slider.images.length > 0 && settings.slider.direction ){
			slider(this, settings.slider.images, settings.slider.time, settings.slider.direction);
		}

		

		return this;
	};


	// setter
	$.fn.tileSet = function( options ) {
		
		var toSet = $.extend({
			size : '', //required
			icon : null,
			image : null,
			title : null,
			notification : null,
			describe : null,
		}, options);

		if( toSet.size ) {
			this.removeClass(function ( index, css ) {
				return ( css.match (/(^|\s)tile\S+/g) || [] ).join(' ');
			});

			this.addClass( 'tile tile-' + toSet.size );
		}

		if( toSet.icon || toSet.icon === '') {
			if( this.find('img.icon').length === 0){
				if( this.find('.tile-image').length === 0){
					this.find('.tile-content').append( '<div class="tile-image"></div>' );
				}
				this.find('.tile-content').find('.tile-image').append( '<img src="" class="icon" alt="">' );
			}
			this.find('img.icon')
				.removeAttr('src')
				.attr('src', toSet.icon)
		}

		if( toSet.image || toSet.image === '') {
			if( this.find('img.image').length === 0){
				if( this.find('.tile-image').length === 0){
					this.find('.tile-content').append( '<div class="tile-image"></div>' );
				}
				this.find('.tile-content').find('.tile-image').append( '<img src="" class="image" alt="">' );
			}
			this.find('img.image')
				.removeAttr('src')
				.attr('src', toSet.image)
		}

		if( toSet.title || toSet.title === '') {
			if( this.find('.tile-title').length === 0){
				this.append( '<div class="tile-title"></div>' );
			}
			this.find('.tile-title').text( toSet.title )
		}

		if( toSet.describe || toSet.describe === '') {
			if( this.find('.tile-describe').length === 0){
				this.find('.tile-content').append( '<div class="tile-describe"></div>' );
			}
			this.find('.tile-describe').text( toSet.describe )
		}

		if( toSet.notification || toSet.notification === '' ) {
			if(toSet.notification !== ''){
				if( this.find('.tile-notification').length === 0){
					this.append( '<div class="tile-notification"></div>' );
				}
				this.find('.tile-notification').text( toSet.notification )
			}else{
				if( this.find('.tile-notification').length > 0){
					this.find('.tile-notification').remove();
				}
			}
		}

		return this;
	};


	// getter
	$.fn.tileGet = function( val ) {
		var values = ['icon', 'image', 'title', 'notification', 'describe', 'images-list'];

		if(values.indexOf( val ) < 0){
			throw new Error( 'Error: tileGet() unknown value "' + val + '"' );
		}

		switch( val ){
			case 'icon':
				if(this.find('img.icon').length === 0){
					return null;
				}else{
					return this.find('img.icon').attr('src');
				}
			break;
			case 'image':
				if(this.find('img.image').length === 0){
					return null;
				}else{
					return this.find('img.image').attr('src');
				}
			break;
			case 'title':
				if(this.find('.tile-title').length === 0){
					return null;
				}else{
					return this.find('.tile-title').text();
				}
			break;
			case 'notification':
				if(this.find('.tile-notification').length === 0){
					return null;
				}else{
					return this.find('.tile-notification').text();
				}
			break;
			case 'describe':
				if(this.find('.tile-describe').length === 0){
					return null;
				}else{
					return this.find('.tile-describe').text();
				}
			break;
			case 'images-list':
				if(this.find('.images-container').find('img').length === 0){
					return null;
				}else{
					var images = new Array();
					this.find('.images-container').find('img').each(function(){
						images.push($(this).attr('src'));				
					});
					return images;
				}
			break;
		}
	};
 
}( jQuery ));