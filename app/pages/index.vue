<script setup lang="ts">
const {
  professionals,
  professionalsPage,
  isLoading,
  hasMore,
  loadingMore,
  loadMore,
  hasError,
  hasLoadMoreError,
  refresh,
} = useProfessionals()

useSeoMeta({
  title: 'DevMatch · Encontre profissionais de tecnologia avaliados',
  description: 'Marketplace com mais de 500 profissionais de tecnologia verificados: front-end, back-end, mobile, design, dados, DevOps e QA. Compare avaliações e preços por hora.',
  ogTitle: 'DevMatch · Profissionais de tecnologia avaliados',
  ogDescription: 'Encontre o profissional de tecnologia ideal para o seu projeto.',
  ogType: 'website',
  twitterCard: 'summary',
})
const siteUrl = useSiteConfig().url
useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/` }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'DevMatch',
      'url': siteUrl,
    }),
  }],
})
</script>

<template>
  <main>
    <HomeHero :catalog-total="professionalsPage.catalogTotal" />

    <ProfessionalFilters />

    <HomeResultsGrid
      :professionals="professionals"
      :total="professionalsPage.total"
      :is-loading="isLoading"
      :has-more="hasMore"
      :loading-more="loadingMore"
      :has-error="hasError"
      :has-load-more-error="hasLoadMoreError"
      @load-more="loadMore"
      @retry="refresh"
    />
  </main>
</template>
