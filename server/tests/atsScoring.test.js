const ATSScoringService = require('../src/services/atsScoringService');

describe('ATS Scoring Service Unit Tests', () => {
  test('Handles empty resume string gracefully without crashing', () => {
    const result = ATSScoringService.evaluate('');
    expect(result.scores.overall).toBeLessThan(30);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues[0].severity).toBe('critical');
  });

  test('Evaluates complete software resume accurately with high readability', () => {
    const sampleResume = `
      Alex Morgan
      alex.morgan@test.com | +1 (555) 123-4567 | San Francisco, CA | linkedin.com/in/alexmorgan
      
      PROFESSIONAL SUMMARY
      Dedicated Senior Software Engineer with over 6 years of experience architecting distributed cloud systems, robust microservices, and high-performance web applications. Proven success leading agile engineering teams, increasing system throughput, and reducing cloud infrastructure operating costs by 35%.

      PROFESSIONAL EXPERIENCE
      Senior Software Engineer | CloudTech Solutions Inc | Jan 2021 - Present
      • Architected high-throughput REST APIs and microservices using Node.js, TypeScript, and MongoDB, scaling throughput to 500,000+ daily requests with 99.99% uptime.
      • Spearheaded CI/CD automation pipeline with Docker and Kubernetes, reducing build deployment time by 45% and eliminating production regressions.
      • Mentored 5 junior developers, facilitated weekly technical design reviews, and established company-wide linting and code quality standards.

      Software Engineer | InnovateSoft Labs | Jun 2018 - Dec 2020
      • Engineered scalable React web applications with Redux and Tailwind CSS, boosting client onboarding conversion rates by 28%.
      • Optimized SQL database queries and indexes, slashing database response time from 150ms to 45ms.
      • Collaborated with product managers and UX designers to iteratively deliver customer features across 2-week agile sprints.

      TECHNICAL SKILLS
      Languages & Frameworks: JavaScript (ES6+), TypeScript, React, Node.js, Express, Python, Java
      Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, Kubernetes, CI/CD, Git, GitHub Actions
      Databases & Tools: MongoDB, PostgreSQL, Redis, Postman, Jest, Linux

      PROJECTS
      Distributed Task Queue Orchestrator | Lead Architect
      • Built an asynchronous task worker pool handling 10,000 jobs per second with Redis and Node.js.
      • Implemented real-time telemetry metrics dashboard using WebSockets and React.

      EDUCATION
      Bachelor of Science in Computer Science | University of California, Berkeley | 2018
      • Dean's Honors List, GPA: 3.84
    `;

    const result = ATSScoringService.evaluate(sampleResume, {
      targetJobTitle: 'Senior Software Engineer'
    });

    expect(result.scores.overall).toBeGreaterThanOrEqual(75);
    expect(result.scores.atsReadability).toBeGreaterThanOrEqual(80);
    expect(result.matchedKeywords.length).toBeGreaterThanOrEqual(4);
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  test('Identifies passive phrasing and flags weak bullet points', () => {
    const passiveResume = `
      Jane Doe
      jane@example.com | 555-432-1234 | New York, NY
      
      EXPERIENCE
      Developer | Alpha Corp
      • Responsible for writing code and helped with website updates.
      • Worked on bug fixing and participated in meetings.
    `;

    const result = ATSScoringService.evaluate(passiveResume);
    const passiveIssue = result.issues.find(i => i.id === 'sk-weak-phrasing');
    expect(passiveIssue).toBeDefined();
    expect(result.weakBullets.length).toBeGreaterThan(0);
  });

  test('Evaluates against custom Job Description keywords', () => {
    const resumeText = 'Experienced developer skilled in Python, Django, Docker, and AWS.';
    const jobDescription = 'Looking for a Senior Python Developer with deep experience in Python, Django, AWS, Kubernetes, and Terraform.';

    const result = ATSScoringService.evaluate(resumeText, {
      targetJobTitle: 'Python Developer',
      jobDescription
    });

    expect(result.hasJobDescription).toBe(true);
    expect(result.matchedKeywords).toContain('python');
    expect(result.matchedKeywords).toContain('django');
  });
});
