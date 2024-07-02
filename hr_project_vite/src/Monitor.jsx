import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';

function Monitor() {

    const [supportText, setSupportText] = useState('');
    const [connected, setConnected] = useState('Not Connected')
    const [hr, setHR] = useState('0');
    const [hrData, setHrData] = useState(new Array(200).fill(0))
    const [deviceName, setName] = useState("N/A")
    const [battery, setBattery] = useState("")

  
    useEffect(()=>{
        console.log("heart_rate", hr)
        console.log(hrData)
        console.log(battery)
    }, [hr]);

    function handleHrChange(event){
        let value = event.target.value;
        let heartrate = value.getUint8(1);
        let newData = hrData
        newData[newData.length] = heartrate
        newData = newData.slice(-200)
        setHrData(newData)
        setHR(heartrate)

    }

    function handleBatteryChange(event){
        let value = event.target.value;
        let battery = value.getUint8(1);
        console.log("The Battery",battery)
        setBattery(battery)

    }

    async function toConnect() {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['heart_rate'] }],
            acceptAllDevices: false,
            optionalServices: ['battery_service'],
            })
        const server = await device.gatt.connect()
        setConnected("Connected")
        setName(device.name)
        device.addEventListener('gattserverdisconnected', () => {
            setConnected("Disconnected");
            setHR('0')
            setHrData(new Array(200).fill(0))
            });

        //Heart Rate
        const service = await server.getPrimaryService('heart_rate')
        const char = await service.getCharacteristic('heart_rate_measurement')
        char.startNotifications()
        char.addEventListener('characteristicvaluechanged', handleHrChange)

        
        //Battery
        /*
        const service2 = await server.getPrimaryService('battery_service')
        const char2 = await service2.getCharacteristic('battery_level')
        char2.startNotifications()
        char2.addEventListener('characteristicvaluechanged', handleBatteryChange)
        */

    }



    return (
        <>
        <Box
            width={300}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
          
            <p id ="supported">{supportText}</p>
            <p>{connected}</p>
            <p>{deviceName}</p>
            {/*<p>{battery}</p>*/}
            <button onClick={() => toConnect()}>Connect</button>
            <p id = "p_text" >{hr}</p>

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
        </>
    )
}
    
export default Monitor
    