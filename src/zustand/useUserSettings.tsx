import { create } from "zustand";



// nie uzywany był plan ale nie zdążyłem

type CardDetails = {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
  cardType: string;
};

type UserSettingsState = {
  password: string;
  email: string;
  location: string;
  isTwoStepVerificationEnabled: boolean;
  accountType: "basic" | "premium";
  cardDetails: CardDetails | null;
  updateSettings: (newSettings: Partial<UserSettingsState>) => void;
};


export const useUserSettings = create<UserSettingsState>((set) => ({
  password: "",
  email: "",
  location: "",
  isTwoStepVerificationEnabled: false,
  accountType: "basic",
  cardDetails: null,
  updateSettings: (newSettings) =>
    set((state) => ({
      ...state,
      ...newSettings,
      cardDetails: newSettings.cardDetails
        ? { ...state.cardDetails, ...newSettings.cardDetails }
        : state.cardDetails,
    })),
}));
