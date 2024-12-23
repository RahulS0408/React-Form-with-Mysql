import React, { useState } from "react";
import './App.css';
import axios from "axios";
const App = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        employee_id: "",
        email: "",
        phone: "",
        department: "HR",
        date_of_joining: "",
        role: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [employees, setEmployees] = useState([]);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.first_name.trim()) newErrors.first_name = "First Name is required.";
        if (!formData.last_name.trim()) newErrors.last_name = "Last Name is required.";
        if (!formData.employee_id.trim() || isNaN(formData.employee_id)) newErrors.employee_id = "Valid Employee ID is required.";
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) newErrors.email = "Valid Email is required.";
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(formData.phone)) newErrors.phone = "Phone number must be 10 digits.";
        if (!formData.department.trim()) newErrors.department = "Department is required.";
        if (!formData.date_of_joining.trim()) {
            newErrors.date_of_joining = "Date of Joining is required.";
        } else {
            const today = new Date();
            const joiningDate = new Date(formData.date_of_joining);
            if (joiningDate > today) {
                newErrors.date_of_joining = "Date of Joining cannot be a future date.";
            }
        }
        if (!formData.role.trim()) newErrors.role = "Role is required.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage("Please fix the errors before submitting.");
            return;
        }
        try {
            const res = await axios.post("http://localhost:5000/api/employees", formData);
            setMessage(res.data.message);
            setErrors({});
        } catch (error) {
            setMessage(error.response?.data?.error || "Submission failed");
        }
    };
    const handleReset = () => {
        setFormData({
            first_name: "",
            last_name: "",
            employee_id: "",
            email: "",
            phone: "",
            department: "HR",
            date_of_joining: "",
            role: "",
        });
        setMessage("");
        setErrors({});
    };
    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/employees");
            setEmployees(res.data);
        } catch (error) {
            setMessage(error.response?.data?.error || "Failed to fetch employees");
        }
    };

    return (
        <div>
            <h1>Employee Management System</h1>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                    {errors.first_name && <p className="error">{errors.first_name}</p>}
                </div>
                <div>
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                    {errors.last_name && <p className="error">{errors.last_name}</p>}
                </div>
                <div>
                    <input
                        type="text"
                        name="employee_id"
                        placeholder="Employee ID"
                        value={formData.employee_id}
                        onChange={handleChange}
                    />
                    {errors.employee_id && <p className="error">{errors.employee_id}</p>}
                </div>
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div>
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    {errors.phone && <p className="error">{errors.phone}</p>}
                </div>
                <div>
                    <select name="department" value={formData.department} onChange={handleChange}>
                        <option value="HR">HR</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                    </select>
                    {errors.department && <p className="error">{errors.department}</p>}
                </div>
                <div>
                    <input
                        type="date"
                        name="date_of_joining"
                        value={formData.date_of_joining}
                        onChange={handleChange}
                    />
                    {errors.date_of_joining && <p className="error">{errors.date_of_joining}</p>}
                </div>
                <div>
                    <input
                        type="text"
                        name="role"
                        placeholder="Role"
                        value={formData.role}
                        onChange={handleChange}
                    />
                    {errors.role && <p className="error">{errors.role}</p>}
                </div>
                <button type="submit">Submit</button>
                <button type="button" onClick={handleReset}>Reset</button>
            </form>

            {message && <p>{message}</p>}

            <center><button type="button" onClick={fetchEmployees}>Display Employees</button></center>

            {employees.length > 0 && (
                <div>
                    <center><h2>Employee List</h2></center>
                    <table>
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Department</th>
                                <th>Date of Joining</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.employee_id}>
                                    <td>{employee.employee_id}</td>
                                    <td>{employee.first_name}</td>
                                    <td>{employee.last_name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.department}</td>
                                    <td>{employee.date_of_joining}</td>
                                    <td>{employee.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default App;
