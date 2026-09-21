import type {
  Professional,
  ProfessionalDetail,
  ProfessionalProject,
  ProfessionalReview,
  ProfessionalService,
  Specialty
} from '../../shared/professional'

const TOTAL = 524

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = <T>(rand: () => number, list: readonly T[]): T => list[Math.floor(rand() * list.length)]!
const between = (rand: () => number, min: number, max: number) => min + Math.floor(rand() * (max - min + 1))

const FIRST_NAMES = [
  'Rafael', 'Juliana', 'Diego', 'Marina', 'Caio', 'Letícia', 'Tomás', 'Aline', 'Henrique', 'Sofia',
  'Vitor', 'Bianca', 'Lucas', 'Camila', 'Gabriel', 'Fernanda', 'Pedro', 'Beatriz', 'Mateus', 'Larissa',
  'Bruno', 'Amanda', 'Felipe', 'Carolina', 'Thiago', 'Patrícia', 'André', 'Renata', 'Rodrigo', 'Isabela'
]
const LAST_NAMES = [
  'Martins', 'Prado', 'Almeida', 'Okada', 'Bernardes', 'Ramos', 'Figueira', 'Costa', 'Dias', 'Menezes',
  'Nakamura', 'Lopes', 'Ferreira', 'Souza', 'Ribeiro', 'Carvalho', 'Moreira', 'Teixeira', 'Barbosa', 'Cardoso',
  'Araújo', 'Pinto', 'Monteiro', 'Cavalcanti', 'Freitas', 'Rocha', 'Batista', 'Nunes', 'Vieira', 'Machado'
]

const LOCATIONS = [
  'São Paulo, SP', 'São Paulo, SP', 'São Paulo, SP', 'Rio de Janeiro, RJ', 'Curitiba, PR',
  'Belo Horizonte, MG', 'Florianópolis, SC', 'Porto Alegre, RS', 'Campinas, SP', 'Recife, PE',
  'Salvador, BA', 'Fortaleza, CE', 'Remoto · Brasil', 'Remoto · Brasil'
] as const

interface SpecProfile {
  roles: string[]
  techs: string[]
  bios: string[]
  price: [number, number]
}

const SPECS: Record<Specialty, SpecProfile> = {
  'Front-end': {
    roles: ['Senior Front-end Engineer', 'Front-end Engineer', 'Front-end Developer'],
    techs: ['React', 'TypeScript', 'Next.js', 'Vue', 'Nuxt', 'Tailwind', 'GraphQL'],
    bios: [
      'Especialista em aplicações web escaláveis e experiências digitais de alta performance.',
      'Interfaces acessíveis, design systems e ganho real de Core Web Vitals.',
      'Migrações de legado para arquiteturas modernas sem perder velocidade de entrega.'
    ],
    price: [110, 230]
  },
  'Back-end': {
    roles: ['Back-end Engineer', 'Senior Back-end Engineer', 'Back-end Engineer · Python'],
    techs: ['Node.js', 'Go', 'PostgreSQL', 'Python', 'FastAPI', 'Redis', 'Kafka'],
    bios: [
      'APIs de alta carga com foco em observabilidade e custo de infraestrutura.',
      'Serviços para produtos com regras de negócio densas e integrações críticas.',
      'Arquitetura de serviços resilientes, com testes e deploys previsíveis.'
    ],
    price: [130, 260]
  },
  'Full Stack': {
    roles: ['Full Stack Engineer', 'Senior Full Stack Engineer'],
    techs: ['Next.js', 'Prisma', 'tRPC', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
    bios: [
      'Produto do zero ao ar: front, back e integrações, com escopo negociado semana a semana.',
      'MVPs rápidos com base sólida para evoluir sem reescrever tudo.'
    ],
    price: [150, 250]
  },
  Mobile: {
    roles: ['Mobile Engineer', 'React Native Engineer', 'iOS Engineer'],
    techs: ['React Native', 'Swift', 'Kotlin', 'Flutter', 'Expo', 'TypeScript'],
    bios: [
      'Apps com atenção a performance, uso offline e acessibilidade.',
      'Publicação nas lojas, monitoramento de crashes e releases contínuas.'
    ],
    price: [120, 220]
  },
  'UX/UI Designer': {
    roles: ['Product Designer · UX/UI', 'UX Researcher', 'UI Designer'],
    techs: ['Figma', 'Design System', 'Pesquisa', 'Usabilidade', 'Prototipação', 'Analytics'],
    bios: [
      'Desenho fluxos de produto e design systems para times que precisam lançar rápido.',
      'Descoberta, entrevistas e testes de usabilidade para decisões com evidência.'
    ],
    price: [130, 250]
  },
  DevOps: {
    roles: ['DevOps / SRE', 'Platform Engineer', 'Cloud Engineer'],
    techs: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'GitHub Actions', 'Prometheus'],
    bios: [
      'Automatizo deploys e reduzo incidentes com infraestrutura como código.',
      'Plataformas internas e developer experience: menos atrito entre código e produção.'
    ],
    price: [170, 290]
  },
  'Data Engineer': {
    roles: ['Data Engineer', 'Analytics Engineer', 'Data Scientist'],
    techs: ['Python', 'dbt', 'BigQuery', 'Airflow', 'Spark', 'SQL'],
    bios: [
      'Pipelines de dados confiáveis e modelagem analítica para produtos orientados a métrica.',
      'Do dado bruto ao dashboard: qualidade, governança e custo sob controle.'
    ],
    price: [160, 280]
  },
  QA: {
    roles: ['QA Engineer', 'SDET', 'QA Analyst'],
    techs: ['Playwright', 'Cypress', 'CI/CD', 'Jest', 'k6', 'TypeScript'],
    bios: [
      'Estratégia de testes automatizados e qualidade contínua em pipelines de entrega.',
      'Testes de ponta a ponta estáveis e relatórios que o time realmente usa.'
    ],
    price: [100, 190]
  }
}

