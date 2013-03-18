$(".tweet").tweet({
    join_text: "auto",
    username: "britt",
    avatar_size: 48,
    count: 3,
    auto_join_text_default: " we said, ",
    auto_join_text_ed: " we ",
    auto_join_text_ing: " we were ",
    auto_join_text_reply: " we replied ",
    auto_join_text_url: " we were checking out ",
    loading_text: "loading tweets...",
    template: '<div class="avatar-wrapper">{avatar}<a href="{user_url}"><span class="overlay"></span></a></div>{text}{time}'
});

$('.flickr').jflickrfeed({
    limit: 12,
    qstrings: {
        id: '89854093@N00'
    },
    itemTemplate:
	'<li>' +
		'<a href="{{image_b}}"><img src="{{image_s}}" alt="{{title}}" /><span class="overlay"></span></a>' +
	'</li>'
});

$('.socket').tooltip({
    selector: "a[data-toggle=tooltip]"
});

$().UItoTop({ easingType: 'easeOutQuart' });

$("a[rel^='prettyPhoto']").prettyPhoto();

$(".wrapper").fitVids();


// $(window).load(function () {
// // run code
// // cache container
//     var $container = $('.portfolio .p-items');
//     var $filter = $('.portfolio-filter');
// // initialize isotope
// $container.isotope({
//     // options...
//     masonry: {
//         columnWidth: 5
//     }
// });
// filter items when filter link is clicked
// $('#filters a').click(function () {
//     var selector = $(this).attr('data-filter');
//     $container.isotope({ filter: selector });
//     return false;
// });
// // Filter items when filter link is clicked
// $filter.find('a').click(function () {
//     var selector = $(this).attr('data-filter');
//     $filter.find('a').removeClass('selected');
//     $(this).addClass('selected');
// });
// });

// // update columnWidth on window resize
// $(window).smartresize(function () {
//     $container.isotope('reLayout');
// });



