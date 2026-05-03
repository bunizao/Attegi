#!/usr/bin/env bun

/**
 * Bun-native development task runner.
 * Replaces concurrently with a small wrapper around Bun.spawn.
 */

const COLORS = {
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  dim: '\x1b[2m'
};

const MODES = {
  default: [
    { name: 'css', color: COLORS.magenta, script: 'css:watch' },
    { name: 'js', color: COLORS.cyan, script: 'js:watch' }
  ],
  hot: [
    { name: 'css', color: COLORS.magenta, script: 'css:watch' },
    { name: 'js', color: COLORS.cyan, script: 'js:watch' },
    { name: 'hot', color: COLORS.green, script: 'serve:hot' }
  ],
  preview: [
    { name: 'css', color: COLORS.magenta, script: 'css:watch' },
    { name: 'js', color: COLORS.cyan, script: 'js:watch' },
    { name: 'preview', color: COLORS.green, script: 'serve:preview' }
  ]
};

const mode = process.argv[2] || 'default';
const tasks = MODES[mode];

if (!tasks) {
  console.error(`${COLORS.red}Unknown dev mode:${COLORS.reset} ${mode}`);
  console.error(`Use one of: ${Object.keys(MODES).join(', ')}`);
  process.exit(1);
}

const children = [];
let shuttingDown = false;

function prefix(name, color) {
  return `${color}[${name}]${COLORS.reset}`;
}

function writeLine(target, name, color, line) {
  const text = line.length ? line : '';
  target.write(`${prefix(name, color)} ${text}\n`);
}

async function pipeStream(stream, target, name, color) {
  if (!stream) return;

  const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += value;
    let newlineIndex = buffer.indexOf('\n');
    while (newlineIndex !== -1) {
      writeLine(target, name, color, buffer.slice(0, newlineIndex));
      buffer = buffer.slice(newlineIndex + 1);
      newlineIndex = buffer.indexOf('\n');
    }
  }

  if (buffer.length) {
    writeLine(target, name, color, buffer);
  }
}

function killChildren(signal = 'SIGTERM') {
  for (const child of children) {
    try {
      child.proc.kill(signal);
    } catch {
      // Ignore already-exited children.
    }
  }
}

async function shutdown(code = 0, signal = 'SIGTERM') {
  if (shuttingDown) return;
  shuttingDown = true;
  killChildren(signal);
  await Promise.allSettled(children.map((child) => child.proc.exited));
  process.exit(code);
}

function spawnTask(task) {
  const proc = Bun.spawn([process.execPath, 'run', task.script], {
    cwd: process.cwd(),
    stdin: 'inherit',
    stdout: 'pipe',
    stderr: 'pipe',
    env: process.env
  });

  const child = { task, proc };
  children.push(child);

  pipeStream(proc.stdout, process.stdout, task.name, task.color).catch((error) => {
    writeLine(process.stderr, task.name, COLORS.red, `stdout pipe failed: ${error.message}`);
  });
  pipeStream(proc.stderr, process.stderr, task.name, task.color).catch((error) => {
    writeLine(process.stderr, task.name, COLORS.red, `stderr pipe failed: ${error.message}`);
  });

  proc.exited.then((code) => {
    if (shuttingDown) {
      return;
    }

    if (code === 0) {
      writeLine(process.stdout, task.name, task.color, `${COLORS.dim}exited normally${COLORS.reset}`);
      shutdown(0);
      return;
    }

    writeLine(process.stderr, task.name, COLORS.red, `exited with code ${code}`);
    shutdown(code || 1);
  });
}

process.on('SIGINT', () => {
  shutdown(0, 'SIGINT');
});

process.on('SIGTERM', () => {
  shutdown(0, 'SIGTERM');
});

for (const task of tasks) {
  spawnTask(task);
}
