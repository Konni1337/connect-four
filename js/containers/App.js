import '../../css/app.css';
import React from "react";
import {Provider} from "react-redux";
import configureStore from "../store/configureStore";
import GameContainer from "./GameContainer";


const store = configureStore();

export default React.createClass({
  render() {
    return (
      <div className="container">
        <Provider store={store}>          
          <GameContainer />
        </Provider>
      </div>
    );
  }
});
