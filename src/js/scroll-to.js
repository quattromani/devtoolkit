$('a[href*=#]:not([href=#])').click(function() {

  var windowWidth = $("body").width();
  var offset = windowWidth > 1020 ? $('nav') : $('header[role=banner]');
  var offset_height = offset.outerHeight();

  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
    || location.hostname == this.hostname) {

    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
     if (target.length) {
       $('html,body').animate({
           scrollTop: target.offset().top - headerHeight
      }, 600);
      return false;
    }
  }
});

var jump_anchors = $(".jumpTo-anchor");

$(window).scroll(_.debounce(function() {
  var offset = $(window).scrollTop();
  var current_anchor;

  for (var i = 0; i < jump_anchors.length; i++) {
    var this_anchor = $(jump_anchors).eq(i);

    if (this_anchor.offset().top - offset > $(window).height() * 2 / 5) {
      break;
    }

    current_anchor = this_anchor;
  }

  var nav_target = $('a[href*="#' + current_anchor.attr('id') + '"]');
  var nav_parent = null;

  if (!nav_target.length) {
    nav_target = $('aside .accordion .js-expandable h6:contains("' + current_anchor.attr('id') + '")').closest('a');
  }

  if (nav_target.parent().parent().parent().hasClass('js-expandable')) {
    nav_parent = nav_target.parent().parent().parent();
  } else {
    nav_parent = null;
  }
  nav_target = nav_target.parent();

  if (!nav_target.hasClass('js-active')) {
    console.log("changing because " + current_anchor.attr('id'));

    if (nav_parent !== null && !nav_parent.hasClass('js-active')) {
      $('aside .accordion .js-expandable ul').slideUp();
      $('aside .accordion li').removeClass("js-active js-open");
      nav_parent.find('ul').slideDown();
      nav_parent.addClass("js-active");

    } else if (nav_target.parent().parent().parent().hasClass("accordion")) {
      $('aside .accordion .js-expandable ul').slideUp();
      $('aside .accordion li').removeClass("js-active js-open");
    }
    console.log(nav_target.parent().parent().parent().attr("class"));
    $('aside .accordion li:not(.js-expandable)').removeClass("js-active");
    nav_target.addClass("js-active");
  }
}, 200));
