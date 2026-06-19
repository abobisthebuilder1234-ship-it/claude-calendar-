import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Event } from './calendar';

const EVENTS_KEY = 'claude_calendar_events';

export const getEvents = async (): Promise<Event[]> => {
  try {
    const data = await AsyncStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveEvents = async (events: Event[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events:', error);
  }
};

export const addEvent = async (event: Event): Promise<void> => {
  const events = await getEvents();
  events.push(event);
  await saveEvents(events);
};

export const updateEvent = async (id: string, updates: Partial<Event>): Promise<void> => {
  const events = await getEvents();
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    await saveEvents(events);
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  const events = await getEvents();
  const filtered = events.filter(e => e.id !== id);
  await saveEvents(filtered);
};

export const getEventsByDate = async (date: string): Promise<Event[]> => {
  const events = await getEvents();
  return events.filter(e => e.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime));
};
