'use client';

/**
 * HomeOverview component.
 * Renders scrollable overview sections for Skills, Education, Projects, and Contact
 * below the main Greeter hero on the home page.
 */
import React from 'react';
import Link from 'next/link';
import { createUseStyles } from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCodeBranch,
  faGraduationCap,
  faBriefcase,
  faEnvelope,
  faChevronRight,
  faStar,
} from '../../theme/icons';
import { green, cyan, midBlue, orange, purple } from '../../theme';
import styles from './styles';

const useStyles = createUseStyles(styles);

interface SkillGroup {
  category: string;
  color: string;
  skills: { name: string; proficiency: number }[];
}

const skillsData: SkillGroup[] = [
  {
    category: 'Frontend Development',
    color: cyan,
    skills: [
      { name: 'React 18 & Next.js 14 (App Router)', proficiency: 95 },
      { name: 'TypeScript & JavaScript (ESNext)', proficiency: 90 },
      { name: 'Tailwind CSS & React-JSS Styling', proficiency: 92 },
      { name: 'Responsive Web Design & HTML5/CSS3', proficiency: 95 },
    ],
  },
  {
    category: 'Backend & APIs',
    color: green,
    skills: [
      { name: 'Python 3.12+ & FastAPI Framework', proficiency: 94 },
      { name: 'RESTful API Design & OpenAPI Spec', proficiency: 90 },
      { name: 'Authentication (JWT & RBAC)', proficiency: 88 },
      { name: 'AsyncIO & Asynchronous Microservices', proficiency: 85 },
    ],
  },
  {
    category: 'Database & Data Storage',
    color: orange,
    skills: [
      { name: 'PostgreSQL & Neon Serverless Database', proficiency: 88 },
      { name: 'SQLAlchemy ORM & Pydantic Validation', proficiency: 90 },
      { name: 'Database Migrations (Alembic)', proficiency: 84 },
      { name: 'Relational Schema Modeling & Indexing', proficiency: 86 },
    ],
  },
  {
    category: 'DevOps & Tooling',
    color: purple,
    skills: [
      { name: 'Docker & Containerization', proficiency: 82 },
      { name: 'CI/CD Pipelines & GitHub Actions', proficiency: 86 },
      { name: 'Cloud Hosting (Vercel & Render)', proficiency: 90 },
      { name: 'Git Workflow, Linux Shell & VS Code', proficiency: 92 },
    ],
  },
];

const educationData = [
  {
    institution: 'Software Engineering Apprenticeship',
    degree: 'Full-Stack Web & Software Engineering',
    period: '2022 - Present',
    badge: 'Apprenticeship Program',
    description:
      'Intensive hands-on apprenticeship in modern full-stack architecture, building production-ready React/Next.js frontend applications and resilient Python backend services.',
    link: '/swe',
    linkText: 'Explore Apprenticeship Curriculum (/swe)',
  },
  {
    institution: 'University of Technology',
    degree: "Bachelor's Degree in Computer Science & IT",
    period: '2018 - 2022',
    badge: '3.8 GPA (Honor Graduate)',
    description:
      'Rigorous academic coursework in algorithm design, data structures, relational database management systems, and computer networks.',
    link: '/education',
    linkText: 'View Education Details',
  },
];

const projectsData = [
  {
    title: 'Cafe Management System',
    description:
      'Production-grade cafe and business management platform with real-time order processing, menu inventory, and sales analytics.',
    tags: ['React', 'FastAPI', 'PostgreSQL', 'Tailwind', 'Vercel'],
    demoUrl: 'https://cafe-management-system-done.vercel.app/',
    githubUrl: 'https://github.com/sokpunlork586-tech/cafe_management_system_done',
  },
  {
    title: 'Developer Portfolio (VS Code Style)',
    description:
      'Interactive developer portfolio engineered to emulate the Visual Studio Code interface with tab management, status bar, and built-in interactive terminal.',
    tags: ['Next.js 14', 'TypeScript', 'React-JSS', 'Jest'],
    demoUrl: '/',
    githubUrl: 'https://github.com/sokpunlork586-tech/my_vscode_portfolio',
  },
  {
    title: 'Portfolio Management Admin Dashboard',
    description:
      'Full-stack management dashboard built with Next.js 14 App Router, FastAPI backend, and PostgreSQL for managing portfolio skills, education, and social links.',
    tags: ['Next.js 14', 'FastAPI', 'PostgreSQL', 'Recharts'],
    demoUrl: 'https://github.com/sokpunlork586-tech',
    githubUrl: 'https://github.com/sokpunlork586-tech',
  },
  {
    title: 'AI Code Assistant & Agentic CLI',
    description:
      'Intelligent developer assistant combining LLM agents with automated terminal sandboxing, multi-file code editing, and continuous verification.',
    tags: ['Python', 'FastAPI', 'AsyncIO', 'Docker'],
    demoUrl: 'https://github.com/sokpunlork586-tech',
    githubUrl: 'https://github.com/sokpunlork586-tech',
  },
];

