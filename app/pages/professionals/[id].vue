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
</script>

<template>
  <main class="mx-auto max-w-300 px-5 pb-32 pt-5 md:pb-10">
    <nav aria-label="Breadcrumb" class="mb-4.5 flex flex-wrap items-center gap-2 text-[12.5px] text-tertiary">
      <NuxtLink to="/" class="text-body hover:text-primary">Profissionais</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink :to="{ path: '/', query: { spec: p.specialty } }" class="text-body hover:text-primary">{{ p.specialty }}</NuxtLink>
      <span aria-hidden="true">/</span>
      <span class="text-primary" aria-current="page">{{ p.name }}</span>
    </nav>

    <ProfessionalProfileHero :p="p" />

    <div class="mt-5 flex flex-wrap items-start gap-5">
      <ProfessionalProfileContent :p="p" />
      <ProfessionalProfileSidebar :p="p" />
    </div>

    <!-- Mobile sticky CTA (CSS-only breakpoint: no client JS to decide visibility) -->
    <div class="fixed inset-x-0 bottom-0 z-[400] flex items-center gap-3 border-t border-subtle bg-base/90 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
      <div class="min-w-0">
        <strong class="block text-[17px] font-bold tracking-[-0.02em] text-primary">{{ formatPrice(p.price) }}<span class="text-xs font-normal text-tertiary">/h</span></strong>
        <span class="text-label text-tertiary">Resposta em ~{{ p.responseHours }}h</span>
      </div>
      <button type="button" class="btn btn-primary flex-1 !py-3.25">Solicitar orçamento</button>
    </div>
  </main>
</template>
