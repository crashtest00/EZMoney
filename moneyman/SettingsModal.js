import React from 'react';
import { Modal, Portal, Paragraph, Button, IconButton } from 'react-native-paper';
import styles from './ModalStyle.js';

// A modal which prompts the user to go to settings and set some value they have failed to set
const SettingsModal = ({ isVisible, settingsNavigation, onDismiss, unsetVariable }) => {
  return (
    <Portal>
      <Modal visible={isVisible} contentContainerStyle={styles.modalContainer} onDismiss={onDismiss}> 
        <Paragraph>The {unsetVariable} has not been defined. Please set it in settings.</Paragraph>
        <Button
          style={{ marginTop: 20 }}
          mode='contained'
          onPress={settingsNavigation}>
          Go to settings
        </Button>
      </Modal>
    </Portal>
  );
};

export default SettingsModal;