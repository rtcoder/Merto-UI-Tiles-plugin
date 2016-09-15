$(document).ready(function(){
	$('#menuBtn').click(function(){
		$('#sidebar').toggleClass('active');
	});
	$('#sidebar ul li').click(function(){
		$('#sidebar').removeClass('active')
	});
	$('pre code').each(function(i, block) {
		hljs.highlightBlock(block);
	});
	// $('a').click(function(){
	// 	if($(this).attr('href').indexOf('/') < 0){
	// 		window.location.href = $(this).attr('href')
	// 		var url = document.URL;
	// 		if(url.indexOf('#') >= 0){
	// 			var URLarr = url.split('#');
	// 			var id = '#'+URLarr[1];
	// 			$('a').removeClass('current-link')
	// 			$('a[href=\\'+id+']').addClass('current-link');
	// 		}
	// 	}
	// });
})