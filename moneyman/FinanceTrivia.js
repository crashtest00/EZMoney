import React, { useState } from 'react';
import { fetchTrivia } from './FinanceTriviaRequests.js';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const FinanceTrivia = ({ navigation }) => {

  const prompt = "Please generate one finance-related \"fun fact\"/trivia item, "
               + "and respond ONLY with a JSON file using the following fields:"
               + "\n-title: a short summary of the trivium (one sentence, 5-10 "
               + "words)\n-body: a longer description of the trivium (up to 300 "
               + "words)"
    
  const [triviaText, setTriviaText] = useState("Press the button below to generate some trivia");

  // fetches trivia from ChatGPT and sets triviaText to the response's title
  const fetchTriviaData = async () => {
    try {
      const response = await fetchTrivia(prompt);
      console.log(response.title)
      setTriviaText(response.title);
    } catch (error) {
      Console.error('Error fetching trivia:', error);
      setTriviaText('Failed in some capacity. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{triviaText}</Text>
      <Button
        mode='contained'
        onPress={fetchTriviaData}>
        fetch trivia
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