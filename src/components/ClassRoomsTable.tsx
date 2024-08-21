"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons"; // Používá se pro navigaci

interface Teacher {
    teacherId: number;
    teacherFullName: string;
}

interface Student {
    studentId: number;
    fullName: string;
}

interface Classroom {
    classRoomId: number;
    classRoomName: string;
    classTeacher: Teacher | null;
    students: Student[];
}

const ClassroomsTable: React.FC = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
    const router = useRouter(); // Inicializace routeru

    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const classroomsPerPage = 10;

    // Search state
    const [searchQuery, setSearchQuery] = useState<string>("");

useEffect(() => {
    const fetchClassrooms = async () => {
        try {
            const token = localStorage.getItem('token'); // Get JWT token from localStorage
            const response = await fetch("http://localhost:8080/api/classroom", {
                headers: {
                    'Authorization': `Bearer ${token}` // Include token in the request headers
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }

            const data = await response.json();
            setClassrooms(data);
        } catch (error) {
            setError("Failed to fetch classroom data.");
            console.error("Failed to fetch classroom data:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchClassrooms();
}, []);

    // Funkce pro mazání třídy
    const handleDeleteClassroom = async (classRoomId: number) => {
        try {
             const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/classroom/deleteClassRoom/${classRoomId}`, {
               method: 'DELETE',
                       headers: {
                           'Authorization': `Bearer ${token}` // Include token in the request headers
                       }
                   });

            if (!response.ok) {
                throw new Error(`Error deleting classroom: ${response.statusText}`);
            }

            // Aktualizace stavu po úspěšném mazání
            setClassrooms(classrooms.filter(classroom => classroom.classRoomId !== classRoomId));
        } catch (error) {
            setError("Failed to delete classroom.");
            console.error("Failed to delete classroom:", error);
        }
    };

    // Filter classrooms based on search query
    const filteredClassrooms = classrooms.filter((classroom) =>
        classroom.classRoomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (classroom.classTeacher &&
            classroom.classTeacher.teacherFullName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
    );

    // Calculate the indexes of the first and last classroom for the current page
    const indexOfLastClassroom = currentPage * classroomsPerPage;
    const indexOfFirstClassroom = indexOfLastClassroom - classroomsPerPage;

    // Get the classrooms to be displayed on the current page
    const currentClassrooms = filteredClassrooms.slice(indexOfFirstClassroom, indexOfLastClassroom);

    // Calculate total pages
    const totalPages = Math.ceil(filteredClassrooms.length / classroomsPerPage);

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handleClassroomClick = (classroom: Classroom) => {
        setSelectedClassroom(classroom);
    };

    const handleGoToMainPage = () => {
        router.push('/'); // Přesměrování na hlavní stránku
    };

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="overflow-x-auto bg-gray-900 text-white p-4">
            {/* Vyhledávací pole */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Hledat podle jména učitele"
                    className="p-2 w-full rounded bg-gray-800 text-white border border-gray-600"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reset to first page on new search
                    }}
                />
            </div>

            <table className="min-w-full border-collapse block md:table">
                <thead className="block md:table-header-group">
                <tr className="border-b border-gray-700 md:border-none md:table-row">
                    <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Třída</th>
                    <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Učitel</th>
                    <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Počet žáků</th>
                    <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Vymazat</th>
                </tr>
                </thead>
                <tbody className="block md:table-row-group">
                {currentClassrooms.map((classroom) => (
                    <tr
                        key={classroom.classRoomId}
                        className="border-b border-gray-700 md:border-none md:table-row cursor-pointer"
                    >
                        <td className="p-2 md:table-cell" onClick={() => handleClassroomClick(classroom)}>
                            {classroom.classRoomName}
                        </td>
                        <td className="p-2 md:table-cell">
                            {classroom.classTeacher ? classroom.classTeacher.teacherFullName : "Učitel nenalezen"}
                        </td>
                        <td className="p-2 md:table-cell">{classroom.students.length}</td>
                        <td className="p-2 md:table-cell">
                            <button
                                onClick={() => handleDeleteClassroom(classroom.classRoomId)}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded flex items-center justify-center"
                            >
                                <FontAwesomeIcon icon={faTimes} className="w-5 h-5"/>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={handlePreviousPage}
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-1 px-3 mx-2 rounded"
                    disabled={currentPage === 1}
                >
                    Předchozí
                </button>
                <span className="text-white mx-2">
                    Strana {currentPage} z {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-1 px-3 mx-2 rounded"
                    disabled={currentPage === totalPages}
                >
                    Další
                </button>
            </div>

            {/* Student List Modal */}
            {selectedClassroom && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-80 flex justify-center items-center z-10">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Students in {selectedClassroom.classRoomName}</h2>
                        <ul>
                            {selectedClassroom.students.map((student) => (
                                <li key={student.studentId} className="mb-2">
                                    {student.fullName}
                                </li>
                            ))}
                        </ul>
                        <button
                            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-1 px-3 mt-4 rounded"
                            onClick={() => setSelectedClassroom(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Button to redirect to the main page */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={handleGoToMainPage}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Zpět
                </button>
            </div>
        </div>
    );
};

export default ClassroomsTable;