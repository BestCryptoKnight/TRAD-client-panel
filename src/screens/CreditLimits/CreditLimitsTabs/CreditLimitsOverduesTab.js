import React from "react";
import BigInput from "../../../common/BigInput/BigInput";
import IconButton from "../../../common/IconButton/IconButton";
import Table from "../../../common/Table/Table";
import Pagination from "../../../common/Pagination/Pagination";
import Loader from "../../../common/Loader/Loader";
import Button from "../../../common/Button/Button";

const CreditLimitsOverduesTab = () => {
    return (<>
        <div className="tab-content-header-row">
            <div className="tab-content-header">Overdues</div>

            <div className="buttons-row">
                <BigInput
                     prefix="search" prefixClass="font-placeholder" placeholder="Search here"
                        borderClass="company-profile-policies-search"
                />
                <IconButton
                        buttonType="primary"
                        title="format_line_spacing"
                />
                <Button buttonType="success" title="Add" />
            </div>
        </div>

            <div className="tab-table-container">
                <Table
                        align="left"
                        valign="center"
                        tableClass="white-header-table"
                />
            </div>
            <Pagination
                    className="common-list-pagination"
            />
    </>)
}

export default CreditLimitsOverduesTab;


