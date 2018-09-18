import AbstractView from '../abstract-view';
import AnswerBtnsView from './items/answer-buttons';
import {ImageType} from '../data/game-data';
import timer from './items/timer';
import {renderElement, resizeToProperSize} from '../utils';

export default class TwoOfTwoGameView extends AbstractView {
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
        const properImage = resizeToProperSize(item);
        const index = tasks.indexOf(item) + 1;
        properImage.alt = `Option ${index}`;
        const answersBtns = new AnswerBtnsView(`question${index}`).element;
        const option = renderElement(``, `div`, `game__option`);
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
        const photoAnswer = `photo`;
        const paintAnswer = `paint`;
        const answer = answerSynchronize.map((userAnswer) => {
          switch (userAnswer) {
            case photoAnswer:
              return ImageType.PHOTO;
            case paintAnswer:
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
