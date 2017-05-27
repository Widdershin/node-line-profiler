/*
 * Copy this file and use it as a starting point for your custom cardinal color theme.
 * Just fill in or change the entries for the tokens you want to color
 * Keep in mind that more specific configurations override less specific ones.
 */

var colors = require('ansicolors');

// Change the below definitions in order to tweak the color theme.
module.exports = {

    'Boolean': {
      'true'   :  undefined
    , 'false'  :  undefined
    , _default :  undefined
    }

  , 'Identifier': {
      _default: colors.white
    }

  , 'Null': {
      _default: undefined
    }

  , 'Numeric': {
      _default: colors.blue
    }

  , 'String': {
      _default: colors.magenta
    }

 , 'Keyword': {
    _default      :  colors.cyan
  }
  , 'Punctuator': {
    _default: colors.magenta
  }

    // line comment
  , Line: {
     _default: undefined
    }

    /* block comment */
  , Block: {
     _default: undefined
    }

  , _default: undefined
};
