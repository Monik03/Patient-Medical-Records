
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecords {
    address public admin;

    struct Record {
        uint recordId;
        string description;
        string patientName;
        address patientAddress;
        string doctorName;
        uint timestamp;
    }

    mapping(address => Record[]) public patientRecords;

    event RecordAdded(address patient, uint recordId, string description, string doctorName, uint timestamp);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Add new medical record
    function addRecord(address _patient, string memory _description, string memory _doctorName) public onlyAdmin {
        uint recordId = patientRecords[_patient].length;
        patientRecords[_patient].push(Record({
            recordId: recordId,
            description: _description,
            patientName: "Patient Name",  // Placeholder for simplicity
            patientAddress: _patient,
            doctorName: _doctorName,
            timestamp: block.timestamp
        }));
        emit RecordAdded(_patient, recordId, _description, _doctorName, block.timestamp);
    }
    
    event LogRecordRetrieved(string description, string doctorName);
    
    // Retrieve all medical records of a patient
    function getPatientRecords(address _patient) public returns (string memory) {
        require(patientRecords[_patient].length > 0, "No records for this patient!");
        for (uint i = 0; i < patientRecords[_patient].length; i++) {
            emit LogRecordRetrieved(patientRecords[_patient][i].description, patientRecords[_patient][i].doctorName);
        }
        return patientRecords[_patient][0].description;
    }

    function getRecordDescription(address _patient, uint index) public view returns (string memory) {
        require(index < patientRecords[_patient].length, "Invalid index");
        return patientRecords[_patient][index].description;
    }

function getRecordsByPatient(address _patient) public view returns (
    uint[] memory recordIds,
    string[] memory descriptions,
    string[] memory doctorNames,
    uint[] memory timestamps
) {
    uint recordCount = patientRecords[_patient].length;
    
    recordIds = new uint[](recordCount);
    descriptions = new string[](recordCount);
    doctorNames = new string[](recordCount);
    timestamps = new uint[](recordCount);

    for (uint i = 0; i < recordCount; i++) {
        Record storage record = patientRecords[_patient][i];
        recordIds[i] = record.recordId;
        descriptions[i] = record.description;
        doctorNames[i] = record.doctorName;
        timestamps[i] = record.timestamp;
    }
    return (recordIds, descriptions, doctorNames, timestamps);
}

function getDescByPatient(address _patient) public view returns (
    string[] memory descriptions
) {
    uint recordCount = patientRecords[_patient].length;
    
    
    descriptions = new string[](recordCount);

    for (uint i = 0; i < recordCount; i++) {
        Record storage record = patientRecords[_patient][i];
        descriptions[i] = record.description;
    }
    return descriptions;
}

}
