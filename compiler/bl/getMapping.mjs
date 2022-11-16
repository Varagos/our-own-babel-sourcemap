import sourceMap from 'source-map';

const SourceMapGenerator = sourceMap.SourceMapGenerator;
const sourceFileName = 'index.bl';

export const getMapping = () => {
  const mozillaMap = new SourceMapGenerator({
    file: 'index.ts',
  });

  mozillaMap.addMapping({
    generated: {
      line: 1,
      column: 0,
    },
    source: sourceFileName,
    original: {
      line: 1,
      column: 0,
    },
    name: 'dto',
  });

  mozillaMap.addMapping({
    generated: {
      line: 1,
      column: 10,
    },
    source: sourceFileName,
    original: {
      line: 1,
      column: 4,
    },
    name: 'identifier',
  });

  mozillaMap.addMapping({
    generated: {
      line: 2,
      column: 9,
    },
    source: sourceFileName,
    original: {
      line: 2,
      column: 2,
    },
    name: 'field_type',
  });

  mozillaMap.addMapping({
    generated: {
      line: 2,
      column: 2,
    },
    source: sourceFileName,
    original: {
      line: 2,
      column: 9,
    },
    name: 'field_name',
  });
  return { mozillaMap };
};
