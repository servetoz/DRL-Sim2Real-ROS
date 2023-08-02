// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { main } from "@foxglove/studio-web";

declare global {
    interface Window {
        studioInterval: any;
        studioRenderable: any;
    }
}

window.studioInterval = setInterval(() => {
    if (!document.getElementById("studio-root")) {
        return;
    }
    if (!window.studioRenderable) {
        return;
    }
    window.document.querySelector('.dash-debug-menu')?.remove();
    window.document.querySelector('.dash-debug-menu__outer')?.remove();
    clearInterval(window.studioInterval);
    main();
}, 500);