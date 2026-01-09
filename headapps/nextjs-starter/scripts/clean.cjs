#!/usr/bin/env node

/* eslint-disable import/no-commonjs */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('node:fs/promises');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const targets = [path.join(ROOT, '.next'), path.join(ROOT, 'node_modules')];
const PROJECT_MARKER = ROOT.replace(/\\/g, '\\\\');

function killLockingProcesses() {
  const isWindows = process.platform === 'win32';

  if (isWindows) {
    const escapedRoot = ROOT.replace(/'/g, "''");
    const psScript = `
      $ErrorActionPreference = 'SilentlyContinue'
      $root = '${escapedRoot}'
      $currentPid = ${process.pid}
      $candidates = New-Object System.Collections.Generic.HashSet[int]

      foreach ($proc in Get-CimInstance Win32_Process) {
        if ($proc.ProcessId -eq $currentPid) { continue }
        $matched = $false

        if ($proc.CommandLine -and $proc.CommandLine -like "*$root*") {
          $matched = $true
        } else {
          try {
            $psProc = Get-Process -Id $proc.ProcessId -ErrorAction Stop
            foreach ($mod in $psProc.Modules) {
              if ($mod.FileName -like "*$root*") { $matched = $true; break }
            }
          } catch {}
        }

        if ($matched) { $null = $candidates.Add($proc.ProcessId) }
      }

      $killed = @()
      foreach ($pid in $candidates) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        taskkill.exe /PID $pid /F /T | Out-Null
        $killed += $pid
      }

      $killed -join ','
    `;

    const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', psScript], {
      encoding: 'utf-8',
    });

    if (result.error && result.error.code !== 'ENOENT') {
      console.warn('[clean] Unable to terminate locking processes:', result.error.message);
    } else {
      const killed = (result.stdout || '').trim();
      if (killed) {
        console.log(`[clean] Terminated processes: ${killed}`);
      } else {
        console.log('[clean] No locking processes detected via PowerShell.');
      }
      if (result.stderr) {
        console.warn('[clean] PowerShell warnings:', result.stderr.trim());
      }
    }
  } else {
    const result = spawnSync('pkill', ['-f', `${PROJECT_MARKER}`], {
      stdio: 'ignore',
    });

    if (result.error && result.error.code !== 'ESRCH') {
      console.warn('[clean] Unable to terminate locking processes:', result.error.message);
    }
  }
}

async function clean() {
  console.log('[clean] Stopping processes that may lock node_modules/.next...');
  try {
    killLockingProcesses();
  } catch (err) {
    console.warn('[clean] Failed to stop locking processes:', err.message);
  }

  for (const target of targets) {
    console.log(`[clean] Removing ${path.basename(target)}...`);
    await removeTarget(target);
  }

  console.log('[clean] Done.');
}

clean().catch((err) => {
  console.error('[clean] Failed to remove build artifacts:', err);
  process.exit(1);
});

async function removeTarget(target) {
  try {
    await fs.rm(target, {
      recursive: true,
      force: true,
      maxRetries: 20,
      retryDelay: 300,
    });
    return;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.warn(`[clean] fs.rm failed for ${target}:`, err.message);
    } else {
      return;
    }
  }

  console.log('[clean] Falling back to shell removal...', target);
  const isWindows = process.platform === 'win32';
  const command = isWindows ? 'powershell.exe' : 'rm';
  const args = isWindows
    ? [
        '-NoProfile',
        '-Command',
        `Remove-Item -LiteralPath '${target.replace(
          /'/g,
          "''"
        )}' -Recurse -Force -ErrorAction SilentlyContinue`,
      ]
    : ['-rf', target];

  const result = spawnSync(command, args, {
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Fallback removal failed for ${target} (exit ${result.status})`);
  }
}
