import type { Professional, ProfessionalDetail } from '#shared/professional'

export function makeProfessional(overrides: Partial<Professional> = {}): Professional {
  return {
    id: 1,
    name: 'Rafael Martins',
    initials: 'RM',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: 'Senior Front-end Engineer',
    specialty: 'Front-end',
    bio: 'Especialista em aplicações web escaláveis.',
    techs: ['React', 'TypeScript', 'Next.js'],
    rating: 4.9,
    reviews: 87,
    location: 'São Paulo, SP',
    years: 7,
    price: 180,
    match: 96,
    responseHours: 2,
    ...overrides
  }
}

export function makeProfessionalDetail(
  overrides: Partial<ProfessionalDetail> = {}
): ProfessionalDetail {
  return {
    ...makeProfessional(),
    about: ['Primeiro parágrafo sobre mim.', 'Segundo parágrafo sobre mim.'],
    services: [
      { title: 'Atuação como Front-end', desc: 'Atuação contínua no seu time.', price: 'A partir de R$ 180/h' },
      { title: 'Projeto fechado', desc: 'Escopo e prazo definidos.', price: 'A partir de R$ 5.400' }
    ],
    projects: [
      { name: 'Cockpit Financeiro', desc: 'Painel de conciliação em tempo real.', techs: ['React', 'TypeScript'], image: 'https://picsum.photos/seed/devmatch-1-0/480/320' },
      { name: 'Nuvem Retail', desc: 'Reestruturação de e-commerce.', techs: ['Next.js'], image: 'https://picsum.photos/seed/devmatch-1-1/480/320' }
    ],
    reviewsList: [
      { score: '5.0', date: 'MAR 2026', text: 'Excelente profissional.', author: 'Mariana Silva', role: 'Product Manager', initials: 'MS' },
      { score: '4.8', date: 'JAN 2026', text: 'Comunicação impecável.', author: 'Eduardo Bastos', role: 'CTO · Fintech', initials: 'EB' }
    ],
    delivered: 34,
    availability: '30h por semana · imediata',
    workingHours: 'Seg a sex, 9h–18h (BRT)',
    contractType: 'PJ · projeto fechado ou hora',
    languages: 'Português (nativo) · Inglês (fluente)',
    ...overrides
  }
}
