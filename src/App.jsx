import React from "react";
import Dashboard from "./components/Dashboard";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <div className="bg-cyan-400 h-full ">
        <Dashboard />
      </div>
    </Provider>
  );
}

export default App;
