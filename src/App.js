import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Copyrights from './contracts/Copyrights.json';
import Register from './components/Register';
import Transfer from './components/Transfer';
import LoadingSpinner from './components/LoadingSpinner'; // Import the LoadingSpinner component
import './App.css'; // Import the CSS file
import logo from './assets/dexcopy.png'

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [copyrights, setCopyrights] = useState([]);
  const [userCopyrights, setUserCopyrights] = useState([]);
  const [selectedCopyright, setSelectedCopyright] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [showRegister, setShowRegister] = useState(false); // Add state to show/hide register form

  useEffect(() => {
    async function load() {
      setLoading(true); // Start loading
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          console.log("Accounts:", accounts);
          setAccount(accounts[0]); // Set the account state
          const networkId = await web3.eth.net.getId();
          console.log("Network ID:", networkId);
          const deployedNetwork = Copyrights.networks[networkId];
          console.log("deployedNetwork:", deployedNetwork);
          if (!deployedNetwork) {
            throw new Error("Smart contract not deployed on the current network");
          }
          console.log("Deployed Network:", deployedNetwork);
          const instance = new web3.eth.Contract(
            Copyrights.abi,
            deployedNetwork && deployedNetwork.address,
          );

          setWeb3(web3);
          setContract(instance);

          // Fetch all registered copyrights
          const totalCopyrights = await instance.methods.nextId().call();
          console.log("Total Copyrights:", totalCopyrights);
          const copyrightsArray = [];
          for (let i = 0; i < totalCopyrights; i++) {
            const copyright = await instance.methods.getCopyright(i).call();
            console.log(`Fetched Copyright ${i}:`, copyright);
            copyrightsArray.push(copyright);
          }
          console.log("Fetched copyrights array:", copyrightsArray);
          setCopyrights(copyrightsArray);

          // Filter current user's copyrights
          const userCopyrightsArray = copyrightsArray.filter(copyright => copyright.owner === accounts[0]);
          setUserCopyrights(userCopyrightsArray);
        } catch (error) {
          console.error("Error in load function:", error);
        } finally {
          setLoading(false); // Stop loading
        }
      } else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider);
        const accounts = await web3.eth.getAccounts();
        console.log("Accounts:", accounts);
        setAccount(accounts[0]); // Set the account state
        const networkId = await web3.eth.net.getId();
        console.log("Network ID:", networkId);
        const deployedNetwork = Copyrights.networks[networkId];
        console.log("deployedNetwork:", deployedNetwork);
        if (!deployedNetwork) {
          throw new Error("Smart contract not deployed on the current network");
        }
        console.log("Deployed Network:", deployedNetwork);
        const instance = new web3.eth.Contract(
          Copyrights.abi,
          deployedNetwork && deployedNetwork.address,
        );

        setWeb3(web3);
        setContract(instance);

        // Fetch all registered copyrights
        const totalCopyrights = await instance.methods.nextId().call();
        console.log("Total Copyrights:", totalCopyrights);
        const copyrightsArray = [];
        for (let i = 0; i < totalCopyrights; i++) {
          const copyright = await instance.methods.getCopyright(i).call();
          console.log(`Fetched Copyright ${i}:`, copyright);
          copyrightsArray.push(copyright);
        }
        console.log("Fetched copyrights array:", copyrightsArray);
        setCopyrights(copyrightsArray);

        // Filter current user's copyrights
        const userCopyrightsArray = copyrightsArray.filter(copyright => copyright.owner === accounts[0]);
        setUserCopyrights(userCopyrightsArray);
      } else {
        console.error("Non-Ethereum browser detected. You should consider trying MetaMask!");
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (contract) {
      contract.events.CopyrightRegistered({}, (error, event) => {
        if (!error) {
          const newCopyright = {
            name: event.returnValues.name,
            ownerName: event.returnValues.ownerName,
            description: event.returnValues.description,
            owner: event.returnValues.owner,
            timestamp: event.returnValues.timestamp,
          };
          console.log("New copyright registered:", newCopyright);
          setCopyrights((prev) => [...prev, newCopyright]);
          if (newCopyright.owner === account) {
            setUserCopyrights((prev) => [...prev, newCopyright]);
          }
          setLoading(false); // Stop loading
          setShowRegister(false); // Hide register form
          window.location.reload(); // Refresh the app
        } else {
          console.error("Error in CopyrightRegistered event:", error);
          setLoading(false); // Stop loading
        }
      });

      contract.events.CopyrightTransferred({}, (error, event) => {
        if (!error) {
          const updatedCopyrights = copyrights.map((copyright) => {
            if (copyright.id === event.returnValues.id) {
              return { ...copyright, owner: event.returnValues.newOwner };
            }
            return copyright;
          });
          console.log("Copyright transferred:", updatedCopyrights);
          setCopyrights(updatedCopyrights);

          // Update user copyrights
          const updatedUserCopyrights = updatedCopyrights.filter(copyright => copyright.owner === account);
          setUserCopyrights(updatedUserCopyrights);
          setLoading(false); // Stop loading
        } else {
          console.error("Error in CopyrightTransferred event:", error);
          setLoading(false); // Stop loading
        }
      });
    }
  }, [contract, copyrights, account]);

  const handleTransferClick = (copyright) => {
    setSelectedCopyright(copyright);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRegisterStart = () => {
    setShowRegister(false); // Hide the register form
    setLoading(true); // Show the loading spinner
  };

  const handleRegisterEnd = () => {
    setLoading(false); // Hide the loading spinner
  };

  const handleTransferStart = () => {
    setSelectedCopyright(null); // Hide the transfer form
    setLoading(true); // Show the loading spinner
  };

  const handleTransferEnd = () => {
    setLoading(false); // Hide the loading spinner
  };

  const filteredCopyrights = copyrights.filter(copyright =>
    copyright.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    copyright.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    copyright.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <img src={logo} alt="Logo" className='app-logo'/>
        <h1>Decentralized Copyrights</h1>
        <p>Account: {account}</p>
        <button className="create-button" onClick={() => setShowRegister(true)}>Create New Copyright</button>
      </header>
      {loading && <LoadingSpinner />} {/* Display loading spinner */}
      {showRegister && (
        <div className="popup-overlay">
          <div className="popup-container">
            <Register contract={contract} account={account} onRegisterStart={handleRegisterStart} onRegisterEnd={handleRegisterEnd} /> {/* Pass onRegisterStart and onRegisterEnd to Register */}
            <button className="close-button" onClick={() => setShowRegister(false)}>Close</button>
          </div>
        </div>
      )}
      {selectedCopyright && (
        <div className="popup-overlay">
          <div className="popup-container">
            <Transfer contract={contract} account={account} copyright={selectedCopyright} onTransferStart={handleTransferStart} onTransferEnd={handleTransferEnd} /> {/* Pass onTransferStart and onTransferEnd to Transfer */}
            <button className="close-button" onClick={() => setSelectedCopyright(null)}>Close</button>
          </div>
        </div>
      )}
      {/* <div className='account'>
        <p>Account: {account}</p>
      </div> */}
      <div className="search-header">
        <h2>All Registered Copyrights</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>Wallet Address</th>
            <th>Description</th>
            <th>Registration Date</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {filteredCopyrights.map((copyright, index) => (
            <tr key={index}>
              <td>{copyright.name}</td>
              <td>{copyright.ownerName}</td>
              <td>{copyright.owner ? `${copyright.owner.slice(0, 6)}...${copyright.owner.slice(-4)}` : 'N/A'}</td>
              <td>{copyright.description}</td>
              <td>{copyright.timestamp ? new Date(copyright.timestamp * 1000).toLocaleString() : 'N/A'}</td>
              {/* <td>
                {copyright.owner === account && (
                  <button className="transfer-button" onClick={() => handleTransferClick(copyright)}>Ownership Transfer</button>
                )}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Your Registered Copyrights</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>Wallet Address</th>
            <th>Description</th>
            <th>Registration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userCopyrights.map((copyright, index) => (
            <tr key={index}>
              <td>{copyright.name}</td>
              <td>{copyright.ownerName}</td>
              <td>{copyright.owner ? `${copyright.owner.slice(0, 6)}...${copyright.owner.slice(-4)}` : 'N/A'}</td>
              <td>{copyright.description}</td>
              <td>{copyright.timestamp ? new Date(copyright.timestamp * 1000).toLocaleString() : 'N/A'}</td>
              <td>
                <button className="transfer-button" onClick={() => handleTransferClick(copyright)}>Ownership Transfer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;