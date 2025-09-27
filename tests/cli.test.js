import { describe, test, expect } from '@jest/globals';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.join(__dirname, '..', 'index.js');

describe('CLI Tests', () => {
  test('should display help when --help flag is used', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} --help`);
    expect(stdout).toContain('shadcn RTL Transform');
    expect(stdout).toContain('USAGE:');
    expect(stdout).toContain('OPTIONS:');
    expect(stdout).toContain('EXAMPLES:');
  });

  test('should work with --no-icons flag', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} --help --no-icons`);
    expect(stdout).not.toContain('📋');
    expect(stdout).toContain('shadcn RTL Transform');
  });

  test('should accept short aliases', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} -h`);
    expect(stdout).toContain('shadcn RTL Transform');
  });

  test('should show correct GitHub URL', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} --help`);
    expect(stdout).toContain('https://github.com/Saleh7/shadcnui-rtl');
    expect(stdout).not.toContain('yourusername');
  });

  test('should show correct example commands', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} --help`);
    expect(stdout).toContain('node index.js');
    expect(stdout).not.toContain('rtl-transform.js');
  });
});