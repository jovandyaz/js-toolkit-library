// Test que demuestra las capacidades de mocking del cliente HTTP

import { createMockHttpClient } from '../src/lib/testing';
import { IHttpClient, isHttpError } from '../src/lib/types';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId?: number;
}

async function runMockTest(): Promise<void> {
  console.log('🧪 Probando el cliente HTTP simulado...');

  // Crear un mock del cliente HTTP con respuestas predefinidas
  const mockClient: IHttpClient = createMockHttpClient({
    get: {
      '/users/1': {
        id: 1,
        name: 'Usuario de Prueba',
        email: 'test@example.com',
      } as User,
      '/posts': [
        { id: 1, title: 'Post de prueba 1', body: 'Contenido 1' },
        { id: 2, title: 'Post de prueba 2', body: 'Contenido 2' },
      ] as Post[],
    },
    post: {
      '/posts': {
        id: 101,
        title: 'Nuevo post simulado',
        body: 'Contenido simulado',
        userId: 1,
      } as Post,
    },
  });

  try {
    // Probar GET
    console.log('\n📡 Simulando obtención de usuario...');
    const user = await mockClient.get<User>('/users/1');
    console.log('✅ Usuario simulado obtenido:');
    console.log(user);

    // Verificar número de llamadas (tracking de llamadas)
    const getCalls = (mockClient.get as any).mock?.calls || [];
    console.log(`ℹ️ El método GET fue llamado ${getCalls.length} vez(ces).`);

    // Probar GET a colección
    console.log('\n📡 Simulando obtención de posts...');
    const posts = await mockClient.get<Post[]>('/posts');
    console.log(`✅ ${posts.length} posts simulados obtenidos:`);
    console.log(posts);

    // Probar POST
    console.log('\n📡 Simulando creación de post...');
    const newPostData = {
      title: 'Esto no se usará en la respuesta simulada',
      body: 'Porque la respuesta ya está predefinida',
    };
    const newPost = await mockClient.post<Post, typeof newPostData>(
      '/posts',
      newPostData
    );
    console.log('✅ Post simulado creado:');
    console.log(newPost);

    // Provocar un error intencionalmente (ruta no definida)
    try {
      console.log('\n📡 Simulando petición a ruta inexistente...');
      await mockClient.get('/ruta-no-existente');
    } catch (error) {
      console.log('✅ Error simulado capturado correctamente:');
      console.log(`   ${(error as Error).message}`);
    }

    console.log('\n🎉 Pruebas de simulación completadas exitosamente!');
  } catch (error) {
    if (isHttpError(error)) {
      console.error('❌ Error HTTP:', error.message, error.response?.status);
    } else {
      console.error('❌ Error inesperado:', (error as Error).message);
    }
  }
}

// Para uso como script independiente
runMockTest().catch(console.error);

// Para uso en importaciones
export { runMockTest };
