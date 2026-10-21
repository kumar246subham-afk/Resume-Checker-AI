/**
 * ATS Scoring Engine
 * Configurable weights:
 * - ATS Readability: 25%
 * - Keyword Alignment: 25%
 * - Skills & Experience Relevance: 20%
 * - Projects & Achievements: 15%
 * - Grammar, Clarity & Structure: 15%
 */

// Common action verbs preferred by ATS systems
const STRONG_ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'analyzed', 'architected', 'automated',
  'built', 'championed', 'collaborated', 'configured', 'constructed', 'coordinated',
  'created', 'decreased', 'delivered', 'deployed', 'designed', 'developed', 'devised',
  'directed', 'engineered', 'enhanced', 'established', 'executed', 'expanded',
  'formulated', 'generated', 'guided', 'implemented', 'improved', 'increased',
  'initiated', 'innovated', 'integrated', 'launched', 'led', 'managed', 'maximized',
  'mentored', 'migrated', 'minimized', 'modernized', 'negotiated', 'optimized',
  'orchestrated', 'overhauled', 'pioneered', 'planned', 'produced', 'reduced',
  'refactored', 'resolved', 'restructured', 'scaled', 'simplified', 'spearheaded',
  'standardized', 'streamlined', 'strengthened', 'supervised', 'transformed', 'upgraded'
];

// Weak / passive verbs and filler phrases that decrease ATS impact
const WEAK_PHRASES = [
  'responsible for', 'duties included', 'worked on', 'helped with', 'assisted in',
  'participated in', 'tasked with', 'handled various', 'familiar with', 'did work on',
  'tried to', 'involved in', 'attempted to', 'dealt with'
];

