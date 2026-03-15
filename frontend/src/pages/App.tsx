import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NewStudyPlace } from "./NewStudyPlace";
export function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={
        <div>This will be our main page</div>
        }
      />
      <Route
        path="/new-study-place"
        element={
          <div className="new-study-page">
            <div className="app">
              <h1>New study place Form</h1>
              <NewStudyPlace />
            </div>
          </div>
        }
      />
    </Routes>
  </BrowserRouter>

  );
}

