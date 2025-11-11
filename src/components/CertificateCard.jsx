import React from "react";

import { useState } from "react";



const downloadCertificate = async (certificateCID, fileName = "certificate.pdf") => {
    try {
        const url = `https://gateway.pinata.cloud/ipfs/${certificateCID}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
    } catch (err) {
        console.error("Download failed:", err);
    }
};

const CertificateCard = ({ certificateCID, metaData }) => {
    const fileName = `${(metaData?.name || "certificate").replace(/\s+/g, "_")}.pdf`;

    return (
        <div
            className="bg-white rounded-2xl pb-2 m-3"
            onClick={() => downloadCertificate(certificateCID, fileName)}
        >

            
            <iframe
                className="rounded-2xl"
                src={`https://gateway.pinata.cloud/ipfs/${certificateCID}#toolbar=0&output=embed`}
            ></iframe>
            <p className="mx-2 font-bold text-lg">Name: {metaData.name}</p>
            <p className="mx-2 text-gray-700 text-xs">Organization: {metaData.organization}</p>
            <p className="mx-2 text-gray-700 text-xs">Event: {metaData.event}</p>
            {/* {console.log(metaData)} */}
        </div>
    );
};

export default CertificateCard;
