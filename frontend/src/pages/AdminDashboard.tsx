import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { Trash2, Calendar, X, Plus } from 'lucide-react';

export default function AdminDashboard() {
    const { isAdmin, loginAsAdmin } = useAuth();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [newDoctorName, setNewDoctorName] = useState('');
    const [newSpecialty, setNewSpecialty] = useState('');

    // Slot Management State
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedTimes, setSelectedTimes] = useState<string[]>(['09:00', '10:00']);
    const [newTimeInput, setNewTimeInput] = useState('11:00');

    useEffect(() => {
        if (isAdmin) fetchDoctors();
    }, [isAdmin]);

    const fetchDoctors = async () => {
        const res = await api.get('/doctors');
        setDoctors(res.data);
    };

    const handleCreateDoctor = async () => {
        try {
            if (!newDoctorName.trim()) {
                alert('Doctor Name is required');
                return;
            }
            await api.post('/doctors', { name: newDoctorName, specialty: newSpecialty });
            setNewDoctorName('');
            setNewSpecialty('');
            fetchDoctors();
            alert('Doctor created successfully!');
        } catch (error: any) {
            console.error(error);
            const errorMsg = error.response?.data?.error || error.message;
            alert(`Failed to create doctor: ${errorMsg}`);
        }
    };

    const handleDeleteDoctor = async (doctorId: string) => {
        if (!confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) return;
        try {
            await api.delete(`/doctors/${doctorId}`);
            fetchDoctors();
        } catch (error) {
            console.error('Failed to delete doctor:', error);
            alert('Failed to delete doctor');
        }
    };

    const handleAddTime = () => {
        if (!newTimeInput) return;
        if (selectedTimes.includes(newTimeInput)) {
            alert('Time already added');
            return;
        }
        setSelectedTimes([...selectedTimes, newTimeInput].sort());
        setNewTimeInput('');
    };

    const handleRemoveTime = (timeToRemove: string) => {
        setSelectedTimes(selectedTimes.filter(t => t !== timeToRemove));
    };

    const handleSaveSlots = async () => {
        if (!selectedDoctorId) return;
        try {
            const promises = selectedTimes.map(time => {
                const dateTime = new Date(`${selectedDate}T${time}`);
                return api.post('/slots', {
                    time: dateTime.toISOString(),
                    doctorId: selectedDoctorId
                });
            });

            await Promise.all(promises);
            alert(`${selectedTimes.length} slots created successfully!`);
            setSelectedDoctorId(null); // Close modal
            fetchDoctors();
        } catch (error: any) {
            console.error('Failed to create slots:', error);
            alert('Failed to create some slots. Check console for details.');
        }
    };

    if (!isAdmin) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                >
                    <h2 className="text-3xl font-bold text-slate-800">Admin Access Required</h2>
                    <p className="text-slate-500">Please login as an administrator to manage doctors and slots.</p>
                    <Button onClick={loginAsAdmin} className="bg-teal-600 hover:bg-teal-700">Login as Admin</Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500 mt-2">Manage doctors, set schedules, and oversee appointments.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Create Doctor Section */}
                <div className="md:col-span-1">
                    <Card className="sticky top-24 shadow-md border-teal-100 bg-gradient-to-br from-white to-teal-50/30">
                        <CardHeader>
                            <CardTitle className="text-teal-800">Add New Doctor</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Doctor Name</label>
                                <input
                                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. Dr. Sarah Smith"
                                    value={newDoctorName}
                                    onChange={e => setNewDoctorName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Specialty</label>
                                <input
                                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. Cardiologist"
                                    value={newSpecialty}
                                    onChange={e => setNewSpecialty(e.target.value)}
                                />
                            </div>
                            <Button className="w-full bg-teal-600 hover:bg-teal-700 mt-2" onClick={handleCreateDoctor}>
                                Create Doctor
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Doctors List Section */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold text-slate-800">Doctors Management</h2>
                    <div className="grid gap-4">
                        {doctors.map((doc: any) => (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                layout
                            >
                                <Card className="hover:shadow-md transition-shadow bg-white">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                                {doc.name.charAt(0)}
                                            </div>
                                            <div>
                                                <CardTitle className="text-base text-slate-900">{doc.name}</CardTitle>
                                                <p className="text-sm text-slate-500">{doc.specialty}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedDoctorId(doc.id)}
                                                className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 border-teal-200"
                                            >
                                                <Calendar className="w-4 h-4 mr-2" />
                                                Manage Slots
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteDoctor(doc.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                title="Delete Doctor"
                                            >
                                                <Trash2 className="size-5" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Manage Slots Modal */}
            <AnimatePresence>
                {selectedDoctorId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                                <h3 className="text-xl font-semibold text-slate-900">Manage Availability</h3>
                                <button
                                    onClick={() => setSelectedDoctorId(null)}
                                    className="text-slate-400 hover:text-slate-500"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Select Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={selectedDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-slate-700">Available Times</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="time"
                                                className="border border-slate-200 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                                value={newTimeInput}
                                                onChange={(e) => setNewTimeInput(e.target.value)}
                                            />
                                            <Button size="sm" onClick={handleAddTime} className="bg-teal-600 hover:bg-teal-700">
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-lg min-h-[100px] content-start">
                                        {selectedTimes.length === 0 && (
                                            <p className="text-sm text-slate-400 w-full text-center py-2">No times added yet</p>
                                        )}
                                        {selectedTimes.map(time => (
                                            <span key={time} className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full text-sm text-slate-700 shadow-sm">
                                                {time}
                                                <button
                                                    onClick={() => handleRemoveTime(time)}
                                                    className="text-slate-400 hover:text-red-500 ml-1"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={handleSaveSlots}>
                                        Create {selectedTimes.length} Slots
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
