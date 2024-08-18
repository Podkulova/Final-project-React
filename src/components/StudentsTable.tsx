"use client"; // This directive must be at the top

import React, { useEffect, useState } from "react";

interface Parent {
  parentId: number;
  parentName: string;
  parentSurname: string;
  parentEmail: string;
  parentPhone: string;
  children: number[];
  parentFullName: string;
}

interface Student {
  studentId: number;
  studentName: string;
  studentSurname: string;
  classRoom: {
    classRoomId: number;
    classRoomName: string;
    students: (number | Student)[];
  };
  fullName: string;
  parents: Parent[]; // Assuming parents are included in the student object
}

const StudentsTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const studentsPerPage = 10;

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("https://edupage.onrender.com/api/student");
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();

        // Flatten the structure to get all students
        const allStudents: Student[] = [];

        data.forEach((student: any) => {
          if (student.studentId) {
            allStudents.push(student); // Add the main student
          }
          if (student.classRoom && student.classRoom.students) {
            student.classRoom.students.forEach((s: any) => {
              if (typeof s === "object" && s.studentId) {
                allStudents.push(s); // Add nested students
              }
            });
          }
        });

        setStudents(allStudents);
      } catch (error) {
        setError("Failed to fetch student data.");
        console.error("Failed to fetch student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const toggleParentsVisibility = (studentId: number) => {
    setExpandedStudentId((prev) => (prev === studentId ? null : studentId));
  };

  const handleDeleteClassRoom = async (classRoomId: number) => {
    try {
      const response = await fetch(`https://edupage.onrender.com/api/deleteClassRoom/${classRoomId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error deleting classroom: ${response.statusText}`);
      }

      // Remove the students associated with the deleted classroom from the list
      setStudents(students.filter(student => student.classRoom.classRoomId !== classRoomId));
    } catch (error) {
      setError("Failed to delete classroom.");
      console.error("Failed to delete classroom:", error);
    }
  };

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentSurname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.classRoom.classRoomName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the indexes of the first and last student for the current page
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

  // Get the students to be displayed on the current page
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Calculate total pages
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
      <div className="overflow-x-auto bg-gray-900 text-white p-4">
        {/* Search Bar */}
        <div className="mb-4">
          <input
              type="text"
              placeholder="Hledat podle jména studenta, příjmení nebo třídy"
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
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">ID</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Jméno</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Příjmení</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Třída</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Detail tříd</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Přidat třídu</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Vymazat třídu</th>
          </tr>
          </thead>
          <tbody className="block md:table-row-group">
          {currentStudents.map((student) => (
              <React.Fragment key={student.studentId}>
                <tr className="border-b border-gray-700 md:border-none md:table-row">
                  <td className="p-2 md:table-cell">{student.studentId}</td>
                  <td className="p-2 md:table-cell">{student.studentName}</td>
                  <td className="p-2 md:table-cell">{student.studentSurname}</td>
                  <td className="p-2 md:table-cell">{student.classRoom.classRoomName}</td>
                  <td className="p-2 md:table-cell">
                    <button
                        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded"
                        onClick={() => toggleParentsVisibility(student.studentId)}
                    >
                      {expandedStudentId === student.studentId ? "Skrýt rodiče" : "Ukázat rodiče"}
                    </button>
                  </td>
                  <td className="p-2 md:table-cell">
                    {/* Add button or functionality to add a class room */}
                  </td>
                  <td className="p-2 md:table-cell">
                    <button
                        className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-2 rounded"
                        onClick={() => handleDeleteClassRoom(student.classRoom.classRoomId)}
                    >
                      Vymazat
                    </button>
                  </td>
                </tr>
                {expandedStudentId === student.studentId && (
                    <tr className="bg-gray-800 border-b border-gray-700 md:border-none md:table-row">
                      <td colSpan={6} className="p-2">
                        <div className="p-2">
                          {student.parents && student.parents.length > 0 ? (
                              <>
                                <h3 className="font-medium text-gray-400">Rodiče:</h3>
                                <ul className="list-disc pl-5">
                                  {student.parents.map((parent) => (
                                      <li key={parent.parentId} className="text-gray-300 mb-2">
                                        <div>
                                          <strong>{parent.parentName} {parent.parentSurname}</strong>
                                        </div>
                                        <div className="text-gray-400">Email: {parent.parentEmail}</div>
                                        <div className="text-gray-400">Telefon: {parent.parentPhone}</div>
                                      </li>
                                  ))}
                                </ul>
                              </>
                          ) : (
                              <h3 className="font-medium text-gray-400">Rodič nenalezen</h3>
                          )}
                        </div>
                      </td>
                    </tr>
                )}
              </React.Fragment>
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
          Stránka {currentPage} z {totalPages}
        </span>
          <button
              onClick={handleNextPage}
              className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-1 px-3 mx-2 rounded"
              disabled={currentPage === totalPages}
          >
            Další
          </button>
        </div>
      </div>
  );
};

export default StudentsTable;
