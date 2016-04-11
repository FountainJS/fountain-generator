'use strict';

const _ = require('lodash');
const falafel = require('falafel');

exports.lit = function lit(strings) {
  return `lit>>${strings[0]}<<lit`;
};

exports.json = function json(value, indent) {
  const js = `var a = ${JSON.stringify(value, null, 2)}`;
  const jsFormatted = falafel(js, {ecmaVersion: 6}, node => {
    if (node.type === 'Literal') {
      const lit = /^lit>>([\s\S]*)<<lit$/.exec(node.value);
      if (lit === null) {
        if (_.isString(node.value)) {
          node.update(`'${node.value}'`);
        }
      } else if (node.parent.type === 'Property' && node.parent.key === node) {
        node.update(`[${lit[1]}]`);
      } else {
        node.update(lit[1]);
      }
    }
    if (node.type === 'Property' && /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(node.key.value)) {
      node.update(`${node.key.value}: ${node.value.source()}`);
    }
  });
  let json = jsFormatted.toString().replace(/^var a = /, '');
  if (_.isNumber(indent)) {
    json = json.replace(/\n(.+)/g, `\n${Array(indent + 1).join(' ')}$1`);
  }
  return json;
};
