import { useContext } from "react";
import DarkModeContext from "../context/DarkModeContext";
import WeeklyBest from "./WeeklyBest";
import Forum from "./Forum";

function Interests() {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`w-full ${isDarkMode ? "bg-black/100" : "bg-white"}`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mt-28 mb-5 grid grid-cols-1 lg:grid-cols-3 gap-6 px-20">
          <div className="lg:col-span-2">
            <WeeklyBest />
          </div>
          <div className="lg:col-span-1">
            <Forum />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interests;




