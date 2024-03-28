import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';

function handleLogout() {
    if (window.confirm('Are you sure you want to log out?')) {
        // Perform logout action here
        console.log('User confirmed logout');
    } else {
        // Do nothing if user cancels
        console.log('User canceled logout');
    }
}

function NavigationBar() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/" onClick={handleLogout}>Feed Application</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/" onClick={handleLogout}>Home</Nav.Link>
                        <Nav.Link href="/Login" onClick={handleLogout}>LogIn</Nav.Link>
                        <Nav.Link href="/Register" onClick={handleLogout}>Register</Nav.Link>
                        <Nav.Link href="/Login" onClick={handleLogout}>LogOut</Nav.Link>
                        <Nav.Link href="/AdminPost">Admin</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