// The 12 professionals shown in the original design come first.
const FEATURED: { name: string, specialty: Specialty, role: string, bio: string, techs: string[], rating: number, reviews: number, location: string, years: number, price: number, match: number, resp: number }[] = [
  { name: 'Rafael Martins', specialty: 'Front-end', role: 'Senior Front-end Engineer', bio: 'Especialista em aplicações web escaláveis e experiências digitais de alta performance.', techs: ['React', 'TypeScript', 'Next.js'], rating: 4.9, reviews: 87, location: 'São Paulo, SP', years: 7, price: 180, match: 96, resp: 2 },
  { name: 'Juliana Prado', specialty: 'UX/UI Designer', role: 'Product Designer · UX/UI', bio: 'Desenho fluxos de produto e design systems para times que precisam lançar rápido.', techs: ['Figma', 'Design System', 'Pesquisa'], rating: 5, reviews: 64, location: 'Curitiba, PR', years: 9, price: 210, match: 93, resp: 1 },
  { name: 'Diego Almeida', specialty: 'Back-end', role: 'Back-end Engineer', bio: 'APIs de alta carga em Node e Go, com foco em observabilidade e custo de infraestrutura.', techs: ['Node.js', 'Go', 'PostgreSQL'], rating: 4.8, reviews: 112, location: 'Remoto · Brasil', years: 11, price: 195, match: 91, resp: 3 },
  { name: 'Marina Okada', specialty: 'Data Engineer', role: 'Data Engineer', bio: 'Pipelines de dados confiáveis e modelagem analítica para produtos orientados a métrica.', techs: ['Python', 'dbt', 'BigQuery'], rating: 4.9, reviews: 53, location: 'Florianópolis, SC', years: 6, price: 230, match: 89, resp: 4 },
  { name: 'Caio Bernardes', specialty: 'DevOps', role: 'DevOps / SRE', bio: 'Automatizo deploys e reduzo incidentes com infraestrutura como código e boas rotinas.', techs: ['Kubernetes', 'Terraform', 'AWS'], rating: 4.7, reviews: 78, location: 'Belo Horizonte, MG', years: 8, price: 240, match: 87, resp: 2 },
  { name: 'Letícia Ramos', specialty: 'Mobile', role: 'Mobile Engineer', bio: 'Apps React Native e Swift com atenção a performance, offline e acessibilidade.', techs: ['React Native', 'Swift', 'Kotlin'], rating: 4.9, reviews: 41, location: 'Recife, PE', years: 5, price: 165, match: 86, resp: 1 },
  { name: 'Tomás Figueira', specialty: 'Full Stack', role: 'Full Stack Engineer', bio: 'Produto do zero ao ar: front, back e integrações, com escopo negociado semana a semana.', techs: ['Next.js', 'Prisma', 'tRPC'], rating: 4.8, reviews: 96, location: 'Porto Alegre, RS', years: 10, price: 205, match: 84, resp: 5 },
  { name: 'Aline Costa', specialty: 'QA', role: 'QA Engineer', bio: 'Estratégia de testes automatizados e qualidade contínua em pipelines de entrega.', techs: ['Playwright', 'Cypress', 'CI/CD'], rating: 4.9, reviews: 37, location: 'Remoto · Brasil', years: 7, price: 145, match: 82, resp: 3 },
  { name: 'Henrique Dias', specialty: 'Front-end', role: 'Front-end Engineer', bio: 'Interfaces acessíveis com Vue e Nuxt, migrações legadas e ganho real de performance.', techs: ['Vue', 'Nuxt', 'Tailwind'], rating: 4.6, reviews: 58, location: 'Campinas, SP', years: 4, price: 130, match: 80, resp: 6 },
  { name: 'Sofia Menezes', specialty: 'UX/UI Designer', role: 'UX Researcher', bio: 'Descoberta, entrevistas e testes de usabilidade para decisões de produto com evidência.', techs: ['Pesquisa', 'Usabilidade', 'Analytics'], rating: 5, reviews: 29, location: 'Salvador, BA', years: 6, price: 190, match: 78, resp: 2 },
  { name: 'Vitor Nakamura', specialty: 'DevOps', role: 'Platform Engineer', bio: 'Plataformas internas e developer experience: menos atrito entre código e produção.', techs: ['Go', 'Docker', 'GitHub Actions'], rating: 4.8, reviews: 71, location: 'Remoto · Brasil', years: 12, price: 260, match: 76, resp: 4 },
  { name: 'Bianca Lopes', specialty: 'Back-end', role: 'Back-end Engineer · Python', bio: 'Serviços em Django e FastAPI para produtos com regras de negócio densas.', techs: ['Python', 'FastAPI', 'Redis'], rating: 4.7, reviews: 49, location: 'Fortaleza, CE', years: 5, price: 155, match: 74, resp: 3 }
]

