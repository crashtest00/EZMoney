import React from 'react';
import { fetchTrivia } from './FinanceTriviaRequests.js';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const FinanceTrivia = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Press the button below to fetch some neat facts</Text>
      <Button
      mode='contained'
      onPress={() => fetchTrivia("Please give me some finance trivia while I wait for this intern to improve this prompt")}>
        neat fact fetching button
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