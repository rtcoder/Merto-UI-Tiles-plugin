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
})