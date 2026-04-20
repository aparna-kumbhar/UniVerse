const express = require("express");
const Student = require("../Models/Student");
const Institute = require("../Models/Institute");

const router = express.Router();

const findInstitute = async (instituteId) => {
	return Institute.findOne({ instituteId }, { _id: 0, instituteId: 1, name: 1 }).lean();
};

router.get("/", async (req, res) => {
	try {
		const instituteId = (req.query.instituteId || "").trim();
		if (!instituteId) {
			return res.status(400).json({ message: "instituteId is required" });
		}

		const institute = await findInstitute(instituteId);
		if (!institute) {
			return res.status(404).json({ message: "Institute not found" });
		}

		const students = await Student.find({ instituteId }).sort({ createdAt: -1 });
		return res.status(200).json(students);
	} catch (error) {
		return res.status(500).json({ message: "Failed to fetch students", error: error.message });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const instituteId = (req.query.instituteId || "").trim();
		if (!instituteId) {
			return res.status(400).json({ message: "instituteId is required" });
		}

		const institute = await findInstitute(instituteId);
		if (!institute) {
			return res.status(404).json({ message: "Institute not found" });
		}

		const student = await Student.findOne({ _id: req.params.id, instituteId });
		if (!student) {
			return res.status(404).json({ message: "Student not found" });
		}

		return res.status(200).json(student);
	} catch (error) {
		return res.status(500).json({ message: "Failed to fetch student", error: error.message });
	}
});

router.post("/", async (req, res) => {
	try {
		const payload = {
			instituteId: (req.body.instituteId || "").trim(),
			instituteName: "",
			fullName: (req.body.fullName || "").trim(),
			dateOfBirth: (req.body.dateOfBirth || "").trim(),
			academicYear: (req.body.academicYear || "").trim(),
			studentPassword: (req.body.studentPassword || "password").trim() || "password",
			parentPassword: (req.body.parentPassword || "parentpassword").trim() || "parentpassword",
			parentId: (req.body.parentId || req.body.fullName || "").trim(),
			parentPhoneNumber: (req.body.parentPhoneNumber || "").trim(),
			studentId: (req.body.studentId || req.body.fullName || "").trim(),
			studentPhoneNumber: (req.body.studentPhoneNumber || "").trim(),
			advancedFeePayment: (req.body.advancedFeePayment || "").trim(),
			createdBy: req.body.createdBy || {},
		};

		if (!payload.instituteId || !payload.fullName) {
			return res.status(400).json({ message: "instituteId and fullName are required" });
		}

		const institute = await findInstitute(payload.instituteId);
		if (!institute) {
			return res.status(404).json({ message: "Institute not found" });
		}

		payload.instituteName = institute.name || "";

		const student = await Student.create(payload);
		return res.status(201).json(student);
	} catch (error) {
		return res.status(500).json({ message: "Failed to create student", error: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const instituteId = (req.query.instituteId || req.body.instituteId || "").trim();
		if (!instituteId) {
			return res.status(400).json({ message: "instituteId is required" });
		}

		const institute = await findInstitute(instituteId);
		if (!institute) {
			return res.status(404).json({ message: "Institute not found" });
		}

		const deletedStudent = await Student.findOneAndDelete({ _id: req.params.id, instituteId });
		if (!deletedStudent) {
			return res.status(404).json({ message: "Student not found" });
		}

		return res.status(200).json({ message: "Student deleted successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Failed to delete student", error: error.message });
	}
});

module.exports = router;