interface IconShape {
  tag: 'path' | 'circle' | 'rect' | 'polygon'
  attrs: Record<string, string | number>
}

interface IconDefinition {
  strokeWidth: number
  filled?: boolean
  shapes: IconShape[]
}

const path = (d: string): IconShape => ({ tag: 'path', attrs: { d } })
const circle = (cx: number, cy: number, r: number): IconShape => ({ tag: 'circle', attrs: { cx, cy, r } })

const icons = {
  'star': {
    strokeWidth: 0,
    filled: true,
    shapes: [{ tag: 'polygon', attrs: { points: '12,2.5 14.9,9 22,9.8 16.7,14.5 18.2,21.5 12,17.9 5.8,21.5 7.3,14.5 2,9.8 9.1,9' } }],
  },
  'pin': {
    strokeWidth: 1.7,
    shapes: [path('M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z'), circle(12, 10, 2.5)],
  },
  'briefcase': {
    strokeWidth: 1.7,
    shapes: [
      { tag: 'rect', attrs: { x: 3, y: 7, width: 18, height: 13, rx: 2 } },
      path('M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7'),
    ],
  },
  'code': {
    strokeWidth: 1.8,
    shapes: [path('M8 6 3 12l5 6'), path('m16 6 5 6-5 6')],
  },
  'sliders': {
    strokeWidth: 1.7,
    shapes: [path('M4 7h16'), path('M7 12h10'), path('M10 17h4')],
  },
  'search': {
    strokeWidth: 1.7,
    shapes: [circle(11, 11, 7), path('m20 20-3.5-3.5')],
  },
  'search-x': {
    strokeWidth: 1.6,
    shapes: [circle(11, 11, 7), path('m21 21-4.3-4.3'), path('m8 8 6 6'), path('m14 8-6 6')],
  },
  'search-minus': {
    strokeWidth: 1.6,
    shapes: [circle(11, 11, 7), path('m20 20-3.5-3.5'), path('M8.5 11h5')],
  },
  'alert': {
    strokeWidth: 1.6,
    shapes: [path('M12 9v4'), path('M12 17h.01'), path('M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z')],
  },
  'check-circle': {
    strokeWidth: 1.8,
    shapes: [circle(12, 12, 9), path('m9 12 2 2 4-4')],
  },
  'calendar': {
    strokeWidth: 1.5,
    shapes: [
      { tag: 'rect', attrs: { x: 3, y: 4, width: 18, height: 16, rx: 2 } },
      path('M3 9h18'),
      path('M8 14h5'),
    ],
  },
  'close': {
    strokeWidth: 1.7,
    shapes: [path('M6 6l12 12'), path('M18 6 6 18')],
  },
} satisfies Record<string, IconDefinition>

export type IconName = keyof typeof icons

export const ICONS: Record<IconName, IconDefinition> = icons
