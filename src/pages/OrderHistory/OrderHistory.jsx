import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { latestOrder } from '../../Service/OrderService';
import './OrderHistory.css';

const PAGE_SIZE = 20;

const OrderHistory = () => {
    const [orders, setOrders]       = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [page, setPage]           = useState(0);          // current page (0-indexed)
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await latestOrder(page, PAGE_SIZE);
                const pageData = response.data;
                setOrders(pageData.content);           // actual order rows
                setTotalPages(pageData.totalPages);
                setTotalElements(pageData.totalElements);
            } catch (error) {
                console.error(error);
                setError('An error occurred while fetching orders.');
                toast.error('Could not fetch orders.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [page]); // re-runs whenever the user changes page

    const formatItems = (items) =>
        items.map((item) => `${item.name} x ${item.quantity}`).join(', ');

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    // ── Loading skeleton ────────────────────────────────────────────────────
    if (loading) {
        return <div className="text-center py-4 text-light">Loading Orders...</div>;
    }

    // ── Error state ─────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="text-center py-4">
                <p className="text-danger">{error}</p>
                <button className="btn btn-outline-light btn-sm" onClick={() => setPage(0)}>
                    Retry
                </button>
            </div>
        );
    }

    // ── Empty state ─────────────────────────────────────────────────────────
    if (orders.length === 0) {
        return <div className="text-center py-4 text-light">No orders found</div>;
    }

    // ── Helpers ─────────────────────────────────────────────────────────────
    const startRecord = page * PAGE_SIZE + 1;
    const endRecord   = Math.min((page + 1) * PAGE_SIZE, totalElements);

    return (
        <div className="orders-history-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-light mb-0">All Orders</h2>
                <small className="text-muted">
                    Showing {startRecord}–{endRecord} of {totalElements} orders
                </small>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Order Id</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.orderId}>
                                <td>{order.orderId}</td>
                                <td>
                                    {order.customerName}
                                    <br />
                                    <small className="text-muted">{order.phoneNumber}</small>
                                </td>
                                <td>{formatItems(order.items)}</td>
                                <td>₹{order.grandTotal}</td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    <span className={`badge ${
                                        order.paymentDetails?.status === 'COMPLETED'
                                            ? 'bg-success'
                                            : 'bg-warning text-dark'
                                    }`}>
                                        {order.paymentDetails?.status || 'PENDING'}
                                    </span>
                                </td>
                                <td>{formatDate(order.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination controls ─────────────────────────────────────── */}
            {totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-3">
                    <ul className="pagination pagination-sm">

                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(0)}>
                                «
                            </button>
                        </li>

                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(p => p - 1)}>
                                ‹
                            </button>
                        </li>

                        {/* Show up to 5 page numbers centered around current page */}
                        {Array.from({ length: totalPages }, (_, i) => i)
                            .filter(i => Math.abs(i - page) <= 2)
                            .map(i => (
                                <li key={i} className={`page-item ${i === page ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(i)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}

                        <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(p => p + 1)}>
                                ›
                            </button>
                        </li>

                        <li className={`page-item ${page >= totalPages - 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(totalPages - 1)}>
                                »
                            </button>
                        </li>

                    </ul>
                </nav>
            )}
        </div>
    );
};

export default OrderHistory;
