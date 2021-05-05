import React, {useEffect, useMemo} from 'react';
import './EmployeeList.scss';
import IconButton from "../../../common/IconButton/IconButton";
import Table from "../../../common/Table/Table";
import Pagination from "../../../common/Pagination/Pagination";
import Loader from "../../../common/Loader/Loader";
import {useDispatch, useSelector} from "react-redux";
import {getEmployeeList} from "../redux/EmployeeAction";

const EmployeeList = () => {
    const dispatch = useDispatch();
    const employeeListWithPageData = useSelector(({ employee }) => employee?.employeeList ?? {});
    const { total, pages, page, limit, docs, headers, isLoading } = useMemo(() => employeeListWithPageData, [
        employeeListWithPageData,
    ]);
    useEffect(() => {
        dispatch(getEmployeeList());
    },[])
    return <>
        <div className="page-header">
            <div className="page-header-name">Employee List</div>
            {isLoading && docs && (
                    <div className="page-header-button-container">
                        <IconButton
                                buttonType="secondary"
                                title="filter_list"
                                className="mr-10"
                                buttonTitle="Click to apply filters on employee list"
                        />
                        <IconButton
                                buttonType="primary"
                                title="format_line_spacing"
                                className="mr-10"
                                buttonTitle="Click to select custom fields"
                        />
                    </div>

            )}
        </div>
        {docs && !isLoading ? (docs.length > 0 ?
                <>
                    <div className="common-list-container">
                        <Table
                                align="left"
                                valign="center"
                                tableClass="main-list-table"
                                data={docs}
                                headers={headers}
                                recordSelected={() => console.log('Record selected')}
                                recordActionClick={() => console.log('Record action clicked')}
                                rowClass="cursor-pointer"
                                haveActions
                        />
                    </div>
                    <Pagination
                            className="common-list-pagination"
                            total={total}
                            pages={pages}
                            page={page}
                            limit={limit}
                    />
                </> : <div className="no-record-found">No record found</div>
        ) : (
                <Loader />
        )}
    </>
}

export default EmployeeList;
