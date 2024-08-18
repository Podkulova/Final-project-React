"use client"; // Tato direktiva musí být na začátku

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; // Použijte to pro Next.js 13 nebo novější
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faEye } from '@fortawesome/free-solid-svg-icons'; // Import ikony lupy, křížku a oka

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
  parents: Parent[]; // Předpokládáme, že rodiče jsou zahrnuti v objektu studenta
}

const StudentsTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);
  const router = useRouter(); // Inicializace routeru

  // Stavy pro stránkování
  const [currentPage, setCurrentPage] = useState<number>(1);
  const studentsPerPage = 10;

  // Stav hledání
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("https://edupage.onrender.com/api/student");
        if (!response.ok) {
          throw new Error(`Chyba při načítání dat: ${response.statusText}`);
        }
        const data = await response.json();

        console.log("Načtená data studentů:", data); // Pro ladění: Výpis načtených dat

        // Zploštění struktury pro získání všech studentů
        const allStudents: Student[] = [];

        data.forEach((student: any) => {
          if (student.studentId) {
            allStudents.push(student); // Přidat hlavního studenta
          }
          if (student.classRoom && student.classRoom.students) {
            student.classRoom.students.forEach((s: any) => {
              if (typeof s === "object" && s.studentId) {
                allStudents.push(s); // Přidat zanořené studenty
              }
            });
          }
        });

        setStudents(allStudents);
      } catch (error) {
        setError("Nepodařilo se načíst data studentů.");
        console.error("Nepodařilo se načíst data studentů:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const toggleParentsVisibility = (studentId: number) => {
    setExpandedStudentId((prev) => (prev === studentId ? null : studentId));
  };

  // Filtrujte studenty na základě dotazu na hledání
  const filteredStudents = students.filter((student) =>
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentSurname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.classRoom.classRoomName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Vypočítejte indexy prvního a posledního studenta na aktuální stránce
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

  // Získejte studenty, kteří mají být zobrazeni na aktuální stránce
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Vypočítejte celkový počet stránek
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleGoToMainPage = () => {
    router.push('/'); // Přesměrování na hlavní stránku
  };

  const handleDeleteStudent = async (studentId: number) => {
    try {
      const response = await fetch(`https://edupage.onrender.com/api/deleteStudent/${studentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Úspěšně vymazáno, obnovte seznam studentů
        setStudents(students.filter(student => student.studentId !== studentId));
      } else {
        console.error(`Chyba při mazání studenta: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Chyba při mazání studenta:', error);
    }
  };

  if (loading) {
    return <div className="text-white">Načítání...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
      <div className="overflow-x-auto bg-gray-900 text-white p-4">
        {/* Vyhledávací pole */}
        <div className="mb-4">
          <div className="flex items-center bg-gray-800 rounded">
            <FontAwesomeIcon icon={faSearch} className="text-gray-500 mx-2" />
            <input
                type="text"
                placeholder="Hledat podle jména studenta, příjmení nebo třídy"
                className="p-2 w-full rounded bg-gray-800 text-white border border-gray-600 outline-none"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Obnovit na první stránku při novém hledání
                }}
            />
          </div>
        </div>

        <table className="min-w-full border-collapse block md:table">
          <thead className="block md:table-header-group">
          <tr className="border-b border-gray-700 md:border-none md:table-row">
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">ID</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Jméno</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Příjmení</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Třída</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Detail rodiče</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Smazat</th>
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
                      <FontAwesomeIcon
                          icon={faEye}
                          className="mr-1"
                      />
                    </button>
                  </td>
                  <td className="p-2 md:table-cell">
                    <button
                        className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-2 rounded"
                        onClick={() => handleDeleteStudent(student.studentId)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
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
                              <h3 className="font-medium text-gray-400">Rodiče nenalezeni</h3>
                          )}
                        </div>
                      </td>
                    </tr>
                )}
              </React.Fragment>
          ))}
          </tbody>
        </table>

        {/* Ovládací prvky pro stránkování */}
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

        {/* Tlačítko pro přesměrování na hlavní stránku */}
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

export default StudentsTable;