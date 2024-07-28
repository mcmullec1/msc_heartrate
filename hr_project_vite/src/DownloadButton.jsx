import './App.css'
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import download from "/download.png"

function DownloadButton({colours, overallSessionData}) {

    const header_names = [
        'timeInterval',
        'hr',
        'name',
        'id'
      ];

    function jsonToCSV(data, header_names) {

        if (data.length === 0) {
            return '';
        }

        const headers = header_names.join(',') + '\n';

        const rows = data.map((row) => {
            return header_names.map((field) => String(row[field]) || '').join(',');
            })
            .join('\n');

        return headers + rows;
      }


    
    const handleDownload = (data, header_names) => {
        const csvData = jsonToCSV(data, header_names);

        if (csvData === '') {
        alert('No data to export');
        }
        
        else {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'heartrate_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        }
    }

    return (
        <>
        <button className='download_button' onClick={() => handleDownload(overallSessionData, header_names)}>
          <Box
          height="100%"
          width="100%"
          backgroundColor={colours["light_green"]}
          borderRadius="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          //marginRight="20px"
          //marginLeft="64px"
          >
            <Box
              component="img"
              sx={{
                height: "30px",
              }}
              alt="Download symbol."
              src={download}
            ></Box>
          </Box>
        </button>
            
        </>
    )
}
    
export default DownloadButton