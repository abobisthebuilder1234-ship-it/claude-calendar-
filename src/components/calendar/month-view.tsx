import React from 'react';
import { View, StyleSheet, Pressable, Text, useColorScheme } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDate,
  getShortDayName,
  isToday,
  type Event,
} from '@/utils/calendar';

interface MonthViewProps {
  year: number;
  month: number;
  events: Event[];
  selectedDate?: string;
  onDateSelect: (date: string) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  year,
  month,
  events,
  selectedDate,
  onDateSelect,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const styles = StyleSheet.create({
    container: { padding: Spacing.three },
    weekRow: {
      flexDirection: 'row',
      marginBottom: Spacing.one,
    },
    dayHeader: {
      flex: 1,
      paddingVertical: Spacing.two,
      textAlign: 'center',
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    dayCell: {
      flex: 1,
      aspectRatio: 1,
      padding: Spacing.one,
      marginHorizontal: Spacing.half,
      marginVertical: Spacing.half,
      borderRadius: 8,
    },
    dayText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      marginBottom: Spacing.half,
    },
    dayTextToday: {
      fontWeight: '700',
      color: '#0066ff',
    },
    dayTextOtherMonth: {
      color: colors.textSecondary,
    },
    eventDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#0066ff',
      marginRight: 2,
    },
    eventDots: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.weekRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} style={[styles.dayHeader, { flex: 1 }]}>
            {day}
          </Text>
        ))}
      </View>

      {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
            const dateStr = day
              ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              : '';
            const isSelected = day && selectedDate === dateStr;
            const dayEvents = day ? getEventsForDay(day) : [];

            return (
              <Pressable
                key={dayIndex}
                style={[
                  styles.dayCell,
                  isSelected && {
                    backgroundColor: colors.backgroundSelected,
                    borderWidth: 1,
                    borderColor: '#0066ff',
                  },
                  day === null && { opacity: 0.3 },
                ]}
                onPress={() => day && onDateSelect(dateStr)}
              >
                {day && (
                  <>
                    <Text
                      style={[
                        styles.dayText,
                        isToday(dateStr) && styles.dayTextToday,
                        !day && styles.dayTextOtherMonth,
                      ]}
                    >
                      {day}
                    </Text>
                    {dayEvents.length > 0 && (
                      <View style={styles.eventDots}>
                        {dayEvents.slice(0, 3).map((_, i) => (
                          <View key={i} style={styles.eventDot} />
                        ))}
                        {dayEvents.length > 3 && (
                          <Text style={{ fontSize: 8, color: colors.textSecondary }}>
                            +{dayEvents.length - 3}
                          </Text>
                        )}
                      </View>
                    )}
                  </>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
};
