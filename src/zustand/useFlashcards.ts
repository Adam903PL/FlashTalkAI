import { create } from "zustand";
import Flashcard from "../pages/flashcards/flashcard";

type Flashcard = {
  id: number;
  word: string;
  translation: string;
};

type Description = {
  description: string;
};

export type TypeFlashCardsResponse = (Flashcard | Description)[];

export type TypeFlashCards = {
  success: boolean;
  data: { flashcard_id: number }[];
};

type UseFlashCardsState = {
  flashCardsUnKnown: TypeFlashCards["data"];
  changeKnown: (wordID: Flashcard["id"]) => void;
  fetchUnKnownFlashCards: (from: number, to: number) => Promise<void>;
  allWordsFlashcards: (Flashcard | Description)[];
  fetchAllFlashcards: (unit: string) => Promise<void>;
  refreshFlashCards:(from: number, to: number, unit: string) =>void
};

export const useFlashCards = create<UseFlashCardsState>((set, get) => ({
  flashCardsUnKnown: [],
  changeKnown: async (wordID: Flashcard["id"]) => {
    try {
    //   const { fetchUnKnownFlashCards, fetchAllFlashcards } = get();

      await fetch("http://localhost:4444/changeKnown", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wordId: wordID }),
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
          }
          return resp.json();
        })
        .then((data) => {
          console.log("ZUstand changeKnown:", data);
        })
        .catch((err) => console.log("Error changeunknown zustand:", err));

    } catch (error) {
      console.error("Error fetching unknownflashcards:", error);
    }
  },
  fetchUnKnownFlashCards: async (from, to) => {
    try {
         await fetch("http://localhost:4444/getKnownWordsByUnitId", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to }),
      })
        .then((resp) => resp.json())
        .then((data: TypeFlashCards) => {
          if (data.success) {
            const datasSend = { flashCardsUnKnown: data.data };
            console.log(datasSend, "fetchUnKownFlashCards");
            set(datasSend);
          } else {
            console.error("Error: Response unsuccessful");
          }
        })
        .catch((err) => console.log("Error in zustand useFLaschkards unKnown:", err));
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  },
  allWordsFlashcards: [],
  fetchAllFlashcards: async (unit) => {
    try {
      await fetch(`http://localhost:4444/api/flashcards/${unit.replace(".json", "")}.json`)
        .then((resp) => resp.json())
        .then((data: TypeFlashCards) => {
          const datasSend = { allWordsFlashcards: data.slice(1) };
          console.log(datasSend, "fetchAllFlashcards");
          set(datasSend);
        })
        .catch((err) => console.log("Error in zustand fetchAllFlashcards:", err));
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error);
    }
  },
  refreshFlashCards: async(from: number, to: number, unit: string) => {
    try{
        const { fetchUnKnownFlashCards, fetchAllFlashcards } = get();

        console.time("fetchUnKnownFlashCards");
        await fetchUnKnownFlashCards(from, to);
        console.timeEnd("fetchUnKnownFlashCards");
        
        console.time("fetchAllFlashcards");
        await fetchAllFlashcards(unit);
        console.timeEnd("fetchAllFlashcards");
        
    }catch (error) {
      console.error("Refresh:", error);
    }
  }
}));
