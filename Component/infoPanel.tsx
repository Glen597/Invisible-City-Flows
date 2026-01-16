import React from "react";
import {SelectedPoint} from "../types";

type InfoPanelProps = {
  selectedPoint: SelectedPoint | null;
};

const InfoPanel: React.FC<InfoPanelProps>= ({selectedPoint}) => {
 
    return (
        <div>
             {selectedPoint ? (
        <div>
          <div>Longitude: {selectedPoint.lng}</div>
          <div>Latitude: {selectedPoint.lat}</div>
        </div>
      ) : (
        <div>Click on the map</div>
      )}
        </div>
    )
};



export default InfoPanel;