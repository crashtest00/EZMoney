import React, { useState, useEffect } from 'react';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Provider as PaperProvider, IconButton, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './SettingsStyle.js';

// Function to format date to string
const formatDate = (date) => {
  const dateDate = new Date(date)
  console.log(date, typeof date)
  let day = ('0' + dateDate.getDate()).slice(-2);
  let month = ('0' + (dateDate.getMonth() + 1)).slice(-2);
  let year = dateDate.getFullYear();
  return `${year}-${month}-${day}`;
};

const SettingsScreen = () => {
  const [budgetDefault, setBudgetDefault] = useState('');
  const [currentMonthBudget, setCurrentMonthBudget] = useState('');
  const [billingCycleStartDate, setBillingCycleStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedBudgetDefault = await AsyncStorage.getItem('budgetDefault');
        const storedCurrentMonthBudget = await AsyncStorage.getItem('currentMonthBudget');
        const storedStartDate = await AsyncStorage.getItem('billingCycleStartDate');
        if (storedBudgetDefault !== null) setBudgetDefault(storedBudgetDefault);
        if (storedCurrentMonthBudget !== null) setCurrentMonthBudget(storedCurrentMonthBudget);
        if (storedStartDate !== null) {
            setBillingCycleStartDate(JSON.parse(storedStartDate));
        }
      } catch (error) {
        console.log(error);
      }
    };
      
    loadSettings();
  }, []);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = new Date(selectedDate) || billingCycleStartDate;
    setShowDatePicker(false);
    setBillingCycleStartDate(currentDate);
  };

  const calculateEndDate = (startDate) => {
    const resultDate = new Date(startDate);
    resultDate.setMonth(resultDate.getMonth() + 1);
    return resultDate;
  };

  const saveSettings = async () => {
    const billingCycleEndDate = calculateEndDate(billingCycleStartDate);
    
    try {
      await AsyncStorage.setItem('budgetDefault', budgetDefault);
      await AsyncStorage.setItem('currentMonthBudget', currentMonthBudget || budgetDefault);
      await AsyncStorage.setItem('billingCycleStartDate', JSON.stringify(billingCycleStartDate));
      await AsyncStorage.setItem('billingCycleEndDate', JSON.stringify(billingCycleEndDate));
      alert('Settings saved!');
    } catch (error) {
      alert('Failed to save settings: ', error);
    }
  };

  return (
    <PaperProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <TextInput
            label="Budget Default"
            value={budgetDefault}
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
              value={formatDate(billingCycleStartDate)}
              onChangeText={text => setBillingCycleStartDate(new Date(text))}
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
