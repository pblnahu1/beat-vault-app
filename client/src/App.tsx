
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { LoaderProvider } from "./context/LoaderContext";

function App() {
  return (
    <LoaderProvider>
      <BrowserRouter>
        <div className="bg-gradient-to-br from-zinc-950 via-indigo-950 to-blue-950">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </LoaderProvider>
  );
}

export default App;