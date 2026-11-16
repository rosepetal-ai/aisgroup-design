// What the package holds: its components, each with what it is for and its source folder.
export interface CatalogItem {
  id: string
  name: string
  description?: string
  file?: string
  ready: boolean
}

export const componentItems: CatalogItem[] = [
  { id: 'arrow', name: 'Arrow', description: 'The arrow of split buttons, text actions and cards: 24 px in split buttons, 20 px elsewhere.', file: 'packages/web/components/arrow', ready: true },
  { id: 'browser-frame', name: 'Browser frame', description: 'A product screen on a blue band: a light browser bar over the screen. Light sections use the plain window.', file: 'packages/web/components/browser-frame', ready: true },
  { id: 'breadcrumb', name: 'Breadcrumb', description: 'Where a page sits, in a strip under the header. The current page is plain text.', file: 'packages/web/components/breadcrumb', ready: true },
  { id: 'card', name: 'Card', description: 'One link with no box, in four layouts: stack, row, text and featured.', file: 'packages/web/components/card', ready: true },
  { id: 'card-grid', name: 'Card grid', description: 'Cards in 2, 3 or 4 columns, or a list of rows.', file: 'packages/web/components/card-grid', ready: true },
  { id: 'closing-band', name: 'Closing band', description: 'The end of a home page and of every AIS page: brand blue, the invitation and a white split button.', file: 'packages/web/components/closing-band', ready: true },
  { id: 'cookie-consent', name: 'Cookie notice', description: 'One ink bar; Reject all and Accept all at equal weight.', file: 'packages/web/components/cookie-consent', ready: true },
  { id: 'footer', name: 'Footer', description: 'Deep blue: the brand block, up to three link columns and the legal row. Each site gives its content.', file: 'packages/web/components/footer', ready: true },
  { id: 'link-card', name: 'Link card', description: 'A link to a page under a rule: title, text and Read more, with an optional picture.', file: 'packages/web/components/link-card', ready: true },
  { id: 'logo', name: 'Logo', description: 'A brand’s logo at its header height.', file: 'packages/web/components/logo', ready: true },
  { id: 'split-button', name: 'Split button', description: 'The call to action: label and arrow segment, at the brand’s size or compact.', file: 'packages/web/components/split-button', ready: true },
  { id: 'text-link', name: 'Text link', description: 'A text action with an arrow; a back link points left; in running text it is underlined.', file: 'packages/web/components/text-link', ready: true },
  { id: 'video-embed', name: 'Video', description: 'A film that loads only when asked, on our own still.', file: 'packages/web/components/video-embed', ready: true },
]
