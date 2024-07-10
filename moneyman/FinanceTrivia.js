import React from 'react';
import financeTrivia from './FinanceTriviaRequests.js';
import { View, Text, Button, StyleSheet } from 'react-native';

const FinanceTrivia = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>You will hear a buzzer.  When you hear the buzzer, press the button below.</Text>
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
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