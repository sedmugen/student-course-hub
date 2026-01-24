import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const result = await register(name, email, password, role);
        setLoading(false);

        if (result.success) {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData.role === 'ADMIN') navigate('/admin');
            else if (userData.role === 'INSTRUCTOR') navigate('/instructor');
            else navigate('/student');
        } else {
            setError(result.message);
        }
    };

    if (user) {
        if (user.role === 'ADMIN') return <Navigate to="/admin" />;
        if (user.role === 'INSTRUCTOR') return <Navigate to="/instructor" />;
        return <Navigate to="/student" />;
    }

    return (
        <div className="auth-container">
            <Card className="auth-card shadow-lg border-0">
                <Card.Body>
                    <div className="auth-header">
                        <h2 style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>SmartCourseHub</h2>
                        <p className="text-muted mt-2">Create your account</p>
                    </div>

                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="role">
                            <Form.Label>I am a...</Form.Label>
                            <Form.Select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="STUDENT">Student</option>
                                <option value="INSTRUCTOR">Instructor</option>
                                <option value="ADMIN">Administrator</option>
                            </Form.Select>
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 py-2 mb-3" 
                            disabled={loading}
                            style={{ fontSize: '1.1rem' }}
                        >
                            {loading ? 'Creating Account...' : 'Register'}
                        </Button>
                    </Form>
                    
                    <div className="text-center mt-3">
                        <span className="text-muted">Already have an account? </span>
                        <Link to="/login" style={{ fontWeight: 500 }}>Sign in</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default RegisterPage;