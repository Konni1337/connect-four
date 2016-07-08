/**
 * This object represents a state action value
 */

export default class StateActionValue {
  stateAction = null;
  value = null;
  
  constructor(stateAction, value) {
    this.stateAction = stateAction;
    this.value = value
  }
}