// First names that map to the "women" portrait set; everything else uses "men"
const FEMALE_NAMES = new Set([
  'Juliana', 'Marina', 'Letícia', 'Aline', 'Sofia', 'Bianca', 'Camila', 'Fernanda', 'Beatriz',
  'Larissa', 'Amanda', 'Carolina', 'Patrícia', 'Renata', 'Isabela'
])

// randomuser.me hosts 100 portraits per set; the index is deterministic so a person keeps the same photo
const photoFor = (name: string, id: number) => {
  const set = FEMALE_NAMES.has(name.split(' ')[0]!) ? 'women' : 'men'
  return `https://randomuser.me/api/portraits/${set}/${id % 100}.jpg`
}

const initialsOf = (name: string) =>
  name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()

function build(): Professional[] {
  const list: Professional[] = []

  FEATURED.forEach((f, index) => {
    const id = index + 1
    list.push({
      id,
      name: f.name,
      initials: initialsOf(f.name),
      photo: photoFor(f.name, id),
      role: f.role,
      specialty: f.specialty,
      bio: f.bio,
      techs: f.techs,
      rating: f.rating,
      reviews: f.reviews,
      location: f.location,
      years: f.years,
      price: f.price,
      match: f.match,
      responseHours: f.resp
    })
  })

  const specKeys = Object.keys(SPECS) as Specialty[]
  for (let id = FEATURED.length + 1; id <= TOTAL; id++) {
    const rand = mulberry32(id * 7919)
    const specialty = pick(rand, specKeys)
    const profile = SPECS[specialty]
    const name = `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`
    const techs = [...profile.techs].sort(() => rand() - 0.5).slice(0, 3)
    const years = between(rand, 1, 14)
    list.push({
      id,
      name,
      initials: initialsOf(name),
      photo: photoFor(name, id),
      role: pick(rand, profile.roles),
      specialty,
      bio: pick(rand, profile.bios),
      techs,
      rating: Math.round((4 + rand()) * 10) / 10,
      reviews: between(rand, 8, 140),
      location: pick(rand, LOCATIONS),
      years,
      price: Math.round((profile.price[0] + (profile.price[1] - profile.price[0]) * (0.3 * rand() + 0.7 * Math.min(years / 14, 1))) / 5) * 5,
      match: between(rand, 55, 95),
      responseHours: between(rand, 1, 8)
    })
  }

  return list
}

