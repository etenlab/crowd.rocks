import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
`;

export const Word = styled('div')({
  display: 'inline-block',
  position: 'relative',
  padding: '5px 4px',
  '&.edit': {
    cursor: 'pointer',
  },
  '&.edit:hover': {
    background: '#eee',
  },
});

export const Dot = styled.div`
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  background-color: red;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  cursor: pointer;
`;
