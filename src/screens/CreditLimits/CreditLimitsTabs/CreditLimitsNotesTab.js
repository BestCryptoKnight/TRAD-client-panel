import React from "react";
import BigInput from "../../../common/BigInput/BigInput";
import Checkbox from "../../../common/Checkbox/Checkbox";
import IconButton from "../../../common/IconButton/IconButton";
import Button from "../../../common/Button/Button";
import Table from "../../../common/Table/Table";
import Pagination from "../../../common/Pagination/Pagination";
import Loader from "../../../common/Loader/Loader";

const CreditLimitsNotesTab = () => {
    return (<>
    {/*    <div className="tab-content-header-row">
            <div className="tab-content-header">Tasks</div>

            <div className="buttons-row">
                <BigInput ref={searchInputRef}
                          prefix="search" prefixClass="font-placeholder" placeholder="Search here"
                          borderClass="tab-search mr-15" onKeyUp={checkIfEnterKeyPressed}
                />
                <Checkbox
                        title="Show Completed"
                        checked={isCompletedChecked}
                        onChange={() => setIsCompletedChecked(!isCompletedChecked)}
                />
                <IconButton
                        buttonType="primary"
                        title="format_line_spacing"
                        onClick={toggleCustomFieldModal}
                />
                <Button buttonType="success" title="Add"/>
            </div>
        </div>
        {!isLoading && docs ? (docs.length > 0 ? <>
            <div className="tab-table-container">
                <Table
                        align="left"
                        valign="center"
                        tableClass="white-header-table"
                        docs={docs}
                        headers={headers}
                />
            </div>
            <Pagination
                    className="common-list-pagination"
            /></>:<div className="no-record-found">No record found</div>):<Loader/>
        }*/}
    </>)
}

export default CreditLimitsNotesTab
