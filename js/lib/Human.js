/**
 * Human player class
 */
export default class Human {
  id = null;

  constructor(id) {
    this.id = id;
  }

  /**
   * Returns true
   *
   * @returns {boolean}
   */
  isHuman() {
    return true;
  }

  /**
   * A hook that is called when a game is finished
   */
  endGame() {}
}