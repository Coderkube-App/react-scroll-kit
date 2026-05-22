import React from 'react';

export function resolveContainer(
    container?:
        | React.RefObject<HTMLElement>
        | HTMLElement
        | Window
        | null
) {
    if (!container) {
        return window;
    }

    if ('current' in container) {
        return container.current ?? window;
    }

    return container;
}