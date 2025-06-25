$(function () {
  const rand = Math.random();

  $("#header").load("/parts/html/header.html?rand=" + rand);
  $("#footer").load("/parts/html/footer.html?rand=" + rand);
  $("#side-menu").load("/parts/html/side-menu.html?rand=" + rand);
  $("#side-menu-sp").load("/parts/html/side-menu.html?rand=" + rand);
});
