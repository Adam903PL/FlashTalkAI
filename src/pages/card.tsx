import React, { useEffect, useState } from "react";
import cardStyles from "./css/card.module.css";

interface CardProps {
  unit: string;
}

const Card: React.FC<CardProps> = ({ unit }) => {
  const [description, setDescription] = useState<string>("");
  useEffect(() => {
    fetch("http://localhost:4444/loginSucces", {
      credentials: "include",
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.succes == false) {
          window.location.href = "/login";
          // navigate("/home");
        }
      });
  }, []);
  useEffect(() => {
    fetch(`http://localhost:4444/api/flashcards/${unit}`, {
      credentials: "include",
    })
      .then((resp) => {
        console.log(unit, "lsl");
        if (!resp.ok) {
          throw new Error("Failed to fetch data");
        }
        return resp.json();
      })
      .then((data) => {
        const descriptionText =
          data.length > 0 && data[0].description
            ? data[0].description
            : "No description available";
        setDescription(descriptionText);
      })
      .catch((error) => {
        console.error(error);
        setDescription("Error fetching description");
      });
  }, [unit]);

  return (
    <div
      className={cardStyles.card}
      onClick={() => {
        window.location.href = `/home/flashcards/${unit.replace(".json", "")}`;
      }}
    >
      <h2>{unit.replace(".json", "")}</h2>
      <p className={cardStyles.description}>Description: {description}</p>
    </div>
  );
};

export default Card;
