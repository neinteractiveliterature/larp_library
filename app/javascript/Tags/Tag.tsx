import type { JSX } from 'react';
import { Link } from 'react-router';

/** What a tag badge needs: satisfied by both the server loaders' plain data and the GraphQL fragments */
export type TagLike = {
  id: string | number;
  name: string;
  tagCategory?: { color?: string | null; textColor?: string | null; icon?: string | null } | null;
};

export type TagProps = {
  tag: TagLike;
  onDismiss?: () => void;
  linkTo?: string;
};

function Tag({ tag, linkTo, onDismiss }: TagProps): JSX.Element {
  const innerContent = (
    <>
      <i
        className={`bi-${tag.tagCategory?.icon ?? 'tag-fill'}`}
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
        <Link to={linkTo} className="link-unstyled" style={{ color: tag.tagCategory?.textColor ?? '#FFFFFF' }}>
          {innerContent}
        </Link>
      ) : (
        innerContent
      )}
      {onDismiss && (
        <button
          type="button"
          className="tag-dismiss-button"
          aria-label={`Remove ${tag.name}`}
          style={{ color: tag.tagCategory?.textColor ?? '#FFFFFF' }}
          onClick={() => {
            onDismiss();
          }}
        >
          <i className="bi-x" />
        </button>
      )}
    </div>
  );
}

export default Tag;
