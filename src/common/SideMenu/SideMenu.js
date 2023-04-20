import { NavLink } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import logo from '../../assets/images/logo.svg';
import { SIDEBAR_URLS } from '../../constants/SidebarConstants';
import { getAllUserPrivileges } from '../../screens/Users/redux/UserManagementAction';
import { SESSION_VARIABLES } from '../../constants/SessionStorage';

const SideMenu = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUserPrivileges());
  }, [SESSION_VARIABLES.USER_TOKEN]);
  return (
    <div className="side-menu-container">
      <div className="side-menu-logo">
        <img alt="TRAD" src={logo} />
      </div>
      <div className="menu-container">
        {SIDEBAR_URLS.map(item => (
          <NavLink className="menu" to={item.url} replace>
            <span className="material-icons-round">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
