import {showScreen, showElement} from './utils';
import SplashScreen from './splash-screen';
import ErrorModal from './templates/error-modal';
import Loader from './loader';
import Intro from './templates/intro-view';
import Greeting from './templates/greeting-view';
import Rules from './templates/rules-view';
import Game from './templates/game-view';
import StatsView from './templates/stats-view';
import state from './data/state';

let questData;
export default class Application {
  static start() {
    const splash = new SplashScreen();
    showScreen(splash.element);
    splash.start();
    Loader.loadData().
      then((data) => {
        questData = data;
        return questData;
      }).
      then((response) => Application.showIntro(response)).
      catch(Application.showError).
    then(() => splash.stop());
  }

  static showIntro() {
    this.currentView = new Intro();
    showScreen(this.currentView.element);
  }
  static showGreeting() {
    this.currentView = new Greeting();
    showScreen(this.currentView.element);
  }
  static showRules() {
    this.currentView.clear();
    this.currentView = new Rules();
    showScreen(this.currentView.element);
  }
  static showGame(name) {
    if (this.currentView) {
      this.currentView.clear();
    }
    this.currentView = null;
    showScreen(new Game(questData, name).startLevel());
  }
  static showResults(status) {
    const scoreBoard = new StatsView(status);
    showScreen(scoreBoard.element);
    Loader.saveResults(status.currentRound, status.currentRound.name).
      then(() => Loader.loadResults(status.currentRound.name).
      then((data) => scoreBoard.showScores(data)).
      then(state.reset()).
      catch(Application.showError));
  }

  static showError(error) {
    const errorScreen = new ErrorModal(error);
    showElement(errorScreen.element);
  }
}
