import test from 'node:test';
import assert from 'node:assert/strict';
import { smoke } from '../smoke.mjs';
import { needsMedia } from './needs.mjs';
test('official SDK real stdio handshake and Cables edit/validate/artifact slice', { skip: needsMedia },async()=>{const e=await smoke();assert.equal(e.validation.state,'succeeded');assert(e.capabilities.tools);assert(e.capabilities.resources);});
