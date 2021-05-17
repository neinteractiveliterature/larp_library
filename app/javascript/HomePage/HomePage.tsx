import { LoadQueryWrapper } from '@neinteractiveliterature/litform/lib';
import { groupBy, sortBy } from 'lodash';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProjectHeaders from '../ProjectSearch/ProjectHeaders';
import Tag from '../Tags/Tag';
import { generateProjectSearchPath } from '../URLGenerators';
import { useHomePageQuery } from './queries.generated';

export default LoadQueryWrapper(useHomePageQuery, function HomePage({ data }) {
  const tagsByCategoryId = useMemo(
    () => groupBy(data.tags.nodes, (tag) => tag.tagCategory?.id ?? 'uncategorized'),
    [data.tags],
  );
  const tagCategoriesSorted = useMemo(
    () => sortBy(data.tagCategories.nodes, (tagCategory) => tagCategory.name),
    [data.tagCategories],
  );

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <h2>Welcome to Larp Library</h2>
        <p>
          Larp Library is an online repository of free-to-run live action roleplaying games. All
          larps in the library are freely licensed for anyone to download, read, run, and play. You
          can <Link to="/projects">browse or search our library of games here</Link>.
        </p>
        <p>
          If you&rsquo;re a larp creator and are interested in sharing your work, you can{' '}
          <Link to="/brands/new">sign up here</Link> and get your own brand page, from which you can
          publish all your projects.
        </p>
        <p>
          Larp Library is a project of{' '}
          <a href="https://interactiveliterature.org">New England Interactive Literature</a>, the
          same organization that runs the New England Intercon conventions and NELCO and publishes
          Game Wrap.
        </p>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h2 className="m-0">Featured larps</h2>
          </div>
          <ul className="list-group list-group-flush">
            {data.projectPromotions.map((projectPromotion) => (
              <li className="list-group-item" key={projectPromotion.id}>
                <ProjectHeaders
                  project={projectPromotion.project}
                  renderTitle={(title) => <h4 className="m-0">{title}</h4>}
                  metadataClassName="text-muted"
                  hideAuthors
                  hideBrandAndYear
                />
              </li>
            ))}
          </ul>
          <div className="card-footer">
            <h4 className="m-0">
              <Link to="/projects">Browse all larps</Link>
            </h4>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h2 className="m-0">Browse by tag</h2>
          </div>
          <ul className="list-group list-group-flush">
            {tagCategoriesSorted.map(
              (category) =>
                tagsByCategoryId[category.id] && (
                  <li className="list-group-item" key={category.id}>
                    <h4 className="mt-0">{category.name}</h4>
                    <ul className="list-unstyled">
                      {tagsByCategoryId[category.id].map((tag) => (
                        <li className="mb-1" key={tag.id}>
                          <Tag tag={tag} linkTo={generateProjectSearchPath({ tag: tag.name })} />
                          <small className="ms-1">
                            ({tag.projects.totalCount}{' '}
                            {tag.projects.totalCount === 1 ? 'project' : 'projects'})
                          </small>
                        </li>
                      ))}
                    </ul>
                  </li>
                ),
            )}
            {tagsByCategoryId['uncategorized'] && (
              <li className="list-group-item">
                <h4 className="mt-0">Miscellaneous</h4>
                <ul className="list-unstyled">
                  {tagsByCategoryId['uncategorized'].map((tag) => (
                    <li className="mb-1" key={tag.id}>
                      <Tag
                        key={tag.id}
                        tag={tag}
                        linkTo={generateProjectSearchPath({ tag: tag.name })}
                      />
                      <small className="ms-1">
                        ({tag.projects.totalCount}{' '}
                        {tag.projects.totalCount === 1 ? 'project' : 'projects'})
                      </small>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
});
