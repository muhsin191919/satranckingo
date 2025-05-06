import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const socket = new WebSocket("wss://metin2-chess.glitch.me");

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.fen) {
        const newGame = new Chess(data.fen);
        setGame(newGame);
        setFen(data.fen());
      }
    };
  }, []);

  const sendMove = (fen) => {
    socket.send(JSON.stringify({ fen }));
  };

  const makeMove = (move) => {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    if (result) {
      setGame(gameCopy);
      setFen(gameCopy.fen());
      sendMove(gameCopy.fen());
    }
  };

  const onDrop = (sourceSquare, targetSquare) => {
    makeMove({ from: sourceSquare, to: targetSquare, promotion: "q" });
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Canlı Satranç</h2>
      <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={350} />
    </div>
  );
}