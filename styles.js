/**
 * This file contains styles for our app.
 */

 import { StyleSheet } from 'react-native';

 const styles = StyleSheet.create({
 blatchfordColours: {
    blatchfordGreen: '#91c024',
    blatchfordRed: '#e50e47',
    blatchfordBlue: '#008aa4',
    blatchfordOrange: '#f39501',
    blatchfordDarkBlue: '#082938'
  },
  
container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingTop: 50,
    paddingBottom: 50,
},

heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
}
});

export default styles;