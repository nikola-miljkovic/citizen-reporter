var page = 1;

$(".previousPage").hide();

$(".nextPage").click(function () {

  var current = $(".p-" + page);
  current.removeClass("transitionCurrent");
  current.addClass("transitionNegative");

  page++;

  var next = $(".p-" + page);
  next.removeClass("transitionPositive");
  next.addClass("transitionCurrent");


  console.log("LoadNewPage");

  if (page >= 2) {
    $(".previousPage").show();
  } else {
    $(".previousPage").hide();
  }

});

$(".previousPage").click(function () {

  var current = $(".p-" + page);
  current.removeClass("transitionCurrent");
  current.addClass("transitionPositive");


  page--;

  var next = $(".p-" + page);
  next.removeClass("transitionNegative");
  next.addClass("transitionCurrent");


  console.log("LoadPreviousPage");

  if (page >= 2) {
    $(".previousPage").show();
  } else {
    $(".previousPage").hide();
  }
});

$(".articles article").click(function () {
  var currentPage = $(".p-" + page);
  currentPage.removeClass("transitionCloseArticle");
  currentPage.addClass("transitionOpenArticle");

  var articleId = $(this).attr("id");
  var article = $("#" + articleId + "open");

  article.removeClass("transitionArticleUp");
  article.addClass("transitionArticleDown", function(){$(this).removeClass("transitionArticleDown")});

});

$(".closeArticle").click(function () {
  var article = $(this).parent().parent().parent();

  article.removeClass("transitionArticleDown");
  article.addClass("transitionArticleUp");

  var currentPage = $(".p-" + page);
  currentPage.removeClass("transitionOpenArticle");
  article.addClass("transitionCloseArticle", function(){$(this).removeClass("transitionCloseArticle")});
});

