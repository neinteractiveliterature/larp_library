import { Link } from 'react-router-dom';
import { TagFragment } from './queries.generated';

export type TagProps = {
  tag: TagFragment;
  linkTo?: string;
};

function Tag({ tag, linkTo }: TagProps): JSX.Element {
  const innerContent = (
    <>
      <i
        className={`fa fa-${tag.tagCategory?.icon ?? 'tag'}`}
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          marginRight: '0.2em',
        }}
        aria-hidden
      ></i>
      {tag.name}
    </>
  );

  return (
    <div
      className="badge badge-pill"
      style={{
        backgroundColor: tag.tagCategory?.color ?? '#777777',
        color: tag.tagCategory?.textColor ?? '#FFFFFF',
        fontSize: '90%',
      }}
    >
      {linkTo ? (
        <Link
          to={linkTo}
          className="link-unstyled"
          style={{ color: tag.tagCategory?.textColor ?? '#FFFFFF' }}
        >
          {innerContent}
        </Link>
      ) : (
        innerContent
      )}
    </div>
  );
}

export default Tag;
