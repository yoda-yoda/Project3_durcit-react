import React from "react";
import ReactDOM from "react-dom/client"; // React 18 방식
import App from "./App";
import "./index.css";
import { Provider } from "react-redux"; // Redux Provider
import store from "./store"; // Redux 스토어

// React 18에서는 createRoot 사용
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
     <App />
  </Provider>

);
