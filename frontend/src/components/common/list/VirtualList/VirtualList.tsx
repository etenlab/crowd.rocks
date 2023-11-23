import {
  useMemo,
  useEffect,
  useState,
  useRef,
  ReactNode,
  Fragment,
} from 'react';
import { Stack } from '@mui/material';

export type VirtualListProps = {
  onRangeChange?(startIndex: number, endIndex: number): void;
  totalCount: number;
  itemContent(index: number): ReactNode;
  rowHeight: number;
  viewportHeight: number;
  customScrollElement?: Element;
};

export function VirtualList({
  totalCount,
  itemContent,
  rowHeight,
  viewportHeight,
  customScrollElement,
  onRangeChange,
}: VirtualListProps) {
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [range, setRange] = useState<{ startIndex: number; endIndex: number }>({
    startIndex: 0,
    endIndex: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = totalCount * rowHeight;

  useEffect(() => {
    let scrollElement: Element;

    if (customScrollElement) {
      scrollElement = customScrollElement;
    } else {
      scrollElement = containerRef.current!;
    }

    const scrollEventHandler = () => {
      const scrollTop = scrollElement.scrollTop;
      const scrollHeight = scrollElement.scrollHeight;

      const marginTop = Math.max(scrollHeight - totalHeight - 40, 0);

      const startIndex = Math.max(
        Math.floor(totalCount * ((scrollTop - marginTop) / totalHeight)) - 1,
        0,
      );
      const endIndex = Math.min(
        Math.ceil(
          totalCount * ((scrollTop - marginTop + viewportHeight) / totalHeight),
        ) + 1,
        totalCount,
      );

      setScrollTop(scrollTop - marginTop);
      setRange({ startIndex, endIndex });
      onRangeChange && onRangeChange(startIndex, endIndex);
    };

    scrollElement.addEventListener('scroll', scrollEventHandler);

    scrollEventHandler();
  }, [
    customScrollElement,
    onRangeChange,
    totalCount,
    totalHeight,
    viewportHeight,
  ]);

  const rows = useMemo(() => {
    const rows: ReactNode[] = [];

    for (let i = range.startIndex; i <= range.endIndex; i++) {
      rows.push(
        <Fragment key={JSON.stringify({ totalHeight, index: i })}>
          {itemContent(i)}
        </Fragment>,
      );
    }

    return rows;
  }, [itemContent, range.endIndex, range.startIndex, totalHeight]);

  return (
    <Stack
      ref={containerRef}
      sx={{ height: `${totalHeight}px`, width: '100%' }}
    >
      <Stack sx={{ paddingTop: `${scrollTop - 20}px` }}>{rows}</Stack>
    </Stack>
  );
}
