const departmentModel = require('../models/department.model');

class DepartmentController {
    // Create a new department
    async createDepartment(req, res) {
        try {
            const { name, location, budget } = req.body;
            if (!name || !location || !budget) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const department = await departmentModel.create({ name, location, budget });
            res.status(201).json({ message: 'Department created successfully', data: department });
        } catch (error) {
            res.status(500).json({ message: 'Error creating department', error: error.message });
        }
    }
    // Get all departments
    async getAllDepartments(req, res) {
        try {
            const departments = await departmentModel.find();
            res.status(200).json({ message: 'Departments fetched successfully', data: departments });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching departments', error: error.message });
        }
    } 
    // Get a department by ID
    async getDepartmentById(req, res) {
        try {
            const { id } = req.params;
            const department = await departmentModel.findById(id);
            if (!department) {
                return res.status(404).json({ message: 'Department not found' });
            }
            res.status(200).json({ message: 'Department fetched successfully', data: department });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching department', error: error.message });
        }
    }
    // Update a department by ID
    async updateDepartment(req, res) {
        try {
            const { id } = req.params;
            const { name, location, budget } = req.body;
            if (!name || !location || !budget) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const department = await departmentModel.findByIdAndUpdate(id, { name, location, budget }, { new: true });
            if (!department) {
                return res.status(404).json({ message: 'Department not found' });
            }
            res.status(200).json({ message: 'Department updated successfully', data: department });
        } catch (error) {
            res.status(500).json({ message: 'Error updating department', error: error.message });
        }
    }
    // Delete a department by ID
    async deleteDepartment(req, res) {
        try {
            const { id } = req.params;
            const department = await departmentModel.findByIdAndUpdate(id, { isDeleted: true });
            if (!department) {
                return res.status(404).json({ message: 'Department not found' });
            }
            res.status(200).json({ message: 'Department deleted successfully', data: department });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting department', error: error.message });
        }
    }
}

module.exports = new DepartmentController();