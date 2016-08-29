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

(function ( $ ) {
	
	var sizes = ["small", "medium", "wide", "large"];
    
	$.fn.createTile = function( options ) {
		
		var settings = $.extend({
            size    : '', //required
			onclick : true,
			onhover : false,
        }, options);
		
		
        if( settings.size === '') {
			console.error("Error: size is empty");
			
			return false;
		}
		if( sizes.indexOf( settings.size ) < 0 ) {
			console.error('Error: size ' + size + 'is incorrect');
			
			return false;
		}
		this.parent().addClass( 'tile-container' );
		this.addClass( 'tile tile-' + settings.size );
		
		if( settings.onclick ) {
			$( this ).mousedown(function( e ){
				addClassToTile( e, $( this ) );
			}).mouseup(function( e ){
				removeClassFromTile( e, $( this ) );
			});
		}
		
		if( settings.onhover ) {
			$( this ).mousemove(function( e ){
				addClassToTile( e, $( this ) );
			});
		}
		
		$( this ).mouseleave(function( e ){
			removeClassFromTile( e, $( this ) );
		})
		
        return this;
    };
 
}( jQuery ));