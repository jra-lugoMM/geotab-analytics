import { promises } from 'fs';
import path from 'path';

export default async function readGeotabConfig() {
  const filePath = path.join(__dirname, '../config/geotab.json');
  return promises.readFile(filePath, 'utf-8').then(data => JSON.parse(data));
}
