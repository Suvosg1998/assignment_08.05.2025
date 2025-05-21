const employeeModel = require('../models/employee.model');
const uuId = require('uuid');
const mongoose = require('mongoose');

class EmployeeController {
    // Create a new employee
    async createEmployee(req, res) {
        try {
            const {  name, department, experience, salary, hireDate, performanceScore } = req.body;
            if ( !name || !department || !experience || !salary || !hireDate) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const employee = await employeeModel.create({ empID : uuId.v4(), name, department, experience, salary, hireDate, performanceScore });
            res.status(201).json({ message: 'Employee created successfully', data: employee });
        } catch (error) {
            res.status(500).json({ message: 'Error creating employee', error: error.message });
        }
    }
    // Get all employees
    async getAllEmployees(req, res) {
        try {
            const employees = await employeeModel.aggregate([
                {
                    $match: {
                        isDeleted: { $ne: true }
                    }
                },
                {
                    $lookup: {
                        from: 'departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'departmentDetails'
                    }
                },
                {
                    $unwind: '$departmentDetails'
                },
                {
                    $project: {
                        empID: 1,
                        name: 1,
                        departmentName: '$departmentDetails.name',
                        department: 1,
                        experience: 1,
                        salary: 1,
                        hireDate: 1,
                        performanceScore: 1,
                    }
                }
            ]);
            res.status(200).json({ message: 'Employees fetched successfully', data: employees });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching employees', error: error.message });
        }
    }
    // Get an employee by ID
    async getEmployeeById(req, res) {
        try {
            const { id } = req.params;
            const employee = await employeeModel.aggregate([
                {
                    $match: {
                        isDeleted: { $ne: true },
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: 'departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'departmentDetails'
                    }
                },
                {
                    $unwind: '$departmentDetails'
                },
                {
                    $project: {
                        empID: 1,
                        name: 1,
                        departmentName: '$departmentDetails.name',
                        department: 1,
                        experience: 1,
                        salary: 1,
                        hireDate: 1,
                        performanceScore: 1,
                    }
                }
            ]);
            if (!employee || employee.length === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.status(200).json({ message: 'Employee fetched successfully', data: employee[0] });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching employee', error: error.message });
        }
    }
    // Update an employee by ID
async updateEmployee(req, res) {
    try {
        const { id } = req.params;
        const { name, department, experience, salary, hireDate, performanceScore } = req.body;
        if (!name || !department || !experience || !salary || !hireDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const employee = await employeeModel.findByIdAndUpdate(id, { name, department, experience, salary, hireDate, performanceScore }, { new: true });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee updated successfully', data: employee });
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }   
}
    // Delete an employee by ID
    async deleteEmployee(req, res) {
        try {
            const { id } = req.params;
            const employee = await employeeModel.findByIdAndUpdate(id, { isDeleted: true });
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.status(200).json({ message: 'Employee deleted successfully', data: employee });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting employee', error: error.message });
        }
    }
    //average salary of employees in a department
    // Add this method to the EmployeeController class
async getAverageSalaryByDepartment(req, res) {
    try {
        const averageSalaries = await employeeModel.aggregate([
            {
                $match: { isDeleted: { $ne: true } }
            },
            {
                $group: {
                    _id: '$department',
                    averageSalary: { $avg: '$salary' }
                }
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'departmentDetails'
                }
            },
            {
                $unwind: '$departmentDetails'
            },
            {
                $project: {
                    departmentName: '$departmentDetails.name',
                    averageSalary: 1
                }
            }
        ]);

        res.status(200).json({ message: 'Average salaries fetched successfully', data: averageSalaries });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching average salaries', error: error.message });
    }
}
// Add this method to the EmployeeController class
async getEmployeePerformance(req, res) {
    try {
        const employeePerformance = await employeeModel.aggregate([
            {
                $match: { isDeleted: { $ne: true } } 
            },
            {
                $unwind: '$performanceScore'
            },
            {
                $group: {
                    _id: '$empID',
                    name: { $first: '$name' },
                    department: { $first: '$department' },
                    averagePerformanceScore: { $avg: '$performanceScore.score' }
                }
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'department',
                    foreignField: '_id',
                    as: 'departmentDetails'
                }
            },
            {
                $unwind: '$departmentDetails'
            },
            {
                $project: {
                    empID: '$_id',
                    name: 1,
                    departmentName: '$departmentDetails.name',
                    averagePerformanceScore: 1
                }
            }
        ]);

        res.status(200).json({ message: 'Employee performance fetched successfully', data: employeePerformance });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee performance', error: error.message });
    }
}
async getDepartmentBudgetUtilization(req, res) {
    try {
        const departmentBudgetUtilization = await employeeModel.aggregate([
            {
                $match: { isDeleted: { $ne: true } }
            },
            {
                $group: {
                    _id: '$department',
                    totalSalary: { $sum: '$salary' }
                }
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'departmentDetails'
                }
            },
            {
                $unwind: '$departmentDetails'
            },
            {
                $project: {
                    departmentName: '$departmentDetails.name',
                    totalSalary: 1,
                    budget: '$departmentDetails.budget',
                    utilization: {
                        $multiply: [
                            { $divide: ['$totalSalary', '$departmentDetails.budget'] },
                            100
                        ]
                    }
                }
            }
        ]);

        res.status(200).json({ message: 'Department budget utilization fetched successfully', data: departmentBudgetUtilization });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching department budget utilization', error: error.message });
    }
}
async getemployeeTenure(req,res){
    try{
        const employeeTenure = await employeeModel.aggregate([
            {
                $match: { isDeleted: { $ne: true } }
            },
            {
                $project: {
                    empID: 1,
                    name: 1,
                    hireDate: 1,
                    tenure: {
                        $dateDiff: {
                            startDate: '$hireDate',
                            endDate: new Date(),
                            unit: 'year'
                        }
                    }
                }
            }
        ]);
        res.status(200).json({ message: 'Employee tenure fetched successfully', data: employeeTenure });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee tenure', error: error.message });
    }
}
}
module.exports = new EmployeeController();