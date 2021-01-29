import { STATUS_MAP, MEMBERS } from './map';
import { concat, pipe } from 'ramda';

const mapPriority = (input: string): number => {
  const priorityMap: { [key: string]: number } = {
    '🔥 🔥 🔥': 2,
    '🖐 🖐': 3,
    '🐌': 4,
  };
  return priorityMap[input] || 0;
};

const mapMember = (input: string): string => {
  return MEMBERS[input];
};

const mapStatus = (input: string) => {
  const mapped = STATUS_MAP[input];
  return (mapped && mapped.name) || 'Backlog';
};

const getLabels = (input: string) => {
  return input.split(',').filter(tag => !!tag);
};

const firstMatch = (exp: RegExp): ((input: string) => string) => {
  return (input: string): string => {
    let [, result = ''] = input.match(exp) || [];
    return result;
  };
};

const removeMatch = (exp: RegExp): ((input: string) => string) => {
  return (input: string): string => input.replace(exp, '');
};

const getDescription = (input: string, filename?: string) => {
  const epic = firstMatch(new RegExp(/^Epic: (.*)/m))(input);
  const epicId = firstMatch(new RegExp(/[.*%20]*([a-f0-9]+)\.md/))(epic);

  // reduce url length
  const shortenUrls = (input: string): string => {
    return input.replace(
      new RegExp(/https:\/\/www\.notion\.so\/[\w*-]*-([a-f0-9]+)/gm),
      'https://www.notion.so/$1'
    );
  };

  const url = filename ? urlFromFilename(filename) : null;

  return pipe(
    removeMatch(new RegExp(/^# .*\n\n/)),
    removeMatch(
      new RegExp(
        /^Epic: .*\n|Criticity: .*\n|Completed: .*\n|Apps: .*\n|Status: .*\n/gm
      )
    ),
    shortenUrls,
    concat(`Epic: https://notion.so/${epicId}\n`),
    str => (url ? concat(`Notion URL: ${url}\n`, str) : str)
  )(input);
};

const urlFromFilename = (input: string): string => {
  return input.replace(
    new RegExp(/.* ([a-f0-9]+).md/),
    'https://www.notion.so/$1'
  );
};

/**
 * Input data parsers
 *
 * Common parameters :
 * @param {String} input  - String to parse from
 */
export const parser = {
  apps: firstMatch(new RegExp(/^Apps: (.*)/m)),
  backlog: firstMatch(new RegExp(/^Backlog: (.*)/m)),
  creator: firstMatch(new RegExp(/^Creator: (.*)/m)),
  criticity: firstMatch(new RegExp(/^Criticity: (.*)/m)),
  design: firstMatch(
    new RegExp(/^Related to Design Progress Board  \(Leads\): (.*)/m)
  ),
  okr: firstMatch(new RegExp(/^OKR: (.*)/m)),
  people: firstMatch(new RegExp(/^People involved: (.*)/m)),
  quarter: firstMatch(new RegExp(/^Quarter: (.*)/m)),
  status: firstMatch(new RegExp(/^Status: (.*)/m)),
  title: firstMatch(new RegExp(/^# (.*)/)), // 1st line !
  description: getDescription,
  url: urlFromFilename,
};

/**
 * Getter from datas, small reformat
 *
 * Common parameters :
 * @param {String} input  - String to format
 */
export const getter = {
  labels: getLabels,
};

/**
 * Mapping from input to output values
 *
 * Common parameters :
 * @param {String} input  - String to map
 */
export const mapper = {
  priority: mapPriority,
  member: mapMember,
  status: mapStatus,
};
