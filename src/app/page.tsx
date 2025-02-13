"use client";

import { Advocate } from "@/db/schema";
import { useCallback, useEffect, useState } from "react";
import { json } from "stream/consumers";
import { formatPhoneNumber } from "./utils";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchAdvocates = useCallback(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/advocates");
        const jsonResponse = await response.json();

        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      } catch (error) {
        setError("Error fetching advocates");
      }
    };

    fetchData();
  }, []);

  const onSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = e.target.value?.toLowerCase();
      setSearchInputValue(searchTerm);
    },
    []
  );

  const onClickReset = useCallback(() => {
    setSearchInputValue("");
    setFilteredAdvocates(advocates);
  }, [advocates]);

  const getSearchableFields = useCallback((advocate: Advocate) => {
    return [
      advocate.firstName,
      advocate.lastName,
      `${advocate.firstName} ${advocate.lastName}`,
      `${advocate.lastName} ${advocate.firstName}`,
      `${advocate.firstName} ${advocate.lastName}, ${advocate.degree}.`,
      advocate.city,
      advocate.degree,
      advocate.yearsOfExperience.toString(),
      advocate.phoneNumber.toString(),
    ].map((field) => field.toLowerCase());
  }, []);

  useEffect(() => {
    fetchAdvocates();
  }, [fetchAdvocates]);

  useEffect(() => {
    const filteredAdvocates = advocates.filter((advocate) => {
      const searchableFields = getSearchableFields(advocate);

      return (
        searchableFields.some((field) => field.startsWith(searchInputValue)) ||
        advocate.specialties.some((specialty) =>
          specialty.toLowerCase().includes(searchInputValue)
        )
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  }, [searchInputValue, advocates, getSearchableFields]);

  return (
    <main className="m-6">
      <h1 className="text-2xl font-semibold text-[var(--primary)]">
        Solace Advocates
      </h1>

      {/* Search Section */}
      <div className="mt-6">
        <p className="text-gray-700 font-medium">Search</p>
        <p className="text-sm text-gray-600">
          Searching for:{" "}
          <span id="search-term" className="font-semibold"></span>
        </p>

        <div className="mt-2 flex flex-col sm:flex-row gap-2">
          <input
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={onSearchInputChange}
            value={searchInputValue}
            placeholder="Search advocates..."
          />
          <button
            onClick={onClickReset}
            className="bg-[var(--primary-light)] text-[var(--primary)] px-4 py-2 rounded-md hover:bg-[var(--primary)] hover:text-white transition"
          >
            Reset Search
          </button>
        </div>
      </div>

      {/* Table Wrapper for Scrolling */}
      <div className="mt-6 overflow-x-auto rounded-lg shadow-md hidden md:block">
        <table className="w-full border-collapse text-left text-sm text-gray-700">
          <thead className="bg-tertiary uppercase">
            <tr>
              <th className="px-4 py-3 border-b text-[var(--primary)]">
                First Name
              </th>
              <th className="px-4 py-3 border-b text-[var(--primary)]">
                Last Name
              </th>
              <th className="px-4 py-3 border-b text-[var(--primary)]">City</th>
              <th className="px-4 py-3 border-b text-[var(--primary)]">
                Degree
              </th>
              <th className="px-4 py-3 border-b text-[var(--primary)]">
                Specialties
              </th>
              <th className="px-4 py-3 border-b text-[var(--primary)]">
                Experience
              </th>
              <th className="px-4 py-3 border-b text-[var(--primary)]">
                Phone
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredAdvocates.map((advocate, index) => (
              <tr
                className="hover:bg-gray-50 transition hidden md:table-row"
                key={index}
              >
                <td className="px-4 py-4">{advocate.firstName}</td>
                <td className="px-4 py-4">{advocate.lastName}</td>
                <td className="px-4 py-4">{advocate.city}</td>
                <td className="px-4 py-4">{advocate.degree}</td>
                <td className="px-4 py-4  max-w-[200px]">
                  <div className="flex flex-wrap gap-2">
                    {advocate.specialties.map((s, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary)] text-white"
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">{advocate.yearsOfExperience} yrs</td>
                <td className="px-4 py-4">
                  {formatPhoneNumber(advocate.phoneNumber)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile View: Stacked Cards */}
      {filteredAdvocates.map((advocate, index) => (
        <div key={index} className="md:hidden block">
          <div className="p-4 rounded-lg shadow-md my-4 bg-white">
            <p className="text-lg font-semibold text-gray-900">
              {advocate.firstName} {advocate.lastName}
            </p>
            <p className="text-gray-700">{advocate.city}</p>
            <p className="text-sm text-gray-600">Degree: {advocate.degree}</p>
            <p className="text-sm text-gray-600">
              Experience: {advocate.yearsOfExperience} yrs
            </p>
            <p className="text-sm text-gray-600">
              Phone: {advocate.phoneNumber}
            </p>

            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Specialties:</p>
              <ul className="list-inside text-gray-600 text-sm">
                {advocate.specialties.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
