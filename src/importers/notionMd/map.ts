import { StatusType } from './types';

export const STATUSES: { [key: string]: StatusType } = {
  Backlog: <StatusType>{ name: 'Backlog', type: 'backlog' },
  Design: <StatusType>{ name: 'Design', type: 'unstarted' },
  'To qualify': <StatusType>{ name: 'To qualify', type: 'unstarted' },
  Ready: <StatusType>{ name: 'Ready', type: 'unstarted' },
  'Working on it': <StatusType>{ name: 'Working on it', type: 'started' },
  QA: <StatusType>{ name: 'QA', type: 'completed' },
  Blocked: <StatusType>{ name: 'Blocked', type: 'started' },
  Delivered: <StatusType>{ name: 'Delivered', type: 'completed' },
  Icebox: <StatusType>{ name: 'Icebox', type: 'backlog' },
};

export const STATUS_MAP: { [key: string]: StatusType | null } = {
  Backlog: STATUSES['Backlog'],
  Design: STATUSES['Design'],
  'To qualify': STATUSES['To qualify'],
  'Ready for development': STATUSES['Ready'],
  'In progress': STATUSES['Working on it'],
  QA: STATUSES['QA'],
  'Blocked/Paused': STATUSES['Blocked'],
  'Delivered this week': STATUSES['Delivered'],
  Epics: STATUSES['Icebox'],
  // 'Delivered': null,
  // 'Closed': null,
};

export const MEMBERS: { [key: string]: string } = {
  'Benjamin Waterlot': 'benjamin.waterlot',
  'Alex Toudic': 'alex',
  'Philippine Basser': 'philippine',
  'Julien Birgand': 'julien',
  'Gabriel Chang': 'gab',
  'Basile Bruneau': 'basile',
  'Maxime Jimenez': 'maxime.jimenez',
  'Matthew Dingley': 'matthew',
};
