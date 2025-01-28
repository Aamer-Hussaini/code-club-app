import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, Text, View } from 'react-native';
import styles from '../styles';

export default function DataScreen() {
    return (
      <SafeAreaView style={{backgroundColor: styles.blatchfordColours.blatchfordDarkBlue, flex: 1}}>
        <View style={[styles.container, {flex: 0.1, alignSelf: 'stretch'}]}>      
          <Text style={[styles.heading]}>Data</Text>
        </View>
        <View style={[styles.container, {flex: 0.75, alignSelf: 'stretch', backgroundColor: "darkred" }]}>
  
        </View>
        <View style={{justifyContent:'space-evenly', flex: 0.5, alignSelf: 'flex-start'}}>
          <Button color={styles.blatchfordColours.blatchfordGreen} title="Green Button" ></Button>
          <Button color={styles.blatchfordColours.blatchfordRed} title="Red Button"></Button>
          <Button color={styles.blatchfordColours.blatchfordBlue} title="Blue Button"></Button>
          <Button color={styles.blatchfordColours.blatchfordOrange} title="Orange Button"></Button>
        </View>      
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }