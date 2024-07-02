
import './App.css'
import Monitor from './Monitor';
import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';

function App() {

  //let p = document.getElementById("p_text") 
  //let p_text = useRef()
  //let supported = useRef()
  const [supportText, setSupportText] = useState('');
  const [connected, setConnected] = useState('Not Connected')
  const [hr, setHR] = useState('0');
  const [hrData, setHrData] = useState(new Array(200).fill(0))

  
  useEffect(()=>{
    console.log("heart_rate", hr)
    console.log(hrData)
  }, [hr]);
  
  

  

  if (navigator.bluetooth === undefined) {
    //document.getElementById("supported").innerHTML = "Bluetooth is not supported."
    //supported.text.textContent = "Bluetooth is not supported" ;
    useEffect(()=>{
      setSupportText('Bluetooth is not supported.');
    }, []);
    //setSupportText('Bluetooth is not supported.')
  }
  else{
    //document.getElementById("supported").innerHTML = "Bluetooth is supported!"
    useEffect(()=>{
      setSupportText('Bluetooth is supported.');
    }, []);
  }

  /*
  useEffect((event) => {
    async function handleHrChange(event){
      let value = event.target.value;
      let heartrate = value.getUint8(1);
      hrData[hrData.length] = heartrate
      hrData = hrData.slice(-200)
      console.log(hrData)
      setHrText(heartrate + "BPM");
      
    }
    handleHrChange()

})
*/

  


      //let button = document.getElementById("connect_button") ;
      //let connect_button = useRef();
      //button.style.cursor = "pointer" ;

      //When the heartrate number changes

    /*
    handleHrChange = (event) => {
        let value = event.target.value ; 
        //we select the eight bytes that contain the heartrate
        let heartrate = value.getUint8(1);
        hrData[hrData.length] = heartrate
        hrData = hrData.slice(-200)
        console.log(hrData)
        useEffect(()=>{
          setHrText(heartrate + "BPM");
        }, []);
        //p.textContent = heartrate + " BPM";

        
    }
    */
      
    
    function handleHrChange(event){
      let value = event.target.value;
      let heartrate = value.getUint8(1);
      let newData = hrData
      newData[newData.length] = heartrate
      newData = newData.slice(-200)
      setHrData(newData)
      //console.log(hrData)
      //console.log(heartrate)
      setHR(heartrate)
      /*
      useEffect(()=>{
        setHrText(heartrate + "BPM");
      }, []);
      */
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

        const service = await server.getPrimaryService('heart_rate')
        const char = await service.getCharacteristic('heart_rate_measurement')
        char.startNotifications()
        char.addEventListener('characteristicvaluechanged', handleHrChange)

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
      <p id ="supported">{supportText}</p>
      <Box
        display="flex"
        justifyContent="space-around"
        width="100%"
      >
        <Monitor></Monitor>
        <Monitor></Monitor>
      </Box>
      
      {/*<canvas id="hr_chart" style="width:100%;max-width:700px"></canvas>
      <script src = "./script2.js"></script>*/}
    </>
  )
}

export default App
