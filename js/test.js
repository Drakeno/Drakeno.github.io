$(document).ready(function() {
  $('#fullpage').fullpage({
    anchors: ['firstPage', 'secondPage', '3rdPage'],
    navigation: true,
    navigationPosition: 'right',
    navigationTooltips: ['Старт', 'Задачи', 'Проекты', 'Детали', 'Анимации', 'Дизайн', 'Вся страница', 'Контакты'],
    responsiveWidth: 900,
    responsiveHeight: 885,
    afterResponsive: function(isResponsive) {

    }

  });
});
