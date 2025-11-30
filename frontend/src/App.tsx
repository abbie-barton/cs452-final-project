import Home from "./pages/Home";
import AnimalsPage from "./pages/animals/AnimalsPage";
import Layout from "./components/layout/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/admin" element={<Home />} />
              <Route path="/animals" element={<AnimalsPage />} />
            </Route>
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
