// import expect from "expect";
// import deepFreeze from "deep-freeze";
// import reducer from "../js/reducers";
// import {pickFromStack} from "../js/actions/GameActions";
// import {initializeGameState} from "../js/helpers/initializeGame";
// import {getRandomIndex} from "../js/helpers/commonHelper";
//
//
// describe('reducer', () => {
//   it('is providing the initial state', () => {
//     expect(reducer(undefined, {})).toEqual(initializeGameState())
//   });
//
//   describe('PICK_FROM_STACK', () => {
//     it('is ending the game when no tiles are left on the stack', () => {
//
//     });
//
//     it('is handling action correct', () => {
//       const stateBefore = initializeGameState();
//       const randomElementIndex = getRandomIndex(stateBefore);
//       const playerIndex = 0;
//       const action = pickFromStack(playerIndex, randomElementIndex);
//
//       deepFreeze(stateBefore);
//       deepFreeze(action);
//
//       const stateAfter = reducer(stateBefore, action);
//       const pickedTile = stateBefore.stack[randomElementIndex];
//       expect(stateAfter.stack).toExclude(pickedTile);
//       expect(stateAfter.players[playerIndex].tiles).toInclude(pickedTile)
//
//     })
//   });
//
//   describe('DISPLAY_GROUP_OR_ROW', () => {
//     it('is displaying the tiles', () => {
//       const stateBefore = initializeGameState();
//
//       const action = startDisplay(tiles);
//       deepFreeze(stateBefore);
//       deepFreeze(action);
//
//       expect(displayValue).toEqual(30)
//
//
//     })
//   })
// });
//
