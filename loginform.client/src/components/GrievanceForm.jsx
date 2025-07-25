import React, { useState, useEffect } from "react";
import "./GrievanceForm.css";
import { useNavigate } from "react-router-dom";
import welspunImage from "../assets/Grievance.jpg";

const GrievanceForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        empNo: "",
        name: "",
        department: "",
        designation: "",
        division: "",
        buildingNo: "",
        supervisor: "",
        grievanceDate: new Date().toISOString().split("T")[0],
        grievanceType: "",
        description: "",
    });

    useEffect(() => {
        const savedEmployee = JSON.parse(localStorage.getItem("employeeData"));
        if (savedEmployee?.empNo) {
            setFormData((prev) => ({
                ...prev,
                empNo: savedEmployee.empNo,
            }));
        }
    }, []);

    useEffect(() => {
        if (formData.empNo) {
            fetch(`https://localhost:7136/api/Grievance/employee?empNo=${formData.empNo}`)
                .then((res) => res.json())
                .then((data) => {
                    setFormData((prev) => ({
                        ...prev,
                        name: data.name,
                        department: data.department,
                        designation: data.designation,
                        division: data.division,
                        buildingNo: data.buildingNo,
                        supervisor: data.supervisor,
                    }));
                });
        }
    }, [formData.empNo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("https://localhost:7136/api/Grievance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then((res) => {
                if (res.ok) {
                    alert("Grievance submitted successfully!");
                    setFormData((prev) => ({
                        ...prev,
                        grievanceDate: new Date().toISOString().split("T")[0],
                        grievanceType: "",
                        description: "",
                    }));
                } else {
                    throw new Error("Failed to submit grievance");
                }
            })
            .catch((err) => {
                console.error(err);
                alert("Submission failed.");
            });
    };

    return (
        <div className="container">
            <div className="left-panel">
                <img src={welspunImage} alt="Welspun" />
            </div>
            <div className="right-panel">
               
                <div className="close-button">
                    <button className="cross-btn" onClick={() => navigate('/emp')}>×</button>
                </div>

                <h2>Grievance Registration Form</h2>
                <p className="sub-text">[All entries are mandatory (सभी प्रविष्टियां अनिवार्य हैं)]</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <label>Emp No:</label>
                        <input name="empNo" value={formData.empNo} readOnly />

                        <label>Name:</label>
                        <input name="name" value={formData.name} readOnly />

                        <label>Department:</label>
                        <input name="department" value={formData.department} readOnly />

                        <label>Designation:</label>
                        <input name="designation" value={formData.designation} readOnly />

                        <label>Division:</label>
                        <input name="division" value={formData.division} readOnly />

                        <label>Building No:</label>
                        <input name="buildingNo" value={formData.buildingNo} readOnly />

                        <label>Supervisor:</label>
                        <input name="supervisor" value={formData.supervisor} readOnly />

                        <label>Grievance Date:</label>
                        <input type="date" name="grievanceDate" value={formData.grievanceDate} onChange={handleChange} />

                        <label>Grievance Type:</label>
                        <select name="grievanceType" value={formData.grievanceType} onChange={handleChange} required>
                            <option value="">Select Type</option>
                            <option value="Attendance">Attendance</option>
                            <option value="Incentive">Incentive</option>
                            <option value="Overtime">Overtime</option>
                            <option value="Leave">Leave</option>
                            <option value="Arrears">Arrears</option>
                            <option value="Paid Holiday">Paid Holiday</option>
                            <option value="Mess Deduction">Mess Deduction</option>
                            <option value="Colony Deduction">Colony Deduction</option>
                            <option value="Bus Deduction">Bus Deduction</option>
                            <option value="Advance Deduction">Advance Deduction</option>
                            <option value="Others">Others</option>
                        </select>

                        <label className="description-label">Description:</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4}></textarea>

                    </div>

                    <div className="btn-container-form">
                        <button type="submit" className="submit-btn">Submit</button>
                        <button type="button" className="back-btn-form" onClick={() => navigate('/emp')}>⬅ Back</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GrievanceForm;



