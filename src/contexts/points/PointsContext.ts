import { createContext } from "react";

export type pointsType = {
    points: number;
    level: number;
};


type PointsContextResult = {
    LearnWithAilist: pointsType[]; 
    addPoint: (userid: number) => void;
};


export const PointsContext = createContext<PointsContextResult | null>(null);

PointsContext.displayName = "PointsContext";