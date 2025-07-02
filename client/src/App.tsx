
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gradient-to-br from-zinc-950 via-indigo-950 to-blue-950">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;