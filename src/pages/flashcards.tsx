import {useEffect, useState } from "react";
import "./css/headerNav.css"
import Card from "./card";
import "./css/card.css"

function Flashcards(){
    const [userMenuVisible, setUserMenuVisible] = useState(false);
    const [units,setUnits] = useState([])
    
    const toggleUserMenu = () => setUserMenuVisible(!userMenuVisible);

    useEffect(() => {
        fetch('/api/flashcards')
          .then(resp => resp.json())  
          .then(data => {
            console.log(data);  
            setUnits(data);  
          })
          .catch(error => {
            console.error('Błąd przy ładowaniu danych:', error);
          });
      },[]);

    useEffect(() => {
        console.log('Stan units zmieniony:', units);  
    }, [units]);
    



    return (
        <>
        <div className="homeContainer">
          {/* Header */}
          <header className="header">
            <div className="logo">FlashTalkAI</div>
            <div className="searchBar">
              <input type="text" placeholder="Wyszukaj..." className="scherch" />
            </div>
            <div className="userIcon" onClick={toggleUserMenu}>
              <i className="fas fa-user"></i>
            </div>
            {userMenuVisible && (
              <div className="userMenu">
                <ul>
                  <li>Ustawienia</li>
                  <li>Wyloguj się</li>
                  <li>Opcje strony</li>
                </ul>
              </div>
            )}
          </header>
      {/* Navigation Menu */}
      <nav className="navigationMenu">
        <ul>
          <li onClick={() => { window.location.href = "/home/learn"; }}>Ucz się AI</li>
          <li onClick={() => { window.location.href = "/home/voice-practice"; }}>Praktyka Głosowa</li>
          <li onClick={() => { window.location.href = "/home/flashcards"; }}>Fiszki</li>
          <li onClick={() => { window.location.href = "/home/test"; }}>Test</li>
        </ul>
      </nav>
        </div>
        <div className="flashcards">
            {units.map((data:string,index) => <Card key={index} unit={data}/> )}  
        </div>
        </>


);
}

export default Flashcards;