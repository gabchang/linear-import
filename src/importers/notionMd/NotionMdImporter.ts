import { Importer, ImportResult } from '../../types';
import path from 'path';
import fs from 'fs';
const fsPromises = fs.promises;
import { NotionIssueImportType } from './types';
import { parser, getter, mapper } from './lib';
import { STATUSES } from './map';

/**
 * Import issues from an Notion MD export
 *
 * @param contentDir  path to md files
 */
export class NotionMdImporter implements Importer {
  public constructor(contentDir: string) {
    this.contentDir = contentDir;
  }

  public get name() {
    return 'Notion (MD)';
  }

  public get defaultTeamName() {
    return 'Leads';
  }

  public getFiles = async (): Promise<string[]> => {
    return fsPromises.readdir(this.contentDir).then((list: Array<string>) => {
      // Enough for a notion export
      return list.filter(filepath => path.extname(filepath) === '.md');
    });
  };

  public rowData = async (filename: string): Promise<NotionIssueImportType> => {
    const md: string = await fsPromises.readFile(
      path.resolve(this.contentDir, filename),
      'utf8'
    );

    const people = parser.people(md);
    const assigneeId =
      people && people.length > 0 ? mapper.member(people) : undefined;

    return <NotionIssueImportType>{
      title: parser.title(md),
      priority: mapper.priority(parser.criticity(md)),
      status: mapper.status(parser.status(md)),
      labels: getter.labels(parser.apps(md)),
      description: parser.description(md, filename),
      assigneeId,
      url: parser.url(filename),
    };
  };

  public import = async (): Promise<ImportResult> => {
    const files = await this.getFiles();

    const importData: ImportResult = {
      issues: [],
      labels: {},
      users: {},
      statuses: {},
    };

    const addUser = (name: string) => {
      if (importData.users[name]) return;
      importData.users[name] = { name };
    };

    const addLabels = (list: Array<string>) => {
      for (const name of list) {
        if (importData.labels[name]) continue;
        importData.labels[name] = { name };
      }
    };

    const addStatus = (name: string) => {
      if (!importData.statuses) return;
      importData.statuses[name] = STATUSES[name];
    };

    // browse files
    for (const filename of files) {
      let rowData;

      try {
        rowData = await this.rowData(filename);
      } catch (e) {
        console.log(`!! Unable to parse ${filename} (ignored)`, e.message);
        continue;
      }

      addLabels(rowData.labels);
      addStatus(rowData.status);
      addUser(rowData.assigneeId);
      importData.issues.push(rowData);
    }

    console.log(`-- ${importData.issues.length} issues to import`);
    return importData;
  };

  // -- Private interface

  private contentDir: string;
}
