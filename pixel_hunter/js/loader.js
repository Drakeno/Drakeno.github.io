import Application from './application';
import adaptServerData from './data/data-adapter';

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

export default class Loader {
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
