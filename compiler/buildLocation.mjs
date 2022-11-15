import { mappings, mozillaMap } from './sourceMap.mjs';
const sourceFile = 'index.es6.js';
/*
 * Determine lication.
 * NOTE: doesnt use END for sourcemap, but useful for our processing.
 *
 * Get last generated details
 * If line offset
 *  set end column to current column
 *  reset column to 0
 *  increment current line
 */
export const buildLocation = ({ colOffset = 0, lineOffset = 0, name, source, node }) => {
  let endColumn;
  let startColumn;
  let startLine;
  const lastGenerated = mappings[mappings.length - 1].target;
  const endLine = lastGenerated.end.line + lineOffset;
  if (lineOffset) {
    endColumn = colOffset;
    startColumn = 0; // If new line reset column
    startLine = lastGenerated.end.line + lineOffset;
  } else {
    endColumn = lastGenerated.end.column + colOffset;
    startColumn = lastGenerated.end.column;
    startLine = lastGenerated.end.line;
  }

  const target = {
    start: {
      line: startLine,
      column: startColumn,
    },
    end: {
      line: endLine,
      column: endColumn,
    },
  };
  node.loc = target; // Update node with new location

  const clonedNode = Object.assign({}, node);
  delete clonedNode.original; // Only useful for check against original
  const original = node.original;
  if (JSON.stringify(clonedNode) !== JSON.stringify(original)) {
    // Push to real mapping. Just START. END is for me managing state
    mozillaMap.addMapping({
      generated: {
        line: target.start.line,
        column: target.start.column,
      },
      source: sourceFile,
      original: source.start,
      name,
    });
  }

  return { target };
};
