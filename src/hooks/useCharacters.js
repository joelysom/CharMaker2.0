import { useState, useCallback } from 'react'
import {
  saveCharacter,
  getUserCharacters,
  getUserCharactersByGender,
  getCharacter,
  updateCharacter,
  deleteCharacter,
  getCharactersByHairAndGender,
  captureCharacterImage,
} from '../services/characterService'

/**
 * Hook para gerenciar personagens
 */
export function useCharacters(userId) {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  /**
   * Carregar todos os personagens do usuário
   */
  const loadCharacters = useCallback(async () => {
    if (!userId) {
      setError('Usuário não autenticado')
      return
    }

    setLoading(true)
    setError('')

    try {
      const chars = await getUserCharacters(userId)
      setCharacters(chars)
    } catch (err) {
      setError(err.message)
      console.error('Erro ao carregar personagens:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  /**
   * Carregar personagens por gênero
   */
  const loadCharactersByGender = useCallback(async (gender) => {
    if (!userId) {
      setError('Usuário não autenticado')
      return
    }

    setLoading(true)
    setError('')

    try {
      const chars = await getUserCharactersByGender(userId, gender)
      setCharacters(chars)
    } catch (err) {
      setError(err.message)
      console.error('Erro ao carregar personagens:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  /**
   * Carregar personagens organizados por cabelo e gênero
   */
  const loadCharactersByHairAndGender = useCallback(async (gender) => {
    if (!userId) {
      setError('Usuário não autenticado')
      return
    }

    setLoading(true)
    setError('')

    try {
      const organized = await getCharactersByHairAndGender(userId, gender)
      return organized
    } catch (err) {
      setError(err.message)
      console.error('Erro ao carregar personagens:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  /**
   * Salvar novo personagem
   */
  const createCharacter = useCallback(async (characterData) => {
    if (!userId) {
      setError('Usuário não autenticado')
      return
    }

    setLoading(true)
    setError('')

    try {
      const newCharacter = await saveCharacter(userId, characterData)
      setCharacters([...characters, newCharacter])
      setSelectedCharacter(newCharacter)
      return newCharacter
    } catch (err) {
      setError(err.message)
      console.error('Erro ao criar personagem:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [userId, characters])

  /**
   * Atualizar personagem existente
   */
  const updateExistingCharacter = useCallback(async (characterId, updates) => {
    if (!userId) {
      setError('Usuário não autenticado')
      return
    }

    setLoading(true)
    setError('')

    try {
      const updated = await updateCharacter(userId, characterId, updates)
      
      // Atualizar lista local
      setCharacters(characters.map(char => 
        char.id === characterId ? updated : char
      ))
      
      // Atualizar seleção se for o personagem selecionado
      if (selectedCharacter?.id === characterId) {
        setSelectedCharacter(updated)
      }

      return updated
    } catch (err) {
      setError(err.message)
      console.error('Erro ao atualizar personagem:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [userId, characters, selectedCharacter])

  /**
   * Deletar personagem
   */
  const removeCharacter = useCallback(async (characterId) => {
    if (!userId) {
      setError('Usuário não autenticado')
      return
    }

    setLoading(true)
    setError('')

    try {
      await deleteCharacter(userId, characterId)
      
      // Remover da lista local
      setCharacters(characters.filter(char => char.id !== characterId))
      
      // Limpar seleção se foi deletado
      if (selectedCharacter?.id === characterId) {
        setSelectedCharacter(null)
      }

      return true
    } catch (err) {
      setError(err.message)
      console.error('Erro ao deletar personagem:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [userId, characters, selectedCharacter])

  /**
   * Selecionar um personagem
   */
  const selectCharacter = useCallback(async (characterId) => {
    if (!userId) {
      setError('Usuário não autenticado')
      return
    }

    setLoading(true)
    setError('')

    try {
      const char = await getCharacter(userId, characterId)
      setSelectedCharacter(char)
      return char
    } catch (err) {
      setError(err.message)
      console.error('Erro ao selecionar personagem:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  /**
   * Capturar imagem do personagem
   */
  const captureImage = useCallback(async (characterId, imageDataUrl) => {
    if (!userId) {
      setError('Usuário não autenticado')
      return
    }

    setLoading(true)
    setError('')

    try {
      const updated = await captureCharacterImage(userId, characterId, imageDataUrl)
      
      // Atualizar lista local
      setCharacters(characters.map(char => 
        char.id === characterId ? updated : char
      ))
      
      // Atualizar seleção se for o personagem selecionado
      if (selectedCharacter?.id === characterId) {
        setSelectedCharacter(updated)
      }

      return updated
    } catch (err) {
      setError(err.message)
      console.error('Erro ao capturar imagem:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [userId, characters, selectedCharacter])

  /**
   * Limpar erro
   */
  const clearError = useCallback(() => {
    setError('')
  }, [])

  return {
    characters,
    loading,
    error,
    selectedCharacter,
    setSelectedCharacter,
    loadCharacters,
    loadCharactersByGender,
    loadCharactersByHairAndGender,
    createCharacter,
    updateExistingCharacter,
    removeCharacter,
    selectCharacter,
    captureImage,
    clearError,
  }
}
