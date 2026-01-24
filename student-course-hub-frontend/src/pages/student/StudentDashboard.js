import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { studentAPI } from '../../api/axiosClient';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentDashboard = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [attendanceSummary, setAttendanceSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [enrollmentsRes, attendanceRes] = await Promise.all([
                    studentAPI.getEnrollments(),
                    studentAPI.getAttendanceSummary()
                ]);
                setEnrollments(enrollmentsRes.data.data || []);
                setAttendanceSummary(attendanceRes.data.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <Container>
            <div className="mb-5">
                <h2 className="mb-2 fw-bold" style={{ color: 'var(--text-primary)' }}>Student Dashboard</h2>
                <p className="text-muted">Track your academic journey</p>
            </div>

            <Row className="mb-4">
                <Col md={4} className="mb-4">
                    <Card className="h-100 card-pastel-blue border-0 shadow-sm">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <div>
                                <Card.Title className="mb-0">Enrolled Courses</Card.Title>
                                <h1 className="display-4 fw-bold mt-2 mb-0">{enrollments.length}</h1>
                            </div>
                            <div className="mt-3">
                                <Link to="/student/enrollments" className="btn btn-sm btn-light text-primary rounded-pill fw-bold">
                                    View Courses
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="h-100 card-pastel-green border-0 shadow-sm">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <div>
                                <Card.Title className="mb-0">Grades & GPA</Card.Title>
                                <div className="mt-2">
                                    <i className="bi bi-journal-check display-4"></i>
                                </div>
                            </div>
                            <div className="mt-3">
                                <Link to="/student/grades" className="btn btn-sm btn-light text-success rounded-pill fw-bold">
                                    Check Grades
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="h-100 card-pastel-orange border-0 shadow-sm">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <div>
                                <Card.Title className="mb-0">Academic Progress</Card.Title>
                                <div className="mt-2">
                                    <i className="bi bi-graph-up display-4"></i>
                                </div>
                            </div>
                            <div className="mt-3">
                                <Link to="/student/progress" className="btn btn-sm btn-light text-secondary rounded-pill fw-bold" style={{color: '#e37400'}}>
                                    View Progress
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={7} className="mb-4">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Current Courses</h5>
                            <Link to="/student/courses" className="btn btn-sm btn-outline-primary">Browse New</Link>
                        </Card.Header>
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-0 ps-4">Course</th>
                                        <th className="border-0">Instructor</th>
                                        <th className="border-0">Schedule</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrollments.map(enrollment => (
                                        <tr key={enrollment.id}>
                                            <td className="ps-4">
                                                <div className="fw-bold">{enrollment.courseCode}</div>
                                                <div className="text-muted small">{enrollment.courseTitle}</div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-light rounded-circle p-1 me-2 text-center" style={{width: '30px', height: '30px'}}>
                                                        <span className="small fw-bold text-secondary">{enrollment.instructorName?.charAt(0)}</span>
                                                    </div>
                                                    {enrollment.instructorName}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="small text-muted">{enrollment.schedule || 'TBA'}</div>
                                                <div className="small text-muted">{enrollment.room || 'TBA'}</div>
                                            </td>
                                        </tr>
                                    ))}
                                    {enrollments.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4 text-muted">
                                                Not enrolled in any courses yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>
                <Col lg={5} className="mb-4">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Header className="bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold">Attendance Overview</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover className="align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="border-0 ps-4">Course</th>
                                            <th className="border-0 text-end pe-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceSummary.map((summary, index) => (
                                            <tr key={index}>
                                                <td className="ps-4">
                                                    <div className="fw-bold">{summary.courseCode}</div>
                                                    <div className="small text-muted mb-1">
                                                        <span className="text-success">{summary.presentCount} Took Class</span> • <span className="text-danger">{summary.absentCount} Missed Class</span>
                                                    </div>
                                                    <ProgressBar 
                                                        now={summary.attendancePercentage} 
                                                        variant={summary.attendancePercentage >= 75 ? 'success' : 'danger'} 
                                                        style={{height: '4px', width: '80%'}} 
                                                    />
                                                </td>
                                                <td className="text-end pe-4">
                                                    <span className={`fw-bold ${summary.attendancePercentage >= 75 ? 'text-success' : 'text-danger'}`}>
                                                        {summary.attendancePercentage?.toFixed(0)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {attendanceSummary.length === 0 && (
                                            <tr>
                                                <td colSpan="2" className="text-center py-4 text-muted">
                                                    No attendance records found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default StudentDashboard;