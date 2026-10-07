// src/ui/icons.jsx — 内联 SVG 图标(复刻 remixicon 语义)
import React from 'react';

const I = ({ d, ...rest }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...rest}><path fill="currentColor" d={d} /></svg>
);

export const IconHome = (p) => <I {...p} d="M12 3.1 3 10v10a1 1 0 0 0 1 1h5.5v-6h5v6H20a1 1 0 0 0 1-1V10z" />;
export const IconSearch = (p) => <I {...p} d="M10 2a8 8 0 1 0 4.9 14.3l5 5 1.4-1.4-5-5A8 8 0 0 0 10 2m0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12" />;
export const IconList = (p) => <I {...p} d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z" />;
export const IconTop = (p) => <I {...p} d="M4 20V10h3v10zm6.5 0V4h3v16zM17 20v-7h3v7z" />;
export const IconDisc = (p) => <I {...p} d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />;
export const IconUser = (p) => <I {...p} d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10m0 2c-5 0-8 2.5-8 6v2h16v-2c0-3.5-3-6-8-6" />;
export const IconSetting = (p) => <I {...p} d="m10.3 2.8.4 2.2a7 7 0 0 0-1.7 1L6.9 5.3 4.5 7.7l1.1 2a7 7 0 0 0-.6 2l-2 .9v3.4l2.2.4a7 7 0 0 0 1 1.7l-.9 2.1 2.4 2.4 2-1.1a7 7 0 0 0 2 .6l.9 2h3.4l.4-2.2a7 7 0 0 0 1.7-1l2.1.9 2.4-2.4-1.1-2a7 7 0 0 0 .6-2l2-.9v-3.4l-2.2-.4a7 7 0 0 0-1-1.7l.9-2.1-2.4-2.4-2 1.1a7 7 0 0 0-2-.6l-.9-2zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6" />;
export const IconPlay = (p) => <I {...p} d="M8 5.1v13.8c0 .8.9 1.3 1.6.9l10.9-6.9c.6-.4.6-1.4 0-1.8L9.6 4.2c-.7-.4-1.6.1-1.6.9" />;
export const IconPause = (p) => <I {...p} d="M6 4h4v16H6zm8 0h4v16h-4z" />;
export const IconPrev = (p) => <I {...p} d="M6 5h2.5v14H6zm13.5.7v12.6c0 .8-.9 1.3-1.6.8l-9-6.3a1 1 0 0 1 0-1.6l9-6.3c.7-.5 1.6 0 1.6.8" />;
export const IconNext = (p) => <I {...p} d="M15.5 5H18v14h-2.5zM4.5 5.7v12.6c0 .8.9 1.3 1.6.8l9-6.3a1 1 0 0 0 0-1.6l-9-6.3c-.7-.5-1.6 0-1.6.8" />;
export const IconVolume = (p) => <I {...p} d="M4 9v6h4l5 5V4L8 9zm12.5 3a3.5 3.5 0 0 0-2-3.2v6.4a3.5 3.5 0 0 0 2-3.2m-2-8.7v2.1a7 7 0 0 1 0 13.2v2.1a9 9 0 0 0 0-17.4" />;
export const IconMute = (p) => <I {...p} d="M4 9v6h4l5 5V4L8 9zm14.6 3 2.5-2.5-1.4-1.4-2.5 2.5-2.5-2.5-1.4 1.4 2.5 2.5-2.5 2.5 1.4 1.4 2.5-2.5 2.5 2.5 1.4-1.4z" />;
export const IconRepeat = (p) => <I {...p} d="M7 7h10v3l4-4-4-4v3H5v6h2zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2z" />;
export const IconOne = (p) => <I {...p} d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m-2 5h3v7h2v2H9v-2h1.5V9.5L9 10.2zm2-3a8 8 0 1 1 0 16 8 8 0 0 1 0-16" />;
export const IconShuffle = (p) => <I {...p} d="M17 4h4v4h-2V6.4l-4.6 4.6 4.6 4.6V14h2v4h-4v-2h1.6L14 11.4 9.4 16H4v-2h4.6l5-5-5-5H4V2h5.4L14 6.6 18.6 2H17zm0 0" />;
export const IconHeart = ({ filled, ...p }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
      d="M12 21s-8-4.9-10-9.5C.6 8 2.6 4.5 6.2 4.5c2.2 0 3.9 1.2 5.8 3.4 1.9-2.2 3.6-3.4 5.8-3.4 3.6 0 5.6 3.5 4.2 7C20 16.1 12 21 12 21Z"
    />
  </svg>
);
export const IconQueue = (p) => <I {...p} d="M3 6h13v2H3zm0 5h13v2H3zm0 5h9v2H3zm16-9 4 3-4 3z" />;
export const IconLyric = (p) => <I {...p} d="M4 4h16v13H8l-4 4z" />;
export const IconClose = (p) => <I {...p} d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6 10.6 12 5 6.4z" />;
export const IconTrash = (p) => <I {...p} d="M9 3h6l1 2h4v2H4V5h4zM5 8h14l-1 13H6z" />;
export const IconDown = (p) => <I {...p} d="M11 4h2v11.2l4.6-4.6L19 12l-7 7-7-7 1.4-1.4L11 15.2z" />;
export const IconPlayCount = (p) => <I {...p} d="M8 5.1v13.8c0 .8.9 1.3 1.6.9l10.9-6.9c.6-.4.6-1.4 0-1.8L9.6 4.2c-.7-.4-1.6.1-1.6.9" />;
export const IconMusic = (p) => <I {...p} d="M12 3v10.6a4 4 0 1 0 2 3.4V7h4V3h-6z" />;
export const IconChevDown = (p) => <I {...p} d="M12 15.4 5.6 9 7 7.6l5 5 5-5L18.4 9z" />;
