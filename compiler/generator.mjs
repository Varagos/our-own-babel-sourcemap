import { buildLocation } from './buildLocation.mjs';

/*
 * Build mappings
 */
// Utils..copied from "eccodegen"
const space = ' ';
const indent = space + space;
const newline = '\n';
const semicolon = ';'; // USUALLY flags on this

// This generates the code but also adds the mappings
export const Statements = {
  FunctionDeclaration: function (node) {
    buildLocation({
      name: 'function',
      colOffset: 'function'.length,
      source: node.original.loc,
      node,
    });

    buildLocation({
      name: '_function_ space',
      colOffset: space.length,
      source: node.original.loc,
      node,
    });

    let id;
    if (node.id) {
      id = generateIdentifier(node.id);
    } else {
      id = '';
    }
    const body = generateFunctionBody(node);

    // console.log("mappings", mappings[mappings.length - 1].target);

    // block has start + end?
    return ['function', space, id].concat(body); // JOIN
  },
  BlockStatement: function (node) {
    let result = ['{', newline];

    buildLocation({
      name: '_function_ {',
      colOffset: '{'.length,
      source: node.original.loc,
      node,
    });

    // USUALLY withIndent
    // USUALLY for loop on body
    // USUALLY addIndent
    result = result.concat(generateStatement(node.body[0])).flat();
    // result.push(generateStatement(node.body[0])); // JOIN

    // HACK for closing bracket as character node doesnt exist.
    const endBracketLocation = {
      start: node.original.loc.end,
      end: {
        line: 3,
        column: 2,
      },
    };
    buildLocation({
      name: '_function_ }',
      lineOffset: 1,
      // source: node.original.loc,
      source: endBracketLocation,
      node,
    });

    result.push('}');
    result.push('\n');
    return result;
  },
  ReturnStatement: function (node) {
    // USUALLY check for argument else return
    buildLocation({
      name: 'indent _return_',
      colOffset: indent.length,
      lineOffset: 1,
      source: node.original.loc,
      node,
    });

    buildLocation({
      name: 'return',
      colOffset: 'return'.length,
      source: node.original.loc,
      node,
    });

    buildLocation({
      name: '_return_ space',
      colOffset: space.length,
      source: node.original.loc,
      node,
    });

    return [indent, 'return', space, generateExpression(node.argument), semicolon, newline];
  },
  BinaryExpression: function (node) {
    const left = generateExpression(node.left);

    buildLocation({
      name: '_binary expression pre_ space',
      colOffset: ' '.length,
      source: node.original.loc,
      node,
    });

    buildLocation({
      name: `_binary expression_ operator ${node.operator}`,
      colOffset: String(node.operator).length,
      source: node.original.loc,
      node,
    });

    buildLocation({
      name: '_binary expression post_ space',
      colOffset: ' '.length,
      source: node.original.loc,
      node,
    });

    const right = generateExpression(node.right);

    return [left, space, node.operator, space, right];
  },
  Literal: function (node) {
    buildLocation({
      name: `_literal_ value ${node.value}`,
      colOffset: String(node.value).length,
      source: node.original.loc,
      node,
    });

    if (node.value === null) {
      return 'null';
    }
    if (typeof node.value === 'boolean') {
      return node.value ? 'true' : 'false';
    }
    return node.value;
  },
  Identifier: function (node) {
    return generateIdentifier(node);
  },
  ExpressionStatement: function (node) {
    const result = generateExpression(node.expression); // was []
    result.push(';');
    return result;
  },
  AssignmentExpression: function (node, precedence) {
    return generateAssignment(node.left, node.right, node.operator, precedence);
  },
  MemberExpression: function (node, precedence) {
    const result = [generateExpression(node.object)];
    result.push('.');
    result.push(generateIdentifier(node.property));
    return parenthesize(result, 19, precedence);
  },
};
// Node processors
function parenthesize(text, current, should) {
  if (current < should) {
    return ['(', text, ')'];
  }
  return text;
}
const generateAssignment = (left, right, operator, precedence) => {
  const expression = [generateExpression(left), space + operator + space, generateExpression(right)];
  return parenthesize(expression, 1, precedence).flat(); // FLATTEN
};
const generateIdentifier = (id) => {
  buildLocation({
    name: `_identifier_ name ${id.name}`,
    colOffset: String(id.name).length,
    source: id.original.loc,
    node: id,
  });
  return id.name;
};
const generateFunctionParams = (node) => {
  buildLocation({
    name: `_function_ (`,
    colOffset: '('.length,
    source: node.original.loc,
    node,
  });
  buildLocation({
    name: `_function_ param name ${node.params[0].name}`,
    colOffset: node.params[0].name.length,
    source: node.original.loc,
    node,
  });

  buildLocation({
    name: `_function_ )`,
    colOffset: ')'.length,
    source: node.original.loc,
    node,
  });

  const result = [];
  result.push('(');
  result.push(node.params[0].name); // USUALLY lots of logic to grab param name
  result.push(')');
  return result;
};
const generateStatement = (node) => {
  const result = Statements[node.type](node);
  return result;
};
const generateFunctionBody = (node) => {
  const result = generateFunctionParams(node);
  return result.concat(generateStatement(node.body)); // if block generateStatement
};
const generateExpression = (node) => {
  const result = Statements[node.type](node);

  return result;
};
