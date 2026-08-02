export interface CategoryGroup {
  group: string
  subcategories: string[]
}

export const PRODUCT_CATEGORY_GROUPS: CategoryGroup[] = [
  {
    group: 'Computers & Laptops',
    subcategories: [
      'Desktop computers and mini PCs',
      'Laptops and netbooks',
      'Computer monitors and displays',
      'Internal components (CPUs, GPUs, RAM, SSDs)',
      'Keyboards, mice, and pointing devices',
    ],
  },
  {
    group: 'Phones & Mobile Devices',
    subcategories: [
      'Smartphones and basic feature phones',
      'Tablets and e-readers',
      'Phone cases, screen protectors, and mounts',
      'Replacement batteries and repair parts',
    ],
  },
  {
    group: 'Audio & Sound Gear',
    subcategories: [
      'Wireless earbuds and true wireless in-ear monitors',
      'Over-ear and on-ear headphones',
      'Bluetooth and portable wireless speakers',
      'Soundbars and home theater audio',
      'Microphones and recording equipment',
    ],
  },
  {
    group: 'Smart Home & Automation',
    subcategories: [
      'Smart speakers and virtual assistant hubs',
      'Smart lighting bulbs and strips',
      'Security cameras and video doorbells',
      'Smart thermostats and climate control',
      'Automated door locks and sensors',
    ],
  },
  {
    group: 'Power & Charging Accessories',
    subcategories: [
      'Portable power banks and external batteries',
      'Wall chargers, multi-port hubs, and wireless charging pads',
      'Power surge protectors, voltage stabilizers, and UPS units',
      'Replacement power adapters and specialty cables',
    ],
  },
  {
    group: 'Gaming & Entertainment',
    subcategories: [
      'Next-gen gaming consoles and handheld systems',
      'Video games (physical discs, cartridges, and digital keys)',
      'Virtual reality (VR) headsets and controllers',
      'Specialized gaming controllers, steering wheels, and joysticks',
      'Handheld media players',
    ],
  },
  {
    group: 'Cameras & Optics',
    subcategories: [
      'Digital mirrorless and DSLR cameras',
      'Camera lenses and lens filters',
      'Action cameras and drone aerial cameras',
      'Tripods, gimbals, and stabilization mounts',
      'Memory cards and storage drives',
    ],
  },
  {
    group: 'Wearable Tech',
    subcategories: [
      'Smartwatches and hybrid watches',
      'Fitness and activity trackers',
      'Smart rings and health monitoring bands',
      'Smart glasses and AR accessories',
    ],
  },
]

// Flat list of all subcategories for validation or simple selects
export const ALL_SUBCATEGORIES = PRODUCT_CATEGORY_GROUPS.flatMap((g) => g.subcategories)
