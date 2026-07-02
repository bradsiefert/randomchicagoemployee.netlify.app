export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

export function useTheme() {
  const theme = useState<Theme>('theme', () => 'light');

  function applyTheme(mode: Theme) {
    theme.value = mode;

    if (!import.meta.client) return;

    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    root.dataset.theme = mode;
    localStorage.setItem(STORAGE_KEY, mode);
  }

  function initTheme() {
    if (!import.meta.client) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const mode: Theme =
      stored === 'light' || stored === 'dark'
        ? stored
        : prefersDark
          ? 'dark'
          : 'light';

    applyTheme(mode);
  }

  function setTheme(mode: Theme) {
    applyTheme(mode);
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
  }

  const isDark = computed(() => theme.value === 'dark');

  return { theme, isDark, initTheme, setTheme, toggleTheme };
}
