package com.HMS.Hospitalmanagement.billing;

import com.HMS.Hospitalmanagement.appointment.Appointment;
import com.HMS.Hospitalmanagement.appointment.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final AppointmentRepository appointmentRepository;

    @Autowired
    public BillService(BillRepository billRepository, AppointmentRepository appointmentRepository) {
        this.billRepository = billRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Bill createBill(Bill bill) {
        
        if (bill.getAppointment() != null && bill.getAppointment().getId() != null) {
            Appointment appointment = appointmentRepository.findById(bill.getAppointment().getId()).orElse(null);
            bill.setAppointment(appointment);
        }
        
        if (bill.getPaymentStatus() == null) {
            bill.setPaymentStatus(Bill.PaymentStatus.PENDING);
        }
        
        if (bill.getBillDate() == null) {
            bill.setBillDate(LocalDateTime.now());
        }
        
        bill.calculateTotal();
        return billRepository.save(bill);
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }

    public Optional<Bill> getBillByAppointmentId(Long appointmentId) {
        return billRepository.findByAppointmentId(appointmentId);
    }

    public Bill updateBill(Long id, Bill billDetails) {
        return billRepository.findById(id).map(bill -> {
            if (billDetails.getConsultationFee() != null) {
                bill.setConsultationFee(billDetails.getConsultationFee());
            }
            if (billDetails.getTestCharges() != null) {
                bill.setTestCharges(billDetails.getTestCharges());
            }
            if (billDetails.getPaymentStatus() != null) {
                bill.setPaymentStatus(billDetails.getPaymentStatus());
            }
            
            bill.calculateTotal();
            return billRepository.save(bill);
        }).orElse(null);
    }

    public boolean deleteBill(Long id) {
        if (billRepository.existsById(id)) {
            billRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
