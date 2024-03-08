import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { NavigationContainer, useFocusEffect, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Appbar, Provider as PaperProvider, Card, Paragraph, TextInput, Button, Snackbar, Icon} from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your SettingsScreen component
import Settings from './Settings'; // Adjust the import path as necessary

function HomeScreen({ navigation }) {
  const [totalBudget, setTotalBudget] = useState(0); // Default to 0
  const today = new Date();
  const [billingPeriodStart, setBillingPeriodStart] = useState(today); // Default to today
  const [billingPeriodEnd, setBillingPeriodEnd] = useState(today); // Default to today
  
  // Now that you have all required data, calculate percentages
  const billingPeriodLength = (billingPeriodEnd - billingPeriodStart) / (1000 * 60 * 60 * 24);
  const daysElapsed = (today - billingPeriodStart) / (1000 * 60 * 60 * 24);
  const billingPeriodElapsedPercentage = ((daysElapsed / billingPeriodLength) * 100).toFixed(2);
  
  // Handle Spent Amount
  const [budgetSpentPercentage, setBudgetSpentPercentage] = useState(0); // Initial value
  const [amountSpent, setAmountSpent] = useState('');

  const calculateSpentPercent = () => {
    // Calculate the percentage of the budgent that has been spent in the current billing period
    // Add logic to handle null
    const newBudgetSpentPercentage = ((parseFloat(amountSpent) / totalBudget) * 100).toFixed(2);
    setBudgetSpentPercentage(newBudgetSpentPercentage);
  };

  const loadSettings = async () => {
    try {
      const savedTotalBudget = await AsyncStorage.getItem('currentMonthBudget');
      if (savedTotalBudget !== null) {
        setTotalBudget(parseFloat(savedTotalBudget));
      }
      const savedBillingPeriodStart = await AsyncStorage.getItem('billingCycleStartDate');
      const savedBillingPeriodEnd = await AsyncStorage.getItem('billingCycleEndDate');

      if (savedTotalBudget !== null) {
        setTotalBudget(parseFloat(savedTotalBudget));
      }
  const [visible, setVisible] = useState(false); // State to control Snackbar visibility
  const content = "This is the content I want to copy.";

  const copyToClipboard = () => {
    Clipboard.setString(content);
    setVisible(true); // Show the Snackbar after copying
  };

  const onDismissSnackBar = () => setVisible(false); // Hide Snackbar

  const loadSettings = async () => {
    try {
      const savedTotalBudget = await AsyncStorage.getItem('currentMonthBudget');
      if (savedTotalBudget !== null) {
        setTotalBudget(parseFloat(savedTotalBudget));
      }

      const savedBillingPeriodStart = await AsyncStorage.getItem('billingCycleStartDate');
      const savedBillingPeriodEnd = await AsyncStorage.getItem('billingCycleEndDate');

      if (savedBillingPeriodStart !== null) {
        setBillingPeriodStart(new Date(savedBillingPeriodStart));
      }

      if (savedBillingPeriodEnd !== null) {
        setBillingPeriodEnd(new Date(savedBillingPeriodEnd));
      }
    } catch (error) {
      console.error('Failed to load settings from AsyncStorage:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSettings();
      setAmountSpent('');
      setBudgetSpentPercentage(0);
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}> 
        <Appbar.Header>
          <Appbar.Content title="Money Manager" />
          <Appbar.Action icon="cog" onPress={() => navigation.navigate('Settings')} />
        </Appbar.Header>      
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Title title="Budget Overview" />
            <Card.Content>
              <Paragraph>Budget Spent: {budgetSpentPercentage}%</Paragraph>
              <Paragraph>Billing Period Elapsed: {billingPeriodElapsedPercentage}%</Paragraph>
              <Button icon="content-copy" mode="contained" onPress={copyToClipboard}>Copy</Button>
          </Card.Content>
          </Card>
          <TextInput 
            style={styles.textInput}
            value={amountSpent}
            label="Enter Amount Spent"
            keyboardType="numeric"
            mode="outlined"
            onChangeText={text => setAmountSpent(text)}
          />
          <Button
            mode='contained'
            labelStyle={{
              fontSize: 20,
            }}
            onPress={() => calculateSpentPercent()} 
            icon="abacus"
          >
            Calculate
          </Button>
          <Button mode="contained" onPress={clearData} style={[styles.button, styles.clearButton]}>Clear Data</Button>
        <StatusBar style="auto" />
        </View>
        <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000} // Duration the Snackbar stays visible
      >
        Content copied to clipboard!
      </Snackbar>
    </View>
    </TouchableWithoutFeedback>
  );
};

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
  textInput: {
    width: '50%', // Adjusted to fill container width more appropriately
    marginTop: 30,
    marginBottom: 20,
  },
});

export default App
