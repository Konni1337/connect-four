import * as ActionTypes from "../constants/ActionTypes";

export function changePlayer(player, index) {
  return {type: ActionTypes.CHANGE_PLAYER, player, index}
}