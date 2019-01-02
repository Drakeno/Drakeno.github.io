(function () {
  'use strict';

  const mainElement = document.querySelector(`#main`);

  const renderElement = (template, tagName = `div`, tagClass) => {
    const wrapper = document.createElement(tagName);
    wrapper.innerHTML = template;
    wrapper.setAttribute(`class`, tagClass || ``);
    return wrapper;
  };

  const appendElement = (element, tagName = `div`, tagClass) => {
    const wrapper = renderElement(``, tagName, tagClass);
    wrapper.appendChild(element);
    return wrapper;
  };

  const showScreen = (element) => {
    mainElement.innerHTML = ``;
    mainElement.appendChild(element);
  };

  const showElement = (element) => {
    mainElement.appendChild(element);
  };

  const isEquivalent = (array1, array2) => {
    const aString = array1.toString();
    const bString = array2.toString();

    return aString === bString;
  };

  const resize = (frame, object) => {

    let ratioX = object.width / frame.width;
    let ratioY = object.height / frame.height;

    if (object.width > object.height) {
      ratioY = ratioX;
    }

    if (object.width < object.height) {
      ratioX = ratioY;
    }

    if (object.width === object.height && frame.width > frame.height) {
      ratioX = ratioY;
    }

    const result = {
      width: object.width / ratioX,
      height: object.height / ratioY
    };

    if (result.width > frame.width) {
      result.width = object.width / (object.width / frame.width);
      result.height = object.height / (object.width / frame.width);
    }

    if (result.height > frame.height) {
      result.width = object.width / (object.height / frame.height);
      result.height = object.height / (object.height / frame.height);
    }

    return result;
  };

  const resizeImg = (image, frame) => {
    const picture = new Image();
    picture.src = image.src;

    picture.onload = () => {
      let resolvedImgSize = {
        width: picture.width,
        height: picture.height
      };

      const properSize = resize(frame, resolvedImgSize);
      picture.width = properSize.width;
      picture.height = properSize.height;
    };

    return picture;
  };

  const renderImage = (item, alt) => {
    item.alt = alt;
    return item;
  };

  const massImageResize = (task) => {
    const promise = new Promise((resolve, reject) => {
      const baseFrame = {
        width: task.width,
        height: task.height
      };
      const properSize = resizeImg(task, baseFrame);
      resolve(properSize);
      setTimeout(() => reject(new Error(`error`)), 5000);
    });

    promise
      .then(
          (result) => {
            task.properImg = result;
          },
          (error) => error
      );
  };

  class AbstractView {
    constructor(data, callback) {
      this.data = data;
      this.callback = callback;
      this.actionElements = null;
    }

    get element() {
      if (this._element) {
        return this._element;
      }
      const wrapper = renderElement(this.getTemplate());
      this._element = document.createDocumentFragment();
      while (wrapper.childNodes.length) {
        this._element.appendChild(wrapper.childNodes[0]);
      }
      this.bind();
      return this._element;
    }

    getTemplate() {

    }

    bind() {
      if (this.actionElements) {
        this.actionElements.forEach((element) => {
          element.addEventListener(`click`, this.callback);
        });
      }
    }

    clear() {
      if (this.actionElements) {
        this.actionElements.forEach((element) => {
          element.removeEventListener(`click`, this.callback);
        });
      }
    }
  }

  class ErrorModal extends AbstractView {

    constructor(error) {
      super();
      this.error = error;
    }

    getTemplate() {
      return `<section class="modal">
    <div class="modal__inner">
      <h2 class="modal__title">Произошла ошибка!</h2>
      <p class="modal__text modal__text--error">${this.error} :( Попробуйте перезагрузить страницу</p>
    </div>
  </section>`;
    }

  }

  const GameType = {
    twoOfTwo: 0,
    oneOfOne: 1,
    oneOfThree: 2
  };

  const ImageType = {
    PAINT: 0,
    PHOTO: 1
  };

  const globalGameData = {
    DEBUG: window.location.hash.replace(`#`, ``).toLowerCase() === `debug`,
    TOTAL_LIVES: 3,
    MIN_LIVES: 0,
    MAX_ANSWERS: 10,
    START_TIME: 30,
    FAST_TIME: 20,
    SLOW_TIME: 10,
    WARNING_TIME: 5,
    END_TIME: 0,
    TIME_TICK: 1000,

    StatsType: {
      WRONG: 0,
      CORRECT: 1,
      SLOW: 2,
      FAST: 3,
      UNKNOWN: 4
    },

    Points: {
      CORRECT: 100,
      BONUS: 50,
      FINE: -50
    },
  };

  class GameData {
    constructor() {
      this.currentRound = 0;
      this.rounds = [
        {
          questions: [],
          currentTask: 0,
          lives: globalGameData.TOTAL_LIVES,
          stats: [],
          result: []
        }
      ];
      this.name = name;
    }

    configure(questData, name) {
      this.rounds[0].questions = questData;
      this.name = name;
      return this;
    }
  }

  const localTypeMapper = {
    'two-of-two': GameType.twoOfTwo,
    'one-of-three': GameType.oneOfThree,
    'tinder-like': GameType.oneOfOne
  };

  const localAnswerTypeMapper = {
    'painting': ImageType.PAINT,
    'photo': ImageType.PHOTO,
  };

  const localTasksMapper = (tasks) => tasks.map((task) => {
    return {
      src: task[`image`][`url`],
      type: localAnswerTypeMapper[task[`type`]],
      width: task[`image`][`width`],
      height: task[`image`][`height`],
    };
  });


  const adaptServerData = (data) => data.map((item) => {
    return {
      question: item[`question`],
      gameType: localTypeMapper[item[`type`]],
      tasks: localTasksMapper(item[`answers`])
    };
  });

  const SERVER_URL = `https://es.dump.academy/pixel-hunter/`;
  const DEFAULT_NAME = `Default`;
  const APP_ID = 12132332721;

  const checkStatus = (response) => {
    if (response.ok) {
      return response;
    }
    Application.showError(`${response.status}`);
    throw new Error(`${response.status}: ${response.statusText}`);
  };

  const toJSON = (res) => res.json();

  class Loader {
    static loadData() {
      return fetch(`${SERVER_URL}/questions`).then(checkStatus).then(toJSON).then(adaptServerData);
    }

    static loadResults(name = DEFAULT_NAME) {
      return fetch(`${SERVER_URL}stats/:${APP_ID}-:${name}`).then(checkStatus).then(toJSON);
    }

    static saveResults(round, name = DEFAULT_NAME) {
      const dataForLoad = {
        date: new Date(),
        round: {
          fastBonuses: round.fastBonuses,
          isCorrect: round.isCorrect,
          isWin: round.isWin,
          lives: round.lives,
          livesBonuses: round.livesBonuses,
          slowFine: round.slowFine,
          stats: round.stats,
          totalPoints: round.totalPoints
        },
      };

      const requestSettings = {
        body: JSON.stringify(dataForLoad),
        headers: {
          'Content-Type': `application/json`
        },
        method: `POST`
      };
      return fetch(`${SERVER_URL}stats/:${APP_ID}-:${name}`, requestSettings).then(checkStatus);
    }
  }

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
    },

    gamePage: {
      photoAnswer: `photo`,
      paintAnswer: `paint`
    }

  };

  class IntroView extends AbstractView {
    constructor() {
      super();
      this.callback = (element) => {
        element.preventDefault();
        Application.showGreeting();
      };
    }

    getTemplate() {
      return `<section class="intro"><button class="intro__asterisk asterisk load" type="button"><span class="visually-hidden">Продолжить</span>*</button>
    <p class="intro__motto"><sup>*</sup>${templatesData.intro.text}</p></section>`;
    }

    bind() {
      this.actionElements = this.element.querySelectorAll(`.intro__asterisk`);
      super.bind();
    }
  }

  class GreetingView extends AbstractView {
    constructor() {
      super();
      this.callback = (element) => {
        element.preventDefault();
        Application.showRules();
      };
    }
    getTemplate() {
      const data = templatesData.greeting;
      return `<section class="greeting central--blur"><img class="greeting__logo" src="${data.logo.src}" width="201" height="89" alt="${data.logo.alt}">
    <div class="greeting__asterisk asterisk"><span class="visually-hidden">Я просто красивая звёздочка</span>*</div>
    <div class="greeting__challenge">
      <h3 class="greeting__challenge-title">${data.title}</h3>
      <p class="greeting__challenge-text">${data.text}</p>
      <ul class="greeting__challenge-list">
        ${data.list}
      </ul>
    </div>
    <button class="greeting__continue" type="button">
      <span class="visually-hidden">Продолжить</span>
      <svg class="icon" width="64" height="64" viewBox="0 0 64 64" fill="#000000">
        <use xlink:href="img/sprite.svg#arrow-right"></use>
      </svg>
    </button></section>`;
    }
    bind() {
      this.actionElements = this.element.querySelectorAll(`.greeting__continue`);
      super.bind();
    }
  }

  class Timer {
    constructor() {
      this.currentTime = null;
      this.callback = null;
      this.timeoutId = null;
      this.container = null;
    }

    configure(startTime, container, timeWarningCallback, timeOverCallback) {
      this.currentTime = startTime;
      this.container = container;
      this.callback = timeOverCallback;
      this.timeWarningCallback = timeWarningCallback;
      return this;
    }

    getTime() {
      return this.currentTime;
    }

    start() {
      const tick = () => {
        this.container.innerHTML = this.currentTime;
        this.currentTime--;

        if (this.currentTime < globalGameData.END_TIME) {
          this.callback();
        } else if (this.currentTime < globalGameData.WARNING_TIME) {
          this.timeWarningCallback();
          this.timeoutId = setTimeout(tick, globalGameData.TIME_TICK);
        } else {
          this.timeoutId = setTimeout(tick, globalGameData.TIME_TICK);
        }
      };

      tick();
    }
    stop() {
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId);
      }
      this.callback = null;
    }
  }

  const timer = new Timer();

  const points = globalGameData.Points;
  const statsType = globalGameData.StatsType;
  const debugMode = globalGameData.DEBUG;

  class GameModel {
    constructor(state) {
      const initialState = new GameData();
      this._state = state ? state : initialState;
      this._state.debugMode = debugMode ? debugMode : null;
    }

    get currentRound() {
      return this._state.rounds[this._state.currentRound];
    }

    configure(data, name) {
      if (!this._state.rounds[0].questions.length) {
        const initialState = new GameData().configure(data, name);
        this._state = initialState;
      }
      return this;
    }

    reset() {
      const initialState = new GameData();
      this._state = initialState;
      timer.stop();
      return this;
    }

    setResult(answer, time) {
      this._state = GameModel.setResult(this._state, answer, time);
    }

    countTotal() {
      this._state = GameModel.countTotal(this._state);
    }

    static checkCorrect(taskResult) {
      const answer = taskResult.userAnswer;
      const real = taskResult.realAnswer;
      const isCorrect = isEquivalent(answer, real);
      return Object.assign({}, taskResult, {isCorrect});
    }

    static setStats(round, value) {
      const newStats = round.stats.slice();
      newStats[round.currentTask] = value;
      return Object.assign({}, round, {
        stats: newStats
      });
    }

    static checkAnswerType(taskResult) {
      let result = statsType.UNKNOWN;

      if (taskResult.isCorrect) {
        if (taskResult.currentTime > globalGameData.FAST_TIME) {
          result = statsType.FAST;
        } else if (taskResult.currentTime < globalGameData.SLOW_TIME) {
          result = statsType.SLOW;
        } else {
          result = statsType.CORRECT;
        }
      } else {
        result = statsType.WRONG;
      }
      return Object.assign({}, taskResult, {
        statsType: result
      });
    }

    static setResult(momentState, answer, time) {
      const decreaseLives = (round) => Object.assign({}, round, {lives: round.lives - 1});
      const setCurrent = (round, currentTask) => Object.assign({}, round, {currentTask});
      const getCurrent = (round) => round.currentTask;
      const setTime = (taskResult, currentTime) => Object.assign({}, taskResult, {currentTime});
      const setUserAnswer = (taskResult, userAnswer) => Object.assign({}, taskResult, {userAnswer});
      const setRealAnswer = (taskResult, realAnswer) => Object.assign({}, taskResult, {realAnswer});

      const currentRoundNum = momentState.currentRound;
      const round = momentState.rounds[currentRoundNum];
      const currentTaskNum = getCurrent(round);

      const currentQuestion = round.questions[currentTaskNum].tasks;
      const realAnswer = currentQuestion.map((item) => {
        return item.type;
      });
      const resultWithAnswers = setRealAnswer(setUserAnswer({}, answer), realAnswer);

      const resultWithTime = setTime(resultWithAnswers, time);
      const taskResult = GameModel.checkAnswerType(GameModel.checkCorrect(resultWithTime));

      let gameStatus = GameModel.setStats(round, taskResult.statsType);

      if (!taskResult.isCorrect) {
        gameStatus = decreaseLives(gameStatus);
      }

      gameStatus = setCurrent(gameStatus, currentTaskNum + 1);
      gameStatus.result[currentTaskNum] = taskResult;

      const rounds = momentState.rounds.slice();
      rounds[momentState.currentRound] = gameStatus;
      return Object.assign({}, momentState, {rounds});
    }

    static countTotal(momentState) {
      const round = momentState.rounds[momentState.currentRound];
      const result = round.result;
      const name = momentState.name;
      let correct = 0;
      let wrong = 0;
      let fastBonuses = 0;
      let livesBonuses = round.lives > 0 ? round.lives : 0;
      let fines = 0;

      result.forEach((item) => {
        if (item.isCorrect === true) {
          correct += 1;
        } else {
          wrong += 1;
        }
        if (item.statsType === statsType.SLOW) {
          fines += 1;
        } else if (item.statsType === statsType.FAST) {
          fastBonuses += 1;
        }
      });

      const isWin = wrong < globalGameData.TOTAL_LIVES + 1;

      let total;
      if (isWin) {
        total = {
          isWin,
          isCorrect: correct,
          totalPoints: correct * points.CORRECT + (livesBonuses + fastBonuses) * points.BONUS + fines * points.FINE,
          fastBonuses,
          livesBonuses: round.lives,
          slowFine: fines,
          name
        };
      } else {
        total = {
          isWin,
          isCorrect: 0,
          totalPoints: 0,
          fastBonuses: 0,
          livesBonuses: 0,
          slowFine: 0,
          name
        };
      }
      const gameStatus = Object.assign({}, round, total);
      const rounds = momentState.rounds.slice();
      rounds[momentState.currentRound] = gameStatus;
      return Object.assign({}, momentState, {rounds});
    }
  }

  var GameModel$1 = new GameModel();

  class BackButtonView extends AbstractView {
    constructor() {
      super();
      this.callback = (element) => {
        element.preventDefault();
        Application.showGreeting();
      };
    }

    getTemplate() {
      return `<button class="back">
    <span class="visually-hidden">Вернуться к началу</span>
    <svg class="icon" width="45" height="45" viewBox="0 0 45 45" fill="#000000">
      <use xlink:href="img/sprite.svg#arrow-left"></use>
    </svg>
    <svg class="icon" width="101" height="44" viewBox="0 0 101 44" fill="#000000">
      <use xlink:href="img/sprite.svg#logo-small"></use>
    </svg>
  </button>`;
    }

    static callback(element) {
      element.preventDefault();
      GameModel$1.reset();
      Application.showGreeting();
    }
  }

  class RulesView extends AbstractView {
    constructor() {
      super();
      this.callback = (element) => {
        element.preventDefault();
        Application.showGreeting();
      };
    }

    getTemplate() {
      const data = templatesData.rules;
      const backBtn = new BackButtonView();
      const header = `<header class="header">${backBtn.getTemplate()}</header>`;
      const rules = `<section class="rules"><h2 class="rules__title">${data.title}</h2>
    <ul class="rules__description">
      ${data.description}
    </ul>
    <p class="rules__ready">Готовы?</p>
    <form class="rules__form">
      <input class="rules__input" type="text" placeholder="Ваше Имя">
      <button class="rules__button  continue" type="submit" disabled>Go!</button>
      <p class="rules__devhint">*Режим отладки: Добавить <b>#debug</b> в адресную строку</p>
    </form></section>`;

      return header + rules;
    }

    bind() {
      this.backBtn = this.element.querySelector(`button.back`);
      this.rulesForm = this.element.querySelector(`.rules__form`);
      this.rulesInput = this.rulesForm.querySelector(`.rules__input`);
      this.rulesSubmit = this.rulesForm.querySelector(`.rules__button`);
      this.devCheck = this.rulesForm.querySelector(`#dev-check`);

      this.inputCallback = () => {
        if (this.rulesInput.value) {
          this.rulesSubmit.removeAttribute(`disabled`);
        } else {
          this.rulesSubmit.setAttribute(`disabled`, `true`);
        }
      };

      this.submitCallback = (element) => {
        element.preventDefault();
        Application.showGame(this.rulesInput.value);
      };

      this.rulesInput.addEventListener(`input`, this.inputCallback);
      this.rulesForm.addEventListener(`submit`, this.submitCallback);
      this.backBtn.addEventListener(`click`, BackButtonView.callback);
    }

    clear() {
      this.rulesInput.removeEventListener(`input`, this.inputCallback);
      this.rulesForm.removeEventListener(`submit`, this.submitCallback);
      this.backBtn.removeEventListener(`click`, BackButtonView.callback);
    }
  }

  class LivesView extends AbstractView {
    getTemplate() {
      const livesData = templatesData.lives;

      const emptyHearts = new Array(livesData.TOTAL_LIVES - this.data).fill(livesData.emptyHeart).join(``);
      const fullHearts = this.data > 0 ? new Array(this.data).fill(livesData.fullHeart).join(``) : ``;
      const displayHearts = emptyHearts + fullHearts;

      return `<div class="game__lives">
      ${displayHearts}
    </div>`;
    }
  }

  class GameHeaderView extends AbstractView {
    constructor(numLives) {
      super();
      this.numLives = numLives;
      this.backButton = new BackButtonView();
    }

    getTemplate() {
      const livesView = new LivesView(this.numLives);
      return `<header class="header">${this.backButton.getTemplate()}<div class="game__timer">30</div>${livesView.getTemplate()}</header>`;
    }

    bind() {
      this.backButton = this.element.querySelector(`button.back`);
      this.backButton.addEventListener(`click`, BackButtonView.callback);
    }

    clear() {
      this.backButton.removeEventListener(`click`, BackButtonView.callback);
    }
  }

  class AnswersHistoryView extends AbstractView {
    getTemplate() {
      const type = globalGameData.StatsType;
      const resultsView = templatesData.statsTesults;

      const statsItem = {
        [type.WRONG]: resultsView.wrong,
        [type.CORRECT]: resultsView.correct,
        [type.SLOW]: resultsView.slow,
        [type.FAST]: resultsView.fast,
        [type.UNKNOWN]: resultsView.unknown
      };

      const answers = this.data;

      for (let i = answers.length; i < globalGameData.MAX_ANSWERS; i++) {
        answers.push(type.UNKNOWN);
      }

      const stats = answers.map((answer) => statsItem[answer]).join(``);

      return `<ul class="stats">${stats}</ul>`;
    }
  }

  class AnswerBtnsView extends AbstractView {
    getTemplate() {
      return `<label class="game__answer game__answer--photo">
          <input class="visually-hidden" name="${this.data}" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer game__answer--paint">
          <input class="visually-hidden" name="${this.data}" type="radio" value="paint">
          <span>Рисунок</span>
        </label>`;
    }
  }

  const ANSWER_TYPES = templatesData.gamePage;
  const DEBUG = globalGameData.DEBUG;

  class TwoOfTwoGameView extends AbstractView {
    get element() {
      if (this._element) {
        return this._element;
      }
      const wrapper = this.getTemplate();
      this._element = wrapper;
      this.bind();
      return this._element;
    }

    getTemplate() {
      const createOptions = (tasks) => {
        const content = renderElement(``, `form`, `game__content`);
        tasks.forEach((item) => {
          const index = tasks.indexOf(item) + 1;
          const properImage = renderImage(item.properImg, `Option ${index}`);
          const answersBtns = new AnswerBtnsView(`question${index}`).element;
          const option = renderElement(``, `div`, `game__option`);

          if (DEBUG) {
            let hintText;
            if (item.type === ImageType.PHOTO) {
              hintText = `ФОТО`;
            } else if (item.type === ImageType.PAINT) {
              hintText = `РИСУНОК`;
            }
            const hint = renderElement(hintText, `p`, `game__hint`);
            option.appendChild(hint);
          }

          option.appendChild(properImage);
          option.appendChild(answersBtns);

          content.appendChild(option);
        });
        return content;
      };
      return createOptions(this.data.tasks);
    }

    bind() {
      this.actionElements = this.element.querySelectorAll(`.game__answer`);
      super.bind();
    }

    static setGame(element, state, GameView) {
      element.preventDefault();
      const firstAnswer = document.querySelector(`.game__answer.checked`);

      if (firstAnswer) {
        const firstInput = firstAnswer.querySelector(`input`);
        const firstName = `question1`;
        const currentInput = element.currentTarget.querySelector(`input`);

        if (firstInput.name === currentInput.name) {
          firstInput.checked = false;
          currentInput.checked = true;
        } else {
          timer.stop();
          const secondAnswer = element.currentTarget.querySelector(`input`).value;
          const answerSynchronize = (firstInput.name === firstName) ? [firstInput.value, secondAnswer] : [secondAnswer, firstInput.value];

          const answer = answerSynchronize.map((userAnswer) => {
            switch (userAnswer) {
              case ANSWER_TYPES.photoAnswer:
                return ImageType.PHOTO;
              case ANSWER_TYPES.paintAnswer:
                return ImageType.PAINT;
              default:
                return null;
            }
          });
          state.setResult(answer, timer.getTime());
          GameView.goToNextScreen();
        }
      } else {
        element.currentTarget.classList.add(`checked`);
        element.currentTarget.querySelector(`input`).checked = true;
      }
    }
  }

  const DEBUG$1 = globalGameData.DEBUG;
  const ANSWER_TYPES$1 = templatesData.gamePage;

  class OneOfOneGameView extends AbstractView {

    get element() {
      if (this._element) {
        return this._element;
      }
      const wrapper = this.getTemplate();
      this._element = wrapper;
      this.bind();
      return this._element;
    }

    getTemplate() {
      const createOption = (item) => {
        const content = renderElement(``, `form`, `game__content game__content--wide`);
        const properImage = renderImage(item.properImg, `Option 1`);
        const answersButtons = new AnswerBtnsView(`question1`).element;

        const soloOption = renderElement(``, `div`, `game__option`);

        if (DEBUG$1) {
          let hintText;
          if (item.type === ImageType.PHOTO) {
            hintText = `ФОТО`;
          } else if (item.type === ImageType.PAINT) {
            hintText = `РИСУНОК`;
          }
          const hint = renderElement(hintText, `p`, `game__hint`);
          soloOption.appendChild(hint);
        }

        soloOption.appendChild(properImage);
        soloOption.appendChild(answersButtons);

        content.appendChild(soloOption);

        return content;
      };

      return createOption(this.data.tasks[0]);
    }

    bind() {
      this.actionElements = this.element.querySelectorAll(`.game__answer`);
      super.bind();
    }

    static setGame(element, state, GameView) {
      element.preventDefault();
      timer.stop();
      const userAnswer = element.currentTarget.querySelector(`input`).value;

      let answer;

      if (userAnswer === ANSWER_TYPES$1.photoAnswer) {
        answer = [ImageType.PHOTO];
      } else if (userAnswer === ANSWER_TYPES$1.paintAnswer) {
        answer = [ImageType.PAINT];
      }
      state.setResult(answer, timer.getTime());
      GameView.goToNextScreen();
    }
  }

  const DEBUG$2 = globalGameData.DEBUG;

  class OneOfThreeGameView extends AbstractView {
    get element() {
      if (this._element) {
        return this._element;
      }
      const wrapper = this.getTemplate();
      this._element = wrapper;
      this.bind();
      return this._element;
    }

    getTemplate() {
      const createOptions = (tasks) => {
        const content = renderElement(``, `form`, `game__content game__content--triple`);
        tasks.forEach((item) => {
          const index = tasks.indexOf(item) + 1;
          const properImage = renderImage(item.properImg, `Option ${index}`);

          const option = renderElement(``, `div`, `game__option`);

          if (DEBUG$2) {
            let hintText;
            if (item.type === ImageType.PHOTO) {
              hintText = `ФОТО`;
            } else if (item.type === ImageType.PAINT) {
              hintText = `РИСУНОК`;
            }
            const hint = renderElement(hintText, `p`, `game__hint`);
            option.appendChild(hint);
          }

          if (item.type === ImageType.PHOTO) {
            option.dataset.imageType = ImageType.PHOTO;
          } else {
            option.dataset.imageType = ImageType.PAINT;
          }
          option.appendChild(properImage);

          content.appendChild(option);
        });

        return content;
      };

      return createOptions(this.data.tasks);
    }

    bind() {
      this.actionElements = this.element.querySelectorAll(`.game__option`);
      super.bind();
    }

    static setGame(element, state, GameView) {
      element.preventDefault();
      timer.stop();
      const gameOptions = document.querySelectorAll(`.game__option`);

      const answer = [];
      gameOptions.forEach((option) => {
        const chosenElementType = Number(element.currentTarget.dataset.imageType);
        const optionType = Number(option.dataset.imageType);
        if (option === element.currentTarget) {
          answer.push(chosenElementType);
        } else {
          answer.push(optionType);
        }
      });
      state.setResult(answer, timer.getTime());
      GameView.goToNextScreen();
    }
  }

  class GameView {
    constructor(questData, name) {
      this.name = name;
      this.questData = questData;
      this.round = GameModel$1.currentRound;
      this.task = this.questData[this.round.currentTask];
      this.header = this.renderHeader();
      this.level = this.renderLevel();

      this.game = document.createDocumentFragment();
      this.game.appendChild(this.header);
      this.game.appendChild(this.level);
    }

    renderHeader() {
      const header = new GameHeaderView(this.round.lives);
      return header.element;
    }

    renderLevel() {
      const gameScreen = renderElement(``, `section`, `game`);
      gameScreen.appendChild(this.renderGameTask());
      gameScreen.appendChild(this.renderGameContent());
      gameScreen.appendChild(this.renderGameStats());
      return gameScreen;
    }

    renderGameTask() {
      return renderElement(this.questData[this.round.currentTask].question, `p`, `game__task`);
    }

    renderGameContent() {
      switch (this.task.gameType) {
        case GameType.twoOfTwo:
          return new TwoOfTwoGameView(this.task, GameView.twoOfTwoCallback).element;
        case GameType.oneOfOne:
          return new OneOfOneGameView(this.task, GameView.oneOfOneCallback).element;
        case GameType.oneOfThree:
          return new OneOfThreeGameView(this.task, GameView.oneOfThreeCallback).element;
        default:
          throw new Error(`Unknown game type`);
      }
    }

    renderGameStats() {
      return appendElement(new AnswersHistoryView(this.round.stats).element, `ul`, `stats`);
    }

    startLevel() {
      GameModel$1.configure(this.questData, this.name);
      timer.configure(globalGameData.START_TIME, this.game.querySelector(`.game__timer`), GameView.timeWarningCallback, GameView.timeOverCallback).start();

      return this.game;
    }

    static timeWarningCallback() {
      this.container.classList.add(`blink`);
    }

    static timeOverCallback() {
      GameModel$1.setResult([], 0);
      GameView.goToNextScreen();
    }

    static twoOfTwoCallback(e) {
      TwoOfTwoGameView.setGame(e, GameModel$1, GameView);
    }

    static oneOfOneCallback(e) {
      OneOfOneGameView.setGame(e, GameModel$1, GameView);
    }

    static oneOfThreeCallback(e) {
      OneOfThreeGameView.setGame(e, GameModel$1, GameView);
    }

    static goToNextScreen() {
      const round = GameModel$1.currentRound;
      const current = round.currentTask;
      if (round.lives < globalGameData.MIN_LIVES || current >= globalGameData.MAX_ANSWERS) {
        GameModel$1.countTotal();
        Application.showResults(GameModel$1);
      } else {
        Application.showGame();
      }
    }
  }

  const data = templatesData.statsPage;
  const points$1 = globalGameData.Points;

  class StatsView extends AbstractView {
    constructor(state) {
      super();
      this.state = state;
    }

    getTemplate() {
      const backBtn = new BackButtonView();
      return `<header class="header">${backBtn.getTemplate()}</header>
  <section class="result">
    <h1>Результаты загружаются...</h1>
  </section>`;
    }

    static setBonusBlock(title, number, pointsForOne, total) {
      return `<tr>
            <td></td>
            <td class="result__extra">${title}</td>
            <td class="result__extra">${number}</td>
            <td class="result__points">× ${pointsForOne}</td>
            <td class="result__total">${total}</td>
            </tr>`;
    }

    showScores(loadedData) {
      const resultsData = loadedData.reverse();

      let resultContainer = ``;
      resultsData.forEach((result) => {
        const round = result.round;
        const answerStats = new AnswersHistoryView(round.stats);
        const mainBlock = `<tr>
        <td class="result__number">${loadedData.indexOf(result) + 1}.</td>
        <td colspan="2">${answerStats.getTemplate()}</td>
        <td class="result__points">${round.isWin ? `× ` + points$1.CORRECT : ``}</td>
        <td class="result__total">${round.isWin ? round.isCorrect * points$1.CORRECT : data.statusFail}</td>
      </tr>`;

        let bonusesBlock = ``;

        if (round.isWin && (round.fastBonuses !== null || round.livesBonuses !== null || round.slowFine !== null)) {
          if (round.fastBonuses) {
            bonusesBlock += StatsView.setBonusBlock(data.speedBonusTitle, round.fastBonuses, points$1.BONUS, round.fastBonuses * points$1.BONUS);
          }

          if (round.livesBonuses) {
            bonusesBlock += StatsView.setBonusBlock(data.lifeBonusTitle, round.livesBonuses, points$1.BONUS, round.livesBonuses * points$1.BONUS);
          }

          if (round.slowFine) {
            bonusesBlock += StatsView.setBonusBlock(data.fineTitle, round.slowFine, points$1.FINE, round.slowFine * points$1.FINE);
          }
        }

        const totalBlock = round.isWin ? `<tr><td colspan="5" class="result__total  result__total--final">${round.totalPoints}</td></tr>` : ``;
        resultContainer += `<table class="result__table">${mainBlock}${bonusesBlock}${totalBlock}</table>`;
      });
      const mainResult = loadedData[0].round;
      this._scoreBoardContainer.innerHTML = `<h1>${mainResult.isWin ? data.titleWin : data.titleFail}</h1>
    ${resultContainer}`;
    }

    bind() {
      this.backBtn = this.element.querySelector(`button.back`);
      this.backBtn.addEventListener(`click`, BackButtonView.callback);
      this._scoreBoardContainer = this.element.querySelector(`section.result`);
    }

    clear() {
      this.backBtn.removeEventListener(`click`, BackButtonView.callback);
    }
  }

  let questData;
  class Application {
    static start() {
      const intro = new IntroView(true);
      showScreen(intro.element);
      Loader.loadData().
        catch((error) => Application.showError(error)).
        then((data) => {
          questData = data;
          Promise.all([questData.forEach((element) => {
            element.tasks.forEach((task) => massImageResize(task));
          })]).
            then(() => {
              Application.showGreeting();
            });
        });
    }

    static showGreeting() {
      this.currentView = new GreetingView();
      showScreen(this.currentView.element);
    }

    static showRules() {
      this.currentView.clear();
      this.currentView = new RulesView();
      showScreen(this.currentView.element);
    }

    static showGame(name) {
      if (this.currentView) {
        this.currentView.clear();
      }
      this.currentView = null;
      showScreen(new GameView(questData, name).startLevel());
    }

    static showResults(status) {
      const scoreBoard = new StatsView(status);
      showScreen(scoreBoard.element);
      Loader.saveResults(status.currentRound, status.currentRound.name).
        then(() => Loader.loadResults(status.currentRound.name).
          then((data) => scoreBoard.showScores(data)).
          then(GameModel$1.reset()).
          catch(Application.showError));
    }

    static showError(error) {
      const errorScreen = new ErrorModal(error);
      showElement(errorScreen.element);
    }
  }

  Application.start();

}());

//# sourceMappingURL=main.js.map
