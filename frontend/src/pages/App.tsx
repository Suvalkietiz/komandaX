import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NewStudyPlace } from "./NewStudyPlace";
import StudyPlacesMap from "../components/StudyPlacesMap";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>StudyMap</h1>
              <StudyPlacesMap />
            </div>
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