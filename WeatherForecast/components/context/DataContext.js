import React, {createContext, useState} from 'react';

export const DataContext = createContext();

const DataContextProvider = ({children}) => {
  //State
  const [C, setC] = useState(false);
  const [kmh, setKmh] = useState(false);
  const [mbar, setMbar] = useState(false);
  const [km, setKm] = useState(false);
  const [s, setSearch] = useState('');
  const [locate, setLocate] = useState([]);

  const toggleSwitchC = () => setC(previousState => !previousState);
  const toggleSwitchKmh = () => setKmh(previousState => !previousState);
  const toggleSwitchMbar = () => setMbar(previousState => !previousState);
  const toggleSwitchKm = () => setKm(previousState => !previousState);
  const handleSearch = value => setSearch(value);
  const handleLocate = city => setLocate(city);

  //context data
  const dataContext = {
    C,
    kmh,
    mbar,
    km,
    s,
    locate,
    toggleSwitchC,
    toggleSwitchKmh,
    toggleSwitchMbar,
    toggleSwitchKm,
    handleSearch,
    handleLocate,
  };

  // return provider
  return (
    <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>
  );
};

export default DataContextProvider;
