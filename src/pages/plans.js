// @flow
import React from 'react';
import Link from 'gatsby-link';
import styled, { css } from 'styled-components';
import { maybeGetCached, fetchAndCacheJson } from '../utils/fetch';
import Async from '../components/Async';
import Title from '../components/Title';
import PageHeader from '../components/PageHeader';
import Container from '../components/Container';
import * as colors from '../utils/colors';
import { BlockExternalLink } from '../components/BlockLink';

const LABEL_COLORS = {
  blue: colors.PRIMARY_COLORS.blue,
  green: colors.PRIMARY_COLORS.green,
  pink: colors.PRIMARY_COLORS.pink,
  lime: colors.PRIMARY_COLORS.green,
  yellow: colors.PRIMARY_COLORS.yellow,
  orange: colors.PRIMARY_COLORS.orange,
  red: colors.PRIMARY_COLORS.red,
  purple: colors.PRIMARY_COLORS.purple,
};

const Label = styled.span`
  display: inline-block;
  font-size: 0.8em;
  padding: 0.2em 0.6em;
  margin-right: 0.5em;
  -webkit-font-smoothing: antialiased;
  ${props => {
    let match = LABEL_COLORS[props.color];
    if (!match) console.warn(`Missing label color: ${props.color}`);
    let bg = match || 'black';
    let fg = match ? colors.highContrast(match) : 'white';

    return css`
      background: ${bg};
      color: ${fg};
    `;
  }};
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.6rem;

  @media (min-width: 720px) {
    font-size: 1.6rem;
  }
`;

const CardLink = BlockExternalLink.extend`
  vertical-align: top;
  padding: 1rem;

  & *:last-child {
    margin-bottom: 0;
  }

  &:hover ${CardTitle} {
    text-decoration: underline;
  }
`;

const CardDescription = styled.p`
  margin-top: 0.6rem;
`;

function Card(props) {
  return (
    <CardLink href={props.card.url} key={props.card.id}>
      <CardTitle>{props.card.name}</CardTitle>
      {props.card.labels.map(label => (
        <Label key={label.id} color={label.color}>
          {label.name}
        </Label>
      ))}
    </CardLink>
  );
}

const CardsContainer = styled.div``;

function Cards(props) {
  return (
    <CardsContainer>
      {props.cards.map(card => <Card key={card.id} card={card} />)}
    </CardsContainer>
  );
}

const ListContainer = styled.div`
  position: relative;
  padding: 0;
  margin-bottom: 5rem;
  min-height: 20rem;

  & > *:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 720px) {
    padding-left: 4.6rem;
  }
`;

const ListHeadingRotator = styled.div`
  @media (min-width: 720px) {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    transform: rotate(-90deg);
  }
`;

const ListHeading = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  font-family: silom;
  text-align: center;
  color: ${() =>
    colors.text('#ffffff', colors.random(colors.PRIMARY_COLORS), 6)};

  @media (min-width: 720px) {
    position: absolute;
    white-space: nowrap;
    right: 0;
    padding: 0.4rem 1rem;
    font-size: 3rem;
    text-align: left;
  }
`;

function List(props) {
  return (
    <ListContainer key={props.list.id}>
      <ListHeadingRotator>
        <ListHeading>{props.list.name}</ListHeading>
      </ListHeadingRotator>
      <Cards
        cards={props.cards.filter(card => card.idList === props.list.id)}
      />
    </ListContainer>
  );
}

function Lists(props) {
  return (
    <div>
      {props.lists.map(list => {
        return <List key={list.id} list={list} cards={props.cards} />;
      })}
    </div>
  );
}

const BoardContainer = styled.div`
  position: relative;
  margin-top: 5rem;
`;

const BoardCover = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const BoardMessage = styled.p`
  position: fixed;
  z-index: 1;
  display: inline-block;
  left: 50%;
  top: 50%;
  transform: translate(-50%, 0);
  background: ${colors.PRIMARY_COLORS.blue};
  font-family: silom;
  color: white;
  padding: 1rem 2rem;
  -webkit-font-smoothing: antialiased;
`;

type Data = {
  lists: Array<{
    id: string,
    name: string,
  }>,
  cards: Array<{
    id: string,
    idList: string,
    url: string,
    name: string,
    desc?: string,
    labels: Array<{
      id: string,
      name: string,
      color: $Keys<typeof LABEL_COLORS>,
    }>,
  }>,
};

const LISTS_URL = 'https://api.trello.com/1/boards/6HO4yHKP/lists';
const CARDS_URL = 'https://api.trello.com/1/boards/6HO4yHKP/cards';

function fetchData(): Promise<Data> {
  return Promise.all([
    fetchAndCacheJson(LISTS_URL),
    fetchAndCacheJson(CARDS_URL),
  ]).then(([lists, cards]) => {
    return { lists, cards };
  });
}

function getCached(): Data | null {
  let lists = maybeGetCached(LISTS_URL);
  let cards = maybeGetCached(CARDS_URL);
  if (lists && cards) return { lists, cards };
  return null;
}

function Board() {
  return (
    <Async refetch fetch={fetchData} cached={getCached()} refetch>
      {state => {
        if (state.data) {
          return (
            <BoardContainer>
              {state.loading && (
                <BoardCover>
                  <BoardMessage>Refreshing...</BoardMessage>
                </BoardCover>
              )}
              <Lists lists={state.data.lists} cards={state.data.cards} />
            </BoardContainer>
          );
        } else if (state.loading) {
          return <h3>Loading...</h3>;
        } else {
          return (
            <div>
              <h3>An unexpected error occured</h3>
              {state.error && <pre>{state.error.toString()}</pre>}
            </div>
          );
        }
      }}
    </Async>
  );
}

export default function Plans() {
  return (
    <div>
      <PageHeader>
        <Title>Plans</Title>
      </PageHeader>
      <Container>
        <Board />
      </Container>
    </div>
  );
}
