import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  useColorScheme,
  Pressable,
} from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { getDayName, parseDate, type Event } from '@/utils/calendar';

interface DayViewProps {
  date: string;
  events: Event[];
  onEventPress: (event: Event) => void;
  onAddEvent: () => void;
}

export const DayView: React.FC<DayViewProps> = ({ date, events, onEventPress, onAddEvent }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const dateObj = parseDate(date);
  const sortedEvents = [...events].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return sortedEvents.filter(e => parseInt(e.startTime.split(':')[0]) === hour);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.three,
      borderBottomWidth: 1,
      borderBottomColor: colors.backgroundElement,
    },
    dayName: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    dateDisplay: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.text,
      marginTop: Spacing.one,
    },
    timelineContainer: { flex: 1 },
    hourRow: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: colors.backgroundElement,
      minHeight: 80,
    },
    timeCell: {
      width: 50,
      paddingHorizontal: Spacing.one,
      paddingVertical: Spacing.two,
    },
    timeText: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    eventsCell: {
      flex: 1,
      paddingHorizontal: Spacing.two,
      paddingVertical: Spacing.one,
    },
    eventItem: {
      backgroundColor: '#0066ff',
      borderRadius: 6,
      padding: Spacing.two,
      marginVertical: Spacing.one,
    },
    eventTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#ffffff',
    },
    eventTime: {
      fontSize: 11,
      color: '#e0e0ff',
      marginTop: Spacing.half,
    },
    eventDescription: {
      fontSize: 10,
      color: '#d0d0ff',
      marginTop: Spacing.half,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.textSecondary,
      marginTop: Spacing.three,
      fontSize: 14,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dayName}>{getDayName(dateObj.getDay())}</Text>
        <Text style={styles.dateDisplay}>{dateObj.getDate()}</Text>
      </View>

      <ScrollView style={styles.timelineContainer}>
        {hours.length === 0 ? (
          <Text style={styles.emptyText}>No events for today</Text>
        ) : (
          hours.map(hour => {
            const hourEvents = getEventsForHour(hour);
            return (
              <View key={hour} style={styles.hourRow}>
                <View style={styles.timeCell}>
                  <Text style={styles.timeText}>{String(hour).padStart(2, '0')}:00</Text>
                </View>
                <View style={styles.eventsCell}>
                  {hourEvents.map(event => (
                    <Pressable
                      key={event.id}
                      style={styles.eventItem}
                      onPress={() => onEventPress(event)}
                    >
                      <Text style={styles.eventTitle} numberOfLines={2}>
                        {event.title}
                      </Text>
                      <Text style={styles.eventTime}>
                        {event.startTime} - {event.endTime}
                      </Text>
                      {event.description && (
                        <Text style={styles.eventDescription} numberOfLines={2}>
                          {event.description}
                        </Text>
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};
