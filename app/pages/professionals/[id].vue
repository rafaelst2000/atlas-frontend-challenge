<script setup lang="ts">
import type { ProfessionalDetail } from '#shared/professional'
import { formatPrice } from '#shared/professional'

const route = useRoute()
const id = route.params.id as string

const { data: pro } = await useFetch<ProfessionalDetail>(`/api/professionals/${id}`, { key: `professional-${id}` })

if (!pro.value) {
  throw createError({ statusCode: 404, statusMessage: 'Profissional não encontrado', fatal: true })
}

const p = pro.value
const url = `${useSiteConfig().url}/professionals/${p.id}`
const title = `${p.name} · ${p.role} | DevMatch`
const description = `${p.name}, ${p.role} em ${p.location}. ${p.years} anos de experiência, nota ${p.rating.toFixed(1)} (${p.reviews} avaliações) e valor a partir de ${formatPrice(p.price)}/h.`

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'profile',
  ogUrl: url,
  ogImage: p.photo,
  twitterCard: 'summary'
})
useHead({
  link: [{ rel: 'canonical', href: url }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      'mainEntity': {
        '@type': 'Person',
        'name': p.name,
        'jobTitle': p.role,
        'description': p.bio,
        'image': p.photo,
        'url': url,
        'knowsAbout': p.techs,
        'address': { '@type': 'PostalAddress', 'addressLocality': p.location },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': p.rating,
          'reviewCount': p.reviews,
          'bestRating': 5
        }
      }
    })
  }]
})

const favorite = ref(false)

const stars = computed(() => Array.from({ length: 5 }, (_, i) => i < Math.round(p.rating)))
const infos = [
  { label: 'Disponibilidade', value: '30h por semana · imediata' },
  { label: 'Horário de atendimento', value: 'Seg a sex, 9h–18h (BRT)' },
  { label: 'Tipo de contratação', value: 'PJ · projeto fechado ou hora' },
  { label: 'Experiência', value: `${p.years} anos · ${p.delivered} projetos entregues` },
  { label: 'Idiomas', value: 'Português (nativo) · Inglês (fluente)' }
]
</script>

