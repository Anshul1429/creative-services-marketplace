import { createContext, useContext, useMemo, useState } from "react"

const AuthContext = createContext(null)
const SESSION_KEY = "flg-demo-auth-session"

export const demoAccounts = [
  {
    name: "Riya Sharma",
    email: "buyer@demo.com",
    password: "buyer123",
    role: "client",
  },
  {
    name: "Aarav Mehta",
    email: "seller@demo.com",
    password: "seller123",
    role: "seller",
  },
]

function readSession() {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored)
    if (
      parsed &&
      typeof parsed.name === "string" &&
      typeof parsed.email === "string" &&
      ["client", "buyer", "seller", "freelancer"].includes(parsed.role)
    ) {
      return parsed
    }

    localStorage.removeItem(SESSION_KEY)
    return null
  } catch (error) {
    console.error("Unable to restore the demo authentication session.", error)
    return null
  }
}

function normalizeRole(role) {
  return role === "freelancer" || role === "seller" ? "seller" : "client"
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)
  const [passwordOverrides, setPasswordOverrides] = useState({})

  const saveUser = (details) => {
    const nextUser = {
      name: details.name || details.email,
      email: details.email,
      role: normalizeRole(details.role),
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    return nextUser
  }

  const value = useMemo(
    () => ({
      user,
      demoAccounts: demoAccounts.map(({ name, email, role }) => ({
        name,
        email,
        role,
      })),
      authenticate: (email, password) => {
        const account = demoAccounts.find(
          (item) => item.email === email.trim().toLowerCase(),
        )
        if (!account) throw new Error("Email or password does not match a demo account.")
        if (
          (passwordOverrides[account.email] || account.password) !== password
        ) {
          throw new Error("Email or password does not match this demo account.")
        }
        return saveUser(account)
      },
      signIn: (details) => saveUser(details),
      login: (details) => saveUser(details),
      register: (details) => saveUser(details),
      switchRole: (role) => {
        if (user) saveUser({ ...user, role })
      },
      requestPasswordReset: (email) =>
        demoAccounts.some(
          (account) => account.email === email.trim().toLowerCase(),
        ),
      resetDemoPassword: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        if (!demoAccounts.some((account) => account.email === normalizedEmail)) {
          throw new Error("Password reset is available only for the listed demo accounts.")
        }
        setPasswordOverrides((current) => ({
          ...current,
          [normalizedEmail]: password,
        }))
      },
      signOut: () => {
        localStorage.removeItem(SESSION_KEY)
        setUser(null)
      },
    }),
    [user, passwordOverrides],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error("useAuth must be used inside AuthProvider")
  return auth
}
