import { z } from 'astro/zod';

/** The plugin's commands and skills as a guide names them: `/pro-web-design-suite:<name>` or a skill's folder name. */
const pluginName = z.string().regex(/^[a-z][a-z0-9-]*$/, 'a lowercase command or skill name');

/**
 * A guide's frontmatter. Kept apart from content.config.ts so Vitest can test it
 * without Astro's virtual modules.
 */
export const guideSchema = z.object({
  title: z.string().min(10).max(70),
  description: z.string().min(50).max(160),
  /** The series the guide belongs to, and its place in it (1-based). */
  series: z.string().regex(/^[a-z][a-z0-9-]*$/),
  order: z.number().int().positive(),
  /** The plugin version the guide was last checked against, e.g. "4.0.0". */
  checkedAgainst: z.string().regex(/^\d+\.\d+\.\d+$/),
  published: z.coerce.date(),
  updated: z.coerce.date().optional(),
  /** Every command and skill the guide names; the build checks each exists in the plugin. */
  commands: z.array(pluginName).default([]),
  skills: z.array(pluginName).default([]),
  draft: z.boolean().default(false),
});

export type GuideData = z.infer<typeof guideSchema>;
