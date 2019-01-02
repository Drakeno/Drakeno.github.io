const templatesData = {
  intro: {
    text: ` Это не фото. Это рисунок маслом нидерландского художника-фотореалиста Tjalf Sparnaay.`
  },

  greeting: {
    logo: {
      src: `img/logo_ph-big.svg`,
      alt: `Pixel Hunter`
    },
    title: `Лучшие художники-фотореалисты бросают тебе вызов!`,
    text: `Правила игры просты:`,
    list: `<li>Нужно отличить рисунок от фотографии и сделать выбор.</li>
    <li>Задача кажется тривиальной, но не думай, что все так просто.</li>
    <li>Фотореализм обманчив и коварен.</li>
    <li>Помни, главное — смотреть очень внимательно.</li>`
  },

  rules: {
    title: `Правила`,
    description: `<li>Угадай 10 раз для каждого изображения фото
    <img class="rules__icon" src="img/icon-photo.png" width="32" height="31" alt="Фото"> или рисунок
    <img class="rules__icon" src="img/icon-paint.png" width="32" height="31" alt="Рисунок"></li>
  <li>Фотографиями или рисунками могут быть оба изображения.</li>
  <li>На каждую попытку отводится 30 секунд.</li>
  <li>Ошибиться можно не более 3 раз.</li>`,
  },

  lives: {
    fullHeart: `<img src="img/heart__full.svg" class="game__heart" alt="Life" width="31" height="27">`,
    emptyHeart: `<img src="img/heart__empty.svg" class="game__heart" alt=" Missed Life" width="31" height="27">`,
    TOTAL_LIVES: 3,
  },

  statsTesults: {
    wrong: `<li class="stats__result stats__result--wrong"></li>`,
    correct: `<li class="stats__result stats__result--correct"></li>`,
    slow: `<li class="stats__result stats__result--slow"></li>`,
    fast: `<li class="stats__result stats__result--fast"></li>`,
    unknown: `<li class="stats__result stats__result--unknown"></li>`
  },

  statsPage: {
    titleWin: `Победа!`,
    titleFail: `Поражение!`,
    statusFail: `FAIL`,
    speedBonusTitle: `Бонус за скорость:`,
    lifeBonusTitle: `Бонус за жизни:`,
    fineTitle: `Штраф за медлительность:`
  }

};

export default templatesData;
