import * as z from 'zod/v4';
export const VERSION = '2.0.0';
export const LIMITS = Object.freeze({ responseBytes: 16000, chunkChars: 3000, page: 8, recipeBytes: 65536, mediaBytes: 256 * 1024 * 1024, queue: 4, records: 100, logBytes: 16384 });
export const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/);
const short = z.string().max(2000);
export const schemas = {
  studio_status: z.object({}).strict(),
  plan_piece: z.object({ intent: short.min(1), kind: z.enum(['auto','post','carousel','video','document','deck','kit','assets']).default('auto'), media: z.array(z.object({ path: z.string().max(400), mime: z.enum(['text/plain','image/png','image/jpeg','image/webp','video/mp4']), role: short.max(200).optional() }).strict()).max(4).default([]) }).strict(),
  search_library: z.object({ collection: z.enum(['skills','templates','assets']), query: z.string().max(100).default(''), filters: z.object({product:z.string().max(80).optional(),status:z.enum(['approved','review','rejected']).optional(),kind:z.string().max(40).optional(),type:z.string().max(60).optional(),origin:z.string().max(40).optional(),lang:z.string().max(10).optional(),exists:z.boolean().optional()}).strict().default({}), offset: z.number().int().min(0).max(100000).default(0), limit: z.number().int().min(1).max(LIMITS.page).default(8) }).strict(),
  read_instructions: z.object({ ref: z.string().max(500), offset: z.number().int().min(0).max(1000000).default(0), chars: z.number().int().min(1).max(LIMITS.chunkChars).default(3000), ifDigest: z.string().max(64).optional() }).strict(),
  get_asset: z.object({ assetId: z.string().max(120) }).strict(),
  inspect_media: z.object({ ref:z.string().regex(/^media:[a-f0-9-]{36}:[0-3]$/), action:z.enum(['probe','preview']).default('probe'), seconds:z.number().min(0).max(36000).optional() }).strict(),
  edit_piece: z.object({ action: z.enum(['copy','inspect','slots','update','validate']), pieceId: id, source: z.string().max(400).optional(), offset: z.number().int().min(0).max(10000).optional(), shot: z.number().int().min(0).max(9).default(0), expectedDigest: z.string().length(64).optional(), printChanges: z.array(z.discriminatedUnion('op', [z.object({op:z.literal('text'),field:z.string().max(40),value:short.min(1)}).strict(),z.object({op:z.literal('row'),field:z.string().max(40),index:z.number().int().min(0).max(15),label:short.max(100).min(1),value:short.min(1)}).strict(),z.object({op:z.literal('append-row'),field:z.literal('software'),label:short.max(100).min(1),value:short.min(1),sourceNote:short.min(1)}).strict(),z.object({op:z.literal('image'),field:z.enum(['cover_image','screen','technical_image']),value:z.string().max(400)}).strict()])).min(1).max(6).optional(), changes: z.array(z.object({ field: z.enum(['copy','lang','headline','title','text','src','pattern']), value: z.string().max(4000) }).strict()).min(1).max(6).optional(), slotChanges: z.array(z.object({ slot: z.string().regex(/^([ps]\d{1,2}|meta)\.[a-z0-9._]{1,60}$/), row: z.enum(['add','remove']).optional(), text: short.max(600).optional(), image: z.string().max(400).optional(), alt: short.max(240).optional() }).strict()).min(1).max(12).optional() }).strict(),
  export_piece: z.object({ action: z.enum(['enqueue','status','cancel','list']), pieceId: id.optional(), jobId: z.string().uuid().optional(), operation: z.enum(['validate','render-html','render-png','render-pdf']).default('validate'), saveAs: z.string().regex(/^[\w][\w .-]{0,80}\.(png|pdf|pptx|html)$/).optional() }).strict()
};
export function bounded(value) {
  const text = JSON.stringify({ contractVersion: VERSION, ...value });
  if (Buffer.byteLength(text) > LIMITS.responseBytes) throw new Error('Response exceeds budget; request a narrower page/chunk');
  return text;
}
