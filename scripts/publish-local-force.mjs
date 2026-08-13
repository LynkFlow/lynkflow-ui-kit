#!/usr/bin/env node
// Force-republish the CURRENT version to the local Verdaccio registry,
// unpublishing it there first if it already exists.
//
// Verdaccio rejects publishing a version that's already present, same as
// any real registry (E409 Conflict) -- normally that means bumping the
// version before every local rehearsal publish. This script exists for the
// common case of iterating locally and wanting to just overwrite the same
// version repeatedly, without touching package.json each time.
//
// Only ever targets Verdaccio (http://localhost:4873) -- the same
// scope-specific override publish:local itself relies on, since the
// project's committed .npmrc still maps @lynkflow:registry to the real
// registry (see .claude/rules/publishing.md's "Local registry (Verdaccio)"
// section for why a bare --registry flag alone isn't enough). Never touches
// the real registry.
//
// Usage: npm run publish:local:force

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const { name, version } = JSON.parse(readFileSync("./package.json", "utf8"));
const REGISTRY = "http://localhost:4873";

const OVERRIDE_FLAGS =
  `--userconfig .npmrc.verdaccio ` +
  `--registry=${REGISTRY} ` +
  `--@lynkflow:registry=${REGISTRY}`;

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

console.log(`Removing ${name}@${version} from Verdaccio, if it's there...`);
try {
  run(`npm unpublish ${name}@${version} ${OVERRIDE_FLAGS} --force`);
} catch {
  // Nothing to remove -- this version was never published to Verdaccio yet.
  // That's fine, the publish step below still runs.
  console.log(`(${name}@${version} wasn't published yet -- nothing to remove)`);
}

console.log(`Publishing ${name}@${version} to Verdaccio...`);
run("npm run publish:local");
