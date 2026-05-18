# Visual Design Specifications

## Seat Class Visual Identity

### Economy Class 🛫
**Theme**: Reliable, Accessible, Comfortable

**Colors**:
- Primary: `#3B82F6` (Blue-500)
- Secondary: `#60A5FA` (Blue-400)
- Accent: `#93C5FD` (Blue-300)
- Gradient: `linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)`
- Glow: `0 0 20px rgba(59, 130, 246, 0.3)`

**Icon**: `Plane` (Lucide React)
- Size: 24px in cards, 32px in modal
- Animation: Gentle tilt on hover

**Features**:
- Standard seating with adjustable headrest
- In-flight entertainment system
- Complimentary snacks and beverages
- Personal reading light
- USB charging port

**Visual Elements**:
- Subtle grid pattern background
- Soft blue glow on hover
- Clean, minimalist design
- Border: 2px solid with blue gradient

---

### Business Class 👑
**Theme**: Premium, Professional, Luxurious

**Colors**:
- Primary: `#8B5CF6` (Purple-500)
- Secondary: `#A78BFA` (Purple-400)
- Accent: `#C4B5FD` (Purple-300)
- Gradient: `linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)`
- Glow: `0 0 25px rgba(139, 92, 246, 0.4)`

**Icon**: `Crown` (Lucide React)
- Size: 24px in cards, 32px in modal
- Animation: Gentle float + sparkle effect on hover

**Features**:
- Premium reclining seats with extra legroom
- Priority boarding and baggage handling
- Gourmet meal service with wine selection
- Noise-canceling headphones
- Premium entertainment system
- Dedicated overhead storage
- Power outlets and USB-C ports

**Visual Elements**:
- Elegant diagonal stripe pattern
- Purple shimmer effect on hover
- Luxury gold accent borders
- Border: 2px solid with purple gradient + gold highlights

---

### Galaxium Class 🚀
**Theme**: Exclusive, Futuristic, Ultimate Luxury

**Colors**:
- Primary: `#10B981` (Emerald-500 / alien-green)
- Secondary: `#34D399` (Emerald-400)
- Accent: `#6EE7B7` (Emerald-300)
- Gradient: `linear-gradient(135deg, #10B981 0%, #34D399 50%, #6EE7B7 100%)`
- Glow: `0 0 30px rgba(16, 185, 129, 0.5)`

**Icon**: `Rocket` (Lucide React)
- Size: 24px in cards, 32px in modal
- Animation: Rocket launch effect on hover (upward motion + trail)

**Features**:
- Luxury private pods with lie-flat beds
- VIP lounge access with spa services
- Personal concierge service
- Chef-prepared multi-course dining
- Premium champagne and spirits
- Zero-gravity experience chamber access
- Virtual reality entertainment suite
- Priority everything (boarding, baggage, customs)
- Complimentary ground transportation

**Visual Elements**:
- Animated starfield background
- Intense green glow with particle effects
- Holographic border effect
- Border: 3px solid with animated gradient + glow pulse

---

## Component Design Patterns

### Seat Class Card (FlightCard.tsx)

```
┌─────────────────────────────────────┐
│ [Icon] Class Name          [Badge]  │
│                                     │
│ $$$ Price                           │
│ 👥 X seats left                     │
│                                     │
│ • Feature 1                         │
│ • Feature 2                         │
│ • Feature 3                         │
└─────────────────────────────────────┘
```

**States**:
1. **Default**: Subtle border, transparent background
2. **Hover**: Elevated (translateY -4px), glowing border, gradient background
3. **Sold Out**: Opacity 50%, grayscale filter, "Sold Out" overlay
4. **Low Seats** (≤2): Orange warning indicator, pulsing animation

**Animations**:
- Entrance: Staggered fade-in with slide-up (0.1s delay between cards)
- Hover: Scale 1.02, shadow expansion, glow intensity increase
- Exit: Fade-out with scale-down

---

