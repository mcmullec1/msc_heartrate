import React, { useState, useEffect } from 'react';
import Monitor from './Monitor';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

function Monitors({monitor_count, timeInterval, colours, sendData}) {


    //const array = Array.from(Array(monitor_count).keys()).map((i, index) => {return i})
    //console.log(array)




    return (
        <>
        <Grid 
            container
            width="100%"
            spacing={4}
            alignItems="center"
            justifyContent="space-around"
            >
            {Array.from(Array(monitor_count).keys()).map((i, index) => {
                return (
                    <Grid item key={i}><Monitor timeInterval={timeInterval} colours={colours} sendData={sendData} id={i}/></Grid>
                );
            })}
        </Grid>
        </>
    )
}
    
export default Monitors
    