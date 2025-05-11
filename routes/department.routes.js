const router = require('express').Router();
const departmentController = require('../controllers/department.controller');

router.post('/api/departments', departmentController.createDepartment);
router.get('/api/departments', departmentController.getAllDepartments);
router.get('/api/departments/:id', departmentController.getDepartmentById);
router.put('/api/departments/:id', departmentController.updateDepartment);
router.delete('/api/departments/:id', departmentController.deleteDepartment);
module.exports = router;