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
	
	$( element ).addClass( 'transform-'+className.join('-') );
}

function removeClassFromTile( e, element ){
	$( element ).removeClass(function ( index, css ) {
		return ( css.match (/(^|\s)transform-\S+/g) || [] ).join(' ');
	});
}
function carousel(element, images, time){
	if(images.constructor !== Array){
		throw new Error( 'Error: carousel() expects parameter 2 to be array. ' + typeof images + ' given.' );
		
		return false;
	}
	
	
	element.append( '<div class="tile-content"></div>' );
	element.find('.tile-content').append( '<div class="carousel-images-container" style="width:'+(element.width()*images.length)+'px"></div>' );
	element.find('.tile-content').append( '<div class="carousel-dots-container"></div>' );
	for(var i=0; i<images.length; i++){
		element.find('.tile-content').find('.carousel-images-container').append( '<img src="' + images[i] + '" class="carousel-image-' + i + '" alt="" style="width:'+element.width()+'px;height:'+element.height()+'px;float:left;">' );
		element.find('.tile-content').find('.carousel-dots-container').append( '<div class="dot" data-nr="'+i+'"></div>' );
	}
	$('.dot').click(function(){
		var nr = $(this).data('nr');
		var margin = -$(this).parent('.carousel-dots-container').width()*nr;
		// $(this).parent('.tile').find('.carousel-images-container').css('margin-left',margin+'px')
		$(this).parent().parent().find('.carousel-images-container').css('margin-left',margin+'px')
		$(this).parent('.carousel-dots-container').find('.dot').removeClass('active');
		$(this).addClass('active')
	})
	
}
(function ( $ ) {
	
	var sizes = ['small', 'medium', 'wide', 'large'];
	var effectTypes = ['slideLeft', 'slideRight', 'slideTop', 'slideBottom', 'zoomIn', 'zoomOut'];
    
	$.fn.createTile = function( options ) {
		
		var settings = $.extend({
            size     : '', //required
			icon     : null,
			image    : null,
			title    : null,
			carousel : {
				images : new Array(),
				time:0
			}
        }, options);
		//checking size
        if( settings.size === '') {
			throw new Error( 'Error: size is empty' );
			
			return false;
		}
		
		if( sizes.indexOf( settings.size ) < 0 ) {
			throw new Error( 'Error: size ' + size + 'is incorrect' );
			
			return false;
		}
////////////////////////////////////////////////////

		//checking icon
		if( settings.icon ){
			this.append( '<img src="' + settings.icon + '" class="icon" alt="">' );
		}
		//checking title
		if( settings.title ){
			this.append( '<div class="tile-title">' + settings.title + '</div>' );
		}

		
		this.parent().addClass( 'tile-container' );
		this.removeClass(function ( index, css ) {
			return ( css.match (/(^|\s)tile\S+/g) || [] ).join(' ');
		});
		this.addClass( 'tile tile-' + settings.size );
		
		if(settings.carousel){
			carousel(this, settings.carousel.images, settings.carousel.time);
		}
		
		$( this ).mousedown(function( e ){
			addClassToTile( e, $( this ) );
		}).mouseup(function( e ){
			removeClassFromTile( e, $( this ) );
		}).mouseleave(function( e ){
			removeClassFromTile( e, $( this ) );
		})
		
        return this;
    };
 
}( jQuery ));