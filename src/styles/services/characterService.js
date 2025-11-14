import { db } from '../firebase/firebase'
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore'

// Mapa de IDs de cabelo para categorias
const HAIR_CATEGORIES = {
  // Liso
  1: 'LISO',
  2: 'LISO',
  3: 'LISO',
  12: 'LISO',
  // Cacheado
  8: 'CACHEADO',
  9: 'CACHEADO',
  // Crespo
  10: 'CRESPO',
  11: 'CRESPO',
  // Ondulado
  14: 'ONDULADO',
  15: 'ONDULADO',
  16: 'ONDULADO',
  // Cultural
  4: 'CULTURAL',
  5: 'CULTURAL',
  6: 'CULTURAL',
  7: 'CULTURAL',
  13: 'CULTURAL',
}

/**
 * Obter categoria do cabelo pelo ID
 */
export const getHairCategory = (hairId) => {
  return HAIR_CATEGORIES[hairId] || 'DESCONHECIDO'
}

/**
 * Salvar um novo personagem
 */
export const saveCharacter = async (userId, characterData) => {
  try {
    if (!userId) throw new Error('ID do usuário é obrigatório')

    // Validar dados obrigatórios
    const requiredFields = ['gender', 'hairId', 'bodyType', 'faceOption', 'skinColor', 'characterName']
    for (const field of requiredFields) {
      if (characterData[field] === undefined || characterData[field] === null) {
        throw new Error(`Campo obrigatório faltando: ${field}`)
      }
    }

    // Gerar ID único para o personagem
    const characterId = `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Estruturar dados do personagem
    const characterDoc = {
      id: characterId,
      userId,
      characterName: characterData.characterName,
      gender: characterData.gender, // 'MALE' ou 'FEMALE'
      
      // Dados do corpo
      bodyType: characterData.bodyType, // 'body1', 'body2', 'body3'
      skinColor: characterData.skinColor, // 'skin1', 'skin2', 'skin3', 'skin4', 'skin5'
      
      // Dados do rosto
      faceOption: characterData.faceOption, // 'face1', 'face2', 'face3', 'face4', 'face5'
      
      // Dados do cabelo
      hairId: characterData.hairId, // ID numérico do cabelo
      hairCategory: getHairCategory(characterData.hairId), // Categoria organizada
      
      // Metadados
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: characterData.imageUrl || null, // URL da imagem do personagem (captura de tela)
      
      // Dados adicionais
      description: characterData.description || '',
    }

    // Salvar no Firestore
    const userCharactersRef = doc(db, 'users', userId, 'characters', characterId)
    await setDoc(userCharactersRef, characterDoc)

    // Também atualizar lista de personagens no documento do usuário
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    const currentPersonagens = userSnap.data()?.personagens || []
    
    await updateDoc(userRef, {
      personagens: [...currentPersonagens, {
        id: characterId,
        characterName: characterData.characterName,
        gender: characterData.gender,
      }]
    })

    return characterDoc
  } catch (error) {
    console.error('Erro ao salvar personagem:', error)
    throw new Error(`Erro ao salvar personagem: ${error.message}`)
  }
}

/**
 * Obter todos os personagens de um usuário
 */
export const getUserCharacters = async (userId) => {
  try {
    if (!userId) throw new Error('ID do usuário é obrigatório')

    const userCharactersRef = collection(db, 'users', userId, 'characters')
    const q = query(userCharactersRef)
    const querySnapshot = await getDocs(q)
    
    const characters = []
    querySnapshot.forEach(doc => {
      characters.push(doc.data())
    })

    return characters
  } catch (error) {
    console.error('Erro ao obter personagens:', error)
    throw new Error(`Erro ao obter personagens: ${error.message}`)
  }
}

/**
 * Obter personagens filtrados por gênero
 */
export const getUserCharactersByGender = async (userId, gender) => {
  try {
    if (!userId) throw new Error('ID do usuário é obrigatório')
    if (!gender) throw new Error('Gênero é obrigatório')

    const userCharactersRef = collection(db, 'users', userId, 'characters')
    const q = query(userCharactersRef, where('gender', '==', gender))
    const querySnapshot = await getDocs(q)
    
    const characters = []
    querySnapshot.forEach(doc => {
      characters.push(doc.data())
    })

    return characters
  } catch (error) {
    console.error('Erro ao obter personagens por gênero:', error)
    throw new Error(`Erro ao obter personagens: ${error.message}`)
  }
}

/**
 * Obter um personagem específico
 */
export const getCharacter = async (userId, characterId) => {
  try {
    if (!userId || !characterId) throw new Error('IDs obrigatórios')

    const characterRef = doc(db, 'users', userId, 'characters', characterId)
    const characterSnap = await getDoc(characterRef)
    
    if (!characterSnap.exists()) {
      throw new Error('Personagem não encontrado')
    }

    return characterSnap.data()
  } catch (error) {
    console.error('Erro ao obter personagem:', error)
    throw new Error(`Erro ao obter personagem: ${error.message}`)
  }
}

/**
 * Atualizar um personagem
 */
export const updateCharacter = async (userId, characterId, updates) => {
  try {
    if (!userId || !characterId) throw new Error('IDs obrigatórios')

    const characterRef = doc(db, 'users', userId, 'characters', characterId)
    
    // Se o hairId foi atualizado, recalcular a categoria
    if (updates.hairId !== undefined) {
      updates.hairCategory = getHairCategory(updates.hairId)
    }

    updates.updatedAt = new Date().toISOString()

    await updateDoc(characterRef, updates)

    // Retornar os dados atualizados
    const updated = await getCharacter(userId, characterId)
    return updated
  } catch (error) {
    console.error('Erro ao atualizar personagem:', error)
    throw new Error(`Erro ao atualizar personagem: ${error.message}`)
  }
}

/**
 * Deletar um personagem
 */
export const deleteCharacter = async (userId, characterId) => {
  try {
    if (!userId || !characterId) throw new Error('IDs obrigatórios')

    // Deletar documento do personagem
    const characterRef = doc(db, 'users', userId, 'characters', characterId)
    await deleteDoc(characterRef)

    // Atualizar lista de personagens no documento do usuário
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    const currentPersonagens = userSnap.data()?.personagens || []
    
    await updateDoc(userRef, {
      personagens: currentPersonagens.filter(p => p.id !== characterId)
    })

    return true
  } catch (error) {
    console.error('Erro ao deletar personagem:', error)
    throw new Error(`Erro ao deletar personagem: ${error.message}`)
  }
}

/**
 * Obter personagens organizados por cabelo e gênero
 */
export const getCharactersByHairAndGender = async (userId, gender) => {
  try {
    if (!userId) throw new Error('ID do usuário é obrigatório')
    if (!gender) throw new Error('Gênero é obrigatório')

    const characters = await getUserCharactersByGender(userId, gender)

    // Organizar por categoria de cabelo
    const organized = {
      LISO: [],
      CACHEADO: [],
      ONDULADO: [],
      CRESPO: [],
      CULTURAL: [],
      DESCONHECIDO: []
    }

    characters.forEach(char => {
      const category = char.hairCategory || 'DESCONHECIDO'
      if (organized[category]) {
        organized[category].push(char)
      } else {
        organized.DESCONHECIDO.push(char)
      }
    })

    return organized
  } catch (error) {
    console.error('Erro ao organizar personagens:', error)
    throw new Error(`Erro ao organizar personagens: ${error.message}`)
  }
}

/**
 * Exportar dados do personagem como JSON
 */
export const exportCharacterData = (character) => {
  return JSON.stringify(character, null, 2)
}

/**
 * Capturar e salvar imagem do personagem
 */
export const captureCharacterImage = async (userId, characterId, imageDataUrl) => {
  try {
    if (!userId || !characterId) throw new Error('IDs obrigatórios')

    // Aqui você poderia fazer upload da imagem para Firebase Storage
    // Por enquanto, apenas salvamos a referência/dados da imagem
    
    const updated = await updateCharacter(userId, characterId, {
      imageUrl: imageDataUrl,
      lastImageCapture: new Date().toISOString()
    })

    return updated
  } catch (error) {
    console.error('Erro ao capturar imagem:', error)
    throw new Error(`Erro ao capturar imagem: ${error.message}`)
  }
}
