import { defineCollection } from 'astro:content';
import type { Loader } from 'astro/loaders';
import { z } from 'astro:schema';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Laedt eine JSON-Datei mit einem einzelnen Objekt als genau einen Collection-Eintrag.
// (Der eingebaute file()-Loader wuerde jede Top-Level-Eigenschaft als eigenen Eintrag behandeln.)
function singleJsonFileLoader(path: string, id: string): Loader {
  return {
    name: `single-json-file-${id}`,
    load: async ({ store, parseData }) => {
      const filePath = fileURLToPath(new URL(path, import.meta.url));
      const raw = await readFile(filePath, 'utf-8');
      const data = await parseData({ id, data: JSON.parse(raw) });
      store.set({ id, data });
    },
  };
}

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
  srcset: z.string().optional(),
  sizes: z.string().optional(),
});

const site = defineCollection({
  loader: singleJsonFileLoader('./content/site.json', 'site'),
  schema: z.object({
    name: z.string(),
    legalName: z.string(),
    founder: z.string(),
    street: z.string(),
    zip: z.string(),
    city: z.string(),
    country: z.string(),
    phone: z.string(),
    phoneFormatted: z.string(),
    email: z.string(),
    vatId: z.string(),
    url: z.string(),
  }),
});

const home = defineCollection({
  loader: singleJsonFileLoader('./content/pages/home.json', 'home'),
  schema: z.object({
    meta: z.object({
      jsonLdDescription: z.string(),
    }),
    hero: z.object({
      logoSuffix: z.string(),
      headline: z.string(),
      sublineHtml: z.string(),
      portrait: imageSchema,
      trustName: z.string(),
      trustRole: z.string(),
      ratingAriaLabel: z.string(),
      ratingText: z.string(),
      quote: z.string(),
      cta: z.string(),
      trustBarLabel: z.string(),
      trustItems: z.array(z.string()),
      ctaNote: z.string(),
    }),
    problem: z.object({
      heading: z.string(),
      items: z.array(z.string()),
    }),
    portfolio: z.object({
      heading: z.string(),
      subline: z.string(),
      buttonLabel: z.string(),
      references: z.array(
        z.object({
          id: z.string(),
          image: imageSchema,
          logo: imageSchema,
          name: z.string(),
          person: z.string(),
          review: imageSchema,
          url: z.string(),
        })
      ),
    }),
    about: z.object({
      heading: z.string(),
      paragraph1: z.string(),
      paragraph2: z.string(),
      image: imageSchema,
    }),
    process: z.object({
      heading: z.string(),
      steps: z.array(
        z.object({
          icon: z.string(),
          title: z.string(),
          text: z.string(),
        })
      ),
    }),
    formSection: z.object({
      heading: z.string(),
      subline: z.string(),
      guaranteeTitle: z.string(),
      guaranteeText: z.string(),
      errorTitle: z.string(),
      errorContactPre: z.string(),
      noJsNote: z.string(),
    }),
    faq: z.object({
      heading: z.string(),
      items: z.array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      ),
    }),
  }),
});

const danke = defineCollection({
  loader: singleJsonFileLoader('./content/pages/danke.json', 'danke'),
  schema: z.object({
    headline: z.string(),
    subline: z.string(),
    greeting: z.string(),
    paragraph1: z.string(),
    paragraph2: z.string(),
    note: z.string(),
    cta: z.string(),
  }),
});

export const collections = { site, home, danke };
