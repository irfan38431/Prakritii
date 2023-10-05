import { useState } from "react";
import Controller from "./components/Controller";

function App() {
  const [_count, _setCount] = useState(0);

  return (
    <div>
      <>
        <Controller />
      </>
    </div>
  );
}

export default App;