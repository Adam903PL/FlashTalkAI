import { create } from "zustand";
import Flashcard from "../pages/flashcards/flashcard";


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
  changeKnown: (wordID: Flashcard["id"],from: number, to: number, unit: string,falseOrTrue:boolean) => void;
  fetchUnKnownFlashCards: (from: number, to: number) => Promise<void>;
  allWordsFlashcards: (Flashcard | Description)[];
  fetchAllFlashcards: (unit: string) => Promise<void>
//   refreshFlashCards:(from: number, to: number, unit: string) =>void
};

export const useFlashCards = create<UseFlashCardsState>((set, get) => ({
  flashCardsUnKnown: [],
  changeKnown: async (wordID: Flashcard["id"], from: number, to: number, unit: string, falseOrTrue: boolean)  => {
    try {
      // const { fetchUnKnownFlashCards, fetchAllFlashcards } = get();

      await fetch("http://localhost:4444/changeKnown", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wordId: wordID, falseOrTrue: falseOrTrue }), 
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
          }
          return resp.json();
        })
        .then((data) => {
          console.log("ZUstand changeKnown:", data);
          const { fetchUnKnownFlashCards, fetchAllFlashcards } = get();

          console.time("fetchUnKnownFlashCards");
          fetchUnKnownFlashCards(from, to);
          console.timeEnd("fetchUnKnownFlashCards");
          
          console.time("fetchAllFlashcards");
          fetchAllFlashcards(unit);
          console.timeEnd("fetchAllFlashcards");
        })
        .catch((err) => console.log("Error changeunknown zustand:", err));

    } catch (error) {
      console.error("Error fetching unknownflashcards:", error);
    }
  },
  fetchUnKnownFlashCards: async (from, to) => {
    try {
      const resp = await fetch("http://localhost:4444/getKnownWordsByUnitId", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to }),
      });
  
      const data = await resp.json();
  
      if (data.success) {
        const datasSend = { flashCardsUnKnown: data.data };
        set(datasSend);
      } else {
        console.error("Error: Response unsuccessful");
      }
    } catch (err) {
      console.log("Error fetching flashcards:", err);
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
}));
