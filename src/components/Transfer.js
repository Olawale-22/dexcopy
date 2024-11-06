import React, { useState } from 'react';
import '../App.css'; // Import the CSS file for styling

function Transfer({ contract, account, onTransferStart, onTransferEnd, copyright }) {
  const [newOwner, setNewOwner] = useState('');

  const handleTransfer = async () => {
    try {
      if (!contract) {
        throw new Error("Smart contract not initialized");
      }
      onTransferStart(); // Call the callback to hide the form and show the spinner
      await contract.methods.transferCopyright(copyright.id, newOwner).send({ from: account });
      console.log('Copyright transferred successfully');
      onTransferEnd(); // Call the callback to hide the spinner
    } catch (error) {
      console.error('Error transferring copyright:', error);
      onTransferEnd(); // Call the callback to hide the spinner in case of error
    }
  };

  return (
    <div className="popup-content">
      <h2>Transfer Copyright</h2>
      <p>Transferring copyright: {copyright.name}</p>
      <input
        type="text"
        value={newOwner}
        onChange={(e) => setNewOwner(e.target.value)}
        placeholder="Enter new owner's address"
        className="popup-input"
      />
      <div className="popup-buttons">
        <button className="close-button" onClick={onTransferEnd}>Close</button>
        <button onClick={handleTransfer} className="popup-button">Transfer</button>
      </div>
    </div>
  );
}

export default Transfer;