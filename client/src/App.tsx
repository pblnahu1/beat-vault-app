
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { LoaderProvider } from "./context/LoaderContext";

function App() {
  return (
    <LoaderProvider>
      <BrowserRouter>
        <div className="top-0 z-[-2] h-full w-full bg-[#1e1e2e] bg-[radial-gradient(#ffffff22_1px,transparent_1px)] bg-[length:20px_20px]">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </LoaderProvider>
  );
}

export default App;