import { create } from 'zustand';


export type SpecificDataTyping = {
  UserLearnAiPoints: number;
  UserLearnAiLevel: number;
  UserFlashCardPoints: number;
};

export type UserPointData = {
  userid: number;
  specificData: SpecificDataTyping;
};

 



type UsePointsState = {
  pointsList: UserPointData;
};


export const usePoint = create<UsePointsState>((set) => ({
  pointsList: defaultPointsList
}));
