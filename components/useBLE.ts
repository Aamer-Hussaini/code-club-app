/* eslint-disable no-bitwise */
import { useEffect, useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

import DoorLock from "../models/device";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

const BASIC_SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const BASIC_CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

let connectedDeviceModel: DoorLock | null = null;

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  stopScan(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: DoorLock | null;
  allDevices: Device[];
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<DoorLock | null>(null);

  /**
   * Handle permissions for Android platform
   */
  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  /**
   * Returns true if the device found is already in the list of devices
   */
  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      // if you would like to filter by device name, insert it inside the quotation marks
      // you can also scan for all available devices by removing the second part of the logical AND
      if (device && device.name?.includes("Door")) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

    const stopScan = () => {
        bleManager.stopDeviceScan();
        setAllDevices([]);
    }

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      connectedDeviceModel = new DoorLock(deviceConnection)
      setConnectedDevice(connectedDeviceModel);
      await connectedDeviceModel?.device.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      readBasicData(connectedDeviceModel?.device);
      startStreamingData(connectedDeviceModel?.device);      
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDeviceModel?.device) {
      bleManager.cancelDeviceConnection(connectedDeviceModel.device.id);
      setConnectedDevice(null);
      connectedDeviceModel.setBasicInformation("");
    }
  };

  const onBasicCharacteristicUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const rawData = base64.decode(characteristic.value);

    // Uncomment this code if your data is divided into representative sections
    // const firstBitValue: number = Number(rawData) & 0x01;

    // if (firstBitValue === 0) {
    //   dataValue = rawData[1].charCodeAt(0);
    // } else {
    //   dataValue =
    //     Number(rawData[1].charCodeAt(0) << 8) +
    //     Number(rawData[2].charCodeAt(2));
    // }

    console.log("BASIC: " + rawData);

    connectedDeviceModel?.setBasicInformation(rawData);
  };

  const readBasicData = async (device: Device) => {
    if (device) {
      const characteristic = await device.readCharacteristicForService(
        BASIC_SERVICE_UUID,
        BASIC_CHARACTERISTIC_UUID
      );
      onBasicCharacteristicUpdate(null, characteristic);
    } else {
      console.log("No Device Connected");
    }
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(
        BASIC_SERVICE_UUID,
        BASIC_CHARACTERISTIC_UUID,
        onBasicCharacteristicUpdate
      );

      console.log("Streaming Data");

    } else {
      console.log("No Device Connected");
    }
  };

  return {
    scanForPeripherals,
    stopScan,
    requestPermissions,
    connectToDevice,    
    allDevices,
    connectedDevice,
    disconnectFromDevice,
  };
}

export default useBLE;