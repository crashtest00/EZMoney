import React, { useState } from 'react';
import { View } from 'react-native';
import { List, Switch, Button } from 'react-native-paper';

const Settings = () => {
    const [isSwitchOn, setIsSwitchOn] = useState(false);

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    return (
        <View>
            <List.Section title="Preferences">
                <List.Item
                    title="Notifications"
                    right={() => <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />}
                />
                <List.Item
                    title="Dark Theme"
                    right={() => <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />}
                />
            </List.Section>
            <Button onPress={() => console.log('Pressed')}>Save Changes</Button>
        </View>
    );
};

export default Settings;
