import styled from 'styled-components';

export const Word = styled('div')({
  display: 'inline-block',
  position: 'relative',
  padding: '5px 4px',
  '&.edit': {
    cursor: 'pointer',
  },
  '&.edit:hover': {
    background: '#E3EAF3',
  },
  '&.selected': {
    background: '#E3EAF3',
  },
  '&.boundary': {
    fontWeight: 700,
  },
});

export const Dot = styled.div`
  position: absolute;
  top: -3px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1f77df;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  cursor: pointer;
`;
