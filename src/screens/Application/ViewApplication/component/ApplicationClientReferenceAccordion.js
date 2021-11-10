import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import AccordionItem from '../../../../common/Accordion/AccordionItem';

const ApplicationClientReferenceAccordion = props => {
  const { applicationDetail } = useSelector(
    ({ application }) => application?.viewApplication ?? {}
  );

  const { index } = props;

  const { clientReference } = useMemo(() => applicationDetail ?? {}, [applicationDetail]);

  return (
    <>
      <AccordionItem index={index} header="Client Reference" suffix="expand_more">
        <div className="common-accordion-item-content-box">
          <span className="font-primary mt-5">{clientReference ?? 'No Client Reference'}</span>
        </div>
      </AccordionItem>
    </>
  );
};

export default React.memo(ApplicationClientReferenceAccordion);

ApplicationClientReferenceAccordion.propTypes = {
  index: PropTypes.number.isRequired,
};
