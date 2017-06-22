(function() {
  'use strict';
  // $('body').scrollspy({
  //   target: '.navbar'
  // })

  $(".navbar a").on("click", function() {
    $(".navbar").find(".active").removeClass("active");
    $(this).parent().addClass("active");
  });
})();
