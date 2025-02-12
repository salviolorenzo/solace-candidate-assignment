"use client";

import { Advocate } from "@/db/schema";
import { useCallback, useEffect, useState } from "react";

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

  const debouncedSetSearchInputValue = useCallback((value: string) => {
    const timeout = setTimeout(() => {
      setSearchInputValue(value);
    }, 300);

    return () => clearTimeout(timeout);
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
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          onChange={onSearchInputChange}
          value={searchInputValue}
        />
        <button onClick={onClickReset}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, index) => {
            return (
              <tr key={index}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s, idx) => (
                    <div key={idx}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
