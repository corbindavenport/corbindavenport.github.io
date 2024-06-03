// Open external links in new tab
document.querySelectorAll('main a').forEach(function (linkEl) {
    const link = new URL(linkEl.href).href;
    if (!link.includes(window.location.hostname)) {
        linkEl.setAttribute('target', '_blank');
        linkEl.setAttribute('rel', 'nofollow')
    }
})