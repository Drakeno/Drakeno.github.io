import AbstractView from '../../abstract-view';
import templatesData from '../../data/templates-data';

export default class LivesView extends AbstractView {
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
