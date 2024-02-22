import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Provider, TextInput, Button, IconButton } from 'react-native-paper';

const App = () => {
  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        {/* Monthly Budget or Expenses Input */}
        <TextInput
          label="Enter Monthly Budget"
          mode="outlined"
          style={styles.input}
          keyboardType='numeric'
          // Add onChangeText to handle input changes
        />

        {/* Calculate Button */}
        <Button
          icon="calculator"
          mode="contained"
          onPress={() => console.log('Calculation triggered')}
          style={styles.button}
        >
          Calculate
        </Button>

        {/* Settings Menu Access */}
        <IconButton
          icon="cog"
          size={30}
          onPress={() => console.log('Settings opened')}
          style={styles.iconButton}
        />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 20,
    width: '100%',
  },
  button: {
    marginBottom: 20,
  },
  iconButton: {
    // Style as needed
  },
});

export default App;
