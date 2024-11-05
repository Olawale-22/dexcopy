import React, { useState } from 'react';

function Transfer({ contract, account, copyright, onTransferStart, onTransferEnd }) {
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
    <div>
      <h2>Transfer Copyright</h2>
      <p>Transferring copyright: {copyright.name}</p>
      <input
        type="text"
        value={newOwner}
        onChange={(e) => setNewOwner(e.target.value)}
        placeholder="Enter new owner's address"
      />
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
}

export default Transfer;