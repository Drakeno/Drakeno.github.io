import BackButtonView from './back-button';
import LivesView from './lives';
import AbstractView from '../../abstract-view';

export default class GameHeaderView extends AbstractView {
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
