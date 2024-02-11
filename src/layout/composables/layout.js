import { toRefs, reactive, computed } from 'vue';

const layoutConfig = reactive({
    menuMode: 'slim-plus',
    colorScheme: 'light',
    componentTheme: 'indigo',
    scale: 12,
    menuTheme: 'light',
    topbarTheme: 'indigo',
    menuProfilePosition: 'start'
});

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    rightMenuActive: false,
    topbarMenuActive: false,
    sidebarActive: false,
    anchored: false,
    activeMenuItem: null,
    overlaySubmenuActive: false,
    menuProfileActive: false
});

export function useLayout() {
    const onMenuProfileToggle = () => {
        layoutState.menuProfileActive = !layoutState.menuProfileActive;
    };

    const changeColorScheme = (colorScheme) => {
        const themeLink = document.getElementById('theme-link');
        const themeLinkHref = themeLink.getAttribute('href');
        const currentColorScheme = 'theme-' + layoutConfig.colorScheme.toString();
        const newColorScheme = 'theme-' + colorScheme;
        const newHref = themeLinkHref.replace(currentColorScheme, newColorScheme);

        replaceLink(themeLink, newHref, () => {
            layoutConfig.colorScheme = colorScheme;
            if (layoutConfig.colorScheme === 'dark') {
                layoutConfig.menuTheme = 'dark';
            } else {
                layoutConfig.menuTheme = 'light';
            }
        });
    };
    const replaceLink = (linkElement, href, onComplete) => {
        if (!linkElement || !href) {
            return;
        }

        const id = linkElement.getAttribute('id');
        const cloneLinkElement = linkElement.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

        cloneLinkElement.addEventListener('load', () => {
            linkElement.remove();

            const element = document.getElementById(id); // re-check
            element && element.remove();

            cloneLinkElement.setAttribute('id', id);
            onComplete && onComplete();
        });
    };
    const setScale = (scale) => {
        layoutConfig.scale = scale;
    };

    const setActiveMenuItem = (item) => {
        layoutState.activeMenuItem = item.value || item;
    };

    const onMenuToggle = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };
    const onTopbarMenuToggle = () => {
        layoutState.topbarMenuActive = !layoutState.topbarMenuActive;
    };
    const openRightSidebar = () => {
        layoutState.rightMenuActive = true;
    };

    const onProfileSidebarToggle = () => {
        layoutState.rightMenuActive = !layoutState.rightMenuActive;
    };

    const onConfigSidebarToggle = () => {
        layoutState.configSidebarVisible = !layoutState.configSidebarVisible;
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive || layoutState.overlaySubmenuActive);

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    const isDesktop = computed(() => window.innerWidth > 991);

    const isSlim = computed(() => layoutConfig.menuMode === 'slim');
    const isSlimPlus = computed(() => layoutConfig.menuMode === 'slim-plus');

    const isHorizontal = computed(() => layoutConfig.menuMode === 'horizontal');

    const isOverlay = computed(() => layoutConfig.menuMode === 'overlay');

    return {
        layoutConfig: toRefs(layoutConfig),
        layoutState: toRefs(layoutState),
        setScale,
        onMenuToggle,
        isSidebarActive,
        isDarkTheme,
        setActiveMenuItem,
        onProfileSidebarToggle,
        onConfigSidebarToggle,
        isSlim,
        isSlimPlus,
        isHorizontal,
        isDesktop,
        openRightSidebar,
        onTopbarMenuToggle,
        changeColorScheme,
        replaceLink,
        onMenuProfileToggle,
        isOverlay
    };
}
