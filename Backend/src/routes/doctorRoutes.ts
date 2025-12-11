import { Router } from 'express';
import { createDoctor, getDoctors, createSlot, getSlots, deleteDoctor } from '../controllers/doctorController';

const router = Router();

router.delete('/doctors/:id', deleteDoctor);
router.post('/doctors', createDoctor);
router.get('/doctors', getDoctors);
router.post('/slots', createSlot); // Admin only in real app
router.get('/doctors/:doctorId/slots', getSlots);

export default router;
