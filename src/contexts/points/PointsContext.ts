import { createContext } from "react";

export type pointsType = {
    points: number;
    level: number;
};


type PointsContextResult = {
    list: pointsType[]; 
    addPoint: (userid: number) => void;
    setPoint: (newList: pointsType[]) => void;
};


export const PointsContext = createContext<PointsContextResult | null>(null);

PointsContext.displayName = "PointsContext";
