import { useMemo, useState } from 'react';
import Tab from '../../../common/Tab/Tab';
import ClaimsDocumentsTab from './ClaimsDocumentsTab';

const CLAIMS_TABS_CONSTANTS = [
  { label: 'Documents', component: <ClaimsDocumentsTab />, name: 'document' },
];

const ClaimsTabContainer = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabActive = index => {
    // setViewDebtorActiveTabIndex(index);
    setActiveTabIndex(index);
  };

  const finalTabs = useMemo(() => {
    const tabs = [];
    CLAIMS_TABS_CONSTANTS.forEach(tab => {
      tabs.push(tab);
    });
    return tabs ?? [];
  }, [CLAIMS_TABS_CONSTANTS]);

  // tabs end
  return (
    <>
      <Tab
        tabs={finalTabs.map(tab => tab?.label)}
        tabActive={tabActive}
        activeTabIndex={activeTabIndex}
        className="mt-15"
      />
      <div className="common-white-container">{finalTabs?.[activeTabIndex]?.component}</div>
    </>
  );
};

export default ClaimsTabContainer;
