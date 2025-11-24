import React, { useState } from 'react';
import { billAPI } from '../../services/api';
import { MdClose } from 'react-icons/md';
import './EditBillModal.css';

function EditBillModal({ bill, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        consultationFee: bill.consultationFee || 0,
        testCharges: bill.testCharges || 0,
        paymentStatus: bill.paymentStatus || 'PENDING'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateTotal = () => {
        const fee = parseFloat(formData.consultationFee) || 0;
        const tests = parseFloat(formData.testCharges) || 0;
        return (fee + tests).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const billData = {
                consultationFee: parseFloat(formData.consultationFee) || 0,
                testCharges: parseFloat(formData.testCharges) || 0,
                paymentStatus: formData.paymentStatus
            };

            await billAPI.update(bill.id, billData);
            alert('Bill updated successfully!');
            onSuccess();
        } catch (err) {
            console.error('Error updating bill:', err);
            setError('Failed to update bill. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content edit-bill-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Bill #{bill.id}</h2>
                    <button onClick={onClose} className="close-btn">
                        <MdClose />
                    </button>
                </div>

                <div className="bill-info-summary">
                    <p><strong>Patient:</strong> {bill.appointment?.patient?.name}</p>
                    <p><strong>Doctor:</strong> {bill.appointment?.doctor?.name}</p>
                    <p><strong>Date:</strong> {new Date(bill.billDate).toLocaleDateString()}</p>
                </div>

                <form onSubmit={handleSubmit} className="bill-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Consultation Fee (€)</label>
                            <input
                                type="number"
                                name="consultationFee"
                                value={formData.consultationFee}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label>Test Charges (€)</label>
                            <input
                                type="number"
                                name="testCharges"
                                value={formData.testCharges}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="total-section">
                        <span>Total Amount:</span>
                        <span className="total-value">€{calculateTotal()}</span>
                    </div>

                    <div className="form-group">
                        <label>Payment Status</label>
                        <select
                            name="paymentStatus"
                            value={formData.paymentStatus}
                            onChange={handleChange}
                        >
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBillModal;
