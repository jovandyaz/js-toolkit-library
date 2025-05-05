/**
 * @file Ejemplo de uso del cliente HTTP con autenticación
 * Este archivo demuestra cómo configurar y usar el cliente HTTP con manejo de tokens
 */

import { createHttpClient } from '../src/index';
import { IHttpClient, AuthTokenProvider } from '../src/lib/types';

// Clase de ejemplo para gestionar tokens (simulada)
class AuthManager implements AuthTokenProvider {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    // Simular un token inicial
    this.setToken('initial-access-token', 30);
  }

  // Método requerido por la interfaz AuthTokenProvider
  getToken(): string | null {
    // Verificar si el token ha expirado
    if (this.tokenExpiresAt < Date.now()) {
      console.log('🔑 Token expirado o no disponible');
      return null;
    }

    console.log('🔑 Obteniendo token de acceso existente');
    return this.accessToken;
  }

  // Método requerido por la interfaz AuthTokenProvider
  async refreshToken(): Promise<string | null> {
    console.log('🔄 Refrescando token...');

    // Simulación de una llamada a API para renovar token
    return new Promise((resolve) => {
      setTimeout(() => {
        const newToken = `refreshed-token-${Date.now()}`;
        this.setToken(newToken, 60);
        console.log('✅ Token refrescado correctamente');
        resolve(newToken);
      }, 500);
    });
  }

  // Método requerido por la interfaz AuthTokenProvider
  isTokenExpired(error: any): boolean {
    // En un caso real, analizaríamos la respuesta del servidor
    // para determinar si el error se debe a un token expirado
    return error.status === 401 || error.status === 403;
  }

  // Método auxiliar para establecer un nuevo token con tiempo de expiración
  private setToken(token: string, expiresInSeconds: number): void {
    this.accessToken = token;
    this.tokenExpiresAt = Date.now() + expiresInSeconds * 1000;
  }

  // Simula la expiración del token para pruebas
  simulateExpiredToken(): void {
    console.log('⚠️ Simulando expiración de token');
    this.tokenExpiresAt = Date.now() - 1000;
  }
}

async function authenticationExample(): Promise<void> {
  // Crear el administrador de autenticación
  const authManager = new AuthManager();

  // Crear cliente HTTP con soporte de autenticación
  const httpClient: IHttpClient = createHttpClient({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 3000,
    // Configurar el proveedor de tokens
    authTokenProvider: authManager,
  });

  interface User {
    id: number;
    name: string;
    email: string;
  }

  try {
    // Primera petición con token inicial
    console.log('\n📡 Realizando petición con token inicial...');
    const user1 = await httpClient.get<User>('/users/1');
    console.log('✅ Datos obtenidos con el token inicial:', user1.name);

    // Simular que el token ha expirado
    authManager.simulateExpiredToken();

    // Segunda petición - debería refrescar el token automáticamente
    console.log(
      '\n📡 Realizando petición con token expirado (debería refrescarse)...'
    );
    const user2 = await httpClient.get<User>('/users/2');
    console.log(
      '✅ Datos obtenidos después de refrescar el token:',
      user2.name
    );

    console.log('\n🎉 Ejemplo de autenticación completado exitosamente!');
  } catch (error) {
    console.error(
      '❌ Error durante el ejemplo de autenticación:',
      (error as Error).message
    );
  }
}

// Para uso como script independiente
authenticationExample().catch(console.error);

// Para uso en importaciones
export { authenticationExample };
