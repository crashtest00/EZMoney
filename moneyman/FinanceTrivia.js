import React from 'react';
import financeTrivia from './FinanceTriviaRequests.js';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const FinanceTrivia = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You will hear a buzzer. When you hear the buzzer, press the button below.</Text>
      <Button
      mode='contained'
      onPress={() => console.log('You haven\'t heard the buzzer yet...')}>
        Do something interesting, no doubt
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default FinanceTrivia;