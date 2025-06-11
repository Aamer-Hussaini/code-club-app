import { Device } from "react-native-ble-plx";
// import { eventEmitter } from "../helpers/emitter";

class DoorLock extends Device {
    constructor(device) {
      super(device);
      this.device = device;
      this.basicInformation = "";
      this.sensorData = 0;
    }

    setBasicInformation(info) {
        this.basicInformation = info;
        // eventEmitter.emit("basicInformationUpdated", this.basicInformation);
    }

    getBasicInformation()
    {
        return this.basicInformation;
    }

    setSensorData(data)
    {
        this.sensorData = data;
    }

    getSensorData()
    {
        return this.sensorData;
    }
}

export default DoorLock;