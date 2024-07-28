
import './App.css'
import Monitor from './Monitor';
import Monitors from './Monitors';
import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';
import logo from "/logo.png"
import download from "/download.png"
import DownloadButton from './DownloadButton';

function App() {

  const [time, setTime] = useState(new Date())

  const [supportText, setSupportText] = useState('');

  const [overallSessionData, setOverallSessionData] = useState([])

  const colours = { 'blue': '#3EA9E0',
                    'plum' : '#3F1D4E',
                    'lime': '#C7D540',
                    'pink' : '#E75172',
                    'light_green': '#00A06E',
                    'dark_green': '#063532'
  }

  //const [connected, setConnected] = useState('Not Connected')
  //const [hr, setHR] = useState('0');
  //const [hrData, setHrData] = useState(new Array(200).fill(0))

  

  if (navigator.bluetooth === undefined) {
    useEffect(()=>{
      setSupportText('Bluetooth is not supported.');
    }, []);
  }
  else{
    useEffect(()=>{
      setSupportText('Bluetooth is supported.');
    }, []);
  }

  /*
  useEffect(() => {
    console.log(time)
  },[time])
  */



  useEffect(() => {
    /*
    async function getTime(){
        const now = new Date()
        setTime(now)
    }
    getTime()
  
    var timer = setInterval(getTime, 30000)
    console.log(time)
    return function cleanup() {
        clearInterval(timer)
    }
    */

    const interval = setInterval(() => {
      setTime(new Date());
    }, 5000);

    return () => clearInterval(interval);

  }, [])


    const handleDownload = () => {
      console.log("Download")
    }
      
    /*
    function handleHrChange(event){
      let value = event.target.value;
      let heartrate = value.getUint8(1);
      let newData = hrData
      newData[newData.length] = heartrate
      newData = newData.slice(-200)
      setHrData(newData)

      setHR(heartrate)

    }
   

    async function toConnect() {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: ['heart_rate'] }],
          acceptAllDevices: false,
        })
        const server = await device.gatt.connect()
        setConnected("Connected")
        device.addEventListener('gattserverdisconnected', () => {
          setConnected("Disconnected");
          setHR('0')
          setHrData(new Array(200).fill(0))
         });

        //Heart rate
        const service = await server.getPrimaryService('heart_rate')
        const char = await service.getCharacteristic('heart_rate_measurement')
        char.startNotifications()
        char.addEventListener('characteristicvaluechanged', handleHrChange)

        const service2 = await server.getPrimaryService('battery_service')
        const char2 = await service.getCharacteristic('battery_level')
        char2.startNotifications()
        char2.addEventListener('characteristicvaluechanged', handleBatteryChange)

    }

  */

  /*
  useEffect(()=>{
    console.log("heart_rate", hr)
    console.log(hrData)
  }, [hr]);
  */

  function handleSessionData(data, id){
    //console.log("THING TO ADD:")
    //console.log(data)
    let newSessionData = overallSessionData
    newSessionData.push(data)
    setOverallSessionData(newSessionData)
    console.log(overallSessionData)
    //let new_item = {"timeInveral":data.}
    
  }



  

  return (
    <>
      {/*<button id = "connect_button" ref = {connect_button}>Connect</button>*/}
      {/*
      <Box
        display = "flex"
        width = "100%"
      >
        <Box>
          <p id ="supported">{supportText}</p>
          <p>{connected}</p>
          <button onClick={() => toConnect()}>Connect</button>
          <p id = "p_text" >{hr}</p>
        </Box>
      <LineChart skipAnimation

        yAxis={[
          {
            min: 50,
            max: 160,
          },
        ]}  
        series={[
          {
            data: hrData,
            area: true,
            showMark: false,
          },
        ]}
        bottomAxis={null}
        grid={{ horizontal: true }}
        width={300}
        height={200}
      />
      </Box>
      */}
      <Box
        width="100%"
        height="75px"
        backgroundColor={colours["dark_green"]}
        color={colours["light_green"]}
        marginBottom="20px"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          component="img"
          sx={{
            height: "60px",
          }}
          alt="University of Roehampton Logo."
          src={logo}
        ></Box>
        <p id ="supported">{supportText}</p>
        <DownloadButton colours = {colours} overallSessionData = {overallSessionData}></DownloadButton>
        {/*
        <button className='download_button' onClick={handleDownload}>
          <Box
          height="50px"
          width="50px"
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
      */}

      </Box>
      <Box
        display="flex"
        justifyContent="space-around"
        width="100%"
      >
        {/*<Monitor timeInterval={time} id = {1}></Monitor>
        <Monitor timeInterval={time} id = {2}></Monitor>*/}
        <Monitors timeInterval={time} monitor_count = {6} colours = {colours} sendData={handleSessionData}></Monitors>
      </Box>
      
    </>
  )
}

export default App
