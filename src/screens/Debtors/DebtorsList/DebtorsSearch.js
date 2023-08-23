import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useOnClickOutside } from '../../../hooks/UserClickOutsideHook';
import { searchGlobalDebtors, updateEditDebtorField } from '../redux/DebtorsAction';
import { DEBTORS_REDUX_CONSTANTS } from '../redux/DebtorsReduxConstants';
import Button from '../../../common/Button/Button';
import { useModulePrivileges } from '../../../hooks/userPrivileges/useModulePrivilegesHook';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';

const DebtorsSearch = () => {
  const history = useHistory();
  const headerSearchRef = useRef();
  const globalSearchInputRef = useRef();
  const dispatch = useDispatch();
  const [headerSearchFocused, setHeaderSearchFocused] = useState(false);
  const [searchedString, setSearchedString] = useState('');
  const [searchStart, setSearchStart] = useState(false);
  const [cursor, setCursor] = useState(-1);

  const globalSearchResult = useSelector(
    ({ debtorsManagement }) => debtorsManagement?.globalDebtorsList ?? []
  );
  const { gloabalSearchLoaderAction } = useSelector(
    ({ generalLoaderReducer }) => generalLoaderReducer ?? false
  );
  const searchOnFocus = () => setHeaderSearchFocused(true);
  const searchOutsideClick = () => {
    setSearchStart(false);
    setHeaderSearchFocused(false);
  };
  useOnClickOutside(headerSearchRef, searchOutsideClick);

  const isDebtorUpdatable = useModulePrivileges(SIDEBAR_NAMES.DEBTOR).hasWriteAccess;

  const target = document.getElementsByClassName('header-search-results')?.[0];

  const onSearchEnterKeyPress = useCallback(
    e => {
      if (globalSearchResult?.length > 0 && searchedString.toString().trim().length > 0) {
        if (e.keyCode === 40) {
          setHeaderSearchFocused(false);
          if (cursor === -1 || cursor >= globalSearchResult?.length - 1) {
            setCursor(0);
            target.scrollTop = 0;
          } else {
            setCursor(prev => prev + 1);
            target.scrollTop += 35;
          }
        }
        if (e.keyCode === 38) {
          setHeaderSearchFocused(false);
          setCursor(prev => prev - 1);
          target.scrollTop -= 35;
          if (cursor <= 0) {
            setCursor(globalSearchResult?.length - 1);
            target.scrollTop = target.scrollHeight;
          }
        }
      }
      if (e.keyCode === 13) {
        const { value } = e?.target;
        if (value?.trim()?.length > 0 && headerSearchFocused) {
          setSearchStart(true);
          dispatch(searchGlobalDebtors(value));
        } else {
          const { _id } = globalSearchResult?.[cursor];
          // handleGlobalSearchSelect(history, module, _id, hasSubModule, subModule, status);
          history.replace(`debtors/debtor/view/${_id}`);
          setSearchStart(false);
          setSearchedString('');
          setCursor(0);
        }
      }
    },
    [setSearchStart, cursor, globalSearchResult?.length, headerSearchFocused, target]
  );

  const onSearchButtonClick = () => {
    const { value } = globalSearchInputRef?.current;
    if (value?.trim()?.length > 0 && headerSearchFocused) {
      setSearchStart(true);
      dispatch(searchGlobalDebtors(value));
    }
  };

  const handleOnSearchChange = useCallback(e => {
    setSearchedString(e?.target?.value);
    setHeaderSearchFocused(true);
    if (e?.target?.value?.trim()?.length === 0) {
      setSearchStart(false);
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.CLEAR_GLOBAL_DEBTORS_LIST,
      });
    }
  }, []);

  const onSearchResultSelection = useCallback(searchResult => {
    const { _id } = searchResult;
    // handleGlobalSearchSelect(history, module, _id, hasSubModule, subModule, status);
    history.replace(`debtors/debtor/view/${_id}`);
  }, []);

  const generateDebtorClick = useCallback(() => {
    dispatch(
      updateEditDebtorField('company', 'country', {
        label: 'Australia',
        name: 'country',
        value: 'AUS',
      })
    );
    history.push(`/debtors/generate/`);
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-header-name">Debtor List</div>
        <div className="page-header-button-container">
          {isDebtorUpdatable && (
            <Button title="Add Debtor" buttonType="success" onClick={generateDebtorClick} />
          )}
        </div>
      </div>

      <div className="global-debtors-search-container">
        <div
          ref={headerSearchRef}
          className={`global-debtors-search-width ${headerSearchFocused && ''} ${
            searchStart && 'got-search-results'
          }`}
        >
          <div className="global-debtors-search-content">
            <input
              ref={globalSearchInputRef}
              type="text"
              placeholder="Search Here"
              onFocus={searchOnFocus}
              onKeyDown={onSearchEnterKeyPress}
              onChange={handleOnSearchChange}
              value={searchedString}
            />
            <span className="" onClick={onSearchButtonClick}>
              Search
            </span>
          </div>
          {searchStart && (
            <div className="global-debtors-search-results">
              {gloabalSearchLoaderAction ? (
                <div className="global-search-loading-text">
                  Loading
                  <span className="loader__dot">.</span>
                  <span className="loader__dot">.</span>
                  <span className="loader__dot">.</span>
                </div>
              ) : (
                [
                  searchStart && globalSearchResult?.length > 0 ? (
                    <ul>
                      {globalSearchResult?.map((searchResult, index) => (
                        <li
                          className={index === cursor && 'header-active-search'}
                          onClick={() => {
                            onSearchResultSelection(searchResult);
                            setSearchStart(false);
                            setSearchedString('');
                            setCursor(0);
                          }}
                        >
                          <span className="gs-value">{searchResult?.title}</span>
                          <span className="gs-tag">
                            {searchResult?.module?.charAt(0)?.toUpperCase() +
                              searchResult?.module?.substring(1)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="ml-10">No Record Found</div>
                  ),
                ]
              )}
              <div className="got-dummy-bottom-block" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default DebtorsSearch;
