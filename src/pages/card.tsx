import React, { useEffect, useState } from 'react';

interface CardProps {
    unit: string;
}

const Card: React.FC<CardProps> = ({ unit }) => {
    const [description, setDescription] = useState<string>("");

    useEffect(() => {
        fetch(`/api/flashcards/${unit}`)
            .then((resp) => {
                console.log(unit,"lsl")
                if (!resp.ok) {
                    throw new Error('Failed to fetch data');
                }
                return resp.json();
            })
            .then((data) => {
                const descriptionText = data.length > 0 && data[0].description ? data[0].description : 'No description available';
                setDescription(descriptionText);
            })
            .catch((error) => {
                console.error(error);
                setDescription('Error fetching description');
            });
    }, [unit]); 

    return (
        <div className="card" onClick={()=>{window.location.href = `/home/flashcards/${unit.replace('.json', '')}`}}>
            <h2>{unit.replace('.json', '')}</h2> 
            <p className='description'>Description: {description}</p>
        </div>
    );
};

export default Card;
