export const wedding = {
  dateLabel: '21 October 2026',
  shortDateLabel: '21.10.26',
  hongKongDateTime: '2026-10-21T10:30:00+08:00',
  hongKongDateKey: '2026-10-21',
  timeLabel: '10:30 AM',
  location: 'Cotton Tree Drive, Central, Hong Kong',
  calendarFileName: 'rishabh-and-glyra-wedding.ics',
  googleCalendarUrl: 'https://calendar.google.com/calendar/r/eventedit?action=TEMPLATE&text=Rishabh+%26+Glyra+Wedding&dates=20261021%2F20261022&details=Wedding+ceremony+at+10%3A30+AM+Hong+Kong+time.+Reception+to+follow.&location=Cotton+Tree+Drive%2C+Central%2C+Hong+Kong',
} as const;

export const weddingStart = new Date(wedding.hongKongDateTime).getTime();
