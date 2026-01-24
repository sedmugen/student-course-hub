import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin, isInstructor, isStudent } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (isAdmin) return '/admin';
        if (isInstructor) return '/instructor';
        if (isStudent) return '/student';
        return '/';
    };

    return (
        <BootstrapNavbar expand="lg" className="navbar-custom mb-4" sticky="top">
            <Container>
                <BootstrapNavbar.Brand as={Link} to={getDashboardLink()}>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Smart</span>CourseHub
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    {user && (
                        <>
                            <Nav className="me-auto">
                                {isAdmin && (
                                    <>
                                        <Nav.Link as={Link} to="/admin" active={location.pathname === '/admin'}>Dashboard</Nav.Link>
                                        <Nav.Link as={Link} to="/admin/users" active={location.pathname.includes('/admin/users')}>Users</Nav.Link>
                                        <Nav.Link as={Link} to="/admin/courses" active={location.pathname.includes('/admin/courses')}>Courses</Nav.Link>
                                        <Nav.Link as={Link} to="/admin/sections" active={location.pathname.includes('/admin/sections')}>Sections</Nav.Link>
                                    </>
                                )}
                                {isInstructor && (
                                    <>
                                        <Nav.Link as={Link} to="/instructor" active={location.pathname === '/instructor'}>Dashboard</Nav.Link>
                                        <Nav.Link as={Link} to="/instructor/sections" active={location.pathname.includes('/instructor/sections')}>My Sections</Nav.Link>
                                        <Nav.Link as={Link} to="/instructor/assignments" active={location.pathname.includes('/instructor/assignments')}>Assignments</Nav.Link>
                                    </>
                                )}
                                {isStudent && (
                                    <>
                                        <Nav.Link as={Link} to="/student" active={location.pathname === '/student'}>Dashboard</Nav.Link>
                                        <Nav.Link as={Link} to="/student/courses" active={location.pathname.includes('/student/courses')}>Available Courses</Nav.Link>
                                        <Nav.Link as={Link} to="/student/enrollments" active={location.pathname.includes('/student/enrollments')}>My Courses</Nav.Link>
                                        <Nav.Link as={Link} to="/student/grades" active={location.pathname.includes('/student/grades')}>Grades</Nav.Link>
                                        <Nav.Link as={Link} to="/student/progress" active={location.pathname.includes('/student/progress')}>Progress</Nav.Link>
                                    </>
                                )}
                            </Nav>
                            <Nav>
                                <Nav.Item className="d-flex align-items-center me-3 text-muted">
                                    <span className="me-1">Hello,</span>
                                    <strong>{user.name}</strong>
                                </Nav.Item>
                                <Button variant="outline-primary" size="sm" onClick={handleLogout} className="px-4">
                                    Logout
                                </Button>
                            </Nav>
                        </>
                    )}
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;