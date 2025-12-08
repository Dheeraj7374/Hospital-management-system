import React, { useState, useEffect } from 'react';
import { MdSearch, MdClose, MdCheck } from 'react-icons/md';
import './LabTestSelector.css';

const AVAILABLE_TESTS = [
    
    "Complete Blood Count (CBC)",
    "Lipid Profile",
    "Liver Function Test (LFT)",
    "Kidney Function Test (KFT)",
    "Thyroid Profile (T3, T4, TSH)",
    "Blood Sugar (Fasting)",
    "Blood Sugar (Post Prandial)",
    "HbA1c",
    "Hemoglobin",
    "Iron Profile",
    "Vitamin D Total",
    "Vitamin B12",
    "Electrolytes (Na, K, Cl)",
    "Calcium",
    "Uric Acid",
    "ESR",

    
    "Dengue NS1 Antigen",
    "Typhoid (Widal)",
    "Malaria Parasite",
    "HIV 1 & 2 Antibody",
    "Hepatitis B (HBsAg)",
    "Hepatitis C (HCV)",
    "Syphilis (VDRL)",
    "COVID-19 RT-PCR",

    
    "Urine Routine & Microscopy",
    "Urine Culture",
    "Stool Routine",

    
    "X-Ray Chest PA View",
    "X-Ray Spine",
    "X-Ray Joints",
    "ECG (Electrocardiogram)",
    "Ultrasound Abdomen",
    "Ultrasound Pelvis",
    "CT Scan Brain",
    "CT Scan Chest",
    "MRI Brain",
    "MRI Spine",
    "Echocardiography (2D Echo)"
];

function LabTestSelector({ selectedTests, onChange }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedList, setSelectedList] = useState([]);

    useEffect(() => {
        
        if (selectedTests) {
            const list = selectedTests.split(',').map(t => t.trim()).filter(Boolean);
            setSelectedList(list);
        } else {
            setSelectedList([]);
        }
    }, [selectedTests]);

    const handleToggleTest = (test) => {
        let newList;
        if (selectedList.includes(test)) {
            newList = selectedList.filter(t => t !== test);
        } else {
            newList = [...selectedList, test];
        }
        setSelectedList(newList);
        onChange(newList.join(', '));
    };

    const handleRemoveTest = (test) => {
        const newList = selectedList.filter(t => t !== test);
        setSelectedList(newList);
        onChange(newList.join(', '));
    };

    const filteredTests = AVAILABLE_TESTS.filter(test =>
        test.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="lab-test-selector">
            {}
            <div className="selected-tests-container">
                {selectedList.map(test => (
                    <span key={test} className="test-tag">
                        {test}
                        <button
                            type="button"
                            onClick={() => handleRemoveTest(test)}
                            className="remove-tag-btn"
                        >
                            <MdClose />
                        </button>
                    </span>
                ))}
            </div>

            {}
            <div className="test-search-wrapper">
                <div className="test-search-box" onClick={() => setIsOpen(true)}>
                    <MdSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search and add lab tests..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>

                {isOpen && (
                    <>
                        <div className="test-dropdown-backdrop" onClick={() => setIsOpen(false)} />
                        <div className="test-dropdown">
                            {filteredTests.length > 0 ? (
                                filteredTests.map(test => (
                                    <div
                                        key={test}
                                        className={`test-option ${selectedList.includes(test) ? 'selected' : ''}`}
                                        onClick={() => handleToggleTest(test)}
                                    >
                                        <span>{test}</span>
                                        {selectedList.includes(test) && <MdCheck className="check-icon" />}
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">No tests found</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default LabTestSelector;
