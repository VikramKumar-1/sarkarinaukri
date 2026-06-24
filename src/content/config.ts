import { z, defineCollection } from 'astro:content';

const jobsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    postDate: z.union([z.string(), z.date()]).optional(),
    expiryDate: z.union([z.string(), z.date()]).optional(),
    isHotLink: z.boolean().default(false),
    shortInfo: z.string(),
    category: z.enum([
      'latest-jobs', 
      'admit-card', 
      'results', 
      'admission', 
      'answer-key', 
      'certificate-verification', 
      'hidden'
    ]).default('latest-jobs'),
    departmentName: z.string().optional(),
    postTitleName: z.string().optional(),
    advtNoShortDetails: z.string().optional(),
    importantDates: z.string().optional(),
    applicationFee: z.string().optional(),
    ageLimitTitle: z.string().optional(),
    ageLimitDetails: z.string().optional(),
    vacancyTableTitle: z.string().optional(),
    vacancyDetails: z.array(z.object({
      postName: z.string(),
      totalPost: z.string(),
      eligibility: z.string()
    })).optional(),
    districtVacancyTitle: z.string().optional(),
    districtVacancyDetails: z.array(z.object({
      districtName: z.string(),
      noOfPost: z.string(),
      lastDate: z.string(),
      notificationLink: z.string().url().or(z.literal(''))
    })).optional(),
    categoryVacancyDetails: z.array(z.object({
      postName: z.string(),
      ur: z.string(),
      ews: z.string(),
      obc: z.string(),
      sc: z.string(),
      st: z.string(),
      total: z.string()
    })).optional(),
    physicalEligibility: z.array(z.object({
      genderCategory: z.string(),
      height: z.string(),
      chest: z.string(),
      running: z.string()
    })).optional(),
    howToFillTitle: z.string().optional(),
    howToFillDetails: z.string().optional(),
    importantLinks: z.array(z.object({
      linkName: z.string(),
      url: z.string().url().or(z.literal('')) // allow empty string if they want to fill it later
    })).optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.string().optional(),
  }),
});

const levelLinksSchema = z.object({
  links: z.array(z.object({ label: z.string(), url: z.string().url().or(z.literal('')) })).default([]),
  blockLevelLinks: z.array(z.object({ label: z.string(), url: z.string().url().or(z.literal('')) })).default([]),
  subDivisionLevelLinks: z.array(z.object({ label: z.string(), url: z.string().url().or(z.literal('')) })).default([]),
  districtLevelLinks: z.array(z.object({ label: z.string(), url: z.string().url().or(z.literal('')) })).default([]),
}).optional();

export const collections = {
  'jobs': jobsCollection,
  'certificateStates': defineCollection({
    type: 'content',
    schema: z.object({
      stateName: z.string(),
      casteCertificate: levelLinksSchema,
      domicileCertificate: levelLinksSchema,
      residentialCertificate: levelLinksSchema,
      nclCertificate: levelLinksSchema,
    })
  }),
};
