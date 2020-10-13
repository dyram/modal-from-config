import React, { Suspense } from "react";
import "./styles.less";
import { MachineProvider } from "./MachineProvider";
import { getComponentsForAppConfig } from "./Helper";

function App() {
  MachineProvider.init();
  return (
    <div className="App">
      <Suspense fallback={<div>Loading a view</div>}>
        {getComponentsForAppConfig()}
      </Suspense>
    </div>
  );
}

export default App;
