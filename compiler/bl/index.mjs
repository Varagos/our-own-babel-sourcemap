import fs from 'fs';
import path from 'path';
import vlq from 'vlq';
import { getMapping } from './getMapping.mjs';

const sourceFileContent = fs.readFileSync('./src/bl/index.bl', 'utf8');

let targetFileContent = fs.readFileSync('./src/bl/index.ts', 'utf8');

// 3. Mapping
const { mozillaMap } = getMapping();
mozillaMap.setSourceContent(sourceFileContent);

const sourceMapContent = mozillaMap.toString();
if (!fs.existsSync('./build/bl')) {
  fs.mkdirSync('./build/bl', { recursive: true });
}

fs.writeFileSync(`./build/bl/index.ts.map`, sourceMapContent, 'utf8');

// Add sourcemap location
targetFileContent += '\n';
targetFileContent += '//# sourceMappingURL=/static/index.ts.map';

fs.writeFileSync(`./build/bl/index.ts`, targetFileContent, 'utf8');
fs.writeFileSync(`./build/bl/index.bl`, sourceFileContent, 'utf8');
