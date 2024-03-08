import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Appbar, Provider as PaperProvider, Card, Paragraph, TextInput, Button, Snackbar } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your SettingsScreen component
import Settings from './Settings'; // Adjust the import path as necessary

function HomeScreen({ navigation }) {
  const [totalBudget, setTotalBudget] = useState(0); // Default to 0
  const [amountSpent, setAmountSpent] = useState(0); // Default to 0
  const [amountSpentInput, setAmountSpentInput] = useState(''); // Temporary input state
  const today = new Date();
  const [billingPeriodStart, setBillingPeriodStart] = useState(today); // Default to today
  const [billingPeriodEnd, setBillingPeriodEnd] = useState(today); // Default to today
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
    }, [])
  );

  // Now that you have all required data, calculate percentages safely
  const billingPeriodLength = Math.max((billingPeriodEnd - billingPeriodStart) / (1000 * 60 * 60 * 24), 1); // Ensure minimum value of 1
  const daysElapsed = Math.max((today - billingPeriodStart) / (1000 * 60 * 60 * 24), 0); // Ensure non-negative
  const billingPeriodElapsedPercentage = totalBudget > 0 ? ((daysElapsed / billingPeriodLength) * 100).toFixed(2) : "0.00";
  const budgetSpentPercentage = totalBudget > 0 ? ((amountSpent / totalBudget) * 100).toFixed(2) : "0.00";


  const updateAmountSpent = () => {
    setAmountSpent(parseFloat(amountSpentInput) || 0); // Only update amountSpent on button press
  };

  // Function to clear AsyncStorage
  async function clearData() {
    try {
      await AsyncStorage.clear();
      Alert.alert("Data Cleared", "All data has been successfully cleared.");
      // Reset states if necessary, for instance:
      setTotalBudget(0);
      setAmountSpent(0);
      setAmountSpentInput('');
    } catch (error) {
      // Error handling
      console.error('Failed to clear AsyncStorage:', error);
      Alert.alert("Error", "Failed to clear data.");
    }
  }

  return (
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
          label="Amount Spent"
          value={amountSpentInput}
          onChangeText={setAmountSpentInput}
          keyboardType="numeric"
          style={styles.textInput}
        />
        <Button mode="contained" onPress={updateAmountSpent} style={styles.button}>Update</Button>
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
  textInput: {
    width: '50%', // Adjusted to fill container width more appropriately
    marginTop: 30,
    marginBottom: 20,
  },
  clearButton: {
    marginTop: 10, // Add some margin to separate it from the previous button
    backgroundColor: 'red', // Optional: Use a different color to emphasize the action
  },
});

export default App
