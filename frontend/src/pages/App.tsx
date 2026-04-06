import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <Route path="/new-study-place" element={<NewStudyPlace />} />
      </Routes>
    </BrowserRouter>
  );
}