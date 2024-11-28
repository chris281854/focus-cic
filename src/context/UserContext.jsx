import { create } from "zustand"
import axios from "axios"
import Cookies from "js-cookie"

const useUserStore = create((set) => ({
  user: null,
  userProfile: [],
  loading: true,
  lifeAreas: [],
  events: [],
  allEvents: [],
  lifeAreas: [],
  darkMode: (() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) {
      return savedMode
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark"
    } else return "light"
  })(),
  timezone: localStorage.getItem("timezone") || "UTC",
  themeColor: localStorage.getItem("themeColor") || "54, 55, 58",
  secondaryColor: localStorage.getItem("secondaryColor") || "193, 184, 179",
  tertiaryColor: localStorage.getItem("tertiaryColor") || "151, 136, 122",
  loggedWithGoogle: false,

  setLoggedWithGoogle: (value) => set(() => ({ loggedWithGoogle: value })),

  setThemeColor: async (theme, secondary, tertiary) => {
    localStorage.setItem("themeColor", theme)
    localStorage.setItem("secondaryColor", secondary)
    localStorage.setItem("tertiaryColor", tertiary)
    set({
      themeColor: theme,
      secondaryColor: secondary,
      tertiaryColor: tertiary,
    })

    const userId = useUserStore.getState().user.user_id
    try {
      await axios.patch(
        `http://localhost:3001/api/update/userConfig`,
        {
          userId: userId,
          theme: theme,
        },
        { withCredentials: true }
      )
      console.log(
        `User theme updated to ${theme} and ${secondary} successfully`
      )
    } catch (error) {
      console.error(error)
    }
  },

  setTimezone: async (timezone) => {
    localStorage.setItem("timezone", timezone)
    set({ timezone })

    const userId = useUserStore.getState().user.user_id
    try {
      await axios.patch(
        `http://localhost:3001/api/update/userConfig`,
        { userId: userId, timezone: timezone },
        { withCredentials: true }
      )
      console.log(`User timezone updated to ${timezone} successfully`)
    } catch (error) {
      console.error(error)
    }
  },

  login: async (userData) => {
    set({ user: userData.user })

    console.log("userData: ", userData) //Estoy obteniendo correctamente los datos del usuario (id, email, etc)

    try {
      const areasResponse = await axios.get(
        "http://localhost:3001/api/get/lifeAreas",
        {
          withCredentials: true, //Esto asegura que las cookies se envíen automaticamente
        }
      )
      const areas = areasResponse.data
      set({ lifeAreas: areas })
      console.log("Áreas de vida obtenidas:", areas)
    } catch (areasError) {
      console.error("Error al obtener las áreas de vida:", areasError)
    }

    try {
      const eventsResponse = await axios.get(
        `http://localhost:3001/api/get/events?userId=${userData.user.user_id}`,
        {
          withCredentials: true, //Esto asegura que las cookies se envíen automaticamente
        }
      )
      const events = eventsResponse.data
      set({ events: events })
      console.log("Eventos obtenidos:", events)
    } catch (eventsError) {
      console.error("Error al obtener los eventos:", eventsError)
    }

    try {
      const allEventsResponse = await axios.get(
        `http://localhost:3001/api/get/allEvents?userId=${userData.user.user_id}`,
        {
          withCredentials: true, //Esto asegura que las cookies se envíen automaticamente
        }
      )
      const allEvents = allEventsResponse.data
      set({ allEvents: allEvents })
      console.log("AllEvents obtenidos:", allEvents)
    } catch (allEventsError) {
      console.error("Error al obtener allEvents", allEventsError)
    }
  },

  logout: async () => {
    try {
      await axios.post(
        "http://localhost:3001/api/logout",
        {},
        { withCredentials: true }
      )
      set({ user: null })
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  },

  getUserProfile: async () => {
    const user = useUserStore.getState().user
    try {
      const response = await axios.get(
        `http://localhost:3001/api/get/userData?userId=${user.user_id}`,
        { withCredentials: true }
      )
      set({ userProfile: response.data })
    } catch (error) {
      console.error("Error al obtener los datos de usuario: ", error)
    }
  },

  updateUserProfile: async () => {
    const user = useUserStore.getState().user
    try {
      const response = await axios.put(
        `http://localhost:3001/api/updateProfile`,
        {},
        { withCredentials: true }
      )
      set({ userProfile: response.data })
    } catch (error) {
      console.error("Error al actualizar los datos de usuario: ", error)
    }
  },

  updateLifeAreas: (areas) => set({ lifeAreas: areas }),

  fetchEvents: async () => {
    const user = useUserStore.getState().user
    if (!user) {
      console.error("No se ha iniciado sesión.")
      return
    }
    const userId = user.user_id
    try {
      const response = await axios.get(
        `http://localhost:3001/api/get/events?userId=${userId}`,
        { withCredentials: true }
      )
      set({ events: response.data })
    } catch (error) {
      console.error("Error al obtener los eventos: ", error)
    }
  },

  fetchAllEvents: async () => {
    const user = useUserStore.getState().user
    if (!user) {
      console.error("No se ha iniciado sesión.")
      return
    }
    const userId = user.user_id
    try {
      const response = await axios.get(
        `http://localhost:3001/api/get/allEvents?userId=${userId}`,
        { withCredentials: true }
      )
      set({ allEvents: response.data })
    } catch (error) {
      console.error("Error al obtener los eventos: ", error)
    }
  },

  fetchLifeAreas: async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/get/lifeAreas",
        { withCredentials: true }
      )
      set({ lifeAreas: response.data })
    } catch (error) {
      console.error("Error al obtener las áreas de vida: ", error)
    }
  },

  verifyToken: async () => {
    // const token = Cookies.get("token") // Leer el token desde la cookie no es posible por httpOnly
    try {
      const response = await axios.post(
        "http://localhost:3001/api/verifyToken",
        {},
        {
          withCredentials: true, //Cookies se envían automáticamente
        }
      )

      if (response.status === 200) {
        const userData = response.data

        // Obtener las áreas de vida del usuario
        const areasResponse = await axios.get(
          "http://localhost:3001/api/get/lifeAreas",
          {
            withCredentials: true,
          }
        )

        set({ lifeAreas: areasResponse.data, user: userData.user })
      } else {
        throw new Error("Token inválido")
      }
    } catch (error) {
      console.error("Error al verificar el token:", error)
      set({ user: null })
    } finally {
      set({ loading: false })
    }
  },

  toggleDarkMode: () =>
    set((state) => {
      const newMode = state.darkMode === "light" ? "dark" : "light"
      localStorage.setItem("darkMode", newMode)
      document
        .querySelector("html")
        .classList.toggle("dark", newMode === "dark")
      return { darkMode: newMode }
    }),
}))

// Reminder: Acceder al estado global usando el nuevo hook de Zustand / No más useContext
export const useUser = useUserStore
