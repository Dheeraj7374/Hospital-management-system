import React, { useState, useEffect } from 'react';
import { billAPI, appointmentAPI } from '../../services/api';
import { MdAdd, MdSearch, MdAttachMoney, MdPendingActions, MdReceipt } from 'react-icons/md';
import BillsTable from './BillsTable';
import CreateBillModal from './CreateBillModal';
import EditBillModal from './EditBillModal';
import InvoiceModal from './InvoiceModal';
import './BillingManagement.css';

function BillingManagement() {
    const [bills, setBills] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [filteredBills, setFilteredBills] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDate, setFilterDate] = useState('all');
    const [loading, setLoading] = useState(true);


    const userRole = localStorage.getItem('role');
    const username = localStorage.getItem('username');


    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterBills();
    }, [bills, searchTerm, filterStatus, filterDate]);

    const loadData = async () => {
        try {
            const [billsRes, appointmentsRes] = await Promise.all([
                billAPI.getAll(),
                appointmentAPI.getAll()
            ]);

            let allBills = billsRes.data;


            if (userRole === 'PATIENT') {



                allBills = allBills.filter(bill =>
                    bill.appointment?.patient?.name?.toLowerCase().includes(username.toLowerCase())
                );
            }

            setBills(allBills);
            setAppointments(appointmentsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading billing data:', error);
            setLoading(false);
        }
    };

    const filterBills = () => {
        let filtered = [...bills];


        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(bill =>
                bill.id.toString().includes(term) ||
                bill.appointment?.patient?.name?.toLowerCase().includes(term) ||
                bill.appointment?.doctor?.name?.toLowerCase().includes(term)
            );
        }


        if (filterStatus !== 'all') {
            filtered = filtered.filter(bill => bill.paymentStatus === filterStatus);
        }


        if (filterDate !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            filtered = filtered.filter(bill => {
                const billDate = new Date(bill.billDate);
                if (filterDate === 'today') {
                    return billDate >= today;
                }
                return true;
            });
        }


        filtered.sort((a, b) => new Date(b.billDate) - new Date(a.billDate));

        setFilteredBills(filtered);
    };

    const handleCreateBill = () => {
        setShowCreateModal(true);
    };

    const handleEditBill = (bill) => {
        setSelectedBill(bill);
        setShowEditModal(true);
    };

    const handleViewInvoice = (bill) => {
        setSelectedBill(bill);
        setShowInvoiceModal(true);
    };

    const handleDeleteBill = async (billId) => {
        if (!window.confirm('Are you sure you want to delete this bill?')) {
            return;
        }

        try {
            await billAPI.delete(billId);
            alert('Bill deleted successfully');
            loadData();
        } catch (error) {
            console.error('Error deleting bill:', error);
            alert('Failed to delete bill');
        }
    };

    const handleModalSuccess = () => {
        loadData();
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowInvoiceModal(false);
    };

    const stats = {
        totalRevenue: bills
            .filter(b => b.paymentStatus === 'PAID')
            .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        pendingAmount: bills
            .filter(b => b.paymentStatus === 'PENDING')
            .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        totalBills: bills.length
    };

    if (loading) {
        return <div className="billing-loading">Loading billing data...</div>;
    }

    return (
        <div className="billing-container">
            { }
            <div className="billing-header">
                <div>
                    <h1>{userRole === 'PATIENT' ? 'My Bills' : 'Billing Management'}</h1>
                    <p>{userRole === 'PATIENT' ? 'View your invoices and payment status' : 'Track revenue and manage patient invoices'}</p>
                </div>
                {userRole !== 'PATIENT' && (
                    <button onClick={handleCreateBill} className="btn-create-bill">
                        <MdAdd /> Create Bill
                    </button>
                )}
            </div>

            { }
            <div className="billing-stats">
                <div className="stat-card revenue">
                    <div className="stat-icon"><MdAttachMoney /></div>
                    <div>
                        <div className="stat-value">€{stats.totalRevenue.toFixed(2)}</div>
                        <div className="stat-label">{userRole === 'PATIENT' ? 'Total Paid' : 'Total Revenue'}</div>
                    </div>
                </div>
                <div className="stat-card pending">
                    <div className="stat-icon"><MdPendingActions /></div>
                    <div>
                        <div className="stat-value">€{stats.pendingAmount.toFixed(2)}</div>
                        <div className="stat-label">Pending Amount</div>
                    </div>
                </div>
                <div className="stat-card total">
                    <div className="stat-icon"><MdReceipt /></div>
                    <div>
                        <div className="stat-value">{stats.totalBills}</div>
                        <div className="stat-label">Total Bills</div>
                    </div>
                </div>
            </div>

            { }
            <div className="billing-filters">
                <div className="search-box">
                    <MdSearch />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>

                <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                </select>
            </div>

            { }
            {filteredBills.length > 0 ? (
                <BillsTable
                    bills={filteredBills}
                    onEdit={userRole === 'PATIENT' ? null : handleEditBill}
                    onDelete={userRole === 'PATIENT' ? null : handleDeleteBill}
                    onViewInvoice={handleViewInvoice}
                    userRole={userRole}
                />
            ) : (
                <div className="no-bills">
                    <p>No bills found</p>
                </div>
            )}

            { }
            {showCreateModal && (
                <CreateBillModal
                    appointments={appointments}
                    existingBills={bills}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleModalSuccess}
                />
            )}

            {showEditModal && selectedBill && (
                <EditBillModal
                    bill={selectedBill}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleModalSuccess}
                />
            )}

            {showInvoiceModal && selectedBill && (
                <InvoiceModal
                    bill={selectedBill}
                    onClose={() => setShowInvoiceModal(false)}
                />
            )}
        </div>
    );
}

export default BillingManagement;
