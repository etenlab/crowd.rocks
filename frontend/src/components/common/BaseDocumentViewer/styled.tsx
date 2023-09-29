import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
`;

export const Word = styled('div')({
  display: 'inline-block',
  padding: '3px 4px',
  '&.edit': {
    cursor: 'pointer',
  },
  '&.edit:hover': {
    background: '#eee',
  },
});

export const Dot = styled.div``;
