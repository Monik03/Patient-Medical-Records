import React, { useState, useEffect } from "react";
import Web3 from "web3";
import MedicalRecordsContract from "./contracts/MedicalRecords.json";  // ABI for the contract

const MedicalRecordsApp = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [patientAddress, setPatientAddress] = useState("");
  const [recordDescription, setRecordDescription] = useState("");
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    console.log("Network id: "+networkId);
    const deployedNetwork = MedicalRecordsContract.networks[networkId];
    if(deployedNetwork){
      const contractInstance = new web3.eth.Contract(
        MedicalRecordsContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(contractInstance);
      // console.log(contract.options.address);
    } else{
      console.error("Contract not found in the current network!");
    }
  };

  const isValidAddress = (address) => {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
  };

  const addMedicalRecord = async () => {
    if (contract && patientAddress && recordDescription && doctorName) {

    const trimmedAddress = patientAddress.trim();
    // Validate Ethereum address
    if (!isValidAddress(trimmedAddress)) {
      alert("Invalid Ethereum address.");
      return;
    }

    // Proceed with form submission logic...
    // console.log("Trimmed Address:", trimmedAddress);

    // await contract.methods.addRecord().estimateGas({
    //   from: account, gas: 200000
    // }).then(function(gasAmount) {
    //   console.log(gasAmount);  // Prints the estimated gas
    // });

    await contract.methods.addRecord(trimmedAddress, recordDescription, doctorName)
        .send({ from: account, gas: 200000 });
      alert("Record added!");
    };
  }

  const getRecords = async () => {
    const trimmedAddr = patientAddress.trim();
    // Validate Ethereum address
    if (!isValidAddress(trimmedAddr)) {
      alert("Invalid Ethereum address.");
      return;
    }
    if (contract) {
      console.log(trimmedAddr);
    try{
      
      const records = await contract.methods.getRecordsByPatient(trimmedAddr).call({ gas: 3000000 });
      console.log("raw data: ", records);
      if(Array.isArray(records) && records.length === 4){
        const [recordIds, descriptions, doctorNames, timestamps] = records;
        const recordsArray = recordIds.map((id, index) => ({
          recordId: id,
          description: descriptions[index],
          doctorName: doctorNames[index],
          timestamp: new Date(timestamps[index] * 1000).toLocaleString(),
        }));
        setPatientRecords(recordsArray);
      }
    }catch(error){
      alert("Error Fetching records: "+error);
      console.log("Error msg: ", error.message);
    }
    }
  };

  return (
    <div>
      <h2>Medical Records dApp</h2>
      <p>Connected Account: {account}</p>

      <h3>Add New Record</h3>
      <input
        type="text"
        placeholder="Patient Address"
        value={patientAddress}
        onChange={(e) => setPatientAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Record Description"
        value={recordDescription}
        onChange={(e) => setRecordDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Doctor Name"
        value={doctorName}
        onChange={(e) => setDoctorName(e.target.value)}
      />
      <button onClick={addMedicalRecord}>Add Record</button>

      <h3>View Patient Records</h3>
      <button onClick={getRecords}>Get Records</button>

      <ul>
        {patientRecords.map((record) => (
          <li key={record.recordId}>
            <p>Record ID: {record.recordId}</p>
            <p>Description: {record.description}</p>
            <p>Doctor: {record.doctorName}</p>
            <p>Date: {record.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicalRecordsApp;
