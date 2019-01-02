import GameData, {globalGameData} from './game-data';
import timer from '../templates/items/timer';
import {isEquivalent} from '../utils';

const points = globalGameData.Points;
const statsType = globalGameData.StatsType;

class State {
  constructor(state) {
    const initialState = new GameData();
    this._state = state ? state : initialState;
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
    this._state = State.setResult(this._state, answer, time);
  }

  countTotal() {
    this._state = State.countTotal(this._state);
  }

  static checkCorrect(taskResult) {
    const answer = taskResult.userAnswer;
    const real = taskResult.realAnswer;
    const isCorrect = isEquivalent(answer, real);
    return Object.assign({}, taskResult, {isCorrect});
  }

  static setStats(round, value) {
    let newStats = round.stats.slice();
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
    } else if (!taskResult.isCorrect) {
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
    const taskResult = State.checkAnswerType(State.checkCorrect(resultWithTime));

    let gameStatus = State.setStats(round, taskResult.statsType);

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

const state = new State();
export default state;
