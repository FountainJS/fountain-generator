const falafel = require('falafel');

function Literal(content) {
  this.content = content;
}

exports.lit = function lit(string) {
  return new Literal(string[0]);
};

function replacer(key, value) {
  if (value instanceof Literal) {
    return `lit>>${value.content}<<lit`;
  } else {
    return value;
  }
}

exports.json = function json(value) {
  const js = 'var a = ' + JSON.stringify(value, replacer, 2);
  const jsFormatted = falafel(js, { ecmaVersion: 6 }, node => {
    if (node.type === 'Literal') {
      const lit = /^lit>>([\s\S]*)<<lit$/.exec(node.value);
      if (lit === null) {
        node.update(`'${node.value}'`);
      } else {
        node.update(lit[1]);
      }
    }
    if (node.type === 'Property' && /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(node.key.value)) {
      node.update(`${node.key.value}: ${node.value.source()}`);
    }
  });
  return jsFormatted.toString().replace(/^var a = /, '');
};