const HomeOverview: React.FC = () => {
  const classes = useStyles();

  return (
    <div id="overview" className={classes.overviewRoot}>
      {/* SECTION 1: SKILLS */}
      <section className={classes.section} id="skills">
        <div className={classes.sectionHeader}>
          <div>
            <h2 className={classes.sectionTag}>
              <FontAwesomeIcon icon={faCodeBranch} size="sm" />
              <span>{'// 01. Technical Skills'}</span>
            </h2>
            <p className={classes.sectionSub}>
              Technologies, frameworks, and programming languages I work with daily.
            </p>
          </div>
          <Link href="/skills" className={classes.tabButton}>
            <span>Open skills.js</span>
            <FontAwesomeIcon icon={faChevronRight} size="xs" />
          </Link>
        </div>

        <div className={classes.gridTwo}>
          {skillsData.map((group) => (
            <div key={group.category} className={classes.card}>
              <h3 className={classes.cardTitle} style={{ color: group.color }}>
                {group.category}
              </h3>
              <div className={classes.skillList}>
                {group.skills.map((s) => (
                  <div key={s.name} className={classes.skillItem}>
                    <div className={classes.skillMeta}>
                      <span className={classes.skillName}>{s.name}</span>
                      <span className={classes.skillPercent}>{s.proficiency}%</span>
                    </div>
                    <div className={classes.barTrack}>
                      <div
                        className={classes.barFill}
                        style={{
                          width: `${s.proficiency}%`,
                          backgroundColor: group.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: EDUCATION */}
      <section className={classes.section} id="education">
        <div className={classes.sectionHeader}>
          <div>
            <h2 className={classes.sectionTag}>
              <FontAwesomeIcon icon={faGraduationCap} size="sm" />
              <span>{'// 02. Education & Apprenticeship'}</span>
            </h2>
            <p className={classes.sectionSub}>
              Academic degrees, formal training, and software apprenticeships.
            </p>
          </div>
          <Link href="/education" className={classes.tabButton}>
            <span>Open .educationrc</span>
            <FontAwesomeIcon icon={faChevronRight} size="xs" />
          </Link>
        </div>

        <div className={classes.gridTwo}>
          {educationData.map((edu) => (
            <div key={edu.institution} className={classes.card}>
              <span className={classes.eduBadge}>{edu.badge}</span>
              <h3 className={classes.cardTitle} style={{ marginTop: '12px' }}>
                {edu.institution}
              </h3>
              <div className={classes.eduDegree}>{edu.degree}</div>
              <span className={classes.eduPeriod}>{edu.period}</span>
              <p className={classes.eduDesc}>{edu.description}</p>
              <Link href={edu.link} className={classes.projectBtn}>
                <span>{edu.linkText}</span>
                <FontAwesomeIcon icon={faChevronRight} size="xs" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: PROJECTS */}
      <section className={classes.section} id="projects">
        <div className={classes.sectionHeader}>
          <div>
            <h2 className={classes.sectionTag}>
              <FontAwesomeIcon icon={faBriefcase} size="sm" />
              <span>{'// 03. Featured Projects'}</span>
            </h2>
            <p className={classes.sectionSub}>
              Selected web applications, full-stack systems, and open-source tools.
            </p>
          </div>
          <Link href="/projects" className={classes.tabButton}>
            <span>Open projects.config</span>
            <FontAwesomeIcon icon={faChevronRight} size="xs" />
          </Link>
        </div>

        <div className={classes.gridTwo}>
          {projectsData.map((project) => (
            <div key={project.title} className={classes.card}>
              <h3 className={classes.cardTitle}>{project.title}</h3>
              <p className={classes.projectDesc}>{project.description}</p>
              <div className={classes.tagList}>
                {project.tags.map((tag) => (
                  <span key={tag} className={classes.techTag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className={classes.projectLinks}>
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.projectBtn}
                  >
                    <span>Live Demo ↗</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.projectBtn}
                  >
                    <span>Source Code ↗</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: CONTACT */}
      <section className={classes.section} id="contact">
        <div className={classes.sectionHeader}>
          <div>
            <h2 className={classes.sectionTag}>
              <FontAwesomeIcon icon={faEnvelope} size="sm" />
              <span>{'// 04. Get In Touch'}</span>
            </h2>
            <p className={classes.sectionSub}>
              Available for full-stack engineering, consulting, and full-time opportunities.
            </p>
          </div>
          <Link href="/contact" className={classes.tabButton}>
            <span>Open contact.json</span>
            <FontAwesomeIcon icon={faChevronRight} size="xs" />
          </Link>
        </div>

        <div className={classes.contactCard}>
          <div className={classes.contactItem}>
            <span className={classes.contactLabel}>Email (Gmail)</span>
            <span className={classes.contactValue}>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=sokpunlork586@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                sokpunlork586@gmail.com ↗
              </a>
            </span>
          </div>

          <div className={classes.contactItem}>
            <span className={classes.contactLabel}>GitHub</span>
            <span className={classes.contactValue}>
              <a
                href="https://github.com/sokpunlork586-tech"
                target="_blank"
                rel="noopener noreferrer"
              >
                @sokpunlork586-tech ↗
              </a>
            </span>
          </div>

          <div className={classes.contactItem}>
            <span className={classes.contactLabel}>LinkedIn</span>
            <span className={classes.contactValue}>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com ↗
              </a>
            </span>
          </div>

          <div className={classes.contactItem}>
            <span className={classes.contactLabel}>Location & Availability</span>
            <span className={classes.contactValue}>
              Cambodia (ICT, UTC+7) • Available
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeOverview;
