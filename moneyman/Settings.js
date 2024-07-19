import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Provider as PaperProvider, IconButton, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './SettingsStyle.js';

const SettingsScreen = () => {
  const [budgetDefault, setBudgetDefault] = useState('');
  const [currentMonthBudget, setCurrentMonthBudget] = useState('');
  const [billingCycleStartDate, setBillingCycleStartDate] = useState(new Date());
  const [billingCycleStartDateString, setBillingCycleStartDateString] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Function to format date to string
  const formatDate = (date) => {
    let day = ('0' + date.getDate()).slice(-2);
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Correctly use useEffect for initial setup
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedBudgetDefault = await AsyncStorage.getItem('budgetDefault');
        const storedCurrentMonthBudget = await AsyncStorage.getItem('currentMonthBudget');
        const storedStartDate = await AsyncStorage.getItem('billingCycleStartDate');
        if (storedBudgetDefault !== null) setBudgetDefault(storedBudgetDefault);
        if (storedCurrentMonthBudget !== null) setCurrentMonthBudget(storedCurrentMonthBudget);
        if (storedStartDate !== null) {
          setBillingCycleStartDateString(storedStartDate);
          setBillingCycleStartDate(new Date(storedStartDate));
        }
      } catch (error) {
        console.log(error);
      }
    };

    setBillingCycleStartDateString(formatDate(new Date())); // Ensure this uses a new Date instance
    loadSettings();
  }, []);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || billingCycleStartDate;
    setShowDatePicker(false); // Hide the picker
    setBillingCycleStartDate(currentDate);
    setBillingCycleStartDateString(formatDate(currentDate));
  };

  const calculateEndDate = (startDate) => {
    const resultDate = new Date(startDate);
    resultDate.setMonth(resultDate.getMonth() + 1);
    return formatDate(resultDate);
  };

  const saveSettings = async () => {
    const billingCycleEndDate = calculateEndDate(billingCycleStartDate);
    
    try {
      await AsyncStorage.setItem('budgetDefault', budgetDefault);
      await AsyncStorage.setItem('currentMonthBudget', currentMonthBudget || budgetDefault);
      await AsyncStorage.setItem('billingCycleStartDate', billingCycleStartDateString);
      await AsyncStorage.setItem('billingCycleEndDate', billingCycleEndDate); // Save the end date
      alert('Settings saved!');
    } catch (error) {
      console.log(error);
      alert('Failed to save settings.');
    }
  };

  return (
    <PaperProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <TextInput
            label="Budget Default"
            value={budg  etDefault}
            onChangeText={setBudgetDefault}
            keyboardType="numeric"
            style={styles.textInput}
          />
          <TextInput
            label="Current Month Budget"
            value={currentMonthBudget}
            onChangeText={setCurrentMonthBudget}
            keyboardType="numeric"
            style={styles.textInput}
          />
          <View style={styles.datePickerContainer}>
            <TextInput
              label="Cycle Start"
              value={billingCycleStartDateString}
              onChangeText={text => setBillingCycleStartDateString(text)}
              style={styles.textInput}
            />
            <IconButton
              icon="calendar"
              onPress={() => setShowDatePicker(true)}
            />
          </View>
        {showDatePicker && (
            <DateTimePicker
              value={billingCycleStartDate}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          <Button
            mode='contained'
            onPress={() => saveSettings()} 
          >
            Save Settings
          </Button>
        </View>
      </TouchableWithoutFeedback> 
    </PaperProvider>
  );
};


export default SettingsScreen;
