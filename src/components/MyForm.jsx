import React, { useState, useRef } from "react";
import certificate from "../assets/certificate_form.png";
import axios from "axios";
import { mintNFT } from "../SmartContract";

// dotenv.config();

const MyForm = ({ cmp }) => {
    const [organization, setOrganization] = useState("");
    const [event, setEvent] = useState("");
    const [participantName, setParticipantName] = useState("");
    const [certificateName, setCertificateName] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [pdfData, setPDFData] = useState("");
    const [isRun,setIsRun]=useState(false)
    const certificateInput = useRef();

    const [certificateCID, setCertificateCID] = useState("");
    const [jsonCID, setJsonCID] = useState("");

    const handleCertificateInput = (e) => {
        e.preventDefault();
        certificateInput.current.click();
    };

    const handleCertificateChange = (event) => {
        const certificate = event.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(certificate); // Read Certificate
        reader.onloadend = function () {
            if (typeof reader.result === "string") {
                setPDFData(reader.result);
            } else {
                setPDFData("");
            }
        };

        setCertificateName(certificate.name);
    };

    const dataURItoBlob = () => {
        if (typeof pdfData !== "string" || pdfData.length === 0) {
            return null;
        }

        // Split the Data URI into metadata and data
        const [metadata, data] = pdfData.split(",");

        // Decode the base64-encoded data
        const decodedData = atob(data);

        // Convert the decoded data to an array buffer
        const arrayBuffer = new ArrayBuffer(decodedData.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < decodedData.length; i++) {
            uint8Array[i] = decodedData.charCodeAt(i);
        }

        // Create a Blob object from the array buffer
        const blob = new Blob([uint8Array], {
            type: metadata.split(";")[0].split(":")[1],
        });

        return blob;
    };

    const postCertificateToPinata = async (formData) => {
        console.log("Posting on pinata");
        const API_KEY = import.meta.env.VITE_API_KEY;
        const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
        if (!API_KEY || !SECRET_KEY) {
            alert("Missing Pinata API credentials. Please set VITE_API_KEY and VITE_SECRET_KEY.");
            return;
        }

        const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
        const headers = {
            pinata_api_key: API_KEY,
            pinata_secret_api_key: SECRET_KEY,
        };

        const metaData = {
            name: participantName,
            issue_date: new Date().toISOString(),
            organization,
            event,
            walletAddress: walletAddress.trim(),
        };

        try {
            const res = await axios.post(url, formData, { headers });
            setCertificateCID(res.data.IpfsHash);

            const jsonForm = new FormData();
            const blob = new Blob([JSON.stringify(metaData)], {
                type: "application/json",
            });

            jsonForm.append("file", blob, certificateName + ".json");
            const jsonRes = await axios.post(url, jsonForm, { headers });

            setJsonCID(jsonRes.data.IpfsHash);

            console.log("Pinata uploads complete, initiating mint.");
            await mintNFT(jsonRes.data.IpfsHash, res.data.IpfsHash, walletAddress.trim());
        } catch (error) {
            console.error("Failed to upload to Pinata", error);
            alert(
                `Unable to upload certificate to Pinata: ${
                    error?.response?.data?.error || error.message
                }`
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsRun(true)
        // call backend api here and pass data of csv from csvData StateVariable
        const blob = dataURItoBlob();
        if (!blob) {
            alert("Please upload a certificate PDF before submitting.");
            return;
        }

        const trimmedWallet = walletAddress.trim();
        if (!trimmedWallet) {
            alert("Please enter the recipient's wallet address.");
            return;
        }

        if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedWallet)) {
            alert("Wallet address must be a valid 42-character hex string starting with 0x.");
            return;
        }

        const formData = new FormData();
        formData.append("file", blob, certificateName);

       try {
         await postCertificateToPinata(formData);
       } catch (error) {
        
       }
       finally{
        setIsRun(false)
       }
        
    };
    return (
        <div className='flex items-center rounded-l-lg w-3/4 bg-[#ECECEC]'>
            <div className='flex justify-center w-1/2 items-center'>
                <img
                    className='rotate-12 bg-contain select-none'
                    src={certificate}
                    alt=''
                />
            </div>
            <div className='bg-white rounded-r-lg w-1/2'>
                <form action='' className='p-5'>
                    <h1 className='text-2xl font-bold text-center'>
                        Enter your details
                    </h1>
                    <div className='flex flex-col mt-5'>
                        <label htmlFor='organization_name'>
                            Organization Name
                        </label>
                        <input
                            className='p-2 bg-gray-100 rounded-lg outline-my-purple mt-1'
                            type='text'
                            onChange={(e) => setOrganization(e.target.value)}
                            value={organization}
                            name='organization_name'
                            id='organization_name'
                            placeholder='Organization Name'
                        />
                    </div>
                    <div className='flex flex-col mt-5'>
                        <label htmlFor='event_name'>Event Name</label>
                        <input
                            className='p-2 bg-gray-100 rounded-lg outline-my-purple mt-1'
                            type='text'
                            onChange={(e) => {
                                setEvent(e.target.value);
                            }}
                            value={event}
                            name='event_name'
                            id='event_name'
                            placeholder='Event Name'
                        />
                    </div>
                    <div className='flex flex-col mt-5'>
                        <label htmlFor='event_name'>Participants Name</label>
                        <input
                            className='p-2 bg-gray-100 rounded-lg outline-my-purple mt-1'
                            type='text'
                            onChange={(e) => setParticipantName(e.target.value)}
                            value={participantName}
                            id='participant_name'
                            name='participant_name'
                            placeholder='Enter Your Name'
                        />
                    </div>
                    <div className='flex flex-col mt-5'>
                        <label htmlFor='wallet_address'>Recipient Wallet Address</label>
                        <input
                            className='p-2 bg-gray-100 rounded-lg outline-my-purple mt-1'
                            type='text'
                            onChange={(e) => setWalletAddress(e.target.value)}
                            value={walletAddress}
                            id='wallet_address'
                            name='wallet_address'
                            placeholder='0x...'
                        />
                    </div>
                    <div className='flex flex-col mt-5'>
                        <label htmlFor='event_name'>Certificates</label>
                        <input
                            className='hidden'
                            type='file'
                            id='certificateFile'
                            onChange={(e) => handleCertificateChange(e)}
                            ref={certificateInput}
                            accept='.pdf'
                        />
                        <div className='flex'>
                            <button
                                className='bg-gray-300 p-2 w-32 rounded-l-lg'
                                onClick={(e) => handleCertificateInput(e)}>
                                Choose file
                            </button>
                            <span className='rounded-r-lg w-full bg-gray-100 p-3 overflow-x-hidden'>
                                {certificateName === ""
                                    ? "Upload certificates in merged PDF"
                                    : certificateName}
                            </span>
                        </div>
                        <p className='text-xs text-center mt-2'>
                            Don't have certificates?{" "}
                            <a href='#' className='text-my-blue underline'>
                                Create from our template
                            </a>
                        </p>
                    </div>

                    <div className='text-center'>
                        <button
                        className={`bg-[#6361AC] p-2 w-32 rounded-lg text-white mt-5 ${
                            isRun ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handleSubmit}
                        disabled={isRun}
                        >
                        {isRun ? 'Uploading...' : 'Submit'}
                        </button>

                    </div>
                </form>
            </div>
            {certificateCID !== "" && (
                <iframe
                    src={`https://gateway.pinata.cloud/ipfs/${certificateCID}`}
                    frameBorder='0'
                    height='100%'></iframe>
            )}
        </div>
    );
};

export default MyForm;
