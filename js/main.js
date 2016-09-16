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
	
	var inter = setInterval(function(){
		if($('iframe').length > 0){
			var url = document.URL;
			$('iframe').each(function(){
				if(url.indexOf('#') >= 0){
					window.location.href = document.URL;
				}
			})
			clearInterval(inter)
		}
	},1)
})