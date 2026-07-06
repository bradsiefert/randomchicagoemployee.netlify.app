export default defineNuxtPlugin({
  name: 'theme',
  enforce: 'pre',
  setup() {
    const { initTheme } = useTheme();
    const theme = useState<'light' | 'dark'>('theme');

    // Sync Vue state with what the inline head script already applied.
    const fromDom = document.documentElement.dataset.theme;
    if (fromDom === 'light' || fromDom === 'dark') {
      theme.value = fromDom;
    }

    initTheme();
  },
});
