import { config, fields, collection, singleton } from '@keystatic/core';

const isDev = import.meta.env.DEV;

export default config({
  storage: isDev ? {
    // When running locally, save directly to the local file system
    kind: 'local',
  } : {
    // When deployed to Cloudflare, connect securely to the GitHub repository
    kind: 'github',
    repo: {
      owner: 'VikramKumar-1',
      name: 'sarkarinaukri'
    }
  },
  collections: {
    jobs: collection({
      label: 'Job Posts',
      slugField: 'title',
      path: 'src/content/jobs/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Job Title' } }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Latest Jobs', value: 'latest-jobs' },
            { label: 'Admit Card', value: 'admit-card' },
            { label: 'Results', value: 'results' },
            { label: 'Admission', value: 'admission' },
            { label: 'Answer Key', value: 'answer-key' },
            { label: 'Certificate Verification', value: 'certificate-verification' },
            { label: 'Syllabus', value: 'syllabus' },
            { label: 'Exam Date', value: 'exam-date' },
            { label: 'Hidden (Archived/Test)', value: 'hidden' },
          ],
          defaultValue: 'latest-jobs',
        }),
        isHotLink: fields.checkbox({
          label: '🔥 Show in Hot Links (Top 8 Boxes)',
          description: 'Check this box to automatically feature this post in the 8 colorful boxes at the top of the homepage!'
        }),
        shortInfo: fields.text({
          label: 'Short Information (SEO Template)',
          multiline: true,
          description: `👇 COPY ONE OF THESE TEMPLATES 👇

--- TEMPLATE 1 (BEST FOR GOOGLE) ---
[DEPARTMENT] has published the latest notification for the recruitment of [JOB TITLE]. There are a total of [VACANCY COUNT] vacancies available. Interested candidates who meet the eligibility criteria can apply online from [START DATE] to [END DATE]. Before submitting the application form, please download and read the official notification for complete details.

--- TEMPLATE 2 (ALTERNATIVE) ---
Good news for job seekers! The [DEPARTMENT] is inviting online applications for [VACANCY COUNT] posts of [JOB TITLE]. All eligible candidates can fill out the online form starting [START DATE]. Make sure to check the official notification below before the final deadline on [END DATE].`
        }),
        seoTitle: fields.text({
          label: 'Custom SEO Title (Optional)',
          description: 'Leave blank to use Automated Title: [Job Title] | Sarkari Result'
        }),
        seoDescription: fields.text({
          label: 'Custom SEO Description (Optional)',
          description: 'Leave blank to use Automated Description: Uses the Short Information text from above.',
          multiline: true
        }),
        seoKeywords: fields.text({
          label: 'Custom SEO Keywords (Optional)',
          description: 'Leave blank to use Automated Keywords: sarkari result, [Job Title], online form, latest jobs'
        }),
        departmentName: fields.text({
          label: 'Header 1: Department Name (Magenta)',
          description: 'UI LOCATION: The very FIRST line at the top of the massive table. (Example: Chhattisgarh Public Service Commission)'
        }),
        postTitleName: fields.text({
          label: 'Header 2: Post Title Name (Green)',
          description: 'UI LOCATION: The SECOND line at the top. (Example: Chhattisgarh Assistant District Public Prosecution Officer...)'
        }),
        advtNoShortDetails: fields.text({
          label: 'Header 3: Advt No & Short Details (Magenta)',
          description: 'UI LOCATION: The THIRD line at the top. (Example: CGPSC Advt. No. 03/2026 : Short Details of Notification)'
        }),
        importantDates: fields.text({
          label: 'Important Dates (Green Header Box)',
          description: 'UI LOCATION: The left side of the 50/50 split box. Paste the whole list here.',
          multiline: true
        }),
        applicationFee: fields.text({
          label: 'Application Fee (Green Header Box)',
          description: 'UI LOCATION: The right side of the 50/50 split box. Paste the whole list here.',
          multiline: true
        }),
        ageLimitTitle: fields.text({
          label: 'Age Limit Section Title (Green & Magenta)',
          description: 'UI LOCATION: The full-width title right below Dates/Fees. (Example: CGPSC ADPPO Notification 2026 : Age Limit as on 01/01/2026)'
        }),
        ageLimitDetails: fields.text({
          label: 'Age Limit Details',
          multiline: true
        }),
        vacancyTableTitle: fields.text({
          label: 'Vacancy Details Section Title (Magenta & Green)',
          description: 'UI LOCATION: Title right above the Vacancy Tables. (Example: CGPSC Assistant District... Vacancy Details Total : 15 Post)'
        }),
        vacancyDetails: fields.array(
          fields.object({
            postName: fields.text({ label: 'Post Name' }),
            totalPost: fields.text({ label: 'Total Post' }),
            eligibility: fields.text({ label: 'Eligibility Details', multiline: true })
          }),
          { label: 'Vacancy Details Table (Simple)' }
        ),
        districtVacancyTitle: fields.text({ label: 'District Vacancy Title (Dark Blue Header)' }),
        districtVacancyDetails: fields.array(
          fields.object({
            districtName: fields.text({ label: 'District Name' }),
            noOfPost: fields.text({ label: 'No. Of Post' }),
            lastDate: fields.text({ label: 'Last Date' }),
            notificationLink: fields.text({ label: 'Notification URL (https://...)' })
          }),
          { label: 'District Wise Vacancy Table' }
        ),
        categoryVacancyDetails: fields.array(
          fields.object({
            postName: fields.text({ label: 'Post Name' }),
            ur: fields.text({ label: 'UR' }),
            ews: fields.text({ label: 'EWS' }),
            obc: fields.text({ label: 'OBC' }),
            sc: fields.text({ label: 'SC' }),
            st: fields.text({ label: 'ST' }),
            total: fields.text({ label: 'Total' })
          }),
          { label: 'Category Wise Vacancy Table' }
        ),
        physicalEligibility: fields.array(
          fields.object({
            genderCategory: fields.text({ label: 'Gender / Category (e.g., Male Gen/OBC/SC)' }),
            height: fields.text({ label: 'Height (e.g., 168 CMS)' }),
            chest: fields.text({ label: 'Chest (e.g., 79-84 CMS)' }),
            running: fields.text({ label: 'Running (e.g., 4.8 KM in 25 Min)' })
          }),
          { label: 'Physical Eligibility Table' }
        ),
        howToFillTitle: fields.text({
          label: 'How to Fill Form Title (Green & Magenta)',
          description: 'UI LOCATION: Title above the instructions. (Example: How to Fill CGPSC Assistant District Public Prosecution Officer...)'
        }),
        howToFillDetails: fields.text({
          label: 'How to Fill Details',
          multiline: true
        }),
        importantLinks: fields.array(
          fields.object({
            linkName: fields.text({ label: 'Link Name (e.g., Apply Online)' }),
            url: fields.text({ label: 'URL (https://...)' })
          }),
          { label: 'Important Links' }
        ),
        faq: fields.array(
          fields.object({
            question: fields.text({ label: 'Question (e.g., What is the last date?)' }),
            answer: fields.text({ label: 'Answer (e.g., The last date is 21 July 2026)', multiline: true })
          }),
          { label: 'Frequently Asked Questions (FAQ)' }
        ),
        content: fields.document({
          label: 'Page Content & Tables',
          formatting: true,
          dividers: true,
          links: true,
          images: false,
          tables: true,
        }),
      },
    }),
    certificateStates: collection({
      label: 'Certificate Verification',
      slugField: 'stateName',
      path: 'src/content/certificateStates/*',
      format: { contentField: 'content' },
      schema: {
        stateName: fields.slug({ name: { label: 'State Name (e.g., Uttar Pradesh, Bihar)' } }),
        casteCertificate: fields.object({
          links: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'General Links', itemLabel: p => p.fields.label.value || 'Link' }),
          blockLevelLinks: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'Block Level Links', itemLabel: p => p.fields.label.value || 'Link' }),
          subDivisionLevelLinks: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'Sub-Division Level Links', itemLabel: p => p.fields.label.value || 'Link' }),
          districtLevelLinks: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'District Level Links', itemLabel: p => p.fields.label.value || 'Link' }),
        }, { label: 'Caste Certificate Verification' }),
        domicileCertificate: fields.object({
          links: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'General Links', itemLabel: p => p.fields.label.value || 'Link' }),
          blockLevelLinks: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'Block Level Links', itemLabel: p => p.fields.label.value || 'Link' }),
          subDivisionLevelLinks: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'Sub-Division Level Links', itemLabel: p => p.fields.label.value || 'Link' }),
          districtLevelLinks: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'District Level Links', itemLabel: p => p.fields.label.value || 'Link' }),
        }, { label: 'Domicile Certificate Verification' }),
        residentialCertificate: fields.object({
          links: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'General Links', itemLabel: p => p.fields.label.value || 'Link' }),
          blockLevelLinks: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'Block Level Links', itemLabel: p => p.fields.label.value || 'Link' }),
          subDivisionLevelLinks: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'Sub-Division Level Links', itemLabel: p => p.fields.label.value || 'Link' }),
          districtLevelLinks: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'District Level Links', itemLabel: p => p.fields.label.value || 'Link' }),
        }, { label: 'Residential Certificate Verification' }),
        nclCertificate: fields.object({
          links: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'General Links', itemLabel: p => p.fields.label.value || 'Link' }),
          blockLevelLinks: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'Block Level Links', itemLabel: p => p.fields.label.value || 'Link' }),
          subDivisionLevelLinks: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'Sub-Division Level Links', itemLabel: p => p.fields.label.value || 'Link' }),
          districtLevelLinks: fields.array(fields.object({ label: fields.text({ label: 'Label' }), url: fields.text({ label: 'URL' }) }), { label: 'District Level Links', itemLabel: p => p.fields.label.value || 'Link' }),
        }, { label: 'NCL Certificate Verification' }),
        content: fields.document({
          label: 'Additional Info (Optional)',
          formatting: true,
        }),
      }
    }),
  },
  singletons: {
    homepage: singleton({
      label: 'Homepage SEO (Settings)',
      path: 'src/settings/homepage',
      format: { data: 'json' },
      schema: {
        customTitle: fields.text({
          label: 'Custom SEO Title',
          description: 'Leave blank to use the automated dynamic year title.'
        }),
        customDescription: fields.text({
          label: 'Custom SEO Description',
          description: 'Leave blank to use the automated dynamic year description.',
          multiline: true
        }),
        customKeywords: fields.text({
          label: 'Custom SEO Keywords',
          description: 'Leave blank to use the default automated keywords.'
        })
      }
    })
  }
});
