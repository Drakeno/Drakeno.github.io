import AbstractView from './abstract-view';

export default class SplashScreen extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div>Загрузка...</div>`;
  }

  start() {
    this.timeout = setTimeout(() => this.start(), 50);
  }

  stop() {
    clearTimeout(this.timeout);
  }
}
