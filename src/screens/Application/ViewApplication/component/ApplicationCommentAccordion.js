import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import AccordionItem from '../../../../common/Accordion/AccordionItem';

const ApplicationCommentAccordion = props => {
  const { applicationDetail } = useSelector(
    ({ application }) => application?.viewApplication ?? {}
  );

  const { index } = props;

  const { comment } = useMemo(() => applicationDetail ?? {}, [applicationDetail]);

  return (
    <>
      <AccordionItem index={index} header="Comment" suffix="expand_more">
        <div className="common-accordion-item-content-box">
          <span className="font-primary mt-5">{comment ?? 'No Comment'}</span>
        </div>
      </AccordionItem>
    </>
  );
};

export default React.memo(ApplicationCommentAccordion);

ApplicationCommentAccordion.propTypes = {
  index: PropTypes.number.isRequired,
};
