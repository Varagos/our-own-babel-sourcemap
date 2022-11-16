import { mappings, mozillaMap } from './sourceMap.mjs';
const sourceFileName = 'index.es6.js';

/**
 * Basically we need start and end of target token (line, column)
 * We need only the start of each token for the mozillaMapping,
 * end is used for managing state.
 */
/*
 * Determine lication.
 * NOTE: doesnt use END for sourcemap, but useful for our processing.
 *

 *
 * @colOffset: number - offset from last generated column, column where token ends
 * @source: object - source location
 * @node - AST node
 * @name - name of token
 *
 */
export const buildLocation = ({ colOffset = 0, lineOffset = 0, name, source, node }) => {
  const { startLine, startColumn, endLine, endColumn } = findTargetStartAndEnd(lineOffset, colOffset);
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
      source: sourceFileName,
      original: source.start,
      name,
    });
  } else {
    console.log('It was actually the same', node);
  }

  const localMapping = { target };
  mappings.push(localMapping);
};

/**
 * Get last generated details
 * If line offset
 *  set end column to current column
 *  reset column to 0
 *  increment current line
 */
const findTargetStartAndEnd = (lineOffset, colOffset) => {
  let startLine;
  let startColumn;
  const lastGenerated = mappings[mappings.length - 1].target;
  const endLine = lastGenerated.end.line + lineOffset;
  let endColumn;
  if (lineOffset) {
    endColumn = colOffset;
    startColumn = 0; // If new line reset column
    startLine = lastGenerated.end.line + lineOffset;
  } else {
    endColumn = lastGenerated.end.column + colOffset;
    startColumn = lastGenerated.end.column;
    startLine = lastGenerated.end.line;
  }

  return { startLine, startColumn, endLine, endColumn };
};
