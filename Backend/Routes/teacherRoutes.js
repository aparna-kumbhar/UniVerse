const express = require("express");
const Teacher = require("../Models/Teacher");
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

		const teachers = await Teacher.find({ instituteId }).sort({ createdAt: -1 });
		return res.status(200).json(teachers);
	} catch (error) {
		return res.status(500).json({ message: "Failed to fetch teachers", error: error.message });
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

		const teacher = await Teacher.findOne({ _id: req.params.id, instituteId });
		if (!teacher) {
			return res.status(404).json({ message: "Teacher not found" });
		}

		return res.status(200).json(teacher);
	} catch (error) {
		return res.status(500).json({ message: "Failed to fetch teacher", error: error.message });
	}
});

router.post("/", async (req, res) => {
	try {
		const payload = {
			instituteId: (req.body.instituteId || "").trim(),
			instituteName: "",
			fullName: (req.body.fullName || "").trim(),
			experience: (req.body.experience || "").trim(),
			qualification: (req.body.qualification || "").trim(),
			teacherId: (req.body.fullName || "").trim(),
			teacherPassword: (req.body.teacherPassword || "").trim(),
			departmentName: (req.body.departmentName || "").trim(),
			createdBy: req.body.createdBy || {},
		};

		if (!payload.instituteId || !payload.fullName || !payload.teacherPassword) {
			return res.status(400).json({ message: "instituteId, fullName and teacherPassword are required" });
		}

		const institute = await findInstitute(payload.instituteId);
		if (!institute) {
			return res.status(404).json({ message: "Institute not found" });
		}

		payload.instituteName = institute.name || "";

		const teacher = await Teacher.create(payload);
		return res.status(201).json(teacher);
	} catch (error) {
		return res.status(500).json({ message: "Failed to create teacher", error: error.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const teacherId = (req.body.teacherId || "").trim();
		const teacherPassword = (req.body.teacherPassword || "").trim();

		if (!teacherId || !teacherPassword) {
			return res.status(400).json({ message: "teacherId and teacherPassword are required" });
		}

		const teacher = await Teacher.findOne({ teacherId, teacherPassword }).sort({ createdAt: -1 });
		if (!teacher) {
			return res.status(401).json({ message: "Invalid teacher ID or password" });
		}

		return res.status(200).json({
			message: "Teacher login successful",
			teacher,
		});
	} catch (error) {
		return res.status(500).json({ message: "Failed to login teacher", error: error.message });
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

		const deletedTeacher = await Teacher.findOneAndDelete({ _id: req.params.id, instituteId });
		if (!deletedTeacher) {
			return res.status(404).json({ message: "Teacher not found" });
		}

		return res.status(200).json({ message: "Teacher deleted successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Failed to delete teacher", error: error.message });
	}
});

module.exports = router;