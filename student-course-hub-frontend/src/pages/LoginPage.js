import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
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
                        <p className="text-muted mt-2">Sign in to continue</p>
                    </div>

                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4" controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="py-2"
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="py-2"
                            />
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 py-2 mb-3" 
                            disabled={loading}
                            style={{ fontSize: '1.1rem' }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </Form>
                    
                    <div className="text-center mt-4">
                        <span className="text-muted">New here? </span>
                        <Link to="/register" style={{ fontWeight: 500 }}>Create an account</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default LoginPage;