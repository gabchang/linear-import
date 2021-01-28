import * as inquirer from 'inquirer';
import { Importer } from '../../types';
import { NotionMdImporter } from './NotionMdImporter';

const BASE_PATH = process.cwd();

export const notionMdImport = async (): Promise<Importer | undefined> => {
  const answers = await inquirer.prompt<NotionImportAnswers>(questions);
  if (!answers.confirmed) return;

  const notionImporter = new NotionMdImporter(answers.notionDirectory);
  return notionImporter;
};

interface NotionImportAnswers {
  notionDirectory: string;
  confirmed: boolean;
}

const questions = [
  {
    basePath: BASE_PATH,
    type: 'directory',
    name: 'notionDirectory',
    message: 'Select your exported directory with Notion MD files',
  },
  {
    type: 'confirm',
    name: 'confirmed',
    message: (answers: NotionImportAnswers) =>
      `.md files will be imported from ${answers.notionDirectory}`,
  },
];