// Common tech & professional keywords library for alignment
const COMMON_INDUSTRY_KEYWORDS = {
  'software': ['javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'c++', 'aws', 'docker', 'kubernetes', 'ci/cd', 'git', 'sql', 'nosql', 'api', 'rest', 'graphql', 'microservices', 'agile', 'scrum', 'testing', 'unit testing', 'system design'],
  'software_developer': ['javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'c++', 'aws', 'docker', 'git', 'sql', 'rest api', 'unit testing', 'system design', 'data structures', 'algorithms', 'ci/cd', 'debugging'],
  'data_analyst': ['sql', 'python', 'r', 'tableau', 'power bi', 'excel', 'pandas', 'numpy', 'data cleaning', 'dashboards', 'statistics', 'etl', 'data visualization', 'kpi', 'a/b testing', 'reporting', 'queries'],
  'data_scientist': ['python', 'machine learning', 'scikit-learn', 'deep learning', 'pandas', 'numpy', 'pytorch', 'tensorflow', 'model evaluation', 'data pipeline', 'regression', 'clustering', 'feature engineering', 'statistics', 'nlp'],
  'product_associate': ['agile', 'scrum', 'user stories', 'product roadmap', 'wireframing', 'market research', 'kpi', 'okr', 'user research', 'cross-functional', 'stakeholder management', 'a/b testing', 'analytics', 'feature launch'],
  'devops': ['docker', 'kubernetes', 'aws', 'terraform', 'ci/cd', 'linux', 'bash', 'git', 'jenkins', 'ansible', 'monitoring', 'prometheus', 'grafana', 'cloudformation', 'microservices', 'infrastructure'],
  'data': ['python', 'r', 'sql', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'tableau', 'power bi', 'etl', 'data warehouse', 'machine learning', 'data pipeline', 'statistics', 'spark', 'hadoop', 'bigquery', 'data visualization'],
  'product': ['roadmap', 'user stories', 'agile', 'scrum', 'kpi', 'okr', 'market research', 'a/b testing', 'wireframing', 'user feedback', 'cross-functional', 'stakeholder management', 'product strategy', 'analytics', 'feature launch'],
  'design': ['figma', 'sketch', 'adobe xd', 'wireframes', 'prototyping', 'user research', 'usability testing', 'design system', 'ui/ux', 'information architecture', 'accessibility', 'responsive design'],
  'general': ['project management', 'communication', 'problem solving', 'leadership', 'teamwork', 'analytical thinking', 'strategic planning', 'time management', 'cross-functional collaboration']
};

class ATSScoringService {
  /**
   * Main evaluation entry point
   * @param {string} resumeText - Extracted text of resume
   * @param {object} options - Options containing targetJobTitle, jobDescription, structuredSections, method, isScanned, careerMode, fresherTrack
   */
  static evaluate(resumeText, options = {}) {
    const text = (resumeText || '').trim();
    const targetJobTitle = options.targetJobTitle || 'General Assessment';
    const jobDescription = (options.jobDescription || '').trim();
    const hasJobDescription = jobDescription.length > 30;

    // Detect career stage (Student, Fresher, Experienced, Senior) with user override support
    let detectedCareerLevel = this._detectCareerLevel(text);
    if (options.careerMode === 'fresher' || options.careerMode === 'student') {
      detectedCareerLevel = 'Student / Entry Level';
    } else if (options.careerMode === 'experienced') {
      detectedCareerLevel = 'Experienced Professional';
    }

    // Boundary check for blank documents
    const alphaCount = (text.match(/[a-zA-Z0-9]/g) || []).length;
    if (!text || alphaCount < 15) {
      return this._generateEmptyEvaluationResult();
    }

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const words = text.toLowerCase().match(/\b[a-z0-9+#.-]+\b/g) || [];
    const wordCount = words.length;

    // 1. Evaluate ATS Readability (Weight: 25%)
    const readabilityEval = this._evaluateReadability(text, lines, wordCount, detectedCareerLevel);

    // 2. Evaluate Keyword Alignment (Weight: 25%)
    const keywordEval = this._evaluateKeywords(text, words, jobDescription, targetJobTitle, options.fresherTrack);

    // 3. Evaluate Skills & Experience (Weight: 20%)
    const skillsExpEval = this._evaluateSkillsAndExperience(text, lines, detectedCareerLevel);

    // 4. Evaluate Projects & Achievements (Weight: 15%)
    const projectsEval = this._evaluateProjectsAndAchievements(text, lines, detectedCareerLevel);

    // 5. Evaluate Grammar, Clarity & Structure (Weight: 15%)
    const grammarEval = this._evaluateGrammarAndClarity(text, lines);

    // Aggregate category scores (0-100)
    const atsReadability = Math.round(readabilityEval.score);
    const keywordAlignment = Math.round(keywordEval.score);
    const skillsExperience = Math.round(skillsExpEval.score);
    const projectsAchievements = Math.round(projectsEval.score);
    const grammarClarity = Math.round(grammarEval.score);

    // Weighted Overall Score
    const overall = Math.round(
      atsReadability * 0.25 +
      keywordAlignment * 0.25 +
      skillsExperience * 0.20 +
      projectsAchievements * 0.15 +
      grammarClarity * 0.15
    );

    // Compile detected issues
    const allIssues = [
      ...readabilityEval.issues,
      ...keywordEval.issues,
      ...skillsExpEval.issues,
      ...projectsEval.issues,
      ...grammarEval.issues
    ];

    // Compile strengths
    const strengths = [
      ...readabilityEval.strengths,
      ...keywordEval.strengths,
      ...skillsExpEval.strengths,
      ...projectsEval.strengths,
      ...grammarEval.strengths
    ].slice(0, 6);

    // Weak bullets detected
    const weakBullets = [
      ...skillsExpEval.weakBullets,
      ...projectsEval.weakBullets,
      ...grammarEval.weakBullets
    ].slice(0, 5);

    // Summary text
    let summaryText = '';
    if (overall >= 85) {
      summaryText = `Outstanding resume! Your document demonstrates strong ATS compliance (${atsReadability}/100) and high keyword relevance. With minor bullet point refinements, it is competitive for top-tier opportunities.`;
    } else if (overall >= 70) {
      summaryText = `Solid foundation! Your resume achieves a respectable ${overall}/100 score. To maximize your visibility in employer ATS filters, incorporate missing keywords, strengthen quantifiable metrics, and eliminate passive phrases.`;
    } else if (overall >= 50) {
      summaryText = `Moderate alignment (${overall}/100). Several key areas need attention: ensure clear standard section headers, enrich role-specific keywords, and convert task descriptions into measurable accomplishments.`;
    } else {
      summaryText = `Foundational improvements required (${overall}/100). The resume is missing standard structural sections, contains sparse keyword coverage, or lacks measurable achievements. Follow the step-by-step suggestions below.`;
    }

    return {
      scores: {
        overall: Math.min(100, Math.max(10, overall)),
        atsReadability,
        keywordAlignment,
        skillsExperience,
        projectsAchievements,
        grammarClarity
      },
      scoringWeights: {
        atsReadability: { weight: '25%', label: 'ATS Readability & Headers' },
        keywordAlignment: { weight: '25%', label: 'Keyword Relevance & Coverage' },
        skillsExperience: { weight: '20%', label: 'Skills & Active Experience' },
        projectsAchievements: { weight: '15%', label: 'Quantifiable Achievements' },
        grammarClarity: { weight: '15%', label: 'Grammar & Chronology' }
      },
      scoringExplanation: 'Our multi-dimensional scoring engine evaluates 5 core pillars: Header and structural readability (25%), targeted keyword coverage (25%), dynamic skill & active verb phrasing (20%), measurable project impact (15%), and grammatical consistency (15%).',
      hasJobDescription,
      issues: allIssues,
      matchedKeywords: keywordEval.matchedKeywords,
      missingKeywords: keywordEval.missingKeywords,
      weakBullets,
      strengths,
      summary: summaryText,
      detectedCareerLevel,
      careerMode: options.careerMode || 'standard',
      fresherTrack: options.fresherTrack || null,
      contactDetection: readabilityEval.contactDetection,
      disclaimer: 'ATS scores are algorithmic estimates based on industry best practices, not guarantees of employment or official employer ATS results.',
      meta: {
        wordCount,
        lineCount: lines.length,
        evaluatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Heuristic career level detection
   */
  static _detectCareerLevel(text) {
    const lower = text.toLowerCase();
    if (/\b(student|undergraduate|fresher|graduate student|entry level|intern|internship|bachelor candidate)\b/i.test(lower)) {
      return 'Student / Entry Level';
    }
    if (/\b(lead|principal|architect|director|vp|head of|executive|staff engineer)\b/i.test(lower)) {
      return 'Senior / Leadership';
    }
    return 'Experienced Professional';
  }

  /**
   * Fallback for empty or near-empty documents
   */
  static _generateEmptyEvaluationResult() {
    return {
      scores: {
        overall: 12,
        atsReadability: 15,
        keywordAlignment: 10,
        skillsExperience: 10,
        projectsAchievements: 10,
        grammarClarity: 15
      },
      hasJobDescription: false,
      issues: [
        {
          id: 'crit-empty',
          title: 'Document Contains Minimal or No Text',
          severity: 'critical',
          category: 'ATS Readability',
          explanation: 'The provided document is either empty, corrupt, or contains an unreadable image.',
          recommendation: 'Ensure your resume is exported as a clean text-based PDF or DOCX file, or use our Resume Builder to create one.',
          fixType: 'structure',
          aiFix: 'Use the AI Resume Builder to generate a fresh, ATS-compliant resume.'
        }
      ],
      matchedKeywords: [],
      missingKeywords: ['Experience', 'Education', 'Skills', 'Projects'],
      weakBullets: [],
      strengths: [],
      detectedCareerLevel: 'Entry Level',
      contactDetection: { emailFound: false, phoneFound: false, linkedInFound: false, locationFound: false },
      summary: 'The document could not be properly parsed. ATS systems require selectable text, standard fonts, and structured headings.',
      disclaimer: 'ATS scores are algorithmic estimates based on industry best practices, not guarantees of employment or official employer ATS results.'
    };
  }

  /**
   * Category 1: ATS Readability & Contact Completeness
   */
  static _evaluateReadability(text, lines, wordCount, careerLevel) {
    let score = 100;
    const issues = [];
    const strengths = [];

    // Word count check calibrated for student vs experienced
    if (careerLevel === 'Student / Entry Level') {
      if (wordCount < 100) {
        score -= 15;
        issues.push({
          id: 'read-word-low-student',
          title: 'Resume is Very Concise for Entry Level',
          severity: 'suggestion',
          category: 'ATS Readability',
          sectionKey: 'projects',
          evidence: `Current volume: ${wordCount} words detected across document`,
          explanation: `Your resume contains approximately ${wordCount} words. As a student or entry-level candidate, aim for 250 to 450 words by detailing academic projects, relevant coursework, and club leadership.`,
          recommendation: 'Add coursework highlights, student projects, or technical competencies to build substance.',
          fixType: 'content'
        });
      } else {
        strengths.push(`Appropriate length (${wordCount} words) for an entry-level / student profile.`);
      }
    } else {
      if (wordCount < 200) {
        score -= 25;
        issues.push({
          id: 'read-word-low',
          title: 'Resume is Extremely Brief',
          severity: 'critical',
          category: 'ATS Readability',
          sectionKey: 'experience',
          evidence: `Current volume: ${wordCount} words detected`,
          explanation: `Your resume contains approximately ${wordCount} words. Most competitive professional resumes contain between 350 and 800 words.`,
          recommendation: 'Expand on your professional responsibilities, key projects, and technical skills.',
          fixType: 'content'
        });
      } else if (wordCount > 1100) {
        score -= 15;
        issues.push({
          id: 'read-word-high',
          title: 'Resume Length May Exceed Optimal Range',
          severity: 'warning',
          category: 'ATS Readability',
          sectionKey: 'experience',
          evidence: `Current volume: ${wordCount} words detected across multiple pages`,
          explanation: `Your resume contains ${wordCount} words, which typically spans 3+ pages and may cause recruiters to skim past critical achievements.`,
          recommendation: 'Condense older or less relevant roles to keep the resume concise and targeted (1 to 2 pages).',
          fixType: 'content'
        });
      } else {
        strengths.push(`Optimal document length (${wordCount} words), fitting well within standard 1-2 page ATS guidelines.`);
      }
    }

    // Contact details check
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
    const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
    const hasLinkedIn = /linkedin\.com/i.test(text);
    const hasLocation = /[A-Z][a-z]+,\s*[A-Z]{2}|Remote|USA|India|Canada|UK|London|San Francisco|New York|Bangalore|Berlin|California|Texas/i.test(text);

    if (!hasEmail) {
      score -= 20;
      issues.push({
        id: 'read-no-email',
        title: 'Missing Professional Email Address',
        severity: 'critical',
        category: 'ATS Readability',
        sectionKey: 'personal',
        evidence: lines[0] ? `Header text: "${lines.slice(0, 2).join(' | ')}"` : 'No header text found',
        explanation: 'No valid email address was detected in the document header.',
        recommendation: 'Add a clean, professional email address at the top of your resume (e.g. name@domain.com).',
        fixType: 'contact'
      });
    }

    if (!hasPhone) {
      score -= 15;
      issues.push({
        id: 'read-no-phone',
        title: 'Missing Contact Phone Number',
        severity: 'critical',
        category: 'ATS Readability',
        sectionKey: 'personal',
        evidence: lines[0] ? `Header line: "${lines[0]}"` : 'Top of document',
        explanation: 'Recruiters often conduct initial phone screens; no phone number was found.',
        recommendation: 'Include an international or standard formatted phone number.',
        fixType: 'contact'
      });
    }

    if (!hasLinkedIn) {
      score -= 10;
      issues.push({
        id: 'read-no-linkedin',
        title: 'No LinkedIn Profile Link Found',
        severity: 'suggestion',
        category: 'ATS Readability',
        sectionKey: 'personal',
        evidence: 'Contact section links: No linkedin.com link detected',
        explanation: 'Over 85% of recruiters review LinkedIn profiles during screening.',
        recommendation: 'Include a customized LinkedIn URL in your header (e.g. linkedin.com/in/yourname).',
        fixType: 'contact'
      });
    }

    if (hasEmail && hasPhone) {
      strengths.push('Complete, easily discoverable contact information detected in header.');
    }

    return {
      score: Math.max(10, score),
      issues,
      strengths,
      contactDetection: {
        emailFound: hasEmail,
        phoneFound: hasPhone,
        linkedInFound: hasLinkedIn,
        locationFound: hasLocation
      }
    };
  }

  /**
   * Category 2: Keyword Alignment & Relevance
   */
  static _evaluateKeywords(text, words, jobDescription, targetJobTitle, fresherTrack) {
    let score = 70;
    const issues = [];
    const strengths = [];
    const lowerText = text.toLowerCase();

    let matchedKeywords = [];
    let missingKeywords = [];

    if (jobDescription && jobDescription.length > 30) {
      const jdWords = jobDescription.toLowerCase().match(/\b[a-z0-9+#.-]{3,}\b/g) || [];
      const stopWords = new Set(['and', 'the', 'for', 'with', 'that', 'this', 'have', 'from', 'your', 'will', 'must', 'each', 'been', 'such', 'more', 'about', 'some', 'what', 'their', 'work', 'year', 'years', 'team', 'role', 'looking', 'candidate', 'experience', 'ability', 'skills', 'responsibilities', 'requirements']);

      const freq = {};
      jdWords.forEach(w => {
        if (!stopWords.has(w) && w.length >= 3) {
          freq[w] = (freq[w] || 0) + 1;
        }
      });

      const topJDKeywords = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 18)
        .map(entry => entry[0]);

      topJDKeywords.forEach(kw => {
        if (lowerText.includes(kw)) {
          matchedKeywords.push(kw);
        } else {
          missingKeywords.push(kw);
        }
      });

      const matchRatio = topJDKeywords.length > 0 ? (matchedKeywords.length / topJDKeywords.length) : 0.5;
      score = Math.round(matchRatio * 100);

      if (matchRatio < 0.4) {
        issues.push({
          id: 'kw-low-match',
          title: 'Low Keyword Match With Job Description',
          severity: 'critical',
          category: 'Keyword Alignment',
          sectionKey: 'skills',
          evidence: `Job description emphasizes: ${topJDKeywords.slice(0, 5).join(', ')}. Found ${matchedKeywords.length} matches in resume.`,
          explanation: `Only ${matchedKeywords.length} of ${topJDKeywords.length} key terms from the job posting were found in your resume. ATS algorithms rank candidates by keyword relevance.`,
          recommendation: `Incorporate key missing skills like: ${missingKeywords.slice(0, 5).join(', ')}.`,
          fixType: 'keywords'
        });
      } else if (matchRatio < 0.7) {
        issues.push({
          id: 'kw-med-match',
          title: 'Targeted Keywords Can Be Improved',
          severity: 'warning',
          category: 'Keyword Alignment',
          sectionKey: 'skills',
          evidence: `Matched: ${matchedKeywords.slice(0, 4).join(', ')} | Missing from JD: ${missingKeywords.slice(0, 4).join(', ')}`,
          explanation: `Your resume matches ${matchedKeywords.length} relevant terms, but lacks key requirements like ${missingKeywords.slice(0, 4).join(', ')}.`,
          recommendation: 'Naturally integrate the missing keywords into your experience bullet points and skills section.',
          fixType: 'keywords'
        });
      } else {
        strengths.push(`High keyword alignment (${Math.round(matchRatio * 100)}%) with the specified job description.`);
      }
    } else {
      let targetGroup = 'general';
      if (fresherTrack && COMMON_INDUSTRY_KEYWORDS[fresherTrack]) {
        targetGroup = fresherTrack;
      } else {
        const roleLower = (targetJobTitle || '').toLowerCase();
        if (/software|developer|frontend|backend|full stack|engineer|web|devops|cloud/i.test(roleLower)) {
          targetGroup = 'software';
        } else if (/data.*scientist|machine learning|ai|deep learning/i.test(roleLower)) {
          targetGroup = 'data_scientist';
        } else if (/data|analyst|analytics|bi|tableau|power bi/i.test(roleLower)) {
          targetGroup = 'data_analyst';
        } else if (/product|project|scrum|manager|owner/i.test(roleLower)) {
          targetGroup = 'product';
        } else if (/design|ui|ux|graphic/i.test(roleLower)) {
          targetGroup = 'design';
        }
      }

      const expectedKws = COMMON_INDUSTRY_KEYWORDS[targetGroup] || COMMON_INDUSTRY_KEYWORDS.software;
      expectedKws.forEach(kw => {
        if (lowerText.includes(kw)) {
          matchedKeywords.push(kw);
        } else {
          missingKeywords.push(kw);
        }
      });

      const matchRatio = matchedKeywords.length / expectedKws.length;
      score = Math.round(40 + (matchRatio * 55));

      if (matchedKeywords.length < 4) {
        issues.push({
          id: 'kw-general-low',
          title: 'Sparse Industry Keywords Detected',
          severity: 'warning',
          category: 'Keyword Alignment',
          sectionKey: 'skills',
          evidence: `Found ${matchedKeywords.length} relevant keywords (${matchedKeywords.join(', ') || 'none detected'}).`,
          explanation: `Your resume contains few recognized core keywords for ${targetJobTitle || targetGroup.replace(/_/g, ' ')}. Found: ${matchedKeywords.length} industry terms.`,
          recommendation: `Consider adding relevant technologies and methodologies such as: ${missingKeywords.slice(0, 5).join(', ')}.`,
          fixType: 'keywords'
        });
      } else {
        strengths.push(`Strong coverage of core industry competencies: ${matchedKeywords.slice(0, 4).join(', ')}.`);
      }
    }

    return {
      score: Math.min(100, Math.max(15, score)),
      matchedKeywords: matchedKeywords.slice(0, 15),
      missingKeywords: missingKeywords.slice(0, 10),
      issues,
      strengths
    };
  }

  /**
   * Category 3: Skills & Experience Relevance
   */
  static _evaluateSkillsAndExperience(text, lines, careerLevel) {
    let score = 80;
    const issues = [];
    const strengths = [];
    const weakBullets = [];

    const hasExperienceHeader = /experience|work history|employment|career|internship|roles/i.test(text);
    const hasSkillsHeader = /skills|technical skills|competencies|technologies/i.test(text);
    const hasEducationHeader = /education|academic|university|degree|college/i.test(text);

    if (!hasExperienceHeader) {
      if (careerLevel === 'Student / Entry Level' && hasEducationHeader) {
        score -= 10;
        issues.push({
          id: 'sk-no-exp-student',
          title: 'No Formal Experience Section Detected',
          severity: 'suggestion',
          category: 'Skills & Experience',
          sectionKey: 'projects',
          evidence: 'No "Work Experience" header found in document',
          explanation: 'As a student or recent graduate, you can use a "Projects" or "Academic Experience" section to demonstrate practical skills.',
          recommendation: 'Highlight student capstone projects, coding projects, or internships under a structured section.',
          fixType: 'structure'
        });
      } else {
        score -= 25;
        issues.push({
          id: 'sk-no-exp',
          title: 'Missing Clear Work Experience Section',
          severity: 'critical',
          category: 'Skills & Experience',
          sectionKey: 'experience',
          evidence: 'No standard "Experience" or "Work History" header located in document',
          explanation: 'ATS parsers look for standard headers like "Professional Experience" or "Work History" to index your career timeline.',
          recommendation: 'Add a clearly demarcated "Experience" section with company names, job titles, dates, and achievement bullets.',
          fixType: 'structure'
        });
      }
    }

    if (!hasSkillsHeader) {
      score -= 15;
      issues.push({
        id: 'sk-no-skills',
        title: 'Missing Dedicated Skills Section',
        severity: 'warning',
        category: 'Skills & Experience',
        sectionKey: 'skills',
        evidence: 'No "Skills" or "Technical Competencies" section header detected',
        explanation: 'A designated "Skills" section allows ATS filters and recruiters to quickly parse your proficiencies.',
        recommendation: 'Create a categorized Skills section (e.g., Languages, Frameworks, Tools, Soft Skills).',
        fixType: 'structure'
      });
    }

    // Check bullet points in experience
    const bulletLines = lines.filter(l => /^[•\-\*–]\s+|^\d+\.\s+/.test(l) || (l.length > 25 && l.length < 200));
    let weakVerbCount = 0;
    let strongVerbCount = 0;

    bulletLines.forEach(b => {
      const lower = b.toLowerCase();
      const startsWithWeak = WEAK_PHRASES.some(wp => lower.includes(wp));
      if (startsWithWeak) {
        weakVerbCount++;
        if (weakBullets.length < 3) {
          weakBullets.push({
            original: b,
            reason: 'Starts with passive or vague phrase ("responsible for", "worked on")',
            improvedSuggestion: b.replace(/responsible for|worked on|helped with/i, 'Architected and spearheaded')
          });
        }
      }

      const hasActionVerb = STRONG_ACTION_VERBS.some(v => lower.startsWith(v) || lower.includes(` ${v} `));
      if (hasActionVerb) {
        strongVerbCount++;
      }
    });

    if (weakVerbCount > 0) {
      score -= Math.min(20, weakVerbCount * 6);
      issues.push({
        id: 'sk-weak-phrasing',
        title: 'Passive Phrasing in Experience Bullets',
        severity: 'warning',
        category: 'Skills & Experience',
        sectionKey: 'experience',
        evidence: weakBullets.length > 0 ? `Bullet sample: "${weakBullets[0].original.slice(0, 90)}${weakBullets[0].original.length > 90 ? '...' : ''}"` : 'Passive phrasing ("responsible for", "worked on") detected in bullets',
        explanation: `Detected ${weakVerbCount} bullet point(s) using passive language like "responsible for" or "worked on". Recruiters favor active responsibility ownership.`,
        recommendation: 'Replace passive phrases with impactful action verbs like Spearheaded, Engineered, Optimized, or Delivered.',
        fixType: 'bullet-rewrite'
      });
    }

    if (strongVerbCount >= 3) {
      strengths.push('Dynamic action verbs demonstrate proactive ownership and leadership.');
    }

    return {
      score: Math.max(20, score),
      issues,
      strengths,
      weakBullets
    };
  }

  /**
   * Category 4: Projects & Measurable Achievements
   */
  static _evaluateProjectsAndAchievements(text, lines, careerLevel) {
    let score = 75;
    const issues = [];
    const strengths = [];
    const weakBullets = [];

    const hasProjects = /projects|portfolio|personal projects|open source|academic projects/i.test(text);
    if (hasProjects) {
      strengths.push('Includes demonstrable project section highlighting practical implementations.');
    } else {
      score -= 10;
      issues.push({
        id: 'proj-no-section',
        title: 'No Dedicated Projects Section',
        severity: 'suggestion',
        category: 'Projects & Achievements',
        sectionKey: 'projects',
        evidence: 'No "Projects" or "Portfolio" section found in resume',
        explanation: 'Featuring 2-3 substantial projects reinforces technical competency, especially for tech and data roles.',
        recommendation: 'Add a Projects section showcasing problems solved, technologies used, and outcomes.',
        fixType: 'structure'
      });
    }

    // Quantitative metrics check: numbers, %, $, ms, x times, etc.
    const metricMatches = text.match(/\b\d+(\.\d+)?%|\$\d+[kKmMbB]?|\b\d+x\b|\b\d{1,3}(,\d{3})+\b|\bincreased by \d+|\breduced by \d+|\b[1-9]\d*\+?\s*(users|clients|requests|ms|seconds|hours)/gi) || [];

    if (metricMatches.length === 0) {
      const penalty = careerLevel === 'Student / Entry Level' ? 15 : 25;
      score -= penalty;
      issues.push({
        id: 'proj-no-metrics',
        title: 'Lack of Quantifiable Metrics & Business Impact',
        severity: careerLevel === 'Student / Entry Level' ? 'warning' : 'critical',
        category: 'Projects & Achievements',
        sectionKey: 'experience',
        evidence: 'Zero percentage boosts, cost metrics, user scale figures, or performance metrics found',
        explanation: 'No measurable outcomes (percentages, performance boosts, cost savings, user scale) were found in your achievements.',
        recommendation: 'Quantify your accomplishments. For example: "Reduced API response times by 35%" or "Served 500+ student users".',
        fixType: 'metrics'
      });
    } else if (metricMatches.length < 3) {
      score -= 10;
      issues.push({
        id: 'proj-few-metrics',
        title: 'Limited Quantifiable Achievements',
        severity: 'suggestion',
        category: 'Projects & Achievements',
        sectionKey: 'experience',
        evidence: `Found only ${metricMatches.length} metric(s): "${metricMatches.slice(0, 3).join(', ')}"`,
        explanation: `Only ${metricMatches.length} quantitative metric(s) detected. Hiring managers gravitate toward data-backed outcomes.`,
        recommendation: 'Add specific figures or approximations to highlight the scale and efficiency of your contributions.',
        fixType: 'metrics'
      });
    } else {
      strengths.push(`Rich in quantitative results (${metricMatches.length} metrics found), establishing tangible business impact.`);
    }

    return {
      score: Math.max(15, score),
      issues,
      strengths,
      weakBullets
    };
  }

  /**
   * Category 5: Grammar, Clarity & Structure
   */
  static _evaluateGrammarAndClarity(text, lines) {
    let score = 90;
    const issues = [];
    const strengths = [];
    const weakBullets = [];

    // Check for first person pronouns
    const firstPersonMatches = text.match(/\b(I|me|my|myself|we|our|us)\b/g) || [];
    if (firstPersonMatches.length > 2) {
      score -= 15;
      issues.push({
        id: 'gram-first-person',
        title: 'First-Person Pronouns Detected',
        severity: 'warning',
        category: 'Grammar & Clarity',
        sectionKey: 'experience',
        evidence: `Found pronouns: ${firstPersonMatches.slice(0, 4).map(p => `"${p}"`).join(', ')}`,
        explanation: `Found ${firstPersonMatches.length} first-person pronouns ("I", "my", "we"). Resumes should be written in concise, third-person implied style.`,
        recommendation: 'Rewrite sentences to omit personal pronouns (e.g. change "I developed an app" to "Developed an app").',
        fixType: 'grammar'
      });
    } else {
      strengths.push('Professional, implied third-person tone maintained throughout document.');
    }

    // Check for inconsistent dates
    const hasConsistentDates = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}\b|\b\d{4}\s*-\s*(\d{4}|present)\b/i.test(text);
    if (!hasConsistentDates) {
      score -= 10;
      issues.push({
        id: 'gram-date-format',
        title: 'Date Formats Appear Inconsistent or Missing',
        severity: 'warning',
        category: 'Grammar & Clarity',
        sectionKey: 'experience',
        evidence: 'Dates do not match expected standard patterns (e.g. "Jan 2022 - Present")',
        explanation: 'Standard date formats (e.g., "Jan 2022 - Present" or "2021 - 2023") ensure ATS chronology parsers understand your tenure.',
        recommendation: 'Standardize dates across all experience and education entries.',
        fixType: 'formatting'
      });
    }

    return {
      score: Math.max(25, score),
      issues,
      strengths,
      weakBullets
    };
  }
}

module.exports = ATSScoringService;
