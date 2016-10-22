import stateToKeyString from "../dbLayer/stateToKeyString";
/**
 * This object represents a state action
 */
export default class StateAction {
  state = null;
  action = null;

  constructor(state, action) {
    this.state = state;
    this.action = action
  }

  print() {
    return stateToKeyString(this);
  }
}
