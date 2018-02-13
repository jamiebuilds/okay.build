// @flow
import React from 'react';
import Link from 'gatsby-link';
import styled from 'styled-components';
import Async from '../components/Async';
import Title from '../components/Title';
import PageHeader from '../components/PageHeader';
import Container from '../components/Container';
import { COLORS } from '../constants';
import { maybeGetCached, fetchAndCacheJson } from '../utils/fetch';
import { random } from '../utils/colors';
import { BlockExternalLink } from '../components/BlockLink';

const PROJECTS = [
  {
    name: 'Bolt',
    repo: 'boltpkg/bolt',
  },
  {
    name: 'Projector',
    repo: 'projectorjs/projector',
  },
  {
    name: 'Glow',
    repo: 'jamiebuilds/glow',
  },
  {
    name: 'Build Stats',
    repo: 'ajaymathur/build-stats',
  },
  {
    name: 'Unstated',
    repo: 'jamiebuilds/unstated',
  },
  {
    name: 'Landkid',
    repo: 'jamiebuilds/landkid',
  },
  {
    name: 'Popular Package',
    repo: 'ajaymathur/popular-package',
  },
  {
    name: 'Shimiteer',
    repo: 'jamiebuilds/shimiteer',
  },
  {
    name: 'Paranormal',
    repo: 'jamiebuilds/paranormal',
  },
];

const GITHUB_API_PREFIX = 'https://api.github.com/repos/';

const ProjectHeading = styled.h3`
  font-size: 4rem;
  margin-bottom: 0.4rem;
`;

const ProjectLink = BlockExternalLink.extend`
  padding: 3rem 0;

  & *:last-child {
    margin-bottom: 0;
  }

  &:hover ${ProjectHeading} {
    text-decoration: underline;
  }
`;

const ProjectDescription = styled.p`
  font-size: 2rem;
  line-height: 1.2;
  margin-bottom: 0;
  font-weight: 800;
`;

const ProjectMeta = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
`;

function Project(props) {
  let url = `${GITHUB_API_PREFIX}${props.project.repo}`;
  return (
    <Async cached={maybeGetCached(url)} fetch={() => fetchAndCacheJson(url)}>
      {state => (
        <ProjectLink
          // highlight
          href={`https://github.com/${props.project.repo}`}>
          <Container>
            <ProjectHeading>{props.project.name}</ProjectHeading>

            {state.data &&
              state.data.description && (
                <ProjectDescription>
                  {state.data.description}
                </ProjectDescription>
              )}
            {state.data &&
              state.data.stargazers_count &&
              state.data.forks_count && (
                <ProjectMeta>
                  {state.data.stargazers_count} stars, {state.data.forks_count}{' '}
                  forks
                </ProjectMeta>
              )}
          </Container>
        </ProjectLink>
      )}
    </Async>
  );
}

type Data = {
  // ...
};

function getCached(): Data | null {
  // let lists = maybeGetCached(LISTS_URL);
  // if (lists && cards) return { lists, cards };
  return null;
}

function ProjectsList() {
  return (
    <div>
      {PROJECTS.map(project => (
        <Project key={project.repo} project={project} />
      ))}
    </div>
  );
}

export default function Projects() {
  return (
    <div>
      <PageHeader>
        <Title>Projects</Title>
      </PageHeader>
      <ProjectsList />
    </div>
  );
}
