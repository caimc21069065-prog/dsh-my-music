// src/ui/icons.jsx — 内联 SVG 图标(对齐 AlgerMusicPlayer 使用的 remixicon 语义与 24px 视觉尺寸)
import React from 'react';

const S = ({ children, size, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" {...rest}>
    {children}
  </svg>
);

const F = ({ d, ...p }) => <S {...p}><path fill="currentColor" d={d} /></S>;
const L = ({ d, sw = 1.7, ...p }) => (
  <S {...p}>
    <path fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" d={d} />
  </S>
);

/* 导航 */
export const IconHome = (p) => <F {...p} d="M12 2.6 2.8 10v11.4h6.4v-6.2h5.6v6.2h6.4V10z" />;
export const IconSearch = (p) => <L {...p} d="M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm5.6 13.1L21 21" />;
export const IconList = (p) => (
  <S {...p}>
    <path fill="currentColor" d="M3 5h18v2.2H3zm0 5.9h18v2.2H3zM3 16.8h11v2.2H3z" />
    <path fill="currentColor" d="M17.4 15.3v6.2l4.2-3.1z" />
  </S>
);
export const IconAlbum = (p) => (
  <S {...p}>
    <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 2.2a7.8 7.8 0 1 1 0 15.6 7.8 7.8 0 0 1 0-15.6m0 4.6a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4" />
  </S>
);
export const IconToplist = (p) => (
  <S {...p}>
    <path fill="currentColor" d="M3.5 20V11h3.4v9zm6.8 0V4h3.4v16zm6.8 0v-6.4h3.4V20z" />
  </S>
);
export const IconHistory = (p) => (
  <S {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="M3.2 12a8.8 8.8 0 1 0 2.6-6.2M3 3.6v4.6h4.6" />
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M12 7.4V12l3.4 2" />
  </S>
);
export const IconUser = (p) => (
  <S {...p}>
    <path fill="currentColor" d="M12 12.2a4.6 4.6 0 1 0 0-9.2 4.6 4.6 0 0 0 0 9.2m0 1.9c-4.6 0-8 2.3-8 5.4V21h16v-1.5c0-3.1-3.4-5.4-8-5.4" />
  </S>
);
export const IconSetting = (p) => (
  <S {...p}>
    <path fill="currentColor" d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2m9 5.2v-3.2l-2.3-.5a7.4 7.4 0 0 0-.8-1.9l1.3-2-2.3-2.3-2 1.3a7.4 7.4 0 0 0-1.9-.8L12.5 2h-3.2l-.5 2.3a7.4 7.4 0 0 0-1.9.8l-2-1.3L2.6 6.1l1.3 2a7.4 7.4 0 0 0-.8 1.9L1 10.4v3.2l2.3.5c.2.7.4 1.3.8 1.9l-1.3 2 2.3 2.3 2-1.3c.6.4 1.2.6 1.9.8l.5 2.3h3.2l.5-2.3c.7-.2 1.3-.4 1.9-.8l2 1.3 2.3-2.3-1.3-2c.4-.6.6-1.2.8-1.9z" />
  </S>
);

/* 播放控制 */
export const IconPlay = (p) => <F {...p} d="M8 4.8v14.4c0 .9 1 1.5 1.8 1l11.4-7.2c.7-.5.7-1.5 0-2L9.8 3.8C9 3.3 8 3.9 8 4.8" />;
export const IconPause = (p) => <F {...p} d="M6 4h4.2v16H6zm7.8 0H18v16h-4.2z" />;
export const IconPrev = (p) => <F {...p} d="M5 5h2.4v14H5zm14.1.6v12.8c0 .9-1 1.4-1.7.9l-9.2-6.4a1.1 1.1 0 0 1 0-1.8l9.2-6.4c.7-.5 1.7 0 1.7.9" />;
export const IconNext = (p) => <F {...p} d="M16.6 5H19v14h-2.4zM4.9 5.6v12.8c0 .9 1 1.4 1.7.9l9.2-6.4a1.1 1.1 0 0 0 0-1.8L6.6 4.7c-.7-.5-1.7 0-1.7.9" />;
export const IconVolume = (p) => (
  <S {...p}>
    <path fill="currentColor" d="M3.6 9.2v5.6h3.5l4.6 4.4V4.8L7.1 9.2z" />
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="M15.2 8.6a4.8 4.8 0 0 1 0 6.8m2.6-9.4a8 8 0 0 1 0 12" />
  </S>
);
export const IconVolumeLow = (p) => (
  <S {...p}>
    <path fill="currentColor" d="M3.6 9.2v5.6h3.5l4.6 4.4V4.8L7.1 9.2z" />
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="M15.2 8.6a4.8 4.8 0 0 1 0 6.8" />
  </S>
);
export const IconMute = (p) => (
  <S {...p}>
    <path fill="currentColor" d="M3.6 9.2v5.6h3.5l4.6 4.4V4.8L7.1 9.2z" />
    <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="m15.4 9.6 5 5m0-5-5 5" />
  </S>
);
export const IconRepeat = (p) => (
  <S {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M17 3.6 20.4 7 17 10.4M7 20.4 3.6 17 7 13.6" />
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="M20.4 7H7.6A4 4 0 0 0 3.6 11M3.6 17h12.8a4 4 0 0 0 4-4" />
  </S>
);
export const IconOne = (p) => (
  <S {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M17 3.6 20.4 7 17 10.4M7 20.4 3.6 17 7 13.6" />
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="M20.4 7H7.6A4 4 0 0 0 3.6 11M3.6 17h12.8a4 4 0 0 0 4-4" />
    <path fill="currentColor" d="M11.2 9.4h1.6v5.2h-1.6v-3.6l-1 .4v-1.4z" />
  </S>
);
export const IconShuffle = (p) => (
  <S {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M3.6 6.4h3.2c1.2 0 2 .6 2.8 1.7l4.8 7.8c.8 1.1 1.6 1.7 2.8 1.7h2.4m-4.2-11.2h4.2m0 0-2.4-2.4m2.4 2.4-2.4 2.4M3.6 17.6h3.2c1.2 0 2-.6 2.8-1.7l1.3-2.1m3.3-4.6 1-1.1c.8-1.1 1.6-1.7 2.8-1.7h2.4m0 9.6-2.4-2.4m2.4 2.4-2.4 2.4" />
  </S>
);
export const IconHeart = ({ filled, ...p }) => (
  <S {...p}>
    <path
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
      strokeLinejoin="round"
      d="M12 20.7s-7.6-4.7-9.5-9.1C1 8 3 4.6 6.4 4.6c2.1 0 3.7 1.2 5.6 3.3 1.9-2.1 3.5-3.3 5.6-3.3 3.4 0 5.4 3.4 3.9 7-1.9 4.4-9.5 9.1-9.5 9.1Z"
    />
  </S>
);
export const IconDownload = (p) => (
  <S {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M12 3.4v11.2m0 0 4.2-4.2M12 14.6l-4.2-4.2M4 18.6v1.6h16v-1.6" />
  </S>
);
export const IconQueue = (p) => (
  <S {...p}>
    <path fill="currentColor" d="M3 5.2h13.4v2.1H3zm0 5.8h13.4v2.1H3zm0 5.8h9.6v2.1H3z" />
    <path fill="currentColor" d="M16.8 16.2v5.2l4-2.6z" />
  </S>
);
export const IconTrash = (p) => (
  <S {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M4.4 6.6h15.2M9.4 6.6V4.4h5.2v2.2M6.4 6.6l.9 13.4h9.4l.9-13.4M10 10.4v6.2m4-6.2v6.2" />
  </S>
);
export const IconClose = (p) => <L {...p} d="m6 6 12 12M18 6 6 18" sw={1.8} />;
export const IconChevronDown = (p) => <L {...p} d="m5.6 9 6.4 6.4L18.4 9" sw={1.9} />;
export const IconChevronUp = (p) => <L {...p} d="m5.6 15 6.4-6.4L18.4 15" sw={1.9} />;
export const IconChevronRight = (p) => <L {...p} d="m9 5.6 6.4 6.4L9 18.4" sw={1.9} />;
export const IconArrowLeft = (p) => <L {...p} d="M20 12H4.4m0 0 6-6m-6 6 6 6" sw={1.9} />;
export const IconMore = (p) => (
  <S {...p}>
    <path fill="currentColor" d="M6 10.4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2m6 0a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2m6 0a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2" />
  </S>
);
export const IconCheck = (p) => <L {...p} d="m4.6 12.4 4.6 4.6 10-10" sw={2} />;
export const IconPlayCircle = (p) => (
  <S {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="1.7" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18" />
    <path fill="currentColor" d="M10 8.4v7.2l5.6-3.6z" />
  </S>
);
export const IconPlayFill = (p) => <F {...p} d="M8 4.8v14.4c0 .9 1 1.5 1.8 1l11.4-7.2c.7-.5.7-1.5 0-2L9.8 3.8C9 3.3 8 3.9 8 4.8" />;
export const IconMusic = (p) => (
  <S {...p}>
    <path fill="currentColor" d="M20.4 3.4 9 5.9v9.3a3.9 3.9 0 1 0 2 3.4V8.9l7.4-1.7v5.4a3.9 3.9 0 1 0 2 3.4z" />
  </S>
);
export const IconClock = (p) => (
  <S {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="1.7" d="M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6Z" />
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="M12 7.4V12l3.2 1.9" />
  </S>
);
export const IconRadio = (p) => (
  <S {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" d="M8.4 8.4a5.1 5.1 0 0 0 0 7.2m-2.8 2.6a9 9 0 0 1 0-12.4M15.6 8.4a5.1 5.1 0 0 1 0 7.2m2.8 2.6a9 9 0 0 0 0-12.4" />
    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
  </S>
);
export const IconFullscreen = (p) => (
  <S {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M4 9V4h5M20 9V4h-5M4 15v5h5m11-5v5h-5" />
  </S>
);
export const IconLyric = (p) => (
  <S {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M4 5.4h16v10.2H9.4L4 19.6z" />
    <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M7.4 9h9.2M7.4 12.2h5.6" />
  </S>
);
export const IconPlus = (p) => <L {...p} d="M12 5v14M5 12h14" sw={1.9} />;
export const IconSpinner = (p) => (
  <S {...p}>
    <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 3.4a8.6 8.6 0 1 1-6.1 2.5" />
  </S>
);
export const IconVolumeWheel = IconVolume;
