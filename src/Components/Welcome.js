import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';

function handleLogout(event) {
    event.preventDefault(); // Prevent the default action of the link
    if (window.confirm('Are you sure you want to log out?')) {
        // Perform logout action here
        console.log('User confirmed logout');
        localStorage.removeItem('userId');
        // Redirect to the login page
        window.location.href = '/login';
    } else {
        console.log('User canceled logout');
        // Add code to handle the cancel action
        alert('You are still logged in.'); // Display a message to the user
    }
}

function NavigationBar() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">Feed Application</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/" onClick={handleLogout}>Home</Nav.Link>
                        <Nav.Link href="/Login" onClick={handleLogout}>LogIn</Nav.Link>
                        <Nav.Link href="/Register" onClick={handleLogout}>Register</Nav.Link>
                        <Nav.Link href="/Logout" onClick={handleLogout}>LogOut</Nav.Link>
                        <Nav.Link href="/AdminLogin">Admin</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;