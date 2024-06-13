import { UserProvider } from "./context/UserContext"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import Welcome from "./components/pages/Welcome"
import Home from "./components/pages/Home"
import About from "./components/pages/About"
import Contact from "./components/pages/Contact"
import GeneralView from "./components/sections/GeneralView"
import Calendar from "./components/sections/Calendar"
import Settings from "./components/pages/Settings"
import Login from "./components/pages/Login"
import Register from "./components/pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/home/*" element={<ProtectedRoute><Home /></ProtectedRoute>}>
              {/* Rutas secundarias dentro de /home */}
              <Route index element={<GeneralView />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="settings" element={<Settings />} />
              <Route path="habits" element={<Settings />} />
            </Route>
            <Route path="/about-us" element={<About />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  )
}

export default App
