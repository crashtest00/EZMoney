import React, { useState, useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Appbar, Provider as PaperProvider, Card, Paragraph, TextInput, Button, Modal, Portal, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './AppStyle.js';
import TriviaModal from './TriviaModal.js';
import { fetchTrivia } from './FinanceTriviaRequests.js';
import Settings from './Settings'; 
import SettingsModal from './SettingsModal.js';

function HomeScreen({ navigation }) {

  // Trivia stuff
  const [triviaBody, setTriviaBody] = useState("If you're seeing this than the trivia-getting function is quite broken. Sorry!");
  const [triviaTitle, setTriviaTitle] = useState("getting trivia...");
  const [triviaSummary, setTriviaSummary] = useState("loading...")
  const [loading, setLoading] = useState(true);
  const [isTriviaModalVisible, setTriviaModalVisible] = useState(false);

  const getNewTrivia = async () => {
    try {        
      const result = await fetchTrivia();
      setTriviaTitle(result.title); 
      setTriviaBody(result.body);
      setTriviaSummary("tap to read more");
      console.log("sucessfully received trivium");
      console.log("storing trivia...");
      try {
        await AsyncStorage.setItem('lastTriviaTitle', result.title);
        await AsyncStorage.setItem('lastTriviaBody', result.body);
        await AsyncStorage.setItem('lastTriviaDate', JSON.stringify(new Date(today)));
        console.log("trivia stored for later access")
      } catch (error) {
        console.error("Error while trying to store trivia: ", error);
        console.error("Failed to store trivia");
      }
    } catch (error) {
      console.error("Error: getting data: ", error)
      setTriviaTitle("An error occured while fetching trivia");
    } finally {
      setLoading(false);
    }
  };
  const getOldTrivia = async () => {
    const storedTrivaiTitle = await AsyncStorage.getItem('lastTriviaTitle')
    setTriviaTitle(storedTrivaiTitle);
    const storedTriviaBody = await AsyncStorage.getItem('lastTriviaBody')
    setTriviaBody(storedTriviaBody);    
    setTriviaSummary("tap to read more");
    console.log("sucessfully restored old trivia");
    setLoading(false)
  }
  const loadTrivia = async () => {
    const lastTriviaDateStored = await AsyncStorage.getItem('lastTriviaDate');
    const todayCalenderDate = new Date(today);
    todayCalenderDate.setHours(0,0,0,0)
    // if the trivia bit was stored on or after today's midnight, it was stored today
    if (lastTriviaDateStored !== null && new Date(JSON.parse(lastTriviaDateStored)).valueOf() >= todayCalenderDate.valueOf()) { 
      console.log("using previously-stored trivia...");
      getOldTrivia();
    }
    else {
      console.log("fetching new trivia...");
      getNewTrivia();
    } 
  }

  const [totalBudget, setTotalBudget] = useState(0); // Default to 0
  const today = new Date();
  const [billingPeriodStart, setBillingPeriodStart] = useState(today); // Default to today
  const [billingPeriodEnd, setBillingPeriodEnd] = useState(today); // Default to today
  
  const billingPeriodLength = (billingPeriodEnd - billingPeriodStart) / (1000 * 60 * 60 * 24) || 1;
  const daysElapsed = (today - billingPeriodStart) / (1000 * 60 * 60 * 24);
  const billingPeriodElapsedPercentage = ((daysElapsed / billingPeriodLength) * 100).toFixed(2);
  const [unsetVariable, setUnsetVariable] = useState("billing period")
  
  // Handle Spent Amount
  const [budgetSpentPercentage, setBudgetSpentPercentage] = useState(0);
  const [amountSpent, setAmountSpent] = useState('');
  

  const calculateSpentPercent = () => {
    if (isNaN(parseInt(amountSpent))) {
      console.log("no valid amount spent!");
      alert("Please enter the amount spent this billing period into the provided field")
    } else if (totalBudget == null || totalBudget == 0) {
      setUnsetVariable("total budget of the current billing period")
      setSettingsModalVisible(true)
    } else {
      const newBudgetSpentPercentage = ((parseFloat(amountSpent) / totalBudget) * 100).toFixed(2);
      setBudgetSpentPercentage(newBudgetSpentPercentage);
    }
  };

  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  const loadSettings = async () => {
    try {
      const savedTotalBudget = await AsyncStorage.getItem('currentMonthBudget');
      const savedBillingPeriodStartString = await AsyncStorage.getItem('billingCycleStartDate');
      const savedBillingPeriodEndString = await AsyncStorage.getItem('billingCycleEndDate');
      
      if (savedTotalBudget !== null) {
        setTotalBudget(parseFloat(savedTotalBudget));
      }

      // assumes the billing period's boundaries are always a month apart 
      if (savedBillingPeriodEndString !== null && savedBillingPeriodStartString !== null) {
        const savedBillingPeriodStart = new Date(JSON.parse(savedBillingPeriodStartString))
        const savedBillingPeriodEnd = new Date(JSON.parse(savedBillingPeriodEndString))
        // automatically detect beginning of new billing period and adjust loaded and stored boundaries accordingly
        if (savedBillingPeriodEnd.valueOf() < today.valueOf()) {
          // if the billing period happens to start on the thirty first of a month, this will cause issues when incrementing to a thirty-day month
          savedBillingPeriodStart.setMonth(savedBillingPeriodStart.getMonth()+1)
          savedBillingPeriodEnd.setMonth(savedBillingPeriodEnd.getMonth()+1)
          setBillingPeriodEnd(savedBillingPeriodEnd);
          setBillingPeriodStart(savedBillingPeriodStart);
          try {
            await AsyncStorage.setItem('billingCycleStartDate', JSON.stringify(savedBillingPeriodStart));
            await AsyncStorage.setItem('billingCycleEndDate', JSON.stringify(savedBillingPeriodEnd));
          } catch (error) {
            console.error('Failed to store updated dates in AsyncStorage: ', error);
          }
          console.log("Previously stored billing cycle incremented by a month");
        }
        else {
          setBillingPeriodStart(savedBillingPeriodStart);
          setBillingPeriodEnd(savedBillingPeriodEnd);
        }
      }
      else {
        console.log("No billing period data found. This issue should be handled.")
        setUnsetVariable("billing period");
        setSettingsModalVisible(true);
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
      loadTrivia();
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
            labelStyle={{ fontSize: 20 }} 
            onPress={calculateSpentPercent} 
            icon="abacus">
            Calculate
          </Button>  
          <SettingsModal 
            isVisible={settingsModalVisible}
            unsetVariable={unsetVariable}
            onDismiss={() => setSettingsModalVisible(false)}
            settingsNavigation={() => {
              navigation.navigate('Settings');
              setSettingsModalVisible(false);
            }}>
          </SettingsModal>        
          <KeyboardAvoidingView style={{width: '100%', alignItems: 'center'}}>
            <Card style={{width: '80%', bottom: '-90%'}} 
              mode='elevated'
              disabled={loading}
              onPress={() => setTriviaModalVisible(true)}>
              <Card.Title titleStyle={{ textAlign: 'center' }} title={triviaTitle} />
              <Card.Content>
                <Text style={{ textAlign: 'center' }}>{triviaSummary}</Text>
              </Card.Content>
            </Card>
            <TriviaModal
              isVisible={isTriviaModalVisible}
              onClose={() => setTriviaModalVisible(false)}
              paragraph={triviaBody}
            />
          </KeyboardAvoidingView>
          </View>
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

export default App;