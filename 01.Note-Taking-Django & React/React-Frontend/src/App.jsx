import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/items/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

    const newItem = await response.json();
    setItems([...items, newItem]);
    setName('');
    setDescription('');
  };

  const fetchItems = async () => {
    const response = await fetch('http://localhost:8000/items/');
    const data = await response.json();
    setItems(data);
  };

  return (
    <div className="App">
      <h1>React FastAPI App</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>

      <h2>Items</h2>
      <button onClick={fetchItems}>Fetch Items</button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>{`${item.name} - ${item.description}`}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
