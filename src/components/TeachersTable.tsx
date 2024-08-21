"use client"; // Tato direktiva musí být na začátku

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; // Použijte to pro Next.js 13 a novější
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Import ikony křížku

interface Teacher {
  teacherId: number;
  teacherName: string;
  teacherSurname: string;
  teacherFullName: string;
}

const TeachersTable: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter(); // Inicializace routeru

  // Stav stránky
  const [currentPage, setCurrentPage] = useState<number>(1);
  const teachersPerPage = 10;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem('token'); // Get JWT token from localStorage
        const response = await fetch("http://localhost:8080/api/teacher", {
          headers: {
            'Authorization': `Bearer ${token}` // Include token in the request headers
          }
        });

        if (!response.ok) {
          throw new Error(`Chyba při načítání dat: ${response.statusText}`);
        }
        const data: Teacher[] = await response.json();

        console.log("Načtená data učitelů:", data); // Debugging: Výpis načtených dat

        setTeachers(data);
      } catch (error) {
        setError("Nepodařilo se načíst data učitelů.");
        console.error("Nepodařilo se načíst data učitelů:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Filtrování učitelů na základě vyhledávacího dotazu
  const filteredTeachers = teachers.filter((teacher) =>
      teacher.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.teacherSurname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.teacherFullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Výpočet indexů prvního a posledního učitele na aktuální stránce
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;

  // Získání učitelů, kteří mají být zobrazeni na aktuální stránce
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);

  // Výpočet celkového počtu stránek
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleGoToMainPage = () => {
    router.push('/'); // Přesměrování na hlavní stránku
  };

  const handleDeleteTeacher = async (teacherId: number) => {
    try {
         const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/teacher/deleteTeacher/${teacherId}`, {
           method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}` // Include token in the request headers
                    }
                });

      if (response.ok) {
        // Úspěšně vymazáno, obnovte seznam učitelů
        setTeachers(teachers.filter(teacher => teacher.teacherId !== teacherId));
      } else {
        console.error(`Chyba při mazání učitele: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Chyba při mazání učitele:', error);
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
          <input
              type="text"
              placeholder="Hledat podle jména nebo příjmení učitele"
              className="p-2 w-full rounded bg-gray-800 text-white border border-gray-600"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset na první stránku při novém vyhledávání
              }}
          />
        </div>

        <table className="min-w-full border-collapse block md:table">
          <thead className="block md:table-header-group">
          <tr className="border-b border-gray-700 md:border-none md:table-row">
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">ID</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Jméno</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Příjmení</th>
            <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Vymazat</th>
          </tr>
          </thead>
          <tbody className="block md:table-row-group">
          {currentTeachers.map((teacher) => (
              <tr key={teacher.teacherId} className="border-b border-gray-700 md:border-none md:table-row">
                <td className="p-2 md:table-cell">{teacher.teacherId}</td>
                <td className="p-2 md:table-cell">{teacher.teacherName}</td>
                <td className="p-2 md:table-cell">{teacher.teacherSurname}</td>
                <td className="p-2 md:table-cell">
                  <button
                      onClick={() => handleDeleteTeacher(teacher.teacherId)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-5 h-5"/>
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        {/* Ovládací prvky stránkování */}
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

export default TeachersTable;