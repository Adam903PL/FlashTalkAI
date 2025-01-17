import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CardProps {
  unit: string;
}

const Card: React.FC<CardProps> = ({ unit }) => {
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:4444/api/flashcards/${unit}`, {
      credentials: "include",
    })
      .then((resp) => {
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
      className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer max-w-sm w-full mx-6 mb-6"
      onClick={() => {
        navigate(`/home/flashcards/${unit.replace(".json", "")}`);
      }}
    >
      <h2 className="text-xl font-semibold mb-4">{unit.replace(".json", "")}</h2>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
};

export default Card;
  