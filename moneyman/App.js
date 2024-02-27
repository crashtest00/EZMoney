import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Appbar, Provider as PaperProvider, Card, Paragraph, TextInput, Button } from 'react-native-paper';

// Import your SettingsScreen component
import Settings from './Settings'; // Adjust the import path as necessary

function HomeScreen({ navigation }) {
  const totalBudget = 1000; // Example budget
  const [amountSpent, setAmountSpent] = useState(0); // Example amount spent
  const billingPeriodStart = new Date('2024-02-01'); // Start of billing period
  const billingPeriodEnd = new Date('2024-02-28'); // End of billing period
  const today = new Date(); // Current date

  const billingPeriodLength = (billingPeriodEnd - billingPeriodStart) / (1000 * 60 * 60 * 24);
  const daysElapsed = (today - billingPeriodStart) / (1000 * 60 * 60 * 24);
  const billingPeriodElapsedPercentage = ((daysElapsed / billingPeriodLength) * 100).toFixed(2);
  const budgetSpentPercentage = ((amountSpent / totalBudget) * 100).toFixed(2);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Budget Overview" />
        <Card.Content>
          <Paragraph>Budget Spent: {budgetSpentPercentage}%</Paragraph>
          <Paragraph>Billing Period Elapsed: {billingPeriodElapsedPercentage}%</Paragraph>
        </Card.Content>
      </Card>
      <TextInput
        label="Amount Spent"
        value={amountSpent.toString()}
        onChangeText={text => setAmountSpent(parseFloat(text))}
        keyboardType="numeric"
      />
      <Button onPress={() => console.log("Amount Spent:", amountSpent)}>Update</Button>
      <StatusBar style="auto" />
      <Appbar.Header>
        <Appbar.Content title="Home" />
        <Appbar.Action icon="cog" onPress={() => navigation.navigate('Settings')} />
      </Appbar.Header>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
