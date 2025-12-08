import React from 'react';
import { MdEdit, MdDelete, MdDescription, MdCheckCircle } from 'react-icons/md';
import './BillsTable.css';

function BillsTable({ bills, onEdit, onDelete, onViewInvoice, userRole }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString() + ' ' +
            new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bills-table-container">
            <table className="bills-table">
                <thead>
                    <tr>
                        <th>Bill ID</th>
                        <th>Date</th>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bills.map(bill => (
                        <tr key={bill.id}>
                            <td className="bill-id-cell">#{bill.id}</td>
                            <td>{formatDate(bill.billDate)}</td>
                            <td className="patient-name-cell">
                                {bill.appointment?.patient?.name || 'Unknown Patient'}
                            </td>
                            <td>{bill.appointment?.doctor?.name || 'Unknown Doctor'}</td>
                            <td className="amount-cell">€{bill.totalAmount?.toFixed(2)}</td>
                            <td>
                                <span className={`status-badge ${bill.paymentStatus?.toLowerCase()}`}>
                                    {bill.paymentStatus}
                                </span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button
                                        onClick={() => onViewInvoice(bill)}
                                        className="btn-action view"
                                        title="View Invoice"
                                    >
                                        <MdDescription />
                                    </button>
                                    {userRole !== 'PATIENT' && (
                                        <>
                                            <button
                                                onClick={() => onEdit(bill)}
                                                className="btn-action edit"
                                                title="Edit"
                                            >
                                                <MdEdit />
                                            </button>
                                            <button
                                                onClick={() => onDelete(bill.id)}
                                                className="btn-action delete"
                                                title="Delete"
                                            >
                                                <MdDelete />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BillsTable;
