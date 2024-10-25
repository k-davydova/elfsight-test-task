/* eslint-disable prettier/prettier */
import styled from 'styled-components';
import { API_URL, useData } from '../providers';
import { useEffect } from 'react';
import { useState } from 'react';

const getAllCharacters = async () => {
  const characters = [];
  let totalPages = 1;

  for (let i = 1; i <= totalPages; i++) {
    const response = await fetch(`${API_URL}?page=${i}`);
    const data = await response.json();
    characters.push(...data.results);

    totalPages = data.info.pages;
  }

  return characters;
};

const getValues = async (value) => {
  const characters = await getAllCharacters();
  const values = [];

  characters.forEach((character) => {
    if (!values.includes(character[value]) && character[value]) {
      values.push(character[value]);
    }
  });

  return values;
};

export function Filters() {
  const { setSearchParams } = useData();

  const [values, setValues] = useState({
    name: '',
    statuses: [],
    species: [],
    types: [],
    genders: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const statuses = await getValues('status');
      const species = await getValues('species');
      const types = await getValues('type');
      const genders = await getValues('gender');

      setValues((prevValues) => ({
        ...prevValues,
        statuses,
        species,
        types,
        genders
      }));
    };

    fetchData();
  }, []);

  const updateSearchParams = (name, value) => {
    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams);

      if (value) {
        params.set('page', '1');
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params;
    });
  };

  const handleChangeFilter = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === 'name') return;

    updateSearchParams(name, value);
  };

  const handleClickFilter = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (event.key === 'Enter' && name === 'name') {
      updateSearchParams(name, value);
    }
  };

  return (
    <Container>
      <div>
        <StyledInput
          name="name"
          type="text"
          placeholder="Search by name"
          onKeyDown={handleClickFilter}
        />
      </div>
      <div>
        <StyledSelect name="status" onChange={handleChangeFilter}>
          <option value="">Select Status</option>
          {values.statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </StyledSelect>
      </div>
      <div>
        <StyledSelect name="specie" onChange={handleChangeFilter}>
          <option value="">Select Specie</option>
          {values.species.map((specie) => (
            <option key={specie} value={specie}>
              {specie}
            </option>
          ))}
        </StyledSelect>
      </div>
      <div>
        <StyledSelect name="type" onChange={handleChangeFilter}>
          <option value="">Select Type</option>
          {values.types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </StyledSelect>
      </div>
      <div>
        <StyledSelect name="gender" onChange={handleChangeFilter}>
          <option value="">Select Gender</option>
          {values.genders.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </StyledSelect>
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding: 10px 10px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  gap: 12px;
`;

const StyledInput = styled.input`
  padding: 6px;
  max-width: 180px;
  border: none;
  border-radius: 6px;
`;
const StyledSelect = styled.select`
  padding: 6px;
  max-width: 180px;
  border: none;
  border-radius: 6px;
`;

