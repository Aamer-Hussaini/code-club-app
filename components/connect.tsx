import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeviceModal from "./DeviceConnectionModal";
import useBLE from "./useBLE";

const ConnectScreen = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    stopScan,
    allDevices,
    connectToDevice,
    connectedDevice,
    basicCharacteristic,
    disconnectFromDevice,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <Text style={styles.deviceInformationTitleText}>
              Device Information:
            </Text>
            <Text style={styles.deviceInformationText}>
              {basicCharacteristic}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.deviceInformationTitleText}>
              No Device Connected
            </Text>
            <Text style={styles.deviceInformationText}>
              Please select the button below to scan for nearby devices.
            </Text>
          </>
        )}
      </View>
      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? "Disconnect" : "Scan for Devices"}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        stopScan={stopScan}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#082938",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight * 2 : 50,
  },
  deviceInformationTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "white",
  },
  deviceInformationText: {
    fontSize: 25,
    marginTop: 15,
    color: "white",
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#91c024",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 50,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default ConnectScreen;
