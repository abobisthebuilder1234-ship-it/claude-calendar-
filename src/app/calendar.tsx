import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  useColorScheme,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { MonthView } from '@/components/calendar/month-view';
import { WeekView } from '@/components/calendar/week-view';
import { DayView } from '@/components/calendar/day-view';
import { EventModal } from '@/components/calendar/event-modal';
import { formatDate, getMonthName, type Event } from '@/utils/calendar';
import * as storage from '@/utils/storage';

type ViewMode = 'month' | 'week' | 'day';

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = useCallback(async () => {
    const allEvents = await storage.getEvents();
    setEvents(allEvents);
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  }, [loadEvents]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    if (viewMode === 'month') {
      setViewMode('day');
    }
  };

  const handleEventPress = (event: Event) => {
    setEditingEvent(event);
    setModalVisible(true);
  };

  const handleAddEvent = () => {
    setEditingEvent(undefined);
    setModalVisible(true);
  };

  const handleSaveEvent = async (event: Event) => {
    if (editingEvent) {
      await storage.updateEvent(event.id, event);
    } else {
      await storage.addEvent(event);
    }
    await loadEvents();
    setModalVisible(false);
    setEditingEvent(undefined);
  };

  const handleDeleteEvent = async (eventId: string) => {
    await storage.deleteEvent(eventId);
    await loadEvents();
    setEditingEvent(undefined);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(formatDate(today));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      borderBottomWidth: 1,
      borderBottomColor: colors.backgroundElement,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.two,
    },
    monthTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    navButton: {
      padding: Spacing.one,
    },
    navButtonText: {
      fontSize: 18,
      color: colors.text,
    },
    headerBottom: {
      flexDirection: 'row',
      gap: Spacing.one,
    },
    viewButton: {
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.one,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.backgroundElement,
    },
    viewButtonActive: {
      backgroundColor: '#0066ff',
      borderColor: '#0066ff',
    },
    viewButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
    },
    viewButtonTextActive: {
      color: '#ffffff',
    },
    addButton: {
      marginLeft: 'auto',
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.one,
      backgroundColor: '#0066ff',
      borderRadius: 6,
    },
    addButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#ffffff',
    },
    todayButton: {
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.one,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#0066ff',
      marginLeft: Spacing.one,
    },
    todayButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#0066ff',
    },
    content: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.monthTitle}>
            {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
          </Text>
          <View style={{ flexDirection: 'row', gap: Spacing.one }}>
            <Pressable style={styles.navButton} onPress={handlePrevMonth}>
              <Text style={styles.navButtonText}>←</Text>
            </Pressable>
            <Pressable style={styles.navButton} onPress={handleNextMonth}>
              <Text style={styles.navButtonText}>→</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.headerBottom}>
          {['month', 'week', 'day'].map(mode => (
            <Pressable
              key={mode}
              style={[
                styles.viewButton,
                viewMode === mode && styles.viewButtonActive,
              ]}
              onPress={() => setViewMode(mode as ViewMode)}
            >
              <Text
                style={[
                  styles.viewButtonText,
                  viewMode === mode && styles.viewButtonTextActive,
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </Pressable>
          ))}
          <Pressable style={styles.todayButton} onPress={handleToday}>
            <Text style={styles.todayButtonText}>Today</Text>
          </Pressable>
          <Pressable style={styles.addButton} onPress={handleAddEvent}>
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        {viewMode === 'month' && (
          <MonthView
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
            events={events}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        )}

        {viewMode === 'week' && (
          <WeekView
            date={currentDate}
            events={events}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onEventPress={handleEventPress}
          />
        )}

        {viewMode === 'day' && (
          <DayView
            date={selectedDate}
            events={events.filter(e => e.date === selectedDate)}
            onEventPress={handleEventPress}
            onAddEvent={handleAddEvent}
          />
        )}
      </View>

      <EventModal
        visible={modalVisible}
        event={editingEvent}
        date={selectedDate}
        onClose={() => {
          setModalVisible(false);
          setEditingEvent(undefined);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </View>
  );
}
