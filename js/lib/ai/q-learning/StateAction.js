export default class StateAction {
  state = null;
  action = null;

  constructor(state, action) {
    this.state = state;
    this.action = action
  }
}