### Seat Class Selection (BookingModal.tsx)

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ [Icon] Economy          [$$$]       │   │
│  │ • Feature 1                         │   │
│  │ • Feature 2                         │   │
│  │ • Feature 3                         │   │
│  │                    [✓] 6 seats left │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ [Icon] Business         [$$$$$]     │   │
│  │ • Feature 1                         │   │
│  │ • Feature 2                         │   │
│  │ • Feature 3                         │   │
│  │ • Feature 4                         │   │
│  │                        3 seats left │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ [Icon] Galaxium    [PREMIUM] [$$$$$]│   │
│  │ • Feature 1                         │   │
│  │ • Feature 2                         │   │
│  │ • Feature 3                         │   │
│  │ • Feature 4                         │   │
│  │ • Feature 5                         │   │
│  │                        1 seat left  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Compare Classes]                          │
│                                             │
│  [Cancel]              [Get Quote →]        │
└─────────────────────────────────────────────┘
```

**Selection States**:
1. **Unselected**: Border 2px white/10, background white/5
2. **Selected**: Border 2px class-color, background class-gradient/10, checkmark icon
3. **Hover (unselected)**: Border white/20, background white/10, scale 1.01
4. **Hover (selected)**: Enhanced glow, scale 1.02

**Animations**:
- Selection: Smooth border color transition (300ms), checkmark slide-in from right
- Deselection: Checkmark fade-out, border color fade (300ms)
- Price update: Number counter animation when switching classes

---

## Comparison View Design

### Side-by-Side Comparison Table

```
┌─────────────────────────────────────────────────────────────┐
│                    Compare Seat Classes                      │
├─────────────────┬─────────────┬─────────────┬──────────────┤
│ Feature         │ Economy     │ Business    │ Galaxium     │
├─────────────────┼─────────────┼─────────────┼──────────────┤
│ Price           │ $1,000      │ $2,500      │ $5,000       │
│ Seating         │ Standard    │ Premium     │ Luxury Pod   │
│ Legroom         │ 32"         │ 42"         │ 72" Lie-flat │
│ Meals           │ Snacks      │ Gourmet     │ Chef-prepared│
│ Entertainment   │ ✓           │ ✓ Premium   │ ✓ VR Suite   │
│ Priority Board  │ ✗           │ ✓           │ ✓            │
│ Lounge Access   │ ✗           │ ✗           │ ✓ VIP        │
│ Zero-G Access   │ ✗           │ ✗           │ ✓            │
│ Concierge       │ ✗           │ ✗           │ ✓ Personal   │
├─────────────────┴─────────────┴─────────────┴──────────────┤
│                                                              │
│  [Select Economy]  [Select Business]  [Select Galaxium]     │
└─────────────────────────────────────────────────────────────┘
```

**Features**:
- Sticky header on scroll
- Highlight differences between classes
- Visual indicators (✓/✗) for feature availability
- Color-coded columns matching class themes
- Smooth scroll to selected class

---

## Animation Specifications

### Entrance Animations
```javascript
// Staggered card entrance
{
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    duration: 0.4,
    delay: index * 0.1,
    ease: "easeOut"
  }
}
```

### Hover Effects
```javascript
// Card hover
{
  whileHover: {
    y: -4,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    transition: { duration: 0.2 }
  }
}

// Icon hover (Economy)
{
  whileHover: {
    rotate: [0, -5, 5, -5, 0],
    transition: { duration: 0.5 }
  }
}

// Icon hover (Business)
{
  whileHover: {
    y: [-2, -6, -2],
    transition: { 
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Icon hover (Galaxium)
{
  whileHover: {
    y: [0, -10],
    scale: [1, 1.1],
    transition: { duration: 0.3 }
  }
}
```

### Selection Animation
```javascript
// Checkmark reveal
{
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: { 
    type: "spring",
    stiffness: 200,
    damping: 15
  }
}
```

### Price Counter Animation
```javascript
// Animated number transition
{
  from: previousPrice,
  to: newPrice,
  duration: 0.5,
  ease: "easeOut",
  onUpdate: (value) => setDisplayPrice(Math.round(value))
}
```

---

## Responsive Design Breakpoints

### Mobile (< 640px)
- Stack cards vertically
- Full-width cards
- Larger touch targets (min 44px)
- Simplified feature lists (top 3 only)
- Swipe gestures for comparison

### Tablet (640px - 1024px)
- 2-column grid for cards
- Medium-sized icons (20px)
- Abbreviated feature lists

### Desktop (> 1024px)
- 3-column grid for cards
- Full feature lists
- Enhanced hover effects
- Side-by-side comparison view

---

## Accessibility Requirements

### ARIA Labels
```html
<button
  role="radio"
  aria-checked={isSelected}
  aria-label={`Select ${className} class, ${price}, ${seatsLeft} seats available`}
  aria-describedby={`${className}-features`}
>
```

### Keyboard Navigation
- Tab: Navigate between seat class cards
- Space/Enter: Select seat class
- Arrow keys: Move between cards in comparison view
- Escape: Close comparison view

### Screen Reader Support
- Announce price changes
- Announce seat availability updates
- Describe visual states (selected, sold out, low seats)
- Provide alternative text for icons

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Focus indicators visible in all themes
- Non-color indicators for states (icons, borders, patterns)

---

## Performance Considerations

### Optimization Strategies
1. **Lazy load** comparison component
2. **Memoize** seat class data calculations
3. **Debounce** hover effects on mobile
4. **Use CSS transforms** for animations (GPU-accelerated)
5. **Preload** icon assets
6. **Reduce motion** for users with motion sensitivity preferences

### Bundle Size Impact
- Framer Motion: Already included (~50KB gzipped)
- Lucide Icons: Already included (~2KB per icon)
- Custom CSS: ~5KB additional
- **Total Impact**: Minimal (~5-10KB)