$(".box1").click(function(){
	if(	$(this).css("animation-play-state") == 'paused'	){
		$(this).css("animation-play-state", "running");
	}
	else {
		$(this).css("animation-play-state", "paused");
	}
});