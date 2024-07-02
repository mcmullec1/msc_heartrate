

/*

async function connect(props) {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['heart_rate'] }],
      acceptAllDevices: false,
    })
    console.log(`%c\n👩🏼‍⚕️`, 'font-size: 82px;', 'Starting HR...\n\n')
    const server = await device.gatt.connect()
    const service = await server.getPrimaryService('heart_rate')
    const char = await service.getCharacteristic('heart_rate_measurement')
    char.oncharacteristicvaluechanged = props.onChange
    char.startNotifications()
    return char
}

function printHeartRate(event) {
    const heartRate = event.target.value.getInt8(1)
    const prev = hrData[hrData.length - 1]
    hrData[hrData.length] = heartRate
    hrData = hrData.slice(-200)
    let arrow = ''
    if (heartRate !== prev) arrow = heartRate > prev ? '⬆' : '⬇'
    console.clear()
    console.log(`%c\n💚 ${heartRate} ${arrow}`, 'font-size: 24px;', '\n\n(To disconnect, refresh or close tab)\n\n')
}

let hrData = new Array(200).fill(10)


connect({ onChange: printHeartRate }).catch(console.error)
button.addEventListener('click', onConnectClick );

*/

//Define the text that will be displayed.
let p = document.getElementById("p_text")
//const canvas = document.getElementById("hr_chart");
//const ctx = canvas.getContext("2d");
let hrData = new Array(200).fill(0)

/*
const hr_chart = new Chart("hr_chart", {
    type: "line",
    data: {
        datasets: [{
          data: hrData
        }]
      }
  });
  */


//When the device does not have bluetooth capability.
if (navigator.bluetooth === undefined) {
    p.textContent = "Bluetooth is not supported" ;
}

else {
    let button = document.getElementById("connect_button") ;
    button.style.cursor = "pointer" ;

    //When the heartrate number changes
    handleHrChange = (event) => {
        let value = event.target.value ; 
        //we select the eight bytes that contain the heartrate
        let heartrate = value.getUint8(1);
        hrData[hrData.length] = heartrate
        hrData = hrData.slice(-200)
        console.log(hrData)
        p.textContent = heartrate + " BPM";
        
    }

    //When the connect button is clicked, this occurs
    /*
    onConnectClick = () => {
        //filter the devices shown to only those that support heart-rate
        navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
        // return the selected device by the user
        .then(device => device.gatt.connect())
        //we get the service
        .then(server => server.getPrimaryService('heart_rate'))
        //then the characteristics
        .then(service => service.getCharacteristic('heart_rate_measurement'))
        .then(characteristic => characteristic.startNotifications())
        
        //set callback function for change in heart-rate
        .then(characteristic => {          
            characteristic.addEventListener('characteristicvaluechanged', handleHrChange); 
        })
        //show errors in the console                                                                                                 
        .catch(error => { console.error(error); });
    }
    */

    async function toConnect() {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ services: ['heart_rate'] }],
          acceptAllDevices: false,
        })
        const server = await device.gatt.connect()
        const service = await server.getPrimaryService('heart_rate')
        const char = await service.getCharacteristic('heart_rate_measurement')
        char.startNotifications()
        char.addEventListener('characteristicvaluechanged', handleHrChange)
        console.log('This is script 2!')
    }

    button.addEventListener('click', toConnect );
}


