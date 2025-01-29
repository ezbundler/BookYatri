import React from "react";
import PropTypes from "prop-types";

const Button = ({ title, onClick, className, disabled, children, keyProp, type }) => {
  return (
    <button
      key={keyProp}
      type={type}
      onClick={onClick}
      className={` ${className}`}
      disabled={disabled}
    >
      {title}
      {children}
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  keyProp: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

Button.defaultProps = {
  className: "",
  disabled: false,
  children: null,
  keyProp: undefined,
  type: "button",
};

export default Button;
