import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';
import './App.css'
import EditableLabel from "react-inline-editing";

function Monitor({timeInterval, colours, sendData, id}) {

    const [supportText, setSupportText] = useState('');
    const [connected, setConnected] = useState('Not Connected')
    const [hr, setHR] = useState(0);
    const [hrData, setHrData] = useState(new Array(200).fill(0))
    const [deviceName, setDeviceName] = useState("N/A")
    const [battery, setBattery] = useState("")
    const [sessionData, setSessionData] = useState({})
    const [name, setName] = useState("P"+(id+1))
    const [min, setMin] = useState(0)

  
    useEffect(()=>{
        //console.log("heart_rate at",timeInterval, hr)
        if(timeInterval != null){
            let newSessionData = sessionData
            newSessionData[timeInterval.toString()] = hr
            setSessionData(newSessionData)

            let sum = 0;
            Object.values(sessionData).forEach( num => {sum += num;})
            if(sum != 0){
                setMin(Math.min.apply(Math, Object.values(sessionData).filter(Boolean)))
            }
        }
        //console.log(id, sessionData)
        //console.log(min)
        sendData({"timeInterval":timeInterval.toString(), "hr":hr,"name":name, "id":id+1}, id)
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
        setDeviceName(device.name)
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


    let connected_text = colours["pink"]
    if(connected == "Connected"){
        connected_text = colours["light_green"]
    }

    let connect_display = "none"
    if(connected != "Connected"){
        connect_display = "flex"
    }


    return (
        <>
        <Box
            width={345}
            height={315}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-around"
            color={colours["dark_green"]}
            backgroundColor="white"
            borderRadius={20}
            zIndex={1}
            position="relative"
        >
            <Box
                width={345}
                height={315}
                position="absolute"
                zIndex={99}
                backgroundColor = "white"
                borderRadius={20}
                display={connect_display}
                alignItems="center"
                justifyContent="center"
            >
                <button
                    onClick={() => toConnect()}
                    /*backgroundColor={colours.light_green}*/
                    className='connect_button'

                >CONNECT</button>
            </Box>
        
            <Box
                height="25%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                zIndex={1}
            >
                <p className='bpm_num'>{hr}</p>
            </Box>

            <Box fontSize="10pt">MIN: {min} BPM</Box>

            <Box
                height="35%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                zIndex={1}
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
                zIndex={1}
            >
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                >
                    <Box
                        borderRadius="100%"
                        width="10px"
                        height="10px"
                        backgroundColor={Object.values(colours)[id]}
                        margin="10px"
                    ></Box>


                    <EditableLabel
                        text={name}
                        labelClassName="nameLabel"
                        inputClassName="nameInput"
                        inputWidth="200px"
                        inputHeight="25px"
                        inputMaxLength={20}
                        onChange={e => setName(e.target.value)}
                    />
                   

                    <Box
                        height= "15px"
                        width="15px"
                        margin="5px"
                    ></Box>
                </Box>
                <Box>{deviceName}</Box>
                <Box
                    color={connected_text}
                >{connected}</Box>
                {/*<p>{battery}</p>*/}
                {/*}
                <button
                    onClick={() => toConnect()}
                    className='connect_button'

                >CONNECT</button>
                */}
            </Box>

        </Box>
        </>
    )
}
    
export default Monitor
    