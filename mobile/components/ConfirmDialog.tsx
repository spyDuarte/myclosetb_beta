import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  destructive = false
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                destructive && styles.destructiveButton
              ]}
              onPress={onConfirm}
            >
              <Text style={[
                styles.confirmText,
                destructive && styles.destructiveText
              ]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#f0f0f0'
  },
  confirmButton: {
    backgroundColor: '#007AFF'
  },
  destructiveButton: {
    backgroundColor: '#ff3b30'
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600'
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  destructiveText: {
    color: '#fff'
  }
});
