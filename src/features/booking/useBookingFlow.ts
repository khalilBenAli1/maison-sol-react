import { useState } from 'react';
import { usePreferences } from '../../app/PreferencesContext';
import { findRoom, rooms } from '../../data/rooms';
import {
  isRoomAvailable,
  nightsBetween,
  today,
  validateStay,
} from '../../domain/dates';
import { stayTotals } from '../../domain/money';
import {
  validateContact,
  type ContactDetails,
  type ContactErrors,
} from '../../domain/contact';
import type { BookingDraft, StayErrors } from '../../domain/types';
import type { BookingStep, ConfirmedStay } from './types';
const emptyContact = (): ContactDetails => ({
  name: '',
  email: '',
  consent: false,
});
export default function useBookingFlow() {
  const { preferences, updateDraft, clearDraft } = usePreferences();
  const { draft } = preferences;
  const [step, setStep] = useState<BookingStep>(0);
  const [stayErrors, setStayErrors] = useState<StayErrors>({});
  const [roomError, setRoomError] = useState('');
  const [contact, setContact] = useState<ContactDetails>(emptyContact);
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [confirmed, setConfirmed] = useState<ConfirmedStay | null>(null);
  const room = findRoom(draft.roomId);
  const earliest = today();
  const datesValid =
    Object.keys(
      validateStay(draft.arrival, draft.departure, draft.guests, {
        today: earliest,
      }),
    ).length === 0;
  const availableRooms = datesValid
    ? rooms.filter((candidate) =>
        isRoomAvailable(candidate, draft, { today: earliest }),
      )
    : [];
  const totals =
    room && datesValid
      ? stayTotals(
          room.nightlyRate,
          nightsBetween(draft.arrival, draft.departure),
          draft.guests,
        )
      : null;
  function changeDates(patch: Partial<BookingDraft>) {
    updateDraft(patch);
    setStayErrors({});
  }
  function changeGuests(guests: number) {
    updateDraft({ guests });
  }
  function chooseRoom(roomId: string) {
    updateDraft({ roomId });
    setRoomError('');
  }
  function changeContact(patch: Partial<ContactDetails>) {
    setContact((previous) => ({ ...previous, ...patch }));
  }
  function fillSampleContact() {
    setContact({
      name: 'Alex Morgan',
      email: 'alex@example.com',
      consent: false,
    });
    setContactErrors({});
  }
  function editStep(next: BookingStep) {
    if (next <= step) setStep(next);
  }
  function nextDates() {
    const errors = validateStay(draft.arrival, draft.departure, draft.guests, {
      today: earliest,
    });
    setStayErrors(errors);
    if (!Object.keys(errors).length) setStep(1);
  }
  function nextRoom() {
    if (!datesValid) {
      setStep(0);
      return;
    }
    if (!room || !isRoomAvailable(room, draft, { today: earliest })) {
      setRoomError('Choose an available room for your stay.');
      return;
    }
    setRoomError('');
    setStep(2);
  }
  function nextContact() {
    const errors = validateContact(contact);
    setContactErrors(errors);
    if (Object.keys(errors).length) return false;
    setStep(3);
    return true;
  }
  function finish() {
    if (!datesValid) {
      setStep(0);
      return;
    }
    if (!room || !isRoomAvailable(room, draft, { today: earliest })) {
      setStep(1);
      setRoomError('Choose an available room for your stay.');
      return;
    }
    if (Object.keys(validateContact(contact)).length) {
      setStep(2);
      return;
    }
    if (!totals) {
      setStep(0);
      return;
    }
    setConfirmed({
      reference: `SOL-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      firstName: contact.name.trim().split(' ')[0],
      room,
      draft: { ...draft },
      totals: { ...totals },
    });
  }
  function restart() {
    clearDraft();
    setContact(emptyContact());
    setConfirmed(null);
    setStep(0);
  }
  return {
    draft,
    earliest,
    step,
    stayErrors,
    roomError,
    contact,
    contactErrors,
    confirmed,
    room,
    availableRooms,
    totals,
    changeDates,
    changeGuests,
    chooseRoom,
    changeContact,
    fillSampleContact,
    editStep,
    nextDates,
    nextRoom,
    nextContact,
    finish,
    restart,
  };
}
