import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import './App.css'

function Monitor({timeInterval, colours, id}) {

    const [supportText, setSupportText] = useState('');
    const [connected, setConnected] = useState('Not Connected')
    const [hr, setHR] = useState(0);
    const [hrData, setHrData] = useState(new Array(200).fill(0))
    const [deviceName, setName] = useState("N/A")
    const [battery, setBattery] = useState("")
    const [sessionData, setSessionData] = useState({})

  
    useEffect(()=>{
        console.log("heart_rate at",timeInterval, hr)
        if(timeInterval != null){
            let newSessionData = sessionData
            newSessionData[timeInterval.toString()] = hr
            setSessionData(newSessionData)
        }
        console.log(id, sessionData)
        //sessionData[timeInterval.toString()] = hr
        //console.log(sessionData)
        //console.log(hrData)
        //console.log(sessionData)
        //console.log(timeInterval)
    }, [timeInterval]);

    function handleHrChange(event){
        let value = event.target.value;
        let heartrate = value.getUint8(1);

        let newData = hrData
        newData[newData.length] = heartrate
        newData = newData.slice(-200)

        /*
        let newSessionData = sessionData
        newSessionData.push(heartrate)
        console.log(newSessionData)
        setSessionData(newSessionData)
        */

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
            setHR(0)
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
            width={375}
            height={350}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-around"
            color={colours["dark_green"]}
            backgroundColor="white"
            borderRadius={20}
        >
        
            <Box
                height="25%"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <p className='bpm_num'>{hr}</p>
            </Box>

            <Box
                height="35%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <LineChart skipAnimation

                    yAxis={[
                    {
                        min: 50,
                        max: 200,
                    },
                    ]}  
                    series={[
                    {
                        data: hrData,
                        area: true,
                        showMark: false,
                        color: colours["light_green"]
                    },
                    ]}
                    bottomAxis={null}
                    grid={{ horizontal: true }}
                    width={375}
                    height={250}
                />
            </Box>

            <Box
                height="30%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-around"
            >
                <p>{deviceName}</p>
                <p>{connected}</p>
                {/*<p>{battery}</p>*/}
                <button
                    onClick={() => toConnect()}
                    /*backgroundColor={colours.light_green}*/
                    className='connect_button'

                >CONNECT</button>
            </Box>

        </Box>
        </>
    )
}
    
export default Monitor
    