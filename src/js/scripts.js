function pauseAllVideos()
{
	$("video").each(function()
	{
		pauseVideo($(this));
	});
}

function pauseVideo(jVideo)
{
	jVideo.siblings(".controls").first().show();
	jVideo.css("cursor", "auto");
	jVideo.get(0).pause();
}

// Set the background of all videos to match their poster
// This prevents a white flash from occurring immediately after load
$("video").each(function()
{
	$(this).css("background-image", 'url("' + $(this).attr("poster") + '")');
})

$(".controls").click(function()
{	
	pauseAllVideos();

	var jVideo = $(this).siblings("video").first();
	var video = jVideo.get(0);
	
	if (video.paused)
	{	
		if ( video.readyState === 4 ) 
		{
			jVideo.css("cursor", "pointer");
			video.play();
		}
		else
		{
			video.addEventListener("canplay", function() 
			{
				jVideo.css("cursor", "pointer");
				var loader = $(this).siblings(".loading").first();
				loader.hide();
				video.play();
			}, false);
			
			var loader = $(this).siblings(".loading").first();
			loader.show();
			video.load();
		}
		
		$(this).hide();
	}
	else
	{
		video.pause();
	}
});

$(".video-link").click(function()
{
	pauseAllVideos();
});

$("video").click(function()
{
	var video = $(this).get(0);
	
	if (!video.paused)
	{
		pauseVideo($(this));
	}
});

$("video").each(function()
{
	var video = $(this).get(0);
	
	video.addEventListener("waiting", function()
	{
		if (video.currentTime != 0)
		{		
			var loader = $(this).siblings(".loading").first();
			loader.show();
		}
	});
	
	video.addEventListener("playing", function()
	{
		var loader = $(this).siblings(".loading").first();
		loader.hide();
	}
	);
});

$(".aside-button").click(function() 
{
    $(this).parent().toggleClass("expanded");
});

$(".toggle-gif").click(function() 
{
    $(this).toggleClass("playing");
});