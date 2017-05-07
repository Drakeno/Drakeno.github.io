var link = document.querySelector(".feedback-btn");
var popup = document.querySelector(".feedback-modal");
var bcground = document.querySelector(".modal-overlay");
var close = popup.querySelector(".modal-close");
var form = popup.querySelector("form");
var name = popup.querySelector("[name=feedback-name]");
var email = popup.querySelector("[name=feedback-email]");
var message = popup.querySelector("[name=feedback-message]");
var storage = localStorage.getItem("name");

link.addEventListener("click", function(event) {
  event.preventDefault();
  popup.classList.add("feedback-modal-on");
  bcground.classList.add("modal-overlay-on");

  if (storage) {
    name.value = storage;
  }
});

close.addEventListener("click", function(event) {
  event.preventDefault();
  popup.classList.remove("feedback-modal-on");
  bcground.classList.remove("modal-overlay-on");
});

window.addEventListener("keydown", function(event) {
  if (event.keyCode === 27) {
    if (popup.classList.contains("feedback-modal-on")) {
      popup.classList.remove("feedback-modal-on");
    }
  }
});

window.addEventListener("keydown", function(event) {
  if (event.keyCode === 27) {
    if (bcground.classList.contains("modal-overlay-on")) {
      bcground.classList.remove("modal-overlay-on");
    }
  }
});
