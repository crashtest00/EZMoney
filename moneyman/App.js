import React, { useState, useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Appbar, Provider as PaperProvider, Card, Paragraph, TextInput, Button, Modal, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './AppStyle.js';
import TriviaModal from './TriviaModal.js';
import { fetchTrivia } from './FinanceTriviaRequests.js';
import Settings from './Settings'; 

function HomeScreen({ navigation }) {

  // Trivia stuff
  const [triviaBody, setTriviaBody] = useState("If you're seeing this than the trivia-getting function is quite broken. Sorry!");
  const [triviaTitle, setTriviaTitle] = useState("getting trivia...");
  const [triviaSummary, setTriviaSummary] = useState("loading...")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNewTrivia = async () => {
      try {        
        const result = await fetchTrivia();
        setTriviaTitle(result.title); 
        setTriviaBody(result.body);
        setTriviaSummary("tap to read more");
        console.log("sucessfully received trivium");
        console.log("storing trivia...");
        await AsyncStorage.setItem('lastTriviaTitle', result.title);
        await AsyncStorage.setItem('lastTriviaBody', result.body);
        await AsyncStorage.setItem('lastTriviaDate', JSON.stringify(new Date(today)))
        console.log("trivia stored for later access")
      } catch (error) {
        console.error("Error: ", error)
        setTriviaTitle("An error occured while fetching trivia");
      } finally {
        setLoading(false);
      }
    };
    const getOldTrivia = async () => {
      setTriviaTitle(await AsyncStorage.getItem('lastTriviaTitle'));
      setTriviaBody(await AsyncStorage.getItem('lastTriviaBody'));
      setTriviaSummary("tap to read more");
      console.log("sucessfully restored old trivia");
      setLoading(false)
    }
    const checkAndGetTrivia = async () => {
      const lastTriviaDateStored = await AsyncStorage.getItem('lastTriviaDate');
      const todayCalenderDate = new Date(today);
      todayCalenderDate.setHours(0,0,0,0)
      // if the trivia bit was stored on or after midnight today, it was stored today
      if (lastTriviaDateStored !== null && new Date(JSON.parse(lastTriviaDateStored)).valueOf() >= todayCalenderDate.valueOf()) { 
        console.log("using previously-stored trivia...");
        getOldTrivia();
      }
      else {
        console.log("fetching new trivia...");
        getNewTrivia();
      } 
    }

    checkAndGetTrivia()
  }, []);

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
  const [isModalVisible, setModalVisible] = useState(false);

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
        </View>
        <View style={{ position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' }}>
          <Card style={{width: '80%'}}
            mode='contained'
            disabled={loading}
            onPress={() => setModalVisible(true)}>
            <Card.Title titleStyle={{ textAlign: 'center' }} title={triviaTitle} />
            <Card.Content>
              <Text style={{ textAlign: 'center' }}>{triviaSummary}</Text>
            </Card.Content>
          </Card>
          <TriviaModal
            isVisible={isModalVisible}
            onClose={() => setModalVisible(false)}
            paragraph={triviaBody}
          />
          <StatusBar style="auto" />
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