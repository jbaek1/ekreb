import { useState, useEffect } from "react";
import { Input, Button, notification, Modal, Radio } from "antd";
import axios from "axios";

function Game() {
  const [showModal, setShowModal] = useState(true); // State for showing the modal
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [word, setWord] = useState("");
  const [scrambled, scramble] = useState("");
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [secondsRemaining, ticker] = useState(60);
  const [round, roundset] = useState(1);
  const [accuracy, setaccuracy] = useState(0);
  const [showSecondModal, setShowSecondModal] = useState(false); 
  const [showFinalModal, setFinalModal] = useState(false); 
  const getWordConfig = (difficulty, selectedLanguage) => {
    let url = `http://localhost:3000/getWord?difficulty=${difficulty}`;
    if (selectedLanguage === "es") {
      url += "&language=es";
    } 
    return {
      method: "get",
      maxBodyLength: Infinity,
      url,
      headers: {},
    };
  };
  const handleHint = () => {
    let url = `http://localhost:3000/getHint`;
    if (selectedLanguage === "es") {
      url += "?language=es";
    }
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        notification.success({
          message: "Hint",
          description: response.data,
          placement: "bottomRight",
          duration: 4,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handleEndGame = () => {
    let url = `http://localhost:3000/gameStats`;
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        setScore(response.data["score"]);
        setaccuracy(response.data["accuracy"]);
        setFinalModal(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handleShowSecondModal = () => {
    setShowModal(false); 
    setShowSecondModal(true);
  };
  const handleCloseSecondModal = () => {
    setShowSecondModal(false);
    handleStartGame();
  };
  
  const handleSubmit = () => {
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://localhost:3000/guessWord?word=${guess}`,
      headers: {},
    };
    axios
      .request(config)
      .then((response) => {
        if (response.data === true) {
            if (difficulty === "easy") {
                setScore(score + 1);
            } else if (difficulty === "medium") {
                setScore(score + 2);
            }
            else if (difficulty === "difficult") {
                setScore(score + 3);
            }
          notification.success({
            message: "Correct!",
            description: "You guessed the word correctly!",
            placement: "bottomRight",
            duration: 2,
          });
          setTimeout(() => {
            fetchWord();
            roundset(round + 1);
          }, 3000); 

        } else {
          notification.error({
            message: "Incorrect!",
            description: "You guessed the word incorrectly!",
            placement: "bottomRight",
            duration: 2,
          });
        }
        setGuess("");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const fetchWord = () => {

      const config = getWordConfig(difficulty, selectedLanguage);

      axios
        .request(config)
        .then((response) => {
          const newScrambled = response.data["scrambled"];
          setWord(response.data["word"]);
          scramble(newScrambled);
        })
        .catch((error) => {
          console.log(error);
        });
    };
const failure = () => {
        notification.error({
            message: "Time's up!",
            description: "You ran out of time!",
            placement: "bottomRight",
            duration: 2,
          });
          setTimeout(() => {
            fetchWord();
            roundset(round + 1);
          }, 3000); 

  };
  const handleStartGame = () => {
    setShowSecondModal(false);
    fetchWord(); // Start the game by fetching the word
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };


  return (
    <div className="card">
      <Modal
        title={
          <div>
            Welcome to Ekreb, a word-scrambling game!
            <br />
            Bienvenido a Ekreb, un juego de palabras!
          </div>
        }
        visible={showModal}
        closable={false}
        footer={[
          <Button
            key="start"
            type="primary"
            onClick={handleShowSecondModal}
          >
            {selectedLanguage === "en" ? "Start" : "Empezar"}
          </Button>,
        ]}
      >
        <p>
          Directions: Enter your guess in the input field and click "Submit" to
          guess the word. You have 60 seconds to guess each word. <p></p>
          Direcciones: Escribe tu conjetura en el campo de entrada y haz clic en
          "Entregar" para adivinar la palabra. Tienes 60 segundos por adivinar
          cada palabra. <p></p>
        </p>
        <p>
          {" "}
          Select language to start: <p></p>
          Selecciona un idioma por empezar:
        </p>
        <Radio.Group onChange={handleLanguageChange} value={selectedLanguage}>
          <Radio value="en">English</Radio>
          <Radio value="es">Español</Radio>
        </Radio.Group>
      </Modal>
      <Modal
        title={
          <div>
           {selectedLanguage === "en" ? "Choose a Difficulty Level" : "Seleciona un nivel de dificultad"}
          </div>
        }
        visible={showSecondModal}
        closable={false}
        footer={[
          <Button
            key="start"
            type="primary"
            onClick={handleStartGame}
          >
            {selectedLanguage === "en" ? "Start Game" : "Empezar Juego"}
          </Button>,
        ]}
      >
        <p>
          {" "}
          {selectedLanguage === "en" ? "Easy: 1 pt per correct answer, words up to 10 letters" : "Facil: 1 pt por respuesta correcta, palabras hasta 10 letras"}
        </p>
        <p>
        {selectedLanguage === "en" ? "Medium: 2 pts per correct answer, words up to 15 letters" : "Intermediato: 2 pt por respuesta correcta, palabras hasta 15 letras"}
        </p>
        <p>
        {selectedLanguage === "en" ? "Difficult: 3 pts per correct answer, words up to 20 letters" : "Dificil: 3 pt por respuesta correcta, palabras hasta 20 letras"}
        </p>
        <Radio.Group onChange={(e) => setDifficulty(e.target.value)} value={difficulty}>
  <Radio value="easy">{selectedLanguage === "en" ? "Easy" : "Facil"}</Radio>
  <Radio value="medium">{selectedLanguage === "en" ? "Medium" : "Intermediato"}</Radio>
  <Radio value="difficult">{selectedLanguage === "en" ? "Difficult" : "Dificil"}</Radio>
</Radio.Group>
      </Modal>
      <Modal
        title={
          <div>
            Thank you for playing!
            <br />
            Gracias por jugar!
          </div>
        }
        visible={showFinalModal}
        closable={false}
        footer={[
        ]}
      >
        <p>
        {selectedLanguage === "en"
          ? `Final Score Summary: ${score}`
          : `Resumen de Puntos Final: ${score}`}{" "} <p></p>
        </p>
        <p>
        </p>
      </Modal>

      <h2>
        {" "}
        {selectedLanguage === "en" ? `Current Word: ${scrambled}` : `Palabra Actual: ${scrambled}`}
      </h2>
      <Input
        size="large"
        placeholder={
          selectedLanguage === "en"
            ? "Enter your guess"
            : "Ingresa tu conjetura"
        }
        onChange={(input) => {
          setGuess(input.target.value);
        }}
        value={guess}
      />
      <br /> <br />
      <Button type="primary" size="large" onClick={handleSubmit}>
        {selectedLanguage === "en" ? "Submit" : "Entregar"}
      </Button>
      {"   "}
      <Button type="primary" size="large" onClick={handleHint}>
        {selectedLanguage === "en" ? "Hint" : "Pista"}
      </Button>
      {"   "}
      <Button type="primary" size="large" onClick={handleEndGame}>
        {selectedLanguage === "en" ? "End Game" : "Terminar Juego"}
      </Button>
      <p>
        {" "}
        {selectedLanguage === "en"
          ? `Score: ${score}`
          : `Puntos: ${score}`}{" "}
      </p>

      <p>
        {" "}
        {selectedLanguage === "en"
          ? `Round: ${round}`
          : `Ronda: ${round}`}{" "}
      </p>
    </div>
  );
}
export default Game;
