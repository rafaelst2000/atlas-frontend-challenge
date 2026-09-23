<script setup lang="ts">
import { formatPrice } from '#shared/professional'

const route = useRoute()
const id = route.params.id as string

const professional = await useProfessionalDetail(id)

const url = `${useSiteConfig().url}/professionals/${professional.id}`
const title = `${professional.name} · ${professional.role} | DevMatch`
const description = `${professional.name}, ${professional.role} em ${professional.location}. ${professional.years} anos de experiência, nota ${professional.rating.toFixed(1)} (${professional.reviews} avaliações) e valor a partir de ${formatPrice(professional.price)}/h.`

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'profile',
  ogUrl: url,
  ogImage: professional.photo,
  twitterCard: 'summary',
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
        'name': professional.name,
        'jobTitle': professional.role,
        'description': professional.bio,
        'image': professional.photo,
        'url': url,
        'knowsAbout': professional.techs,
        'address': { '@type': 'PostalAddress', 'addressLocality': professional.location },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': professional.rating,
          'reviewCount': professional.reviews,
          'bestRating': 5,
        },
      },
    }),
  }],
})
</script>

<template>
  <main class="mx-auto max-w-300 px-5 pb-32 pt-5 md:pb-10">
    <nav
      aria-label="Breadcrumb"
      class="mb-4.5 flex flex-wrap items-center gap-2 text-[12.5px] text-tertiary"
    >
      <NuxtLink
        to="/"
        class="text-body hover:text-primary"
      >Profissionais</NuxtLink>
      <span aria-hidden="true">/</span>
      <NuxtLink
        :to="{ path: '/', query: { spec: professional.specialty } }"
        class="text-body hover:text-primary"
      >{{ professional.specialty }}</NuxtLink>
      <span aria-hidden="true">/</span>
      <span
        class="text-primary"
        aria-current="page"
      >{{ professional.name }}</span>
    </nav>

    <ProfessionalProfileHero :professional="professional" />

    <div class="mt-5 flex flex-wrap items-start gap-5">
      <ProfessionalProfileContent :professional="professional" />
      <ProfessionalProfileSidebar :professional="professional" />
    </div>

    <div class="fixed inset-x-0 bottom-0 z-[400] flex items-center gap-3 border-t border-subtle bg-base/90 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
      <div class="min-w-0">
        <strong class="block text-[17px] font-bold tracking-[-0.02em] text-primary">{{ formatPrice(professional.price) }}<span class="text-xs font-normal text-tertiary">/h</span></strong>
        <span class="text-label text-tertiary">Resposta em ~{{ professional.responseHours }}h</span>
      </div>
      <button
        type="button"
        class="btn btn-primary flex-1 !py-3.25"
      >
        Solicitar orçamento
      </button>
    </div>
  </main>
</template>
