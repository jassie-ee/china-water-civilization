import { useState, type ReactNode } from 'react';

import './Folder.css';

interface FolderProps {
  color?: string;
  size?: number;
  items?: ReactNode[];
  className?: string;
  onActivate?: () => void;
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) color = color.split('').map((part) => part + part).join('');
  const numericColor = Number.parseInt(color.slice(0, 6), 16);
  const channel = (shift: number) => Math.max(0, Math.min(255, Math.floor(((numericColor >> shift) & 0xff) * (1 - percent))));
  return `#${((1 << 24) + (channel(16) << 16) + (channel(8) << 8) + channel(0)).toString(16).slice(1)}`;
};

function Folder({ color = '#2c98a0', size = 1, items = [], className = '', onActivate }: FolderProps) {
  const [open, setOpen] = useState(false);
  const papers = [...items.slice(0, 3)];
  while (papers.length < 3) papers.push(null);
  const style = {
    '--folder-color': color,
    '--folder-back-color': darkenColor(color, .13),
    '--folder-paper-one': '#dfead8',
    '--folder-paper-two': '#edf0d9',
    '--folder-paper-three': '#fff9e4',
    transform: `scale(${size})`,
  } as React.CSSProperties;

  const activate = (): void => {
    setOpen((wasOpen) => !wasOpen);
    onActivate?.();
  };

  return <div className={`folder ${open ? 'folder--open' : ''} ${className}`.trim()} style={style}>
    <div className="folder__interactive" role="button" tabIndex={0} aria-expanded={open} aria-label="打开水电与储能知识册" onClick={activate} onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
    }}>
      <div className="folder__back">
        {papers.map((paper, index) => <div className={`folder__paper folder__paper--${index + 1}`} key={index}>{paper}</div>)}
        <div className="folder__front" />
        <div className="folder__front folder__front--right" />
      </div>
    </div>
  </div>;
}

export default Folder;
