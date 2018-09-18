import {globalGameData} from '../../data/game-data';
import templatesData from '../../data/templates-data';
import AbstractView from '../../abstract-view';

export default class AnswersHistoryView extends AbstractView {
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
