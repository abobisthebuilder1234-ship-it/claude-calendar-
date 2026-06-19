import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  useColorScheme,
  Modal,
  ScrollView,
} from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import type { Event } from '@/utils/calendar';

interface EventModalProps {
  visible: boolean;
  event?: Event;
  date: string;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  visible,
  event,
  date,
  onClose,
  onSave,
  onDelete,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStartTime(event.startTime);
      setEndTime(event.endTime);
    } else {
      setTitle('');
      setDescription('');
      setStartTime('09:00');
      setEndTime('10:00');
    }
  }, [event, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter an event title');
      return;
    }

    const newEvent: Event = {
      id: event?.id || Date.now().toString(),
      title,
      description: description || undefined,
      date,
      startTime,
      endTime,
      color: event?.color || '#0066ff',
    };

    onSave(newEvent);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: Spacing.three,
      maxHeight: '90%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.three,
      paddingBottom: Spacing.three,
      borderBottomWidth: 1,
      borderBottomColor: colors.backgroundElement,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    closeButton: {
      padding: Spacing.one,
    },
    closeText: {
      fontSize: 16,
      color: colors.text,
    },
    content: {
      padding: Spacing.three,
      gap: Spacing.three,
    },
    inputLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: Spacing.one,
      textTransform: 'uppercase',
    },
    textInput: {
      borderWidth: 1,
      borderColor: colors.backgroundElement,
      borderRadius: 8,
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.two,
      fontSize: 14,
      color: colors.text,
      backgroundColor: colors.backgroundElement,
    },
    timeContainer: {
      flexDirection: 'row',
      gap: Spacing.two,
    },
    timeInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.backgroundElement,
      borderRadius: 8,
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.two,
      fontSize: 14,
      color: colors.text,
      backgroundColor: colors.backgroundElement,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: Spacing.two,
      marginTop: Spacing.two,
    },
    saveButton: {
      flex: 1,
      backgroundColor: '#0066ff',
      borderRadius: 8,
      paddingVertical: Spacing.two,
      alignItems: 'center',
    },
    saveButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#ffffff',
    },
    deleteButton: {
      flex: 1,
      backgroundColor: '#ff3333',
      borderRadius: 8,
      paddingVertical: Spacing.two,
      alignItems: 'center',
    },
    deleteButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#ffffff',
    },
    cancelButton: {
      flex: 1,
      backgroundColor: colors.backgroundElement,
      borderRadius: 8,
      paddingVertical: Spacing.two,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {event ? 'Edit Event' : 'New Event'}
            </Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Event title"
                placeholderTextColor={colors.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, { minHeight: 80 }]}
                placeholder="Add a description"
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View>
              <Text style={styles.inputLabel}>Time</Text>
              <View style={styles.timeContainer}>
                <TextInput
                  style={styles.timeInput}
                  placeholder="Start"
                  placeholderTextColor={colors.textSecondary}
                  value={startTime}
                  onChangeText={setStartTime}
                />
                <TextInput
                  style={styles.timeInput}
                  placeholder="End"
                  placeholderTextColor={colors.textSecondary}
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
              {event && onDelete && (
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => {
                    onDelete(event.id);
                    onClose();
                  }}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              )}
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
