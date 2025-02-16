import express from 'express';
import { getCourse, listCourses } from '../controllers/courseController';

const courseRoutes = express.Router()

courseRoutes.get("/", listCourses)
courseRoutes.get("/:courseId", getCourse)

export default courseRoutes