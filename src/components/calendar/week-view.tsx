import React from 'react';
import { View, StyleSheet, ScrollView, Text, useColorScheme, Pressable } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import {
  getWeekDates,
  formatDate,
  getShortDayName,
  isToday,
  type Event,
} from '@/utils/calendar';

interface WeekViewProps {
  date: Date;
  events: Event[];
  selectedDate?: string;
  onDateSelect: (date: string) => void;
  onEventPress: (event: Event) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  date,
  events,
  selectedDate,
  onDateSelect,
  onEventPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const weekDates = getWeekDates(date);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForTime = (dateStr: string, hour: number) => {
    return events.filter(e => {
      if (e.date !== dateStr) return false;
      const startHour = parseInt(e.startTime.split(':')[0]);
      return startHour === hour;
    });
  };

  const styles = StyleSheet.create({
    container: { flex: 1 },
    dayHeader: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      borderBottomWidth: 1,
      borderBottomColor: colors.backgroundElement,
    },
    dayCell: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: Spacing.two,
    },
    dayName: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    dateNumber: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginTop: Spacing.half,
    },
    dateNumberToday: {
      color: '#0066ff',
    },
    scrollContent: {
      flexDirection: 'row',
    },
    timeColumn: {
      width: 50,
      paddingHorizontal: Spacing.one,
    },
    timeText: {
      fontSize: 10,
      color: colors.textSecondary,
      fontWeight: '500',
      paddingVertical: Spacing.two,
      textAlign: 'center',
    },
    dayColumn: {
      flex: 1,
      borderRightWidth: 1,
      borderRightColor: colors.backgroundElement,
      paddingHorizontal: Spacing.one,
    },
    hourCell: {
      borderTopWidth: 1,
      borderTopColor: colors.backgroundElement,
      minHeight: 60,
      paddingVertical: Spacing.one,
    },
    eventBlock: {
      backgroundColor: '#0066ff',
      borderRadius: 4,
      padding: Spacing.one,
      marginBottom: Spacing.one,
    },
    eventTitle: {
      fontSize: 11,
      fontWeight: '600',
      color: '#ffffff',
    },
    eventTime: {
      fontSize: 9,
      color: '#e0e0ff',
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.dayHeader}>
        <View style={{ width: 50 }} />
        {weekDates.map((d, i) => {
          const dateStr = formatDate(d);
          return (
            <Pressable
              key={i}
              style={[styles.dayCell, selectedDate === dateStr && { borderBottomWidth: 2, borderBottomColor: '#0066ff' }]}
              onPress={() => onDateSelect(dateStr)}
            >
              <Text style={styles.dayName}>{getShortDayName(d.getDay())}</Text>
              <Text style={[styles.dateNumber, isToday(dateStr) && styles.dateNumberToday]}>
                {d.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView style={{ flex: 1 }} horizontal pagingEnabled={false}>
        <View style={styles.scrollContent}>
          <View style={styles.timeColumn}>
            {hours.map(hour => (
              <Text key={hour} style={styles.timeText}>
                {String(hour).padStart(2, '0')}:00
              </Text>
            ))}
          </View>

          {weekDates.map((d, dayIndex) => {
            const dateStr = formatDate(d);
            return (
              <View key={dayIndex} style={styles.dayColumn}>
                {hours.map(hour => {
                  const dayEvents = getEventsForTime(dateStr, hour);
                  return (
                    <View key={`${dayIndex}-${hour}`} style={styles.hourCell}>
                      {dayEvents.map(event => (
                        <Pressable
                          key={event.id}
                          style={styles.eventBlock}
                          onPress={() => onEventPress(event)}
                        >
                          <Text style={styles.eventTitle} numberOfLines={1}>
                            {event.title}
                          </Text>
                          <Text style={styles.eventTime}>
                            {event.startTime} - {event.endTime}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};
