var flgKeyUp = false,
    flgKeyDown = false,
    flgKeyLeft = false,
    flgKeyRight = false,

    /* key code value */
    KV_A = 65,
    KV_D = 68,
    KV_S = 83,
    KV_W = 87,
    KV_SPACE = 32;

canvas.setAttribute('tabindex', 0);
canvas.addEventListener('keydown', onKeyDown, false);
canvas.addEventListener('keyup', onKeyUp, false);

function onKeyDown(e) {
    switch (e.keyCode) {
        case KV_W: flgKeyUp = true; break;
        case KV_S: flgKeyDown = true; break;
        case KV_A: flgKeyLeft = true; break;
        case KV_D: flgKeyRight = true; break;
    }
}

function onKeyUp(e) {
    switch (e.keyCode) {
        case KV_W: flgKeyUp = false; break;
        case KV_S: flgKeyDown = false; break;
        case KV_A: flgKeyLeft = false; break;
        case KV_D: flgKeyRight = false; break;
    }
}
