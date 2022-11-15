import { mozillaMap, mappings } from './sourceMap.mjs';
import { Statements } from './generator.mjs';

/*
 * Depth-first search
 *
 * Check each object property value in AST node
 * If array (will b of nodes) iterate and call traverse(item)
 * If object call traverse(item)
 */
export function visit(ast, callback) {
  callback(ast);

  for (const [keyName, child] of Object.entries(ast)) {
    if (keyName === 'loc') return;
    if (Array.isArray(child)) {
      for (let j = 0; j < child.length; j++) {
        visit(child[j], callback);
      }
    } else if (isNode(child)) {
      visit(child, callback);
    }
  }
}
function isNode(node) {
  return typeof node === 'object' && node.type;
}

/*
 * Shallow clone.
 * Pass-by-ref so write to reference
 * clone does not have original on
 */
export const cloneOriginalOnAst = (ast) => {
  visit(ast, (node) => {
    const clone = Object.assign({}, node);
    node.original = clone;
  });
};

/*
 * Help with Node properties is https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API
 * DONT flatten on cloned, as want to update that AST, not flattened.
 */
export const flattenTokens = (ast) => {
  const flattenedTokens = [];
  ast.body.map((current) => {
    // process each body to help us separate by block/line
    const row = [];
    visit(current, (node) => {
      if (node.type) {
        const item = {
          type: node.type,
          // ALWAYS: location, original
          // SOMETIMES: operator, name, value
        };
        if (node.value) {
          item.value = node.value;
        }
        if (node.name) {
          item.name = node.name;
        }
        if (node.operator) {
          item.operator = node.operator;
        }
        if (node.loc) {
          item.location = node.loc;
        }
        // item.original = Object.assign({}, item);

        // Not needed. Its the identifier
        // if (node.params) {
        //   item.params = node.params;
        // }
        // Not needed. Its the left identifier + right literal
        // if (node.argument) {
        //   item.argument = node.argument;
        // }

        // if (node.type === "FunctionDeclaration") {
        //   console.log("FunctionDeclaration", node);
        // }
        row.push(item);
      }
    });

    flattenedTokens.push(row);
  });
  return flattenedTokens;
};

/**
 * iterate over the program body (i.e. each line of code) and start running our generator.
 */
export const getMapping = (ast) => {
  const code = ast.body.map((astBody) => Statements[astBody.type](astBody)).flat();

  return { mappings, code, mozillaMap };
};
