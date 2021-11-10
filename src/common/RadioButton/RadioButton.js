import React from 'react';
import PropTypes from 'prop-types';

const RadioButton = props => {
  const { id, label, value, name, className, isDisabled, ...restProps } = props;
  return (
    <div className={className}>
      <input type="radio" id={id} name={name} value={value} disabled={isDisabled} {...restProps} />
      <label htmlFor={id} className="radio-button mr-15">
        {label}
      </label>
    </div>
  );
};

RadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
};

RadioButton.defaultProps = {
  label: '',
  className: '',
  isDisabled: false,
};

export default RadioButton;
