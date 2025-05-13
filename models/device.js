import { Device } from "react-native-ble-plx";
// import { eventEmitter } from "../helpers/emitter";

class DoorLock extends Device {
    constructor(device) {
      super(device);
      this.device = device;
      this.basicInformation = "";
      this.lockState = false;
    }

    setBasicInformation(info) {
        this.basicInformation = info;
        // eventEmitter.emit("basicInformationUpdated", this.basicInformation);
    }

    getBasicInformation()
    {
        return this.basicInformation;
    }

    setLockState(state) {
        this.lockState = state;
        console.log(this.lockState);
        // eventEmitter.emit("lockStateUpdated", this.lockState);
    }

    getLockState() {
        return this.lockState;
    }
}

export default DoorLock;