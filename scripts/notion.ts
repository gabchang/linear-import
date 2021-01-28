import { NotionMdImporter } from '../src/importers/notionMd/NotionMdImporter';
const filepath =
  'imports/Leads Progress Board 891081b6e4844855bf7a0987e373c210.csv';

async function run() {
  const importer = new NotionMdImporter(filepath);
  const result = await importer.import();
  return result;
}

const result = run();
console.log(result);
