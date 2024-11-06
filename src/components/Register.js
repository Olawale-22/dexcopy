import React, { useState, useEffect } from 'react';
import '../App.css'; // Import the CSS file for styling

function Register({ contract, account, onRegisterStart, onRegisterEnd }) {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(''); // State to store error message
  const [allCopyrights, setAllCopyrights] = useState([]); // State to store all registered copyrights

  useEffect(() => {
    const fetchCopyrights = async () => {
      if (contract) {
        const totalCopyrights = await contract.methods.nextId().call();
        const copyrightsArray = [];
        for (let i = 0; i < totalCopyrights; i++) {
          const copyright = await contract.methods.getCopyright(i).call();
          copyrightsArray.push(copyright);
        }
        setAllCopyrights(copyrightsArray);
      }
    };

    fetchCopyrights();
  }, [contract]);

  const handleRegister = async () => {
    try {
      if (!contract) {
        throw new Error("Smart contract not initialized");
      }

      // Check if the name already exists
      const nameExists = allCopyrights.some(copyright => copyright.name === name);
      if (nameExists) {
        setError("Copyright with this name already exists");
        return; // Exit the function to avoid the transaction
      }

      onRegisterStart(); // Call the callback to hide the form and show the spinner
      await contract.methods.registerCopyright(name, ownerName, description).send({ from: account });
      console.log('Copyright registered successfully');
      onRegisterEnd(); // Call the callback to hide the spinner
    } catch (error) {
      console.error('Error registering copyright:', error);
      setError(error.message); // Set the error message
      onRegisterEnd(); // Call the callback to hide the spinner in case of error
    }
  };

  return (
    <div className="popup-content">
      <h2>Register a New Copyright</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="popup-input"
      />
      <input
        type="text"
        placeholder="Owner Name"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        className="popup-input"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="popup-textarea"
      />
      <div className="popup-buttons">
        <button className="close-button" onClick={onRegisterEnd}>Close</button>
        <button onClick={handleRegister} className="popup-button">Register</button>
      </div>
    </div>
  );
}

export default Register;