import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = props => {
  const { title, className, isDisabled, ...restProps } = props;
  const checkboxClasses = `d-flex align-center ${className}`;
  return (
    <div className={checkboxClasses}>
      <label className="checkbox-container" style={{ paddingLeft: title ? '35px' : '24px' }}>
        {title}
        <input type="checkbox" {...restProps} disabled={isDisabled} />
        <span className="checkmark" />
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
};

Checkbox.defaultProps = {
  title: '',
  className: '',
  isDisabled: false,
};
export default Checkbox;
