import  { useRef } from 'react';
import Header from './components/Header';
import Board from './components/Board';
import './App.css';

function App() {
  const fileInputRef = useRef(null);
  const boardRef = useRef(null);

  const handleAddImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        boardRef.current?.addImage(event.target.result);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddNote = () => {
    boardRef.current?.addNote();
  };

  return (
    <div className="app">
      <Header 
        onAddImage={handleAddImage}
        onAddNote={handleAddNote}
      />
      <Board ref={boardRef} />
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        multiple 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
      />
    </div>
  );
}

export default App;