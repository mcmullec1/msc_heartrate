
//Define the text that will be displayed.
let p = document.getElementById("p_text") ;

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
        p.textContent = heartrate + " BPM";
    }

    //When the connect button is clicked, this occurs
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

    button.addEventListener('click', onConnectClick );
}