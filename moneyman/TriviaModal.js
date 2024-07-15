import React from 'react';
import { Modal, Portal, Paragraph, Button, IconButton } from 'react-native-paper';
import styles from './TriviaModalStyle.js';

const TriviaModal = ({ isVisible, onClose, paragraph }) => {
  return (
    <Portal>
      <Modal visible={isVisible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
        <IconButton
          icon="close"
          size={20}
          onPress={onClose}
          style={styles.closeIcon}
        />
        <Paragraph>{paragraph}</Paragraph>
        <Button
          mode='contained'
          onPress={onClose}
        >
          Close
        </Button>
      </Modal>
    </Portal>
  );
};

export default TriviaModal;