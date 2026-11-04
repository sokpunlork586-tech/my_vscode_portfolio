const React = require('react');

module.exports = {
  Tooltip: function Tooltip() {
    return null;
  },
  TooltipProvider: function TooltipProvider({ children }) {
    return React.createElement(React.Fragment, null, children);
  },
};

