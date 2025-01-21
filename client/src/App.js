import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [document, setDocument] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:5000');
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('Connected to server');
    }

    newSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'update' || message.type === 'init') {
          setDocument(message.data);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    }

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    }
    return () => {
      newSocket.close();
    }
  }, []);

  const handleDocumentChange = (e) => {
    const newDocment = e.target.value;
    setDocument(newDocment);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'update', data: newDocment }));
    }
  }

  return (
    <div className="App">
      <h1>Collaborative Document</h1>
      <textarea
        value={document}
        onChange={(e) => handleDocumentChange(e)}
        rows={20}
        cols={80}
      />
    </div>
  );
}

export default App;
