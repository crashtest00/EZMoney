import React from 'react';
import { Modal, Portal, Paragraph, Button, IconButton } from 'react-native-paper';
import styles from './ModalStyle.js';

const DateModal = ({ isVisible, settingsNavigation, onDismiss }) => {
  return (
    <Portal>
      <Modal visible={isVisible} contentContainerStyle={styles.modalContainer} onDismiss={onDismiss}> 
        <Paragraph>The start of the current billing period has not been set. Please set it in settings.</Paragraph>
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

export default DateModal;