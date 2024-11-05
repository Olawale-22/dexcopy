import React, { useState } from 'react';

function Register({ contract, account, onRegisterStart, onRegisterEnd }) {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [description, setDescription] = useState('');

  const handleRegister = async () => {
    try {
      if (!contract) {
        throw new Error("Smart contract not initialized");
      }
      onRegisterStart(); // Call the callback to show the spinner
      await contract.methods.registerCopyright(name, ownerName, description).send({ from: account });
      console.log('Copyright registered successfully');
      onRegisterEnd(); // Call the callback to hide the spinner
    } catch (error) {
      console.error('Error registering copyright:', error);
      onRegisterEnd(); // Call the callback to hide the spinner in case of error
    }
  };

  return (
    <div>
      <h2>Register a New Copyright</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Owner Name"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;