var navMain = document.querySelector(".main-navigation");
var navBtn = document.querySelector(".main-navigation__btn");
var itemLink = document.querySelector(".main-item__buy");
var cardNodeList = document.querySelectorAll(".item__buy-btn");
var popup = document.querySelector(".order-popup");
var bcground = document.querySelector(".order-popup__overlay");

navMain.classList.remove("main-navigation--nojs");

navBtn.addEventListener("click", function() {
  if (navMain.classList.contains("main-navigation--closed")) {
    navMain.classList.remove("main-navigation--closed");
    navMain.classList.add("main-navigation--opened");
  } else {
    navMain.classList.add("main-navigation--closed");
    navMain.classList.remove("main-navigation--opened");
  }
});
[].forEach.call(cardNodeList, function(item) {
  item.addEventListener("click", function(event) {
    event.preventDefault();
    popup.classList.add("order-popup--on");
    bcground.classList.add("order-popup--on");
  });
});

bcground.addEventListener("click", function(event) {
  popup.classList.remove("order-popup--on");
  bcground.classList.remove("order-popup--on");
});

window.addEventListener("keydown", function(event) {
  if (event.keyCode === 27) {
    if (popup.classList.contains("order-popup--on")) {
      popup.classList.remove("order-popup--on");
    }
  }
});

window.addEventListener("keydown", function(event) {
  if (event.keyCode === 27) {
    if (bcground.classList.contains("order-popup--on")) {
      bcground.classList.remove("order-popup--on");
    }
  }
});

itemLink.addEventListener("click", function(event) {
  event.preventDefault();
  popup.classList.add("order-popup--on");
  bcground.classList.add("order-popup--on");
});
