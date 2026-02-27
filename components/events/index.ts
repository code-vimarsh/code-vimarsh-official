// components/events/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Public API for the events feature. Import from here in pages and other modules.

export { default as EventsSection } from './EventsSection';
export { default as EventCard } from './EventCard';
export { default as EventsTabs } from './EventsTabs';
export { default as EventBadge } from './EventBadge';
export { default as RegisterButton } from './RegisterButton';
export { default as LiveHeroBanner } from './LiveHeroBanner';
export { default as EmptyState } from './EmptyState';
export { default as EventsSectionHeader } from './EventsSectionHeader';

// Detail-page sub-components
export { default as EventBanner } from './EventBanner';
export { default as EventScheduleTimeline } from './EventScheduleTimeline';
export { default as EventSpeakers } from './EventSpeakers';
export { default as EventRegistrationButton } from './EventRegistrationButton';

export type { Event, EventStatus, FilterTab, Speaker, ScheduleItem } from './types';
