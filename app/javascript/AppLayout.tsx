import { LoadQueryWrapper, PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { ReactNode, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { AppLayoutQueryData, AppLayoutQueryVariables, useAppLayoutQuery } from './queries.generated';
import { SignInButton } from './SignInButton';
import { SignOutButton } from './SignOutButton';

export type AppLayoutProps = {
  children: ReactNode;
};

export default LoadQueryWrapper<AppLayoutQueryData, AppLayoutQueryVariables, AppLayoutProps>(
  useAppLayoutQuery,
  function AppLayout({ data, children }) {
    return (
      <>
        <div className="container">
          <nav id="topbar">
            <ul id="mainnav">
              <li className="col-md-4 col-sm-6 topbar-brand" style={{ textAlign: 'center' }}>
                <Link to="/">Larp Library</Link>
              </li>
              <li className="col-md-8 col-sm-6">
                <ul id="globalnav">
                  <li>
                    <Link to="/projects">Larps</Link>
                  </li>
                  <li>
                    <Link to="/brands">Creators</Link>
                  </li>
                  {data.currentUser?.admin && (
                    <li className="dropdown">
                      <a
                        aria-expanded={false}
                        aria-haspopup={true}
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        href="#"
                        role="button"
                      >
                        Admin
                        <span className="caret"></span>
                      </a>
                      <ul className="dropdown-menu">
                        {data.currentAbility.canCreateProjectPromotions && (
                          <li>
                            <Link to="/project_promotions" className="dropdown-item">
                              Promotions
                            </Link>
                          </li>
                        )}
                        {data.currentAbility.canUpdateTags && (
                          <li>
                            <Link to="/tags" className="dropdown-item">
                              Tags
                            </Link>
                          </li>
                        )}
                        {data.currentAbility.canUpdateTagCategories && (
                          <li>
                            <Link to="/tag_categories" className="dropdown-item">
                              Tag Categories
                            </Link>
                          </li>
                        )}
                      </ul>
                    </li>
                  )}
                  <li>
                    <Link to="/brands/new">Publish your larp</Link>
                  </li>
                  <li>{data.currentUser ? <SignOutButton /> : <SignInButton />}</li>
                </ul>
              </li>
            </ul>
          </nav>

          <Suspense fallback={<PageLoadingIndicator visible iconSet="bootstrap-icons" />}>{children}</Suspense>

          <nav>
            <ul className="list-inline" style={{ textAlign: 'center' }}>
              <li className="list-inline-item">
                <small>
                  Larp Library &copy; 2015-{new Date().getFullYear()}{' '}
                  <a href="http://interactiveliterature.org" target="_blank" rel="noreferrer noopener">
                    New England Interactive Literature
                  </a>
                </small>
              </li>
              <li className="list-inline-item">&mdash;</li>
              <li className="list-inline-item">
                <Link to="/pages/about">About us</Link>
              </li>
              <li className="list-inline-item">
                <Link to="/pages/licensing">Licensing</Link>
              </li>
            </ul>
          </nav>
        </div>
      </>
    );
  },
);
