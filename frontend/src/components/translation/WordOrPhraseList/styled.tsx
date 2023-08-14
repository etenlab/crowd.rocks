import { styled } from 'styled-components';
import { IonButton } from '@ionic/react';

export const CaptainContainer = styled.div`
  height: 50px;
  margin: -16px;
`;

export const FilterContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const CardListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const CardContainer = styled.div`
  width: 100%;
`;

export const Button = styled(IonButton)(() => ({
  width: '100%',
}));

export const CardUl = styled.ul`
  list-style: none;
  padding: 0;
`;
