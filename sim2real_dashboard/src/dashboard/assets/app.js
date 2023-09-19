(() => {
    let oldPushState = history.pushState;
    history.pushState = function pushState() {
        let ret = oldPushState.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    };

    let oldReplaceState = history.replaceState;
    history.replaceState = function replaceState() {
        let ret = oldReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    };

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
    });
})();

window.addEventListener('locationchange', function () {
    window.studioRenderable = window.location.pathname === '/3d-viewer';
    let navButton = document.getElementById("menu-button");
    window.studioRenderable || navButton?.style.setProperty("display", "block");
});

window.studioRenderable = window.location.pathname === '/3d-viewer';


$(document).ready(function () {
    $(document).on('click', '.column-header-name', function () {
        ev = document.createEvent('MouseEvents');
        ev.initEvent('click', true, true);
        $(this).parent().find('input[type="checkbox"')[0].dispatchEvent(ev);
    });
});