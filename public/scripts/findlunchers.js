$(document).ready(function() {
	$.post('/findLunchers', function(data) {
		var template = Handlebars.compile($("#profile").html());
		if(data.length == 1) {
  		$('.nobodyshere').show();
		} else {
		  $('.heretheyare').show();
  		$.each(data, function(i, obj) {
  			$('.lunchers').append(template(obj));
  		})
		}
	});
	
	$('.logout').on('click', function() {
		$.post('/logout', function() {window.location='/';});
  });
});