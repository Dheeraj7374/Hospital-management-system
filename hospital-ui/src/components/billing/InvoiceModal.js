import React from 'react';
import { MdClose, MdPrint } from 'react-icons/md';
import './InvoiceModal.css';

function InvoiceModal({ bill, onClose }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content invoice-modal" onClick={(e) => e.stopPropagation()}>
                <div className="invoice-actions no-print">
                    <button onClick={handlePrint} className="btn-print">
                        <MdPrint /> Print Invoice
                    </button>
                    <button onClick={onClose} className="close-btn">
                        <MdClose />
                    </button>
                </div>

                <div className="invoice-container" id="printable-invoice">
                    {/* Header */}
                    <div className="invoice-header">
                        <div className="hospital-branding">
                            <h1>City Hospital</h1>
                            <p>123 Medical Center Drive</p>
                            <p>New York, NY 10001</p>
                            <p>Phone: (555) 123-4567</p>
                        </div>
                        <div className="invoice-meta">
                            <h2>INVOICE</h2>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Invoice #:</td>
                                        <td><strong>INV-{bill.id}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Date:</td>
                                        <td>{new Date(bill.billDate).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td>Status:</td>
                                        <td><span className={`status-text ${bill.paymentStatus.toLowerCase()}`}>{bill.paymentStatus}</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <hr className="divider" />

                    {/* Patient & Doctor Info */}
                    <div className="invoice-details">
                        <div className="detail-box">
                            <h3>Bill To:</h3>
                            <p><strong>{bill.appointment?.patient?.name}</strong></p>
                            <p>Patient ID: #{bill.appointment?.patient?.id}</p>
                            <p>Contact: {bill.appointment?.patient?.contactNumber}</p>
                        </div>
                        <div className="detail-box">
                            <h3>Doctor:</h3>
                            <p><strong>Dr. {bill.appointment?.doctor?.name}</strong></p>
                            <p>{bill.appointment?.doctor?.specialization}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="invoice-items">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th className="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Consultation Fee</td>
                                <td className="text-right">€{bill.consultationFee?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Lab Tests & Other Charges</td>
                                <td className="text-right">€{bill.testCharges?.toFixed(2)}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="total-row">
                                <td>Total Amount</td>
                                <td className="text-right">€{bill.totalAmount?.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Footer */}
                    <div className="invoice-footer">
                        <p>Thank you for choosing City Hospital.</p>
                        <p className="small-text">This is a computer-generated invoice and does not require a signature.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvoiceModal;
