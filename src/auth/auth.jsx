import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Monitorar mudanças de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser)
          // Buscar dados adicionais do usuário no Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid)
          const userDocSnap = await getDoc(userDocRef)
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data())
          }
        } else {
          setUser(null)
          setUserData(null)
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Registrar novo usuário
  const register = async (nome, idade, email, senha) => {
    setError('')
    try {
      // Validações
      if (!nome || nome.trim().length === 0) {
        throw new Error('Nome é obrigatório')
      }
      if (!idade || idade < 1 || idade > 120) {
        throw new Error('Idade deve estar entre 1 e 120 anos')
      }
      if (!email || !email.includes('@')) {
        throw new Error('Email válido é obrigatório')
      }
      if (!senha || senha.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres')
      }

      // Criar usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
      const firebaseUser = userCredential.user

      // Salvar dados adicionais no Firestore
      const userData = {
        uid: firebaseUser.uid,
        nome: nome.trim(),
        idade: parseInt(idade),
        email: email.trim(),
        dataCriacao: new Date().toISOString(),
        personagens: [],
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), userData)

      setUser(firebaseUser)
      setUserData(userData)
      return userData
    } catch (err) {
      const errorMessage = err.code === 'auth/email-already-in-use'
        ? 'Este email já está registrado'
        : err.code === 'auth/weak-password'
        ? 'Senha muito fraca'
        : err.message
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Login com email e senha
  const login = async (email, senha) => {
    setError('')
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Email válido é obrigatório')
      }
      if (!senha) {
        throw new Error('Senha é obrigatória')
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, senha)
      const firebaseUser = userCredential.user

      // Buscar dados do usuário
      const userDocRef = doc(db, 'users', firebaseUser.uid)
      const userDocSnap = await getDoc(userDocRef)

      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data())
      }

      return userDocSnap.data()
    } catch (err) {
      const errorMessage = err.code === 'auth/user-not-found'
        ? 'Usuário não encontrado'
        : err.code === 'auth/wrong-password'
        ? 'Senha incorreta'
        : err.message
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Logout
  const logout = async () => {
    setError('')
    try {
      await signOut(auth)
      setUser(null)
      setUserData(null)
    } catch (err) {
      setError(err.message)
      throw new Error(err.message)
    }
  }

  // Resetar senha
  const resetPassword = async (email) => {
    setError('')
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Email válido é obrigatório')
      }
      await sendPasswordResetEmail(auth, email)
      return 'Email de recuperação enviado!'
    } catch (err) {
      setError(err.message)
      throw new Error(err.message)
    }
  }

  // Atualizar dados do usuário no Firestore
  const updateUserData = async (newData) => {
    setError('')
    try {
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const userDocRef = doc(db, 'users', user.uid)
      const updatedData = {
        ...userData,
        ...newData,
        dataAtualizacao: new Date().toISOString(),
      }

      await setDoc(userDocRef, updatedData, { merge: true })
      setUserData(updatedData)
      return updatedData
    } catch (err) {
      setError(err.message)
      throw new Error(err.message)
    }
  }

  // Verificar autenticação
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      isAuthenticated,
      loading,
      error,
      register,
      login,
      logout,
      resetPassword,
      updateUserData,
      setError,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