/** Deterministic dataset used to seed the database (`npm run db:seed`). */
export const generateProfessionals = build

const REVIEWERS: { author: string, role: string }[] = [
  { author: 'Mariana Silva', role: 'Product Manager' },
  { author: 'Eduardo Bastos', role: 'CTO · Fintech' },
  { author: 'Carla Nogueira', role: 'Head of Design' },
  { author: 'Paulo Ventura', role: 'Engineering Manager' },
  { author: 'Renata Guedes', role: 'Founder · SaaS' }
]
const REVIEW_TEXTS = [
  'Excelente profissional, entregou o projeto com muita qualidade e dentro do prazo.',
  'Assumiu uma base complicada e em poucas semanas tudo estava estável. Comunicação impecável.',
  'Muito forte em detalhe e boas práticas. Trouxe soluções que nem tínhamos pedido.',
  'Conversas diretas sobre escopo e prazo, sem surpresa no final. Voltaria a contratar.'
]
const REVIEW_DATES = ['MAR 2026', 'JAN 2026', 'NOV 2025', 'SET 2025']

export function buildDetail(p: Professional): ProfessionalDetail {
  const rand = mulberry32(p.id * 104729)
  const tech = p.techs.join(', ')

  const about = [
    `Sou ${p.role.toLowerCase()} com ${p.years} ${p.years === 1 ? 'ano' : 'anos'} de experiência em produtos digitais. ${p.bio}`,
    `Meu foco é ${tech}, com atenção a qualidade, prazos claros e comunicação direta durante todo o projeto.`,
    'Trabalho bem em projetos de médio e longo prazo, seja como reforço pontual de um time de produto ou como responsável técnico de uma entrega do zero.'
  ]

  const services: ProfessionalService[] = [
    { title: `Atuação como ${p.specialty}`, desc: 'Atuação contínua no seu time, por sprint ou por demanda.', price: `A partir de R$ ${p.price}/h` },
    { title: 'Projeto fechado', desc: 'Escopo, prazo e valor definidos antes de começar.', price: `A partir de R$ ${(p.price * 30).toLocaleString('pt-BR')}` },
    { title: 'Consultoria', desc: 'Diagnóstico técnico e plano de ação para o seu time.', price: `R$ ${Math.round(p.price * 1.3 / 5) * 5}/h` }
  ]

  const projects: ProfessionalProject[] = [
    { name: 'Cockpit Financeiro', desc: 'Painel de conciliação em tempo real para uma fintech de crédito.', techs: p.techs },
    { name: 'Nuvem Retail', desc: 'Reestruturação de plataforma de e-commerce com ganho expressivo de performance.', techs: [...p.techs].reverse() },
    { name: 'Atlas Platform', desc: 'Base compartilhada usada por dezenas de pessoas desenvolvedoras.', techs: p.techs.slice(0, 2) }
  ]

  const reviewsList: ProfessionalReview[] = [0, 1, 2].map((i) => {
    const reviewer = REVIEWERS[(p.id + i) % REVIEWERS.length]!
    return {
      score: i === 2 ? '4.8' : '5.0',
      date: REVIEW_DATES[i]!,
      text: REVIEW_TEXTS[(p.id + i) % REVIEW_TEXTS.length]!,
      author: reviewer.author,
      role: reviewer.role,
      initials: initialsOf(reviewer.author)
    }
  })

  return { ...p, about, services, projects, reviewsList, delivered: between(rand, 12, 60) }
}
