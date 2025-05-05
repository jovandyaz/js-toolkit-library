/**
 * @file Punto de entrada para ejecutar todos los ejemplos
 */

import { basicExample } from './basic-usage';
import { runMockTest } from './mock-test';
import { authenticationExample } from './authentication';

// Definición de los ejemplos disponibles
const examples = {
  basic: basicExample,
  mock: runMockTest,
  auth: authenticationExample,
};

async function runExample(name: string): Promise<void> {
  console.log(`\n==== Ejecutando ejemplo: ${name} ====\n`);

  if (name in examples) {
    await examples[name as keyof typeof examples]();
  } else {
    console.error(`❌ Ejemplo "${name}" no encontrado`);
    console.log('\nEjemplos disponibles:');
    Object.keys(examples).forEach((example) => console.log(`- ${example}`));
  }
}

async function runAll(): Promise<void> {
  for (const [name, runFn] of Object.entries(examples)) {
    console.log(`\n\n========== EJEMPLO: ${name.toUpperCase()} ==========\n`);
    try {
      await runFn();
    } catch (error) {
      console.error(
        `❌ Error ejecutando ejemplo ${name}:`,
        (error as Error).message
      );
    }
    // Pausa entre ejemplos
    console.log('\n-----------------------------------------');
  }
}

// Procesar los argumentos de la línea de comandos
async function main(): Promise<void> {
  const exampleName = process.argv[2];

  if (!exampleName || exampleName === 'all') {
    await runAll();
  } else {
    await runExample(exampleName);
  }
}

// Ejecutar
main().catch((err) => {
  console.error('Error global:', err);
  process.exit(1);
});
