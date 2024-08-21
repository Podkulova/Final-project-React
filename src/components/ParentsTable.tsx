"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import ikon

interface Parent {
    parentId: number;
    parentName: string;
    parentSurname: string;
    parentEmail: string;
    parentPhone: string;
    parentFullName: string;
}

const ParentsTable: React.FC = () => {
    const [parents, setParents] = useState<Parent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // Inicializace routeru

    // Stavy pro stránkování
    const [currentPage, setCurrentPage] = useState<number>(1);
    const parentsPerPage = 10;

    // Stav pro vyhledávání
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const token = localStorage.getItem('token'); // Získání JWT tokenu z localStorage
                const response = await fetch("https://edupage.onrender.com/api/parent", {
                    headers: {
                        'Authorization': `Bearer ${token}` // Přidání tokenu do hlavičky požadavku
                    }
                });

                if (!response.ok) {
                    throw new Error(`Chyba při načítání dat: ${response.statusText}`);
                }
                const data = await response.json();
                setParents(data);
            } catch (error) {
                setError("Nepodařilo se načíst data o rodičích.");
                console.error("Nepodařilo se načíst data o rodičích:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchParents();
    }, []);

    // Funkce pro mazání rodiče
    const handleDeleteParent = async (parentId: number) => {
        const token = localStorage.getItem('token'); // Získání JWT tokenu z localStorage

        try {
            const response = await fetch(`https://edupage.onrender.com/api/parent/${parentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // Přidání tokenu do hlavičky požadavku
                }
            });

            if (!response.ok) {
                throw new Error(`Chyba při mazání rodiče: ${response.statusText}`);
            }

            // Aktualizace seznamu rodičů po úspěšném smazání
            setParents((prevParents) => prevParents.filter(parent => parent.parentId !== parentId));
        } catch (error) {
            console.error("Nepodařilo se smazat rodiče:", error);
            setError("Nepodařilo se smazat rodiče.");
        }
    };

    // Filtrování rodičů na základě vyhledávacího dotazu
    const filteredParents = parents.filter((parent) =>
        parent.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.parentSurname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.parentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.parentPhone.includes(searchQuery)
    );

    // Výpočet indexů prvního a posledního rodiče pro aktuální stránku
    const indexOfLastParent = currentPage * parentsPerPage;
    const indexOfFirstParent = indexOfLastParent - parentsPerPage;

    // Získání rodičů, kteří se zobrazí na aktuální stránce
    const currentParents = filteredParents.slice(indexOfFirstParent, indexOfLastParent);

    // Výpočet celkového počtu stránek
    const totalPages = Math.ceil(filteredParents.length / parentsPerPage);

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handleGoToMainPage = () => {
        router.push('/'); // Přesměrování na hlavní stránku
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
                    placeholder="Hledat podle jména rodiče, emailu nebo tel."
                    className="p-2 w-full rounded bg-gray-800 text-white border border-gray-600"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Při novém hledání reset na první stránku
                    }}
                />
            </div>

            <table className="min-w-full border-collapse block md:table">
                <thead className="block md:table-header-group">
                <tr className="border-b border-gray-700 md:border-none md:table-row">
                    <th className="p-2 text-left font-medium text-gray-400 md:table-cell">ID</th>
                    <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Jméno a příjmení</th>
                    <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Email</th>
                    <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Číslo</th>
                    <th className="p-2 text-left font-medium text-gray-400 md:table-cell">Vymazat</th>
                </tr>
                </thead>
                <tbody className="block md:table-row-group">
                {currentParents.map((parent) => (
                    <tr key={parent.parentId} className="border-b border-gray-700 md:border-none md:table-row">
                        <td className="p-2 md:table-cell">{parent.parentId}</td>
                        <td className="p-2 md:table-cell">{parent.parentFullName}</td>
                        <td className="p-2 md:table-cell">{parent.parentEmail}</td>
                        <td className="p-2 md:table-cell">{parent.parentPhone}</td>
                        <td className="p-2 md:table-cell">
                            <button
                                className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-2 rounded"
                                onClick={() => handleDeleteParent(parent.parentId)}
                            >
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className="mr-1"
                                />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Ovládání stránkování */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={handlePreviousPage}
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-1 px-3 mx-2 rounded"
                    disabled={currentPage === 1}
                >
                    Předchozí
                </button>
                <span className="text-white mx-2">
          Strana {currentPage} ze {totalPages}
        </span>
                <button
                    onClick={handleNextPage}
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-1 px-3 mx-2 rounded"
                    disabled={currentPage === totalPages}
                >
                    Další
                </button>
            </div>
            {/* Tlačítko pro návrat na hlavní stránku */}
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

export default ParentsTable;