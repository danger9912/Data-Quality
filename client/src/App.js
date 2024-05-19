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
import AccuracyTime from "./components/AccuracyTime";
import DateFormat from './components/DateFormat';
import Pincodeformate from "./components/FormatConsistency/Pincodeformate";
import FormatConsist from "./components/FormatConsist";
import StateFormat from "./components/FormatConsistency/StateFormat";
import UnionTerritoriesFormat from "./components/FormatConsistency/UnionTerritoriesFormat";
import DistrictFormat from "./components/FormatConsistency/DistrictFormat";

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/generaldetails" element={<GeneralDetails />} />
        <Route path="/omission" element={<Omission />} />
        <Route path="/comission" element={<Comission />} />
        <Route path="/domainconsistency" element={<DomainConsistency />} />
        <Route path="/formatconsistency" element={<FormatConsist />} />
        <Route path="/format" element={<Format />} />
        <Route path="/formatdate" element={<DateFormat />} />
        <Route path="/temporalval" element={<TemporalVal />} />
        <Route path="/acctimeasurement" element={<AccuracyTimeManagement />} />
        <Route path="/activemeasurement" element={<AccuracyTime />} />
        <Route path="/pincode" element={<Pincodeformate/>}/>
        <Route path="/state" element={<StateFormat/>}/>
        <Route path="/unionterr" element={<UnionTerritoriesFormat/>}/>
        <Route path="/district" element={<DistrictFormat/>}/>
      </Routes>
     </BrowserRouter>
  );
}

export default App;