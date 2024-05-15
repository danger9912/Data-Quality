import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Navbar from './components/Navbar';
import Omission from './components/Omission';
import Comission from './components/Comission';
import GeneralDetails from './components/GeneralDetails';
import DomainConsistency from './components/DomainConsistency';
import FormatConsistency from "./components/FormatConsistency";
import TemporalVal from "./components/TemporalVal";
import Format from "./components/Format";
import AccuracyTimeManagement from "./components/AccuracyTimeManagement";

import Dateformat from "./components/Dateformat";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/generaldetails" element={<GeneralDetails />} />
        <Route path="/omission" element={<Omission />} />
        <Route path="/comission" element={<Comission />} />
        <Route path="/domainconsistency" element={<DomainConsistency />} />
        <Route path="/formatconsistency" element={<FormatConsistency />} />
        <Route path="/format" element={<Format />} />
        <Route path="/temporalval" element={<TemporalVal />} />
        <Route path="/acctimeasurement" element={<AccuracyTimeManagement />} />
        <Route path="/dateformate" element={<Dateformat />} />
      </Routes>
     </BrowserRouter>
  );
}

export default App;