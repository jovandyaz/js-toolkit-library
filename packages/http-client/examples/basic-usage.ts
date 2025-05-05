/**
 * @file Ejemplo básico de uso del cliente HTTP
 * Este archivo demuestra el uso básico del cliente HTTP para realizar peticiones GET, POST, PUT y DELETE
 */

import { createHttpClient } from '../src/index';
import { IHttpClient, isHttpError } from '../src/lib/types';

// Crear una instancia del cliente HTTP
const httpClient: IHttpClient = createHttpClient({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

async function basicExample(): Promise<void> {
  try {
    // GET - Obtener un usuario
    console.log('Obteniendo usuario...');
    const user = await httpClient.get<User>('/users/1');
    console.log('Usuario:', user);

    // GET - Obtener lista de posts
    console.log('\nObteniendo posts...');
    const posts = await httpClient.get<Post[]>('/posts', {
      params: { _limit: 3 },
    });
    console.log(`${posts.length} posts obtenidos`);

    // POST - Crear un nuevo recurso
    console.log('\nCreando un nuevo post...');
    const newPostData = {
      title: 'Ejemplo de post',
      body: 'Este es un ejemplo de post creado con http-client',
      userId: 1,
    };
    const newPost = await httpClient.post<Post, typeof newPostData>(
      '/posts',
      newPostData
    );
    console.log('Post creado:', newPost);

    // PUT - Actualizar un recurso existente
    console.log('\nActualizando post...');
    const updateData = {
      title: 'Título actualizado',
      body: 'Contenido actualizado',
      userId: 1,
    };
    const updatedPost = await httpClient.put<Post, typeof updateData>(
      `/posts/${newPost.id}`,
      updateData
    );
    console.log('Post actualizado:', updatedPost);

    // DELETE - Eliminar un recurso
    console.log('\nEliminando post...');
    await httpClient.delete(`/posts/${newPost.id}`);
    console.log('Post eliminado exitosamente');
  } catch (error) {
    if (isHttpError(error)) {
      console.error('Error HTTP:', error.message, error.response?.status);
    } else {
      console.error('Error desconocido:', (error as Error).message);
    }
  }
}

// Para uso como script independiente
basicExample().catch(console.error);

// Para uso en importaciones
export { basicExample };
export default basicExample;
