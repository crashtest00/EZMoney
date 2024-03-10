import { NavigationContainer,  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Appbar, Provider as PaperProvider, Card, Paragraph, TextInput, Button, Icon} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Import components for pages
import Home from './Home';
import Settings from './Settings';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}


export default App;
