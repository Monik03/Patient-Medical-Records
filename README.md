# Patient-Medical-Records
Patient Medical Records Application using local ethereum blockchain (Ganache), smartcontract in solidity and React Frontend

#Prerequisites:
1. Truffle
2. Ganache-cli
3. React (using npm)
4. Web3.js

#Initialization steps:
  //Install Truffle framework
  npm install -g truffle
  
  //Install Ganache for a local blockchain
  npm install -g ganache-cli
  
  //Initialize a new Truffle project
  truffle init
  
  //Create a basic React app for the frontend
  npx create-react-app frontend
  cd frontend
  //move MedicalRecords.js inside frontend & replace index.js file
  npm install web3

#HOW TO RUN:
1. Start Ganache server using: ganache-cli in the terminal
2. If any changes done to solidity file, do the following:
  2.1. truffle migrate --reset
  2.2. Copy the build/contracts/{.json} file and paste/replace in frontend/contracts/ directory
3. Start the react app using:
  3.1. cd frontend
  3.2. npm start
