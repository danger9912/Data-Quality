import { BrowserRouter, Route, Routes } from "react-router-dom";
import AccuracyTimeManagement from "./components/AccuracyTimeManagement";
import AccuracyNumber from "./components/AccuracyTimeMeasurement/AccuracyTime";
import Main from "./components/AccuracyTimeMeasurement/Main";
import CheckAllFields from "./components/CheckAllFields";
import Comission from "./components/Comission";
import DateFormat from "./components/DateFormat";
import DomainConsistency from "./components/DomainConsistency";
import Format from "./components/Format";
import FormatConsist from "./components/FormatConsist";
import GeneralDetails from "./components/GeneralDetails";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import NonQuantitative from "./components/NonQuantitative";
import Omission from "./components/Omission";
import AbsolutePA from "./components/PositionalAccuracy/AbsolutePA";
import GriddedPA from "./components/PositionalAccuracy/GriddedPA";
import RelativePA from "./components/PositionalAccuracy/RelativePA";
import TemporalVal from "./components/TemporalVal";
import ThematicClassfication from "./components/ThematicClassfication";
import UserDefined from "./components/UserDefined";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generaldetails" element={<GeneralDetails />} />
        <Route path="/omission" element={<Omission />} />
        <Route path="/comission" element={<Comission />} />
        <Route path="/domainconsistency" element={<DomainConsistency />} />
        <Route path="/formatconsistency" element={<FormatConsist />} />
        <Route path="/format" element={<Format />} />
        <Route path="/formatdate" element={<DateFormat />} />
        <Route path="/temporalval" element={<TemporalVal />} />
        <Route path="/acctimeasurement" element={<AccuracyTimeManagement />} />
        <Route path="/activemeasurement" element={<AccuracyNumber />} />
        <Route path="/Quantitative" element={<Main />} />
        <Route
          path="/ThematicClassification"
          element={<ThematicClassfication />}
        />
        <Route path="/nonquantitative" element={<NonQuantitative />} />
        <Route path="/checkallfields" element={<CheckAllFields />} />
        <Route path="/userdefined" element={<UserDefined />} />

        {/* POSITIONAL ACCURACY */}
        <Route path="/absolutepositionalaccuracy" element={<AbsolutePA />} />
        <Route path="/relativepositionalaccuracy" element={<RelativePA />} />
        <Route path="/griddedpositionalaccuracy" element={<GriddedPA />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
