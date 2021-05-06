import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './Accordion.scss';

export const AccordionContext = React.createContext();
const Accordion = props => {
  const { children, className } = props;
  const accordion = `accordion-container ${className}`;
  const [openIndex,setOpenIndex] = useState(-1)

  return <div className={accordion}>
    <AccordionContext.Provider value={{openIndex,setOpenIndex}}>{children}</AccordionContext.Provider></div>;
};

Accordion.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,
};

Accordion.defaultProps = {
  className: '',
  children: null,
};

export default Accordion;
