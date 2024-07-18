import React from 'react';
import { Modal, Portal, Paragraph, Button, IconButton } from 'react-native-paper';
import styles from './ModalStyle.js';

const TriviaModal = ({ isVisible, onClose, paragraph }) => {
  return (
    <Portal>
      <Modal visible={isVisible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
        <Paragraph>{paragraph}</Paragraph>
        <Button
          style={{ marginTop: 20 }}
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