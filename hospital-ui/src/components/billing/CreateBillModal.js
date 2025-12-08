import React, { useState, useEffect } from 'react';
import { billAPI } from '../../services/api';
import { MdClose, MdAdd, MdDelete } from 'react-icons/md';
import './CreateBillModal.css';

function CreateBillModal({ appointments, existingBills, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        appointmentId: '',
        consultationFee: '',
        testCharges: '',
        paymentStatus: 'PENDING'
    });

    
    const [testItems, setTestItems] = useState([]);
    const [customTestName, setCustomTestName] = useState('');
    const [customTestCost, setCustomTestCost] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    
    const unbilledAppointments = appointments.filter(apt =>
        !existingBills.some(bill => bill.appointment?.id === apt.id) &&
        apt.status !== 'CANCELLED'
    );

    
    useEffect(() => {
        const totalTestCost = testItems.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
        setFormData(prev => ({ ...prev, testCharges: totalTestCost }));
    }, [testItems]);

    const handleAppointmentChange = (e) => {
        const aptId = e.target.value;
        const apt = appointments.find(a => a.id.toString() === aptId);

        if (apt) {
            setFormData({
                ...formData,
                appointmentId: aptId,
                consultationFee: apt.doctor?.consultationFee || 0,
            });

            
            if (apt.patient?.labTestsRequired) {
                const tests = apt.patient.labTestsRequired.split(',').map(t => t.trim()).filter(Boolean);
                const initialItems = tests.map(test => ({
                    name: test,
                    cost: '' 
                }));
                setTestItems(initialItems);
            } else {
                setTestItems([]);
            }
        } else {
            setFormData({
                ...formData,
                appointmentId: aptId,
                consultationFee: '',
                testCharges: ''
            });
            setTestItems([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTestCostChange = (index, value) => {
        const newItems = [...testItems];
        newItems[index].cost = value;
        setTestItems(newItems);
    };

    const handleAddCustomTest = () => {
        if (customTestName && customTestCost) {
            setTestItems([...testItems, { name: customTestName, cost: customTestCost }]);
            setCustomTestName('');
            setCustomTestCost('');
        }
    };

    const handleRemoveTest = (index) => {
        const newItems = [...testItems];
        newItems.splice(index, 1);
        setTestItems(newItems);
    };

    const calculateTotal = () => {
        const fee = parseFloat(formData.consultationFee) || 0;
        const tests = parseFloat(formData.testCharges) || 0;
        return (fee + tests).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.appointmentId) {
            setError('Please select an appointment');
            return;
        }

        setLoading(true);

        try {
            const billData = {
                appointment: { id: parseInt(formData.appointmentId) },
                consultationFee: parseFloat(formData.consultationFee) || 0,
                testCharges: parseFloat(formData.testCharges) || 0,
                paymentStatus: formData.paymentStatus
            };

            await billAPI.create(billData);
            alert('Bill created successfully!');
            onSuccess();
        } catch (err) {
            console.error('Error creating bill:', err);
            setError('Failed to create bill. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content create-bill-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Bill</h2>
                    <button onClick={onClose} className="close-btn">
                        <MdClose />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bill-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Select Appointment *</label>
                        <select
                            name="appointmentId"
                            value={formData.appointmentId}
                            onChange={handleAppointmentChange}
                        >
                            <option value="">-- Select Appointment --</option>
                            {unbilledAppointments.map(apt => (
                                <option key={apt.id} value={apt.id}>
                                    #{apt.id} - {apt.patient?.name} (Dr. {apt.doctor?.name}) - {new Date(apt.appointmentDate).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                        {unbilledAppointments.length === 0 && (
                            <small className="helper-text warning">No unbilled appointments available</small>
                        )}
                    </div>

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

                    {}
                    <div className="test-breakdown-section">
                        <label className="section-label">Lab Test Breakdown</label>

                        {testItems.length > 0 ? (
                            <div className="test-items-list">
                                {testItems.map((item, index) => (
                                    <div key={index} className="test-item-row">
                                        <span className="test-name">{item.name}</span>
                                        <div className="test-cost-input">
                                            <span>€</span>
                                            <input
                                                type="number"
                                                value={item.cost}
                                                onChange={(e) => handleTestCostChange(index, e.target.value)}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                            />
                                            <button type="button" onClick={() => handleRemoveTest(index)} className="btn-remove-item">
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-tests-msg">No lab tests required for this patient.</p>
                        )}

                        {}
                        <div className="add-custom-test">
                            <input
                                type="text"
                                placeholder="Test Name"
                                value={customTestName}
                                onChange={(e) => setCustomTestName(e.target.value)}
                                className="custom-name-input"
                            />
                            <input
                                type="number"
                                placeholder="Cost"
                                value={customTestCost}
                                onChange={(e) => setCustomTestCost(e.target.value)}
                                className="custom-cost-input"
                            />
                            <button type="button" onClick={handleAddCustomTest} className="btn-add-item">
                                <MdAdd /> Add
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Total Test Charges (€)</label>
                        <input
                            type="number"
                            name="testCharges"
                            value={formData.testCharges}
                            readOnly
                            className="readonly-input"
                        />
                        <small className="helper-text">Calculated from breakdown above</small>
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
                        </select>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading || !formData.appointmentId}>
                            {loading ? 'Creating...' : 'Create Bill'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateBillModal;
