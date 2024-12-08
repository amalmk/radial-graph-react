import { useEffect, useState } from "react";
import "./App.css";
import Chart from "./Chart";

function App() {
  const [zoom, setZoom] = useState(0);
  useEffect(() => {
    console.log(zoom);
  }, [zoom]);

  return (
    <>
      <div className="app-container">
        <div className="chart-wrapper">
          <Chart setZoom={setZoom} />
        </div>
        <div
          className="arc-container"
          // style={zoom ? { zoom: zoom + 0.31 } : { zoom: 0 }}
        >
          <div className="arc arc-1">
            <div className="arc arc-2">
              <div className="arc arc-3">
                <div className="arc-4">
                  SPRING BOOT BANKING
                  <button>APPLY NOW</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
