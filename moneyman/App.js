import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  // Hardcoded values for demonstration
  const totalBudget = 1000; // Example budget
  const amountSpent = 1500; // Example amount spent
  const billingPeriodStart = new Date('2024-02-01'); // Start of billing period
  const billingPeriodEnd = new Date('2024-02-28'); // End of billing period
  const today = new Date(); // Current date

  // Calculate percentage of the billing period elapsed
  const billingPeriodLength = (billingPeriodEnd - billingPeriodStart) / (1000 * 60 * 60 * 24); // Difference in days
  const daysElapsed = (today - billingPeriodStart) / (1000 * 60 * 60 * 24); // Days elapsed in billing period
  const billingPeriodElapsedPercentage = ((daysElapsed / billingPeriodLength) * 100).toFixed(2);

  // Calculate percentage of budget spent
  const budgetSpentPercentage = ((amountSpent / totalBudget) * 100).toFixed(2);

  return (
    <View style={styles.container}>
      <Text>Budget Spent: {budgetSpentPercentage}%</Text>
      <Text>Billing Period Elapsed: {billingPeriodElapsedPercentage}%</Text>
      <StatusBar style="auto" />
    </View>
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
