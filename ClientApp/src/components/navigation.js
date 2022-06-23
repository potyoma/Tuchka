import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloud } from '@fortawesome/free-solid-svg-icons'
import { Nav, Navbar, NavbarBrand, Collapse, NavItem, NavbarText, NavbarToggler, NavLink } from 'reactstrap';

const Navigation = () => {
    const authorized = localStorage.getItem('user')

    return (
        <Navbar
            color="dark"
            dark
            expand="md"
            fixed="top"
            className='px-4' >
            <NavbarBrand href="/">
                <FontAwesomeIcon icon={faCloud} />
                Tuchka
            </NavbarBrand>
            <NavbarToggler onClick={function noRefCheck() { }} />
            <Collapse navbar>
                <Nav
                    className="me-auto"
                    navbar >
                    {authorized &&
                        <NavItem>
                            <NavLink href="/myfiles">
                                My Files
                            </NavLink>
                        </NavItem>}
                    <NavItem>
                        <NavLink href="/login" className="nav-link">
                            {!authorized && "Login"}
                        </NavLink>
                    </NavItem>
                </Nav>
                <NavbarText>
                    <NavLink href='/login'>
                        {authorized && "Logout"}
                    </NavLink>
                </NavbarText>
            </Collapse>
        </Navbar>
    );
};
export default Navigation;