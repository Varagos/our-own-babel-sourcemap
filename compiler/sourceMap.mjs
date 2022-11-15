import sourceMap from 'source-map';

const SourceMapGenerator = sourceMap.SourceMapGenerator;

/**
 * To make full use of Mozillas library we will:
 * Create a sourceMap instance to hold and build our mappings
 * Initialise and store local mappings
 */

export const mozillaMap = new SourceMapGenerator({
  file: 'index.es5.js',
});

/*
 * Mapping instance
 */
export const mappings = [
  {
    target: {
      start: { line: 1, column: 0 },
      end: { line: 1, column: 0 },
    },
    source: {
      start: { line: 1, column: 0 },
      end: { line: 1, column: 0 },
    },
    name: 'START',
  },
];