<template>
  <main class="mx-auto max-w-[1200px] px-5 pb-32 pt-5 md:pb-10">
    <nav aria-label="Breadcrumb" class="mb-[18px] flex flex-wrap items-center gap-2 text-[12.5px] text-tertiary">
      <NuxtLink to="/" class="text-body hover:text-primary">Profissionais</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink :to="{ path: '/', query: { spec: p.specialty } }" class="text-body hover:text-primary">{{ p.specialty }}</NuxtLink>
      <span aria-hidden="true">/</span>
      <span class="text-primary" aria-current="page">{{ p.name }}</span>
    </nav>

    <section class="relative overflow-hidden rounded-card bg-card p-6 shadow-card">
      <div class="pointer-events-none absolute -bottom-[220px] left-1/2 h-[380px] w-[760px] max-w-[150vw] -translate-x-1/2 rounded-full opacity-90 blur-[40px] [background:radial-gradient(ellipse_at_center_bottom,rgba(180,100,15,0.22)_0%,rgba(150,75,10,0.10)_35%,transparent_70%)]" aria-hidden="true" />
      <div class="relative flex flex-wrap items-start gap-5">
        <ProfessionalAvatar :src="p.photo" :name="p.name" :initials="p.initials" :size="96" eager />
        <div class="min-w-0 flex-[1_1_260px]">
          <span class="mb-3 inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-[11px] py-[5px] text-[11.5px] text-[#6dc48b]">
            <span class="size-[5px] rounded-full bg-success" aria-hidden="true" />Disponível para projetos
          </span>
          <h1 class="text-[clamp(28px,6vw,44px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-primary">{{ p.name }}</h1>
          <p class="mt-2 text-[clamp(14px,3.6vw,17px)] text-body">{{ p.role }}</p>

          <div class="mt-4 flex flex-wrap gap-x-[22px] gap-y-3.5 text-[13.5px] text-body">
            <div class="flex items-center gap-[7px]">
              <span class="flex gap-0.5" aria-hidden="true">
                <svg v-for="(on, i) in stars" :key="i" width="14" height="14" viewBox="0 0 24 24" :fill="on ? 'var(--color-accent)' : 'rgba(212,160,60,0.35)'"><polygon points="12,2.5 14.9,9 22,9.8 16.7,14.5 18.2,21.5 12,17.9 5.8,21.5 7.3,14.5 2,9.8 9.1,9" /></svg>
              </span>
              <strong class="font-semibold text-primary">{{ p.rating.toFixed(1) }}</strong><span>({{ p.reviews }} avaliações)</span>
            </div>
            <div class="flex items-center gap-[7px]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-tertiary)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
              <span>{{ p.location }}</span>
            </div>
            <div class="flex items-center gap-[7px]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-tertiary)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" /></svg>
              <span>{{ p.years }} {{ p.years === 1 ? 'ano' : 'anos' }} de experiência</span>
            </div>
          </div>
        </div>

        <div class="flex flex-[1_1_220px] flex-col items-stretch gap-3">
          <div class="flex items-baseline gap-1">
            <strong class="text-[clamp(26px,6vw,34px)] font-extrabold tracking-[-0.03em] text-primary">{{ formatPrice(p.price) }}</strong>
            <span class="text-sm text-tertiary">/hora</span>
          </div>
          <div class="flex gap-2.5">
            <button type="button" class="btn btn-primary flex-1 !bg-surface !py-[13px]">Solicitar orçamento</button>
            <button type="button" class="flex w-[46px] shrink-0 items-center justify-center rounded-button border bg-surface" :class="favorite ? 'border-accent' : 'border-medium'" aria-label="Favoritar" :aria-pressed="favorite" @click="favorite = !favorite">
              <svg width="18" height="18" viewBox="0 0 24 24" stroke="var(--color-accent)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" :fill="favorite ? 'var(--color-accent)' : 'none'" aria-hidden="true"><path d="M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7 3.1C19 15.6 12 20 12 20Z" /></svg>
            </button>
          </div>
          <p class="text-center text-xs text-tertiary">Resposta média em {{ p.responseHours }} {{ p.responseHours === 1 ? 'hora' : 'horas' }} · Sem taxa de contato</p>
        </div>
      </div>
    </section>

    <div class="mt-5 flex flex-wrap items-start gap-5">
      <div class="flex min-w-0 flex-[3_1_420px] flex-col gap-5">
        <section aria-labelledby="sobre">
          <span class="section-label !mb-2.5 !text-xs">[Sobre]</span>
          <h2 id="sobre" class="mb-3.5 text-[clamp(22px,4.5vw,30px)] font-bold tracking-[-0.03em] text-primary">Sobre mim</h2>
          <div class="flex flex-col gap-3.5 rounded-card bg-card p-6 shadow-card">
            <p v-for="(paragraph, i) in p.about" :key="i" class="text-[15px] leading-[1.7] text-body [text-wrap:pretty]">{{ paragraph }}</p>
          </div>
        </section>

        <section aria-labelledby="tecnologias">
          <span class="section-label !mb-2.5 !text-xs">[Especialidades]</span>
          <h2 id="tecnologias" class="mb-3.5 text-[clamp(22px,4.5vw,30px)] font-bold tracking-[-0.03em] text-primary">Tecnologias</h2>
          <ul class="flex flex-wrap gap-2">
            <li v-for="t in p.techs" :key="t" class="rounded-full bg-card px-4 py-[9px] font-mono text-[12.5px] text-primary shadow-[inset_0_1px_0_rgba(255,248,230,0.08),0_2px_12px_rgba(0,0,0,0.35)]">{{ t }}</li>
          </ul>
        </section>

        <section aria-labelledby="servicos">
          <span class="section-label !mb-2.5 !text-xs">[Serviços]</span>
          <h2 id="servicos" class="mb-3.5 text-[clamp(22px,4.5vw,30px)] font-bold tracking-[-0.03em] text-primary">O que eu entrego</h2>
          <ul class="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
            <li v-for="s in p.services" :key="s.title" class="card flex flex-col gap-2.5 p-5">
              <span class="flex size-[42px] items-center justify-center rounded-button border border-medium bg-surface" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /><path d="M8 14h5" /></svg>
              </span>
              <h3 class="text-base font-semibold tracking-[-0.02em] text-primary">{{ s.title }}</h3>
              <p class="text-[13px] leading-[1.6] text-body">{{ s.desc }}</p>
              <p class="mt-auto pt-2 font-mono text-xs text-accent">{{ s.price }}</p>
            </li>
          </ul>
        </section>

        <!-- Below the fold: rendered on the server, hydrated only when scrolled into view -->
        <ProfessionalPortfolioAndReviews hydrate-on-visible :projects="p.projects" :reviews="p.reviewsList" />
      </div>

      <aside class="flex min-w-0 flex-[1_1_260px] flex-col gap-3.5 md:sticky md:top-[84px]" aria-label="Informações">
        <div class="rounded-card bg-card p-[22px] shadow-card">
          <span class="section-label !mb-4 !text-xs">[Informações]</span>
          <dl class="flex flex-col gap-3.5">
            <div v-for="i in infos" :key="i.label" class="flex flex-col gap-1 border-b border-subtle pb-3.5">
              <dt class="font-mono text-[11.5px] uppercase tracking-[0.02em] text-tertiary">{{ i.label }}</dt>
              <dd class="text-sm font-medium text-primary">{{ i.value }}</dd>
            </div>
          </dl>
          <button type="button" class="btn btn-primary mt-[18px] w-full !bg-surface !py-[13px]">Solicitar orçamento</button>
        </div>
        <div class="rounded-card bg-card p-[22px] shadow-card">
          <h3 class="mb-2 text-[15px] font-semibold text-primary">Contratação protegida</h3>
          <p class="text-[13px] leading-[1.65] text-body">O pagamento fica retido até a aprovação de cada etapa. Se algo sair do combinado, a DevMatch media a negociação.</p>
        </div>
      </aside>
    </div>

    <!-- Mobile sticky CTA (CSS-only breakpoint: no client JS to decide visibility) -->
    <div class="fixed inset-x-0 bottom-0 z-[400] flex items-center gap-3 border-t border-subtle bg-base/90 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
      <div class="min-w-0">
        <strong class="block text-[17px] font-bold tracking-[-0.02em] text-primary">{{ formatPrice(p.price) }}<span class="text-xs font-normal text-tertiary">/h</span></strong>
        <span class="text-[11px] text-tertiary">Resposta em ~{{ p.responseHours }}h</span>
      </div>
      <button type="button" class="btn btn-primary flex-1 !py-[13px]">Solicitar orçamento</button>
    </div>
  </main>
</template>
