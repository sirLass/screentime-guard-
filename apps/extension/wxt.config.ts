import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: 'ScreenTime Guard',
    description:
      'Track time spent on websites and automatically block them when a parent-set daily limit is reached. Local-first and privacy-respecting.',
    permissions: ['tabs', 'idle', 'alarms', 'storage', 'declarativeNetRequest'],
    // Needed so DNR redirect rules can cover every site the parent adds, and so the
    // warning toast can run on limited pages. M5 evaluates optional host permissions
    // to reduce this install-warning scope (see PRD §7.3 and the risks table).
    host_permissions: ['<all_urls>'],
  },
